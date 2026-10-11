import os, re, time, logging, json
from collections import defaultdict
from datetime import date
from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq
import requests
from functools import wraps
from dotenv import load_dotenv

load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app, origins=os.getenv("ALLOWED_ORIGINS", "*").split(","))

# ── Security headers ──────────────────────────────────────────────────────────
@app.after_request
def set_security_headers(response):
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response

# ── Rate limiting ─────────────────────────────────────────────────────────────
RATE_LIMIT = int(os.getenv("RATE_LIMIT_PER_HOUR", 40))
rate_store = defaultdict(list)

def rate_limit(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        ip = request.headers.get("X-Forwarded-For", request.remote_addr).split(",")[0].strip()
        now = time.time()
        rate_store[ip] = [t for t in rate_store[ip] if t > now - 3600]
        if len(rate_store[ip]) >= RATE_LIMIT:
            return jsonify({"error": "Too many requests. Please try again later."}), 429
        rate_store[ip].append(now)
        return f(*args, **kwargs)
    return decorated

# ── Groq ──────────────────────────────────────────────────────────────────────
# llama-3.3-70b-versatile was shut down by Groq on 16 Aug 2026.
# The model is now an env variable, so the next migration needs no code change.
# Alternative Groq suggested: qwen/qwen3.6-27b
GROQ_MODEL = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")

groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def call_groq(system, user, max_tokens=1200):
    kwargs = {}
    # gpt-oss models "think" first, and those tokens count toward max_tokens.
    # Keep the thinking short so the JSON answer is not cut off.
    if GROQ_MODEL.startswith("openai/gpt-oss"):
        kwargs["extra_body"] = {"reasoning_effort": "low"}

    completion = groq_client.chat.completions.create(
        model=GROQ_MODEL,
        messages=[{"role": "system", "content": system}, {"role": "user", "content": user}],
        temperature=0.7,
        max_tokens=max_tokens,
        **kwargs,
    )
    content = completion.choices[0].message.content
    if not content:
        raise ValueError(
            f"Empty reply from model (finish_reason={completion.choices[0].finish_reason}). "
            "Try raising max_tokens."
        )
    return content.strip()

# ── Bible API ─────────────────────────────────────────────────────────────────
def fetch_verse(reference):
    try:
        r = requests.get(f"https://bible-api.com/{requests.utils.quote(reference)}", timeout=6)
        if r.status_code == 200:
            d = r.json()
            return {"reference": d.get("reference", reference), "text": d.get("text", "").strip(), "translation": d.get("translation_name", "WEB")}
    except Exception as e:
        logger.warning(f"Bible API error: {e}")
    return None

def sanitize(text, max_len=500):
    text = re.sub(r"<[^>]+>", "", text.strip())
    text = re.sub(r"[^\w\s\'\"\?\!\.,\-]", "", text)
    return text[:max_len]

def parse_json(raw):
    # Strip markdown fences, then keep only the text between the first { and last }
    # so stray text before or after the JSON does not break parsing.
    raw = re.sub(r"```json|```", "", raw).strip()
    start, end = raw.find("{"), raw.rfind("}")
    if start == -1 or end == -1:
        raise ValueError("No JSON object found in model output")
    return json.loads(raw[start:end + 1], strict=False)

# ── Devotional cache (file-based, survives restarts) ─────────────────────────
DEVO_CACHE_FILE = '/tmp/versefinder_devotional.json'

DEVOTIONAL_PROMPT = """Generate a short daily devotional. Return ONLY valid JSON:
{
  "title": "Short inspiring title",
  "verse_ref": "Book chapter:verse",
  "verse_preview": "First few words of the verse...",
  "reflection": "3-4 sentence reflection on the verse, warm and encouraging",
  "application": "One practical thing to do or think about today",
  "prayer": "A 2-sentence prayer written in first person as if the reader is speaking to God — use I, me, my"
}
No markdown, no extra text."""

SEEK_PROMPT = """You are a compassionate, Bible-grounded spiritual guide.
Listen to the person's problem or situation and respond with:
1. Genuine empathy — acknowledge what they are going through (2-3 warm sentences)
2. 3 specific Bible verse references most relevant to their situation
3. A plain-language explanation of each verse and why it applies
4. Practical faith-based advice (2-3 actionable steps)
5. A short prayer (3-5 sentences)

CRITICAL RULE FOR THE PRAYER — THIS IS MANDATORY:
The prayer MUST be written as if the USER is speaking directly to God themselves.
ALWAYS use "I", "me", "my", "Lord I", "Father I".
NEVER use "this person", "they", "them", "her", "him", or any third-person language.
The user will read the prayer out loud as their own words.

WRONG example: "Lord I pray for this person who is sad, comfort them."
CORRECT example: "Lord, I come to you with a heavy heart. I ask that you comfort me and remind me that I am not alone. Help me to feel your presence in this moment. Amen."

Detect the language (English, Swahili, Sheng, or mix) and respond fully in that same language.

Return ONLY valid JSON:
{
  "empathy": "Your empathetic opening...",
  "verses": [
    {"reference": "Book chapter:verse", "explanation": "Why this applies..."},
    {"reference": "Book chapter:verse", "explanation": "Why this applies..."},
    {"reference": "Book chapter:verse", "explanation": "Why this applies..."}
  ],
  "advice": ["Step 1...", "Step 2...", "Step 3..."],
  "prayer": "Lord, I..."
}"""

SEARCH_PROMPT = """You are a Bible scholar. The user wants Bible verses about a specific topic.
Return ONLY valid JSON:
{
  "topic": "The topic title",
  "summary": "2-sentence intro about what the Bible says on this topic",
  "verses": [
    {"reference": "Book chapter:verse", "explanation": "Why this verse is relevant"},
    {"reference": "Book chapter:verse", "explanation": "Why this verse is relevant"},
    {"reference": "Book chapter:verse", "explanation": "Why this verse is relevant"},
    {"reference": "Book chapter:verse", "explanation": "Why this verse is relevant"}
  ]
}
No markdown, no extra text."""

# ── Routes ────────────────────────────────────────────────────────────────────
@app.route("/api/health")
def health():
    # "model" lets you confirm the new code is actually deployed
    return jsonify({"status": "ok", "model": GROQ_MODEL})

# TEMPORARY: open /api/selftest in a browser to see the real Groq error.
# Only works when the env variable DEBUG_ERRORS=1 is set on Render.
@app.route("/api/selftest")
def selftest():
    if os.getenv("DEBUG_ERRORS") != "1":
        return jsonify({"error": "disabled"}), 404
    info = {
        "model": GROQ_MODEL,
        "key_set": bool(os.getenv("GROQ_API_KEY")),
        "key_length": len(os.getenv("GROQ_API_KEY") or ""),
    }
    try:
        raw = call_groq("Reply with only this JSON: {\"ok\": true}", "test", max_tokens=300)
        info["raw_reply"] = raw[:300]
        info["parsed"] = parse_json(raw)
        info["result"] = "SUCCESS"
    except Exception as e:
        info["result"] = "FAILED"
        info["error_type"] = type(e).__name__
        info["error"] = str(e)[:500]
    return jsonify(info)

@app.route("/api/seek", methods=["POST"])
@rate_limit
def seek():
    data = request.get_json(silent=True)
    if not data or not data.get("problem"):
        return jsonify({"error": "Please share what is on your heart."}), 400
    problem = sanitize(data["problem"])
    if len(problem) < 5:
        return jsonify({"error": "Please share a bit more so I can help."}), 400
    try:
        raw = call_groq(SEEK_PROMPT, problem, max_tokens=2500)
        ai = parse_json(raw)
    except Exception as e:
        logger.error(f"Seek error: {type(e).__name__}: {e}", exc_info=True)
        return jsonify({"error": "Something went wrong. Please try again."}), 500

    for v in ai.get("verses", []):
        fetched = fetch_verse(v.get("reference", ""))
        if fetched:
            v["text"] = fetched["text"]
            v["reference"] = fetched["reference"]
            v["translation"] = fetched["translation"]
        else:
            v["text"] = ""
            v["translation"] = "WEB"
    return jsonify(ai)

@app.route("/api/devotional")
@rate_limit
def devotional():
    today = str(date.today())

    # Try file cache first
    if os.path.exists(DEVO_CACHE_FILE):
        try:
            with open(DEVO_CACHE_FILE, 'r') as f:
                cached = json.load(f)
            if cached.get('date') == today:
                return jsonify(cached['data'])
        except Exception:
            pass

    # Generate fresh devotional
    try:
        raw = call_groq(DEVOTIONAL_PROMPT, f"Generate a devotional for {today}", max_tokens=1000)
        data = parse_json(raw)
        fetched = fetch_verse(data.get("verse_ref", ""))
        if fetched:
            data["verse_text"] = fetched["text"]
            data["translation"] = fetched["translation"]

        # Save to file cache
        try:
            with open(DEVO_CACHE_FILE, 'w') as f:
                json.dump({'date': today, 'data': data}, f)
        except Exception as e:
            logger.warning(f"Could not write devotional cache: {e}")

        return jsonify(data)
    except Exception as e:
        logger.error(f"Devotional error: {type(e).__name__}: {e}", exc_info=True)
        return jsonify({"error": "Could not load devotional."}), 500

@app.route("/api/search", methods=["POST"])
@rate_limit
def search():
    data = request.get_json(silent=True)
    if not data or not data.get("topic"):
        return jsonify({"error": "Please enter a topic."}), 400
    topic = sanitize(data["topic"], max_len=100)
    try:
        raw = call_groq(SEARCH_PROMPT, f"Topic: {topic}", max_tokens=1500)
        result = parse_json(raw)
    except Exception as e:
        logger.error(f"Search error: {type(e).__name__}: {e}", exc_info=True)
        return jsonify({"error": "Search failed. Please try again."}), 500

    for v in result.get("verses", []):
        fetched = fetch_verse(v.get("reference", ""))
        if fetched:
            v["text"] = fetched["text"]
            v["reference"] = fetched["reference"]
            v["translation"] = fetched["translation"]
        else:
            v["text"] = ""
            v["translation"] = "WEB"
    return jsonify(result)

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
