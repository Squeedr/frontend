import { useCallback, useRef, useState, useEffect } from "react"

/**
 * Custom hook for managing state with selective updates
 * @param initialState Initial state
 * @returns State and update functions
 */
export function useSelectiveState<T extends Record<string, any>>(initialState: T) {
  const [state, setState] = useState<T>(initialState)
  const stateRef = useRef<T>(initialState)

  // Update state ref when state changes
  useEffect(() => {
    stateRef.current = state
  }, [state])

  /**
   * Update a specific field in the state
   * @param field Field to update
   * @param value New value
   */
  const updateField = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setState((prevState) => ({
      ...prevState,
      [field]: value,
    }))
  }, [])

  /**
   * Update multiple fields in the state
   * @param updates Object containing field updates
   */
  const updateFields = useCallback((updates: Partial<T>) => {
    setState((prevState) => ({
      ...prevState,
      ...updates,
    }))
  }, [])

  /**
   * Reset state to initial values
   */
  const resetState = useCallback(() => {
    setState(initialState)
  }, [initialState])

  /**
   * Get current state value
   * @returns Current state
   */
  const getState = useCallback(() => {
    return stateRef.current
  }, [])

  return {
    state,
    updateField,
    updateFields,
    resetState,
    getState,
  }
}

/**
 * Custom hook for managing state with history (undo/redo)
 * @param initialState Initial state
 * @param maxHistory Maximum number of history entries
 * @returns State and history management functions
 */
export function useHistoryState<T>(initialState: T, maxHistory = 50) {
  const [state, setState] = useState<T>(initialState)
  const [history, setHistory] = useState<T[]>([initialState])
  const [currentIndex, setCurrentIndex] = useState(0)

  /**
   * Update state and add to history
   * @param newState New state
   */
  const updateState = useCallback(
    (newState: T) => {
      setState(newState)
      
      // Remove any future history entries
      const newHistory = history.slice(0, currentIndex + 1)
      
      // Add new state to history
      newHistory.push(newState)
      
      // Limit history size
      if (newHistory.length > maxHistory) {
        newHistory.shift()
      }
      
      setHistory(newHistory)
      setCurrentIndex(newHistory.length - 1)
    },
    [history, currentIndex, maxHistory]
  )

  /**
   * Undo the last state change
   */
  const undo = useCallback(() => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1
      setCurrentIndex(newIndex)
      setState(history[newIndex])
    }
  }, [currentIndex, history])

  /**
   * Redo the last undone state change
   */
  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      const newIndex = currentIndex + 1
      setCurrentIndex(newIndex)
      setState(history[newIndex])
    }
  }, [currentIndex, history])

  /**
   * Check if undo is available
   */
  const canUndo = currentIndex > 0

  /**
   * Check if redo is available
   */
  const canRedo = currentIndex < history.length - 1

  return {
    state,
    updateState,
    undo,
    redo,
    canUndo,
    canRedo,
    history,
    currentIndex,
  }
}

/**
 * Custom hook for managing state with persistence
 * @param key Storage key
 * @param initialState Initial state
 * @param storage Storage to use (localStorage or sessionStorage)
 * @returns State and update functions
 */
export function usePersistentState<T>(
  key: string,
  initialState: T,
  storage: Storage = localStorage
) {
  const [state, setState] = useState<T>(() => {
    try {
      const item = storage.getItem(key)
      return item ? JSON.parse(item) : initialState
    } catch (error) {
      console.error("Error reading from storage:", error)
      return initialState
    }
  })

  useEffect(() => {
    try {
      storage.setItem(key, JSON.stringify(state))
    } catch (error) {
      console.error("Error writing to storage:", error)
    }
  }, [key, state, storage])

  return [state, setState] as const
} 