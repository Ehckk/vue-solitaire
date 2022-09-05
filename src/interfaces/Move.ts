import type { CardType } from './CardType'

interface MoveType {
	from: {
		stack: string
		card: CardType
	}
	to: {
		stack: string
		topCard: CardType
	}
}

export type { MoveType }