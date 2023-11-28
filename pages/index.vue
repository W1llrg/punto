<template>
    <h1 class="main-title" style="text-align: center;">Puntooooooo</h1>
    <div clash="grid">
        <Grid :grid="grid" :deck="deck" :players="players"/>
    </div>
    <div class="player-list">
        <PlayerList :players="players"/>
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
import { Player } from '@/composables/usePlayer';

export default {
    setup() {

        // connect to db and test
        useDatabase();
        //create main deck
        const deck = new Deck(['red', 'blue', 'green', 'yellow'], true);
        console.log(`there are ${deck.getDeckSize()} cards in the deck`);

        //create players
        const players = [
            new Player('Miguel'),
            new Player('Juan'),
        ];

        // assign decks to players
        let subDecks = [];
        subDecks = deck.split2();

        players.forEach(player => {
            player.setDeck(subDecks.pop());
            player.getDeck().shuffle();
        });

        console.log(players[0].toString());
        console.log(players[1].toString());

        console.log(`${players[0].getName()} has the following cards:\n\n${players[0].getDeck().toString()}`);
        console.log(`${players[1].getName()} has the following cards:\n\n${players[1].getDeck().toString()}`);

        return { deck, players };
    },
    data() {
        return {
            grid: Array.from({ length: 11 }, () => Array.from({ length: 11 }, () => null)),
        }
    }
}
</script>

