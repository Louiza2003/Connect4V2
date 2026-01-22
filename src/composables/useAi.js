import { useGameStateStore } from "../stores/gameState"
import { useGameSettingsStore } from "../stores/gameSettings"
import { storeToRefs } from 'pinia'

export function useAi() {
   const gameStateStore = useGameStateStore()
   const gameSettingsStore = useGameSettingsStore()
   const { board } = storeToRefs(gameStateStore)
   const { boardSize } = storeToRefs(gameSettingsStore)

   const isColAvailable = (col, b) => {
      return b[0][col] === 0
   }

   const getNextOpenRow = (b, col) => {
      for (let row = b.length - 1; row >= 0; row--) {
         if (b[row][col] === 0) return row
      }
      return null
   }

   const copyBoard = (b) => {
      return b.map(row => [...row])
   }

   const checkWinner = (b, player) => {
      const ROWS = b.length
      const COLS = b[0].length

      // Horizontal
      for (let r = 0; r < ROWS; r++) {
         for (let c = 0; c < COLS - 3; c++) {
            if (
               b[r][c] === player &&
               b[r][c + 1] === player &&
               b[r][c + 2] === player &&
               b[r][c + 3] === player
            ) return true
         }
      }

      // Vertical
      for (let c = 0; c < COLS; c++) {
         for (let r = 0; r < ROWS - 3; r++) {
            if (
               b[r][c] === player &&
               b[r + 1][c] === player &&
               b[r + 2][c] === player &&
               b[r + 3][c] === player
            ) return true
         }
      }

      // Diagonale /
      for (let r = 3; r < ROWS; r++) {
         for (let c = 0; c < COLS - 3; c++) {
            if (
               b[r][c] === player &&
               b[r - 1][c + 1] === player &&
               b[r - 2][c + 2] === player &&
               b[r - 3][c + 3] === player
            ) return true
         }
      }

      // Diagonale \
      for (let r = 0; r < ROWS - 3; r++) {
         for (let c = 0; c < COLS - 3; c++) {
            if (
               b[r][c] === player &&
               b[r + 1][c + 1] === player &&
               b[r + 2][c + 2] === player &&
               b[r + 3][c + 3] === player
            ) return true
         }
      }

      return false
   }

   const evaluateBoard = (b) => {
      if (checkWinner(b, 2)) return 1000
      if (checkWinner(b, 1)) return -1000
      return 0
   }

   const minimax = (b, depth, isMaximizing) => {
      if (depth === 0 || checkWinner(b, 1) || checkWinner(b, 2)) {
         return evaluateBoard(b)
      }

      if (isMaximizing) {
         let best = -Infinity
         for (let col = 0; col < b[0].length; col++) {
            if (isColAvailable(col, b)) {
               const row = getNextOpenRow(b, col)
               const newBoard = copyBoard(b)
               newBoard[row][col] = 2
               best = Math.max(best, minimax(newBoard, depth - 1, false))
            }
         }
         return best
      } else {
         let best = Infinity
         for (let col = 0; col < b[0].length; col++) {
            if (isColAvailable(col, b)) {
               const row = getNextOpenRow(b, col)
               const newBoard = copyBoard(b)
               newBoard[row][col] = 1
               best = Math.min(best, minimax(newBoard, depth - 1, true))
            }
         }
         return best
      }
   }

   const calculateCol = () => {
      const b = board.value
      let bestScore = -Infinity
      let bestCol = -1

      for (let col = 0; col < b[0].length; col++) {
         if (isColAvailable(col, b)) {
            const row = getNextOpenRow(b, col)
            const newBoard = copyBoard(b)
            newBoard[row][col] = 2
            const score = minimax(newBoard, 3, false)
            if (score > bestScore) {
               bestScore = score
               bestCol = col
            }
         }
      }

      return bestCol
   }

   return { calculateCol }
}
