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
		<button class="bar_btn" @click="board.resetBoard()">Reset</button>
		<button class="bar_btn" @click="board.clearBoard()">New Game</button>
		<span class="text">{{ winText }}</span>
	</div>
</template>
<style>
	.bar {
		position: absolute;
		bottom: 0;
		height: calc(var(--dim-card) * 3);
		width: 100%;
		background-color: var(--color-util);
		display: flex;
		justify-content: center;
		align-items: center;
	}
	button.bar_btn {
		height: calc(var(--dim-card) * 2);
		width: calc(var(--dim-card) * 7);
		margin: calc(var(--dim-card) * .5);
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
	button.bar_btn:hover {
		background-color: var(--color-green-med);
	}
	button.bar_btn:active {
		transform: translateY(calc(var(--dim-card) * .125));
	}
	span.text {
		color: var(--color-green-dark);
		font-size: calc(var(--dim-card) * 2);
	}
</style>