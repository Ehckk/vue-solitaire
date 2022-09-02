import type { CardType } from "@/interfaces";
import { computed, type Ref } from "vue"
import { ref } from "vue";
import { createCards } from "@/utils";
import { Board } from "@/interfaces/Board";

const cards: Ref<Ref<CardType>[]> = ref(createCards())
const targetCard: Ref<CardType | null> = ref(null)
const board = new Board()
const flipTime = computed(() => 100) // TODO speed this up if autocomplete

export { cards, targetCard, board, flipTime }