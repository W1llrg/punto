<template>
    <div class="game">
        <GameGrid />
        <PlayerList v-on:get-players="getPlayers" />
    </div>
    <div class="turnDisplayer">
        <TurnManager :whosTurn="whosTurn" :players="players" />
    </div>
</template>

<script>
import GameGrid from '~/components/GameGrid.vue';
import PlayerList from '~/components/PlayerList.vue';
import TurnManager from '~/components/TurnManager.vue';

export default {
    name: 'Game',
    components: {
        GameGrid,
        PlayerList,
        TurnManager,
    },
    data() {
        return {
            players: null,
            whosTurn: 1,
        }
    },
    methods: {
        getPlayers(players) {
            this.players = players;
        },
    }
}
</script>

<style>
.game {
    display: flex;
    float: left;
    padding: 20px;
}
</style>