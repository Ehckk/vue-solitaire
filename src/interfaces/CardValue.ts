import type { Suits } from "./Suits"

interface CardValue {
	suit: Suits
	value: number
	// TODO make facedown and stack Ref types
}

export type { CardValue }