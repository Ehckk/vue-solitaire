import type { BoardState, CardType } from "@/interfaces"
import { Suits } from "@/interfaces/Suits"
import { type Ref, ref } from "vue"
import { cards } from "./store"

const cardsMatch = (card1: CardType, card2: CardType): boolean => {
	return card1.suit === card2.suit && card1.value === card1.value
}

const fixedBoard: | null = null
// const fixedBoard: BoardState = {
// 	draw: [],
// 	discard: [],
// 	stack: {
// 		'1': [],
// 		'2': [],
// 		'3': [],
// 		'4': [],
// 		'5': [],
// 		'6': [],
// 		'7': []
// 	},			
// 	win: {
// 		'S': [],
// 		'H': [],
// 		'C': [],
// 		'D': []
// 	}
// } 	

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