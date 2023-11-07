<template>
    <div class="game-grid">
        <h1>Game Grid</h1>
        <div v-for="(row, rowIndex) in grid" :key="rowIndex" class="row">
            <div v-for="(cell, cellIndex) in row" :key="cellIndex" class="cell">
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            grid: [
                ['', '', '', '', '', ''],
                ['', '', '', '', '', ''],
                ['', '', '', '', '', ''],
                ['', '', '', '', '', ''],
                ['', '', '', '', '', ''],
                ['', '', '', '', '', '']
            ]
        }
    },
    methods: {

    }
}
</script>

<style scoped>
.game-grid {
    display: flex;
    flex-wrap: wrap;
    width: 300px;
}
.row {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
}
.cell {
    width: 50px;
    height: 50px;
    border: 1px solid black;
    box-sizing: border-box;
}
</style>
