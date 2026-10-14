import { useEffect, useReducer } from 'react'
import { boardReducer } from './boardReducer'
import { loadBoard, saveBoard } from './storage'

export function useBoard() {
  const [state, dispatch] = useReducer(boardReducer, undefined, loadBoard)

  useEffect(() => {
    saveBoard(state)
  }, [state])

  return [state, dispatch] as const
}
