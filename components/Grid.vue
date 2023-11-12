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
    data() {
        return {
            cardPlaced: false,
        }
    },
    methods: {
        toggleCell(rowIndex, cellIndex) {
            if (!this.cardPlaced) {
                const card = this.deck.pop();
                this.grid[rowIndex][cellIndex] = card.getName();
                this.cardPlaced = true;
            } else {
                if (this.grid[rowIndex][cellIndex] === null && this.isAdjacentPlaced(rowIndex, cellIndex)) {
                    const card = this.deck.pop();
                    if (card === undefined) {
                        console.log('no more cards in the deck!');
                    } else {
                        this.grid[rowIndex][cellIndex] = card.getName();
                    }
                } else {
                    console.log('cannot place card here!');
                }
            }
        },
        isAdjacentPlaced(rowIndex, cellIndex) {
            for (let i = Math.max(rowIndex - 1, 0); i <= Math.min(rowIndex + 1, this.grid.length - 1); i++) {
                for (let j = Math.max(cellIndex - 1, 0); j <= Math.min(cellIndex + 1, this.grid[i].length - 1); j++) {
                    if (i !== rowIndex || j !== cellIndex) {
                        if (this.grid[i][j] !== null) {
                            return true;
                        }
                    }
                }
            }
            return false;
        }
    },
    created() {
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
