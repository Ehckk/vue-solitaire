<script setup lang="ts">
import { createCards } from '@/utils';
import { board, cards, targetCard } from '@/utils/store';
import { computed } from '@vue/reactivity';
import { onMounted, onUnmounted } from 'vue';

onMounted(() => {
	window.addEventListener('keydown', handleKeyDown)
	window.addEventListener('keyup', handleKeyUp)
})
onUnmounted(() => {
	window.removeEventListener('keydown', handleKeyDown)
	window.removeEventListener('keyup', handleKeyUp)
})

const newGame = () => {
	cards.value = createCards()
	targetCard.value = null
	board.resetBoard()
} 

const handleKeyDown = (e: KeyboardEvent) => {
	if (e.key === 'Shift') {		
		board.autoMove = true		
	}
}
const handleKeyUp = (e: KeyboardEvent) => {
	if (e.key === 'Shift') {
		board.autoMove = false
	}
}

const winText = computed(() => board.isWin ? 'Winner!' : '') 
</script>
<template>
	<div class="bar">
		<button class="reset" @click="newGame">New Game</button>
		<span class="text">{{ winText }}</span>
	</div>
</template>
<style>
	.bar {
		position: absolute;
		bottom: 0;
		height: calc(var(--dim-card) * 4);
		width: 100%;
		background-color: var(--color-util);
		display: flex;
		justify-content: center;
		align-items: center;
	}
	button.reset {
		height: calc(var(--dim-card) * 2.5);
		width: calc(var(--dim-card) * 8);
		cursor: pointer;
		outline: none;
		border: none;
		border-radius: calc(var(--dim-card) * 2);
		background-color: var(--color-green-dark);
		color: var(--color-text);
		font-size: var(--dim-card);
		font-weight: bold;
		display: flex;
		justify-content: center;
		align-items: center;
		user-select: none;
	}
	button.reset:hover {
		background-color: var(--color-green-med);
	}
	button.reset:active {
		transform: translateY(calc(var(--dim-card) * .125));
	}
	span.text {
		color: var(--color-green-dark);
		font-size: calc(var(--dim-card) * 2);
	}
</style>