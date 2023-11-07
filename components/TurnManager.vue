<template>
    <div>
        <h1>It's {{ currentPlayer }}'s turn</h1>
    </div>
</template>

<script>
export default {
    props: {
        whosTurn: {
            type: String,
            required: true
        },
        players: {
            type: Array,
            required: true
        },
    },
    computed: {
        currentPlayer() {
            console.log(`player = ${this.players}`);
            console.log(`whosTurn = ${this.whosTurn}`);
            const current = this.players.find(player => player.id === this.whosTurn);
            return current ? current.name : 'no one';
        },
    }
}
</script>
