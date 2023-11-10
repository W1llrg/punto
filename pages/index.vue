<template>
    <h1 class="main-title" style="text-align: center;">Puntooooooo</h1>
    <div clash="grid">
        <Grid :grid="grid" :deck="deck"/>
    </div>
</template>

<style scoped>
    .grid {
        display: flex;
        flex-wrap: wrap;
        align-content: center;
    }
</style>

<script>
import { Deck } from '@/composables/useDeckBuilder';

export default {
    setup() {
        const deck = new Deck(['red', 'blue', 'green', 'yellow']);
        console.log(`there are ${deck.getDeckSize()} cards in the deck`);

        // Shuffle the deck
        deck.shuffle();
        console.log(`after shuffling: ${deck.toString()}`);

        return { deck };
    },
    data() {
        return {
            grid: Array.from({ length: 11 }, () => Array.from({ length: 11 }, () => null))
        }
    }
}
</script>

