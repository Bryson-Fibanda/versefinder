import { useState, useCallback } from 'react'
import { seekGuidance } from '../utils/api.js'

export function useSeek() {
  const [state, setState] = useState({ loading: false, result: null, error: null })

  const seek = useCallback(async (problem) => {
    setState({ loading: true, result: null, error: null })
    try {
      const data = await seekGuidance(problem)
      setState({ loading: false, result: data, error: null })
    } catch (err) {
      setState({ loading: false, result: null, error: err.message })
    }
  }, [])

  const reset = useCallback(() => setState({ loading: false, result: null, error: null }), [])

  return { ...state, seek, reset }
}
