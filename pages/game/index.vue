<template>
    <div class="game">
        <GameGrid />
        <div class="player-list">
            <PlayerList v-on:get-players="getPlayers" />
        </div>
        <div class="turn-display">
            <TurnManager :whosTurn="whosTurn" :players="players" />
        </div>
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
  display: grid; 
  grid-template-columns: 1.5fr 1.5fr; 
  grid-template-rows: 1fr 1fr; 
  gap: 0px 0px; 
  grid-template-areas: 
    "game-grid player-list"
    "turn-display turn-display"; 
}
.turn-display { 
    grid-area: turn-display; 
    text-align: center;
}
.game-grid { grid-area: game-grid; }
.player-list { grid-area: player-list; }
</style>