<template>
    <div>
        <h2>Player List</h2>
        <ul>
            <li v-for="player in players" :key="player.id">
                {{ player.name }}
            </li>
        </ul>
        <button type="button" @click="switchTurn()"></button>
    </div>
</template>

<script>
export default {
    name: 'PlayerList',
    playerCount: 2,
    data() {
        return {
            players: null,
            whosTurn: 1,
        }
    },
    created() {
        this.players = [
            { id: 1, name: 'Player 1' },
            { id: 2, name: 'Player 2' },
        ];
        this.emitPlayerData();
    },
    methods: {
        getTurn() {
            return this.whosTurn;
        },
        switchTurn() {
            if (this.whosTurn === 1) {
                this.whosTurn = 2;
            } else {
                this.whosTurn = 1;
            }
        },
        emitPlayerData() {
            this.$emit('get-players', this.players);
        }
    },
}
</script>