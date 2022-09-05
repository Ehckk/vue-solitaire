<script setup lang="ts">
import { ref, watch, type FunctionalComponent, type SVGAttributes } from '@vue/runtime-dom';
import JackComponent from '@/assets/icons/jack.svg?component'
import QueenComponent from '@/assets/icons/queen.svg?component'
import KingComponent from '@/assets/icons/king.svg?component'
import SpadeComponent from '@/assets/icons/spade.svg?component'
import HeartComponent from '@/assets/icons/heart.svg?component'
import ClubComponent from '@/assets/icons/club.svg?component'
import DiamondComponent from '@/assets/icons/diamond.svg?component'
import type { CardType } from '@/interfaces';
import { board, flipTime, targetCard } from '@/utils/store';
import { Suits } from '@/interfaces/Suits';
import { computed, toRefs } from '@vue/reactivity';

interface Props {
	card: CardType
}

const props = defineProps<Props>()

const SuitComponent: FunctionalComponent<SVGAttributes, {}> = props.card.suit === Suits.Spade ? SpadeComponent : props.card.suit === Suits.Heart ? HeartComponent : props.card.suit === Suits.Club ? ClubComponent : DiamondComponent  
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
const baseColor = computed(() => props.card.suit === Suits.Spade || props.card.suit === Suits.Club ? 'var(--color-black)' : 'var(--color-red)')
const altColor = computed(() =>  props.card.suit === Suits.Spade || props.card.suit === Suits.Club ? 'var(--color-red)' : 'var(--color-black)')
</script>
<template>
	<div class="card" :class="cardClass" @click="cardClick()">
		<div class="side left">
			<SuitComponent class="suitImg small"/>
			<h4 class="suitNum" :suit="card.suit">{{ getValue(card.value) }}</h4>
		</div>
		<div class="middle">
			<div class="center" :class="{ face: card.value > 10 }">		
				<JackComponent v-if="card.value ===  11" class="faceImg"/>
				<QueenComponent v-if="card.value ===  12" class="faceImg"/>
				<KingComponent v-if="card.value ===  13" class="faceImg"/>
				<div class="innerSide left" :class="{ start: card.value > 10 }">
					<SuitComponent v-if="card.value > 10" class="suitImg"/>
					<SuitComponent v-else-if="card.value > 3" v-for="(i) in card.value < 10 ? Math.floor((card.value) / 2) : 4" :key="i" class="suitImg"/>
				</div>
				<div class="innerSide center">
					<SuitComponent v-if="card.value < 11" v-for="(i) in card.value < 4 ? card.value : card.value === 10 ? 2 : card.value % 2" :key="i" class="suitImg"></SuitComponent>
				</div>
				<div class="innerSide right" :class="{ start: card.value > 10 }">
					<SuitComponent v-if="card.value > 10" class="suitImg"/>
					<SuitComponent v-else-if="card.value > 3" v-for="(i) in card.value < 10 ? Math.floor((card.value) / 2) : 4" :key="i" class="suitImg"/>
					
				</div>
			</div>
		</div>
		<div class="side right">
			<SuitComponent class="suitImg small"/>
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
		--base-color: v-bind(baseColor);
		--alt-color: v-bind(altColor);
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
		transform: rotateZ(-180deg);
	}
	.middle {
		display: flex;
		align-items: center;
	}
	.center {
		min-height: calc(var(--dim-card) * 5);
		border-radius: calc(var(--dim-card) * .125);
		border-width:  calc(var(--dim-card) * .125);
		border-style: solid;
		border-color: transparent;
		display: flex;
	}
	.center.face {
		border-color: var(--color-face-light);
	}
	.faceImg {
		width: calc(var(--dim-card) * 3);
		position: absolute;
	}
	.innerSide {
		width: calc(var(--dim-card) * 1);
		height: 100%;
		min-height: calc(var(--dim-card) * 5);
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
		fill: var(--base-color);
	}
	.suitImg.small {		
		height: calc(var(--dim-card) * .75);
		width: calc(var(--dim-card) * .75);
		margin-top: calc(var(--dim-card) * .125);
	}
	h4.suitNum {
		width: 100%;
		text-align: center;
		color: var(--base-color);
	}
	.card.faceDown > .side {
		width: calc(var(--dim-card) * .375);
	}
	.card.faceDown > .side > h4.suitNum,
	.card.faceDown .suitImg,
	.card.faceDown > .middle > .center.face > .faceImg  {
		display: none;
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
	.card.flipping {
		transform: translateX(var(--translate-x)) translateY(var(--translate-y)) rotateY(90deg);
	}
	.card.isDisabled {
		pointer-events: none;
	}
</style>