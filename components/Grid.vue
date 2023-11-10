<template>
  <div class="grid">
    <div 
        v-for="(row, rowIndex) in grid" 
        :key="rowIndex" 
        class="row"
    >
        <div
            v-for="(cell, cellIndex) in row"
            :key="cellIndex"
            class="cell"
            @click="toggleCell(rowIndex, cellIndex)"
        >{{ grid[rowIndex][cellIndex] }}</div>
    </div>
  </div>
</template>

<script>
export default {
    props: {
        grid: {
            type: Array,
            required: true
        },
        deck: {
            type: Object,
            required: true
        }
    },
    methods: {
        toggleCell(rowIndex, cellIndex) {
            if (this.grid[rowIndex][cellIndex] === null) {
                const card = this.deck.pop();
                if (card === undefined) {
                    console.log('no more cards in the deck!');
                } else {
                    this.grid[rowIndex][cellIndex] = card.getName();
                }
            }
        }
    },
    created() {
        console.log(`grid content: ${this.grid}`)
        console.log(`grid deck content:\n\n${this.deck}`)
    }
}
</script>

<style scoped>
.grid {
  display: flex;
  flex-wrap: wrap;
  width: 300px;
}

.row {
  display: flex;
}

.cell {
  width: 50px;
  height: 50px;
  border: 1px solid black;
}

.active {
  background-color: green;
}
.inactive {
  background-color: white;
}
</style>
