import { useCallback, useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"

export function useUrlState<T extends Record<string, any>>(initialState: T, key: string) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [state, setState] = useState<T>(() => {
    const urlState = searchParams.get(key)
    if (urlState) {
      try {
        return { ...initialState, ...JSON.parse(urlState) }
      } catch (e) {
        return initialState
      }
    }
    return initialState
  })

  useEffect(() => {
    const urlState = searchParams.get(key)
    if (urlState) {
      try {
        const parsedState = JSON.parse(urlState)
        setState(prev => ({ ...prev, ...parsedState }))
      } catch (e) {
        // Ignorar erro de parsing
      }
    }
  }, [searchParams, key])

  const setUrlState = useCallback(
    (newState: Partial<T> | ((prev: T) => Partial<T>)) => {
      setState(prev => {
        const updatedState = typeof newState === "function" ? { ...prev, ...newState(prev) } : { ...prev, ...newState }
        
        const newSearchParams = new URLSearchParams(searchParams)
        newSearchParams.set(key, JSON.stringify(updatedState))
        setSearchParams(newSearchParams)
        
        return updatedState
      })
    },
    [searchParams, setSearchParams, key]
  )

  return [state, setUrlState] as const
}