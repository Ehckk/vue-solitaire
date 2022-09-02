import type { Board } from './Board'

interface GameType {
	winCount: number
	lossCount: number
	board: Board
	possibleBoards: Board[]
}

export type { GameType }