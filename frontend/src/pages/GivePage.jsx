import React from "react";
import { Heart, Smartphone, BookOpen, Code } from "lucide-react";
import "./GivePage.css";

const MPESA_TILL = import.meta.env.VITE_MPESA_TILL || "000000";
const MPESA_NAME = import.meta.env.VITE_MPESA_NAME || "VerseFinder";

export default function GivePage() {
  return (
    <div className="give-page">
      {/* Hero */}
      <div className="give-hero">
        <div className="give-hero-icon">
          <Heart size={28} strokeWidth={1.5} />
        </div>
        <h1 className="give-title">Support This Ministry</h1>
        <p className="give-subtitle">
          VerseFinder is completely free and will always be. If the Word has
          blessed you, consider sowing a seed to keep this service running for
          others.
        </p>
      </div>

      <div className="give-container">
        {/* Scripture */}
        <div className="give-scripture">
          <p className="give-verse-text">
            "Each of you should give what you have decided in your heart to
            give, not reluctantly or under compulsion, for God loves a cheerful
            giver."
          </p>
          <span className="give-verse-ref">2 Corinthians 9:7</span>
        </div>

        {/* M-Pesa card */}
        <div className="mpesa-card animate-fade-up">
          <div className="mpesa-card-top">
            <div className="mpesa-icon-wrap">
              <Smartphone size={20} strokeWidth={1.5} />
            </div>
            <div>
              <p className="mpesa-card-label">Send via M-Pesa</p>
              <p className="mpesa-card-sub">Send Money</p>
            </div>
          </div>

          <div className="mpesa-till-block">
            <span className="mpesa-till-label">Till Number</span>
            <span className="mpesa-till-number">0762766158</span>
            <span className="mpesa-till-name">Bryson</span>
          </div>

          <div className="mpesa-steps">
            <p className="mpesa-steps-title">How to send</p>
            <ol>
              <li>
                Open <strong>M-Pesa</strong> on your phone
              </li>
              <li>
                Select <strong>Send Money</strong>
              </li>
              <li>
                Select <strong>Enter Phone no.</strong>
              </li>
              <li>
                Enter Number: <strong>0762766158</strong>
              </li>
              <li>Enter any amount — every shilling counts</li>
              <li>Enter your M-Pesa PIN and confirm</li>
            </ol>
          </div>
        </div>

        {/* Impact */}
        <div className="give-impact animate-fade-up delay-1">
          <p className="give-impact-title">What your support does</p>
          <div className="give-impact-items">
            {[
              [
                "Keeps the App running",
                "Pays for the API calls that power every guidance session",
              ],
              [
                "Keeps it free",
                "Ensures no one ever pays a subscription to receive the Word",
              ],
              [
                "Reaches more people",
                "Helps us share VerseFinder with more Kenyans who need it",
              ],
            ].map(([title, desc], i) => (
              <div key={i} className="impact-item">
                <div className="impact-dot" />
                <div>
                  <p className="impact-item-title">{title}</p>
                  <p className="impact-item-desc">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="give-divider">
          <span>About</span>
        </div>

        {/* Creator */}
        <div className="give-creator animate-fade-up delay-2">
          <div className="creator-icon">
            <Code size={18} strokeWidth={1.5} />
          </div>
          <div className="creator-info">
            <p className="creator-built">Built by</p>
            <p className="creator-name">Two Five Four Software Solutions</p>
            <p className="creator-desc">
              A Kenyan developer building tools that serve real people in real
              situations — in their language, with their payment methods, for
              their lives.
            </p>
          </div>
        </div>

        {/* App info */}
        <div className="give-app-info">
          <BookOpen size={14} strokeWidth={1.5} />
          <p>
            VerseFinder uses the World English Bible (WEB) translation via
            bible-api.com.No user data is stored.
          </p>
        </div>
      </div>
    </div>
  );
}
