<template>
    <div class="player-list">
        <h2>Current Players:</h2>
        <ul>
            <li v-for="player in players">{{ player.getName() }}</li>
        </ul>
    </div>
</template>

<script>
export default {
    props: {
        players: {
            type: Array,
            required: true
        },
    },
}
</script>

<style scoped>
.player-list {
    margin: 10px;
    padding: 10px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}
</style>