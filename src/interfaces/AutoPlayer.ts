import { getCriticalCards } from "@/utils";
import { board, cards } from "@/utils/store";
import type { Ref } from "vue";
import type { Board } from "./Board";
import type { CardType } from "./CardType";
import type { MoveType } from "./Move";

class AutoPlayer {
	possibleMoves: MoveType[]

	constructor() {
		this.possibleMoves = []
		if (getCriticalCards().length === 0) {
			// autocomplete
		} else {
			// autoPlay
		}
	}

	autoPlay() {
		const criticalCards = getCriticalCards().map((card) => card.value)
		this.getPossibleMoves(criticalCards, )
	}

	getWinMove() {
		
	}
	getWinCard() { // the card that would be below this one in the win pile (same suit, value - 1)

	}

	getPossibleMoves(criticalCards: CardType[], ) {
		if (criticalCards.length === 0) {
			return
		}
		const thisCard = criticalCards.splice(0, 1)[0]
		if (!thisCard) {
			this.getPossibleMoves(criticalCards)
		}
		const cardAbove = this.getCardAbove(thisCard)
		const targets = this.getCardTargets(thisCard)
	}
	
	getCardTargets(thisCard: CardType) {
		// 
	}

	findTargetCard() {

	}

	getCardAbove(card: CardType): CardType | null {
		const stack = board.getStackFromName(card.stack)
		const cardIndex = board.getCardIndex(card.suit, card.value, card.stack)
		if (stack.length <= cardIndex + 1) return null
		const aboveCard = stack[cardIndex + 1]
		return board.getCardFromValue(aboveCard.suit, aboveCard.value)?.value ?? null
	}
}


