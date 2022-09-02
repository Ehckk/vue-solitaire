import type { CardValue } from "./CardValue"
import type { Suits } from "./Suits"

interface CardType extends CardValue {
	stack: string
	facedown: boolean
}

export type { CardType }