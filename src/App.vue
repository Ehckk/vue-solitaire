<script setup lang="ts">
import { cards, board } from '@/utils/store'
import Card from '@/components/Card.vue'
import { Suits } from '@/interfaces'
import spade from '@/assets/images/spade.png'
import heart from '@/assets/images/heart.png'
import club from '@/assets/images/club.png'
import diamond from '@/assets/images/diamond.png'
import Bar from './components/Bar.vue'

const getSuitImage = (suit: string) => {
	switch (suit) {
		case Suits.Spade:
			return spade
		case Suits.Heart:
			return heart
		case Suits.Club:
			return club
		case Suits.Diamond:
			return diamond
	}
}
</script>

<template>
	<button class="recycle" @click="board.recycleCards()">Recycle</button>
	<div class="pileStack" v-for="num in Array.from(Array(7).keys()).map((n) => n + 1)" :class="`s${num}`" @click="board.stackMove(num)"></div>
	<div class="pileWin" v-for="suit in Object.keys(Suits)" :class="suit" @click="board.winMove()">
		<div class="pileWin__icon" :class="suit" :style="{ backgroundImage: `url(${getSuitImage(suit)}`}"></div>
	</div>
	<Card v-for="card, i in cards" :key="i" :card="card.value"></Card>
	<Bar></Bar>
</template>
<style>
	@import '@/assets/globals.css';

	button.recycle,
	.pileStack,
	.pileWin {
		position: absolute;
		height: calc(var(--dim-card) * 7.25);
		width: calc(var(--dim-card) * 5);
		margin: calc(var(--dim-card) * .25);
		border-width: .25rem;
		border-radius: 1rem;
		border-style: solid;
		border-color: var(--color-util);
		color: var(--color-util);
		user-select: none;
	}
	button.recycle {
		cursor: pointer;
		outline: none;
		font-size: var(--dim-card);
		font-weight: bold;
		background-color: transparent;
	}
	.pileWin {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.pileWin__icon {
		height: calc(var(--dim-card) * 1.5);
		width: calc(var(--dim-card) * 1.5);
		background-repeat: no-repeat;
		background-position: center center;
		background-size: contain;
		filter: brightness(0%) invert(71%) sepia(13%) saturate(4851%) hue-rotate(69deg) brightness(95%) contrast(56%);
	}
	.pileStack.s1 {
		transform: translateX(calc(var(--dim-card) * 5.5 * 2.5));
	}
	.pileStack.s2 {
		transform: translateX(calc(var(--dim-card) * 5.5 * 3.5));
	}
	.pileStack.s3 {
		transform: translateX(calc(var(--dim-card) * 5.5 * 4.5));
	}
	.pileStack.s4 {
		transform: translateX(calc(var(--dim-card) * 5.5 * 5.5));
	}
	.pileStack.s5 {
		transform: translateX(calc(var(--dim-card) * 5.5 * 6.5));
	}
	.pileStack.s6 {
		transform: translateX(calc(var(--dim-card) * 5.5 * 7.5));
	}
	.pileStack.s7 {
		transform: translateX(calc(var(--dim-card) * 5.5 * 8.5));
	}
	.pileWin.Spade {
		transform: translateX(calc(var(--dim-card) * 5.5 * 9.5));
	}
	.pileWin.Heart {
		transform: translateX(calc(var(--dim-card) * 5.5 * 9.5)) translateY(calc(var(--dim-card) * 7.5 * 1));
	}
	.pileWin.Club {
		transform: translateX(calc(var(--dim-card) * 5.5 * 9.5)) translateY(calc(var(--dim-card) * 7.5 * 2));
	}
	.pileWin.Diamond {
		transform: translateX(calc(var(--dim-card) * 5.5 * 9.5)) translateY(calc(var(--dim-card) * 7.5 * 3));
	} 
</style>