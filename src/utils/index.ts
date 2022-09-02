import type { CardType } from "@/interfaces"
import { Suits } from "@/interfaces/Suits"
import { type Ref, ref } from "vue"
import { cards } from "./store"

const cardsMatch = (card1: CardType, card2: CardType): boolean => {
	return card1.suit === card2.suit && card1.value === card1.value
}

// const fixedBoard: string[] = []
// const fixedBoard: string[] = ['3', 'draw', '6', 'draw', '7', 'draw', 'draw', '3', '4', '6', 'draw', '4', '7', '4', '7', '5', 'draw', '7', '1', '2', 'draw', '7', 'draw', 'draw', 'draw', '5', 'draw', 'draw', '5', '6', '2', '3', 'draw', 'draw', '7', 'draw', 'draw', '5', 'draw', '6', 'draw', 'draw', '5', 'draw', 'draw', 'draw', '4', '6', 'draw', 'draw', '6', '7']
const fixedBoard: string[] = ['7', 'draw', '6', 'draw', 'draw', 'draw', '1', 'draw', '5', 'draw', '4', 'draw', '5', '3', '5', '3', '7', '7', '2', 'draw', '6', '4', '6', '2', '5', '5', 'draw', '4', '6', 'draw', 'draw', 'draw', '4', 'draw', 'draw', '3', '7', 'draw', 'draw', 'draw', 'draw', '7', 'draw', '7', '7', 'draw', '6', 'draw', '6', 'draw', 'draw', 'draw']
const createCards = (): Ref<CardType>[] => {
	const cards: Ref<CardType>[] = []
	Object.values(Suits).forEach((suit) => {
		for (let i = 1; i <= 13; i++) {
			cards.push(ref({
				suit: suit,
				value: i,
				stack: 'draw',
				facedown: true,
			}))
		}
	})
	return cards
}

const getCriticalCards = () =>  cards.value.filter((card) => card.value.facedown)

// TODO move some logic from board to here
// TODO vue dependency injection

export { 
	cardsMatch, 
	createCards,  
	getCriticalCards,
	fixedBoard
}