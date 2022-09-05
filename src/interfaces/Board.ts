import type { MoveType } from './Move'
import type { CardValue } from './CardValue'
import { Suits } from './Suits'
import { board, cards, flipTime, targetCard } from '@/utils/store'
import type { CardType } from './CardType'
import { createCards, fixedBoard, getCriticalCards } from '@/utils'

interface BoardState {
	// previousMoves: MoveType[]
	// possibleMoves: MoveType[]
	draw: CardValue[]
	discard: CardValue[]
	stack: {
		'1': CardValue[]
		'2': CardValue[]
		'3': CardValue[]
		'4': CardValue[]
		'5': CardValue[]
		'6': CardValue[]
		'7': CardValue[]
	}
	win: {
		'S': CardValue[]
		'H': CardValue[]
		'C': CardValue[]
		'D': CardValue[]
	}
}

class Board {
	state: BoardState = {
		draw: [],
		discard: [],
		stack: {
			'1': [],
			'2': [],
			'3': [],
			'4': [],
			'5': [],
			'6': [],
			'7': []
		},			
		win: {
			'S': [],
			'H': [],
			'C': [],
			'D': []
		}
	}
	initialState: BoardState = {
		draw: [],
		discard: [],
		stack: {
			'1': [],
			'2': [],
			'3': [],
			'4': [],
			'5': [],
			'6': [],
			'7': []
		},			
		win: {
			'S': [],
			'H': [],
			'C': [],
			'D': []
		}
	}
	autoMove: boolean = false
	autoPlay: boolean = false
	autoComplete: boolean = false
	isWin: boolean = false
	isResetting: boolean = false

	constructor() {
		this.initBoard()
	}
	initBoard() {
		if (!this.autoPlay) {
			this.autoComplete = false
		}
		this.isWin = false
		// if (fixedBoard === null) {
		this.initCards()
		this.dealCards()
		// }
		this.updateBoard()
		// console.log(this.state);
	}
	initCards() {
		const cardValues: CardValue[] = []
		Object.keys(Suits).forEach((suit, x) => {
			for (let i = 1; i <= 13; i++) {
				cardValues.push({ suit: suit as Suits, value: i })
			}
		})
		const randomCard = () => cardValues.splice(Math.floor(Math.random() * cardValues.length), 1)[0]
		for (let x = 1; x <= 7; x++) {
			const stack = this.getStackFromName(`${x}`)
			while (stack.length < x) {
				const selectedCard = randomCard()
				stack.push(selectedCard)
			}
		}
		while (cardValues.length > 0) {
			const selectedCard = randomCard()
			this.getStackFromName('draw').push(selectedCard)
		}
		this.copyBoard()
	}
	dealCards() {
		if (this.isResetting) {
			this.dealStack('draw')
		}
		this.dealStack('discard')
		for (let i = 1; i <= 7; i++) {
			this.dealStack(`${i}`)
		}
		Object.keys(Suits).forEach((suit) => {
			this.dealStack(`win${suit[0].toUpperCase()}`)
		})
	}
	dealStack(stackName: string) {
		this.getStackFromName(stackName).forEach((card) => {
			this.moveCard(true, card.suit, card.value, stackName)
		})
	}
	copyBoard() {
		['draw', ...Array.from(Array(7).keys()).map(n => `${n + 1}`)].forEach((stackName) => {
			if (stackName === 'draw') {
				this.initialState.draw = [...this.getStackFromName(stackName).map(card => card)]
			} else {
				this.initialState.stack[stackName as '1' | '2' | '3' | '4' | '5' | '6' | '7'] = [...this.getStackFromName(stackName as '1' | '2' | '3' | '4' | '5' | '6' | '7')]
			}
		})
	}
	clearBoard() {
		cards.value = createCards()
		this.setTargetCard(null)
		this.state, this.initialState = {
			draw: [],
			discard: [],
			stack: {
				'1': [],
				'2': [],
				'3': [],
				'4': [],
				'5': [],
				'6': [],
				'7': []
			},			
			win: {
				'S': [],
				'H': [],
				'C': [],
				'D': []
			}
		} 	
		this.initBoard()
	}
	resetBoard() {
		this.isResetting = true
		this.setTargetCard(null)
		this.state = {
			draw: [...this.initialState.draw.map(card => card)],
			discard: [],
			stack: {
				'1': [...this.initialState.stack[1].map(card => card)],
				'2': [...this.initialState.stack[2].map(card => card)],
				'3': [...this.initialState.stack[3].map(card => card)],
				'4': [...this.initialState.stack[4].map(card => card)],
				'5': [...this.initialState.stack[5].map(card => card)],
				'6': [...this.initialState.stack[6].map(card => card)],
				'7': [...this.initialState.stack[7].map(card => card)]
			},			
			win: {
				'S': [],
				'H': [],
				'C': [],
				'D': []
			}
		};
		console.log(this.initialState);
		this.dealCards()
		this.updateBoard()
		this.isResetting = false
	}
	getStackFromName(name: string): CardValue[] {
		if (name === 'discard') {
			return this.state.discard
		}
		if (name === 'draw') {
			return this.state.draw
		}
		if (name.startsWith('win')) {
			return this.state.win[(name.slice(3) as 'S' | 'H' | 'C' | 'D')]
		}
		const n = parseInt(name)
		return this.state.stack[n as 1 | 2 | 3 | 4 | 5 | 6 | 7]
	}
	getCardIndex(suit: Suits, value: number, stack: string): number {
		const index = this.getStackFromName(stack).findIndex((card) => card.suit === suit && card.value === value)
		return index
	}
	getCardFromValue(suit: Suits, value: number) {
		return cards.value.find((card) => card.value.suit === suit && card.value.value === value) ?? null
	}
	makeMove(card: CardType) {				
		if (card.stack === 'draw') {
			this.moveTopCard('draw', 'discard') // TODO what is with this moveTopCard bs bruh the other function is better 
			this.setTargetCard(null)
			return 
		}
		if (this.autoMove) {
			this.makeAutoMove(card)
			return
		}
		if (targetCard.value === null) {
			this.setTargetCard(card)
			return
		}
		if (this.isTargetCard(card)) {
			this.setTargetCard(null)
			return 
		}
		if (this.cardInWin(card)) {
			this.winMove()
			return
		}
		const stackNum = parseInt(card.stack)
		if (isNaN(stackNum)) {
			this.setTargetCard(null)
			return
		}
		if (this.cardInStack(card, stackNum)) {
			this.stackMove(stackNum)
			return 
		}
	}
	cardInStack = (card: CardType, stackNumber: number) =>  this.getStackFromName(`${stackNumber}`).some((stackCard) => this.cardsMatch(stackCard, card))
	stackMove(stackNumber: number) {
		if (targetCard.value === null) return
		if (this.isValidStackMove(targetCard.value, `${stackNumber}`) && !this.cardInStack(targetCard.value, stackNumber)) {
			if (targetCard.value.stack === 'discard' || targetCard.value.stack.startsWith('win')) {
				this.moveTopCard(targetCard.value.stack, `${stackNumber}`)
			} else {
				const targetCardIndex = this.getCardIndex(targetCard.value.suit, targetCard.value.value, targetCard.value.stack)
				this.moveStackedCards(targetCardIndex, targetCard.value.stack, `${stackNumber}`)
			}
		}
		this.setTargetCard(null)
	}
	getWinKey = (suit: Suits) => `win${suit[0].toUpperCase()}`
	cardInWin = (card: CardType) => this.getStackFromName(this.getWinKey(card.suit)).some((winCard) => this.cardsMatch(winCard, card))
	winMove() {
		if (targetCard.value === null) return
		const winStack = `win${targetCard.value.suit[0].toUpperCase()}`
		if (this.isValidWinMove(targetCard.value, winStack) && !this.cardInWin(targetCard.value)) {
			this.moveTopCard(targetCard.value.stack, winStack)
		}
		this.setTargetCard(null)
	}
	recycleCards() {
		let topCard: CardValue | null = this.state.discard.pop() ?? null
		while (topCard !== null) {
			this.state.draw.push(topCard)
			topCard = this.state.discard.pop() ?? null
		}
		this.state.draw.forEach((drawCard) => {
			const card = cards.value.find((card) => card.value.suit === drawCard.suit && card.value.value === drawCard.value)
			if (card) {
				card.value.stack = 'draw'
				card.value.facedown = true
			}
		})
	}
	moveTopCard(oldStack: string, newStack: string) {
		const card = this.getStackFromName(oldStack).pop()
		if (!card) return
		this.getStackFromName(newStack).push(card)
		this.moveCard(false, card.suit, card.value, newStack)
	}
	moveStackedCards(index: number, from: string, to: string) {
		const prevStack = this.getStackFromName(from)
		const newStack = this.getStackFromName(to)
		const cards = prevStack.splice(index, prevStack.length - index)
		cards.forEach((card) => {
			newStack.push(card)
			this.moveCard(false, card.suit, card.value, to)		
		})
	}
	cardsMatch(card1: CardValue, card2: CardValue) {
		return card1.suit === card2.suit && card1.value === card2.value
	} 
	getTopCard(stackName: string): CardValue | null {
		const stack = this.getStackFromName(stackName)
		if (stack.length === 0) {
			return null
		}
		return stack[stack.length - 1]
	}
	isTopCard(card: CardType): boolean { // TODO put this where it is needed
		const topCard = this.getTopCard(card.stack) // TODO 🤢
		if (!topCard) return false
		return this.cardsMatch(topCard, card)
	}
	setTargetCard(card: CardType | null) {
		targetCard.value = card
	}
	isTargetCard(card: CardType) {
		if (targetCard.value === null) return false
		return this.cardsMatch(targetCard.value, card) 
	}
	updateBoard() {
		this.updateStack('draw')
		this.updateStack('discard')
		for (let i = 1; i <= 7; i++) {
			this.updateStack(`${i}`)
		}
		Object.keys(Suits).forEach((suit) => {
			this.updateStack(`win${suit[0].toUpperCase()}`)
		})
		if (getCriticalCards().length === 0 && this.autoComplete === false) {
			this.autoComplete = true;
			this.getNextWinCards().then(async (nextWinCards) => {
				this.isWin = await this.autoCompleteBoard(nextWinCards) ?? false
			})
		}
	}
	updateStack(stackName: string) {
		const stack = this.getStackFromName(stackName)
		for (let i = stack.length - 1; i >= 0; i-- ) {
			const card = stack[i]
			this.updateCard(card.suit, card.value)
		}
	}
	updateCard(suit: Suits, value: number) {
		const card = this.getCardFromValue(suit, value)
		if (!card) return
		if (card.value.stack.startsWith('win')) return
		if (card.value.stack === 'draw') {
			card.value.facedown = true
			return
		}
		if (card.value.stack === 'discard') {
			card.value.facedown = false
			return
		}
		if (this.isResetting) {
			card.value.facedown = !this.isTopCard(card.value)
			return
		}
		if (this.isTopCard(card.value)) {
			card.value.facedown = false
		}
	}
	moveCard(init: boolean, suit: Suits, value: number, newStack: string) {
		const card = this.getCardFromValue(suit, value)
		if (!card)  return
		card.value.stack = newStack
		if (init) return
		this.updateBoard()
	}

	isValidWinMove(card: CardType, target: string) {
		const topCard = this.getTopCard(target)
		const fromTopCard = this.getTopCard(card.stack)
		if (fromTopCard === null || !this.cardsMatch(card, fromTopCard)) return false
		if (topCard === null) return card.value === 1
		return card.suit === topCard.suit && card.value - 1 === topCard.value
	}
	isValidStackMove(card: CardValue, target: string) {
		const topCard = this.getTopCard(target)
		if (topCard === null) return card.value === 13
		if (card.value + 1 !== topCard.value) return false
		if (card.suit === Suits.Heart || card.suit === Suits.Diamond) return topCard.suit === Suits.Spade || topCard.suit === Suits.Club
		return topCard.suit === Suits.Heart || topCard.suit === Suits.Diamond
	}

	makeAutoMove(card: CardType) {		
		this.setTargetCard(null)
		const targets = this.getTargets(card)
		if (targets.length === 0) return
		this.moveStackedCards(this.getCardIndex(card.suit, card.value, card.stack), card.stack, targets[0])
	}
	getTargets(card: CardType) {
		const targets: string[] = []
		if (!this.cardInWin(card)) {
			const winKey = this.getWinKey(card.suit)
			if (this.isValidWinMove(card, winKey)) {
				targets.push(winKey)
			}
		}
		for (let i = 1; i <= 7; i++) {
			if (!this.cardInStack(card, i)) {
				if (this.isValidStackMove(card, `${i}`)) {
					targets.push(`${i}`)
				}
			}
		}
		return targets
	}

	async autoCompleteBoard(nextWinCards: CardValue[]): Promise<boolean | void> {
		console.log(nextWinCards);
		if (nextWinCards.length === 0) {
			return true
		}
		const nextWinCard = nextWinCards.splice(0, 1)[0]
		const winMoveMade = await this.autoCompleteWinMove(nextWinCard)
		if (!winMoveMade) {
			console.log('win move failed');
			return await this.autoCompleteBoard(nextWinCards)
		}
		this.updateBoard()
		await new Promise(resolve => setTimeout(() => resolve, flipTime.value))
		const newWinCards = await this.getNextWinCards()
		console.log(`new ${newWinCards}`);
		return await this.autoCompleteBoard(newWinCards)
	}

	async autoCompleteWinMove(winCard: CardValue): Promise<boolean> {
		const card = this.getCardFromValue(winCard.suit, winCard.value) // TODO Extract "is this card the top card in its stack" logic into it's own method
		if (!card) return false
		if (card.value.stack !== 'draw' && this.isTopCard(card.value)) { // TODO why does getCardIndex take suit and value and not CardValue exactly
			this.moveStackedCards(this.getCardIndex(card.value.suit, card.value.value, card.value.stack), card.value.stack, this.getWinKey(card.value.suit))
			return true
		} 
		if (card.value.stack === 'discard' || card.value.stack === 'draw') {
			await this.cycleDrawPile(card.value)
			this.moveStackedCards(this.getCardIndex(card.value.suit, card.value.value, card.value.stack), card.value.stack, this.getWinKey(card.value.suit))
			return true
		} 
		// Since cards in winPiles can't be moved and non-top stackPile cards can't be moved, just return false here
		return false
	}

	async cycleDrawPile(card: CardType): Promise<void> {
		if (card.stack === 'discard' && this.isTopCard(card)) {
			return
		}
		if (this.getStackFromName('draw').length === 0) {
			this.recycleCards()
		} else {
			this.moveTopCard('draw', 'discard')
		}
		this.updateBoard()
		await new Promise(resolve => setTimeout(() => resolve, flipTime.value))
		return await this.cycleDrawPile(card)
	}

	async getNextWinCards() {
		const nextWinCards: CardValue[] = []
		Object.values(Suits).forEach((suit) => {
			const topWinCard = this.getTopCard(this.getWinKey(suit))
			if (topWinCard === null) {
				nextWinCards.push({ suit: suit, value: 1 })
			} else if (topWinCard.value < 13) {
				nextWinCards.push({ suit: suit, value: topWinCard.value + 1 })
			}
		})
		return nextWinCards
	}

	async computerMove() {

	}
	// use recursive function to see if the move will unflip any critical cards
	
}

export { Board, type BoardState }