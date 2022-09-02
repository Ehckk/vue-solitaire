<script setup lang="ts">
import { ref, watch } from '@vue/runtime-dom';
import jack from '@/assets/images/jack.png'
import queen from '@/assets/images/queen.png'
import king from '@/assets/images/king.png'
import spade from '@/assets/images/spade.png'
import heart from '@/assets/images/heart.png'
import club from '@/assets/images/club.png'
import diamond from '@/assets/images/diamond.png'
import type { CardType } from '@/interfaces';
import { board, flipTime, targetCard } from '@/utils/store';
import { Suits } from '@/interfaces/Suits';
import { computed, toRefs } from '@vue/reactivity';

interface Props {
	card: CardType
}

const props = defineProps<Props>()

const SUIT_IMG = props.card.suit === 'Spade' ? spade : props.card.suit === 'Heart' ? heart : props.card.suit === 'Club' ? club : diamond 
const FACE_IMG = props.card.value > 10 ? props.card.value === 13 ? king : props.card.value === 12 ? queen : jack : 'none'
const z = ref(board.getCardIndex(props.card.suit, props.card.value, props.card.stack) + 1)
const cardRef = toRefs(props).card
const isFlipping = ref(false)
let faceDown = cardRef.value.facedown
const isTarget = ref(board.isTargetCard(cardRef.value))
const locked = ref(board.autoComplete)

const getValue = (value: number) => value === 13 ? 'K' : value === 12 ? 'Q' : value === 11 ? 'J' : value === 1 ? 'A' : `${value}`

const getTranslateX = () => {
	if (cardRef.value.stack.startsWith('win')) {
		return `${9.5}`
	} 
	if (cardRef.value.stack === 'discard') {
		return `${1}`
	} 
	if (cardRef.value.stack === 'draw') {
		return `${0}`
	} 
	return `${(parseInt(cardRef.value.stack) + 1.5)}`
}

const getTranslateY = () => {
	if (cardRef.value.stack.startsWith('win')) {
		return `${Object.keys(Suits).indexOf(props.card.suit)}`
	}
	if (cardRef.value.stack === 'discard' || cardRef.value.stack === 'draw') {
		return '0'
	}	
	return `${board.getCardIndex(cardRef.value.suit, cardRef.value.value, cardRef.value.stack) / 4.25}`
}

const printCard = (card: CardType) => `${card.value} of ${card.suit}`

watch(cardRef, () => {
	z.value = z.value + 1000
	if (faceDown === cardRef.value.facedown) {
		setTimeout(() => z.value = board.getCardIndex(cardRef.value.suit, cardRef.value.value, cardRef.value.stack) + 1, flipTime.value * 2)
		return
	}
	isFlipping.value = true	
	setTimeout(() => {
		isFlipping.value = false
		faceDown = cardRef.value.facedown
		setTimeout(() => {
			z.value = board.getCardIndex(cardRef.value.suit, cardRef.value.value, cardRef.value.stack) + 1
		}, flipTime.value)		
	}, flipTime.value)
}, { 
	deep: true,
	onTrigger(event) {
		// console.log(`${printCard(props.card)}\n${event.key}: Was ${event.oldValue}, Now ${event.newValue}`);
	} 
})
watch(targetCard, () => isTarget.value = targetCard.value ? board.cardsMatch(targetCard.value, cardRef.value) : false)

const cardClick = () => {
	board.makeMove(cardRef.value)
	isTarget.value = board.isTargetCard(cardRef.value)
}

const cardClass = computed(() => ({ 'faceDown': faceDown, 'flipping': isFlipping.value, 'isTarget': isTarget.value, 'isDisabled': (faceDown && cardRef.value.stack !== 'draw') || locked.value }))
const suitImage = computed(() => `url(${SUIT_IMG})`) 
const faceImage = computed(() => `url(${FACE_IMG})`)

</script>
<template>
	<div class="card" :class="cardClass" @click="cardClick()">
		<div class="side left">
			<div class="suitImg small"></div>
			<h4 class="suitNum" :suit="card.suit">{{ getValue(card.value) }}</h4>
		</div>
		<div class="middle">
			<div class="center" :class="{ face: card.value > 10 }">			
				<div class="innerSide left" :class="{ start: card.value > 10 }">
					<div v-if="card.value > 10" class="suitImg"></div>
					<div v-else-if="card.value > 3" v-for="(i) in card.value < 10 ? Math.floor((card.value) / 2) : 4" :key="i" class="suitImg"></div>
				</div>
				<div class="innerSide center">
					<div v-if="card.value < 11" v-for="(i) in card.value < 4 ? card.value : card.value === 10 ? 2 : card.value % 2" :key="i" class="suitImg"></div>
				</div>
				<div class="innerSide right" :class="{ start: card.value > 10 }">
					<div v-if="card.value > 10" class="suitImg"></div>
					<div v-else-if="card.value > 3" v-for="(i) in card.value < 10 ? Math.floor((card.value) / 2) : 4" :key="i" class="suitImg"></div>
				</div>
			</div>
		</div>
		<div class="side right">
			<div class="suitImg small"></div>
			<h4 class="suitNum" :suit="card.suit">{{ getValue(card.value) }}</h4>
		</div>
	</div>
</template>
<style scoped>
	* {
		--time: v-bind('`${flipTime / 1000}s`');
		--z-index: v-bind(z);
		--translate-x: calc(v-bind('getTranslateX()') * var(--dim-card) * 5.5);
		--translate-y: calc(v-bind('getTranslateY()') * var(--dim-card) * 7.5);
		--face-image: v-bind(faceImage);
		--suit-image: v-bind(suitImage);
		/* --card-flip-time: v-bind(CARD_FLIP_TIME / 2); TODO lol */
	}
	.card {
		cursor: pointer;
		min-height: calc(var(--dim-card) * 7.25);
		border-width: calc(var(--dim-card) * .125);
		border-style: solid;
		border-color: var(--color-face-med);
		margin: calc(var(--dim-card) * .25);
		position: absolute;
		display: flex;
		border-radius: calc(var(--dim-card) * .5);
		background-color: var(--color-white);
		transform-style: preserve-3d;
		perspective: 100px;
		user-select: none;
		transition: transform var(--time) ease-in;
		transform: translateX(var(--translate-x)) translateY(var(--translate-y)) rotateY(0deg);
		z-index: var(--z-index);
	}
	.card.isTarget {
		border-color: var(--color-yellow);
	}
	.side {
		min-height: 100%;
		width: calc(var(--dim-card) * .75);
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.side.right {
		transform: rotateX(-180deg);
	}
	.middle {
		min-height: 100%;
		padding-top: var(--dim-card);
		padding-bottom: var(--dim-card);
		display: flex;
		align-items: center;
	}
	.center {
		height: 100%;
		border-radius: calc(var(--dim-card) * .125);
		border-width:  calc(var(--dim-card) * .125);
		border-style: solid;
		border-color: transparent;
		display: flex;
	}
	.center.face {
		border-color: var(--color-face-light);
		background-position: center center;
		background-repeat: no-repeat;
		background-size: cover;
		background-image: var(--face-image);
	}
	.innerSide {
		width: calc(var(--dim-card) * 1);
		min-height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		align-items: center;
	}
	.innerSide.start {
		justify-content: flex-start;
	}
	.innerSide.right.start {
		transform: rotateX(180deg);
	}
	.suitImg {		
		height: calc(var(--dim-card) * 1);
		width: calc(var(--dim-card) * 1);
		background-repeat: no-repeat;
		background-position: center center;
		background-size: contain;
		background-image: var(--suit-image);
	}
	.suitImg.small {		
		height: calc(var(--dim-card) * .75);
		width: calc(var(--dim-card) * .75);
		margin-top: calc(var(--dim-card) * .125);
	}
	h4.suitNum {
		width: 100%;
		text-align: center;
	}
	h4.suitNum[suit='Heart'], h4.suitNum[suit='Diamond'] {
		color: var(--color-red);
	} 
	h4.suitNum[suit='Spade'], h4.suitNum[suit='Club'] {
		color: var(--color-black);
	}
	.card.faceDown > .side {
		width: calc(var(--dim-card) * .375);
	}
	.card.faceDown > .side > h4.suitNum {
		display: none;
	}
	.card.faceDown .suitImg {
		background-image: none;
	}
	.card.faceDown > .middle {
		padding-top: calc(var(--dim-card) * .375);
		padding-bottom: calc(var(--dim-card) * .375);
	}
	.card.faceDown > .middle > .center {
		background-color: var(--color-face-dark);
		border-color: var(--color-face-med);
		border-width:  calc(var(--dim-card) * .5);
		border-radius: calc(var(--dim-card) * .25);
	}
	
	.card.faceDown > .middle > .center.face {
		background-image: none;
	}
	.card.flipping {
		transform: translateX(var(--translate-x)) translateY(var(--translate-y)) rotateY(90deg);
	}
	.card.isDisabled {
		pointer-events: none;
	}
	@keyframes flipCard {
		0% {
			transform: translateX(var(--translate-x)) translateY(var(--translate-y)) rotateY(0deg);
		}

		50% {
			transform: translateX(var(--translate-x)) translateY(var(--translate-y)) rotateY(90deg);
		}

		100% {
			transform: translateX(var(--translate-x)) translateY(var(--translate-y)) rotateY(0deg);
		}
	}
</style>