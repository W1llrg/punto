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
            :class="setClass(rowIndex, cellIndex)"
            @click="toggleCell(rowIndex, cellIndex)"
        >{{ grid[rowIndex][cellIndex] }}</div>
    </div>
  </div>
</template>

<script>
import { Deck } from '@/composables/useDeckBuilder';
import { Player } from '@/composables/usePlayer';

export default {
    props: {
        grid: {
            type: Array,
            required: true
        },
        deck: {
            type: Object,
            required: true
        },
        players: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            cardPlaced: false,
            playerTurn: null,
            cardsPlayed: null,
            allowedCells: null,
            maxRow: [],
            maxCell: [],
        }
    },
    created() {
        //choose a random player to start
        this.playerTurn = Math.floor(Math.random() * 2);
        console.log(`player ${this.playerTurn} starts!`);
        console.log(`${this.players[this.playerTurn]} starts!`);

        // init cards played
        this.cardsPlayed = Array.from({ length: 11 }, () => Array.from({ length: 11 }, () => null));

        // init allowedCells
        this.allowedCells = Array.from({ length: 11 }, () => Array.from({ length: 11 }, () => true));
    },
    methods: {

        /** fill the cell with the given card */
        toggleCell(rowIndex, cellIndex) {
            const curPlayer = this.players[this.playerTurn]; 
            this.playCard(curPlayer, rowIndex, cellIndex);
        },

        /** checks is the given cell is adjacent to a cell already filled */
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
        },

        /** gets the card of the given player and places it in the grid */
        playCard(p, rowIndex, cellIndex) {
            console.log(`player ${p.getName()} turn!`);
            const pDeck = p.getDeck();
            if (!this.cardPlaced) {

                const card = pDeck.pop();
                this.grid[rowIndex][cellIndex] = card.getName();
                this.cardsPlayed[rowIndex][cellIndex] = card;
                this.cardPlaced = true;
                this.playerTurn = (this.playerTurn + 1) % this.players.length;
                this.updateBoundaries(rowIndex, cellIndex);

            } else {

                if (this.grid[rowIndex][cellIndex] === null && this.isAdjacentPlaced(rowIndex, cellIndex)) {
                    
                    const card = pDeck.pop();
                    if (card === undefined) {
                        console.log('no more cards in the deck!');
                    } else {
                        this.grid[rowIndex][cellIndex] = card.getName();
                        this.cardsPlayed[rowIndex][cellIndex] = card;
                        // console.log(`cards placed: ${this.cardsPlayed}`);
                    }
                    this.playerTurn = (this.playerTurn + 1) % this.players.length;
                    this.updateBoundaries(rowIndex, cellIndex);

                } else {
                    console.log('cannot place card here!');
                }

            }
            console.log(`maxRow: ${this.maxRow}\nmaxCell: ${this.maxCell}`);
        },

        updateBoundaries(rowIndex, cellIndex) {
            let foundRow = false;
            let foundCell = false;
            let maxGridSize = 6;
            
            // vertical, rows
            if (this.maxRow.length < maxGridSize) {
                this.maxRow.forEach(index => {
                    if (index === rowIndex) {
                        foundRow = true;
                    }
                });
                if (!foundRow) {
                    this.maxRow.push(rowIndex);
                }
            }
            // horizontal, columns/cells
            if (this.maxCell.length < maxGridSize) {
                this.maxCell.forEach(index => {
                    if (index === cellIndex) {
                        foundCell = true;
                    }
                });
                if (!foundCell) {
                    this.maxCell.push(cellIndex);
                }
            }

        },
    },
    computed: {
        setClass() {
            return (rowIndex, cellIndex) => {
                let classes = ['cell'];
                const card = this.cardsPlayed[rowIndex][cellIndex];
                if (card) {
                    switch (card.getSprite()) {
                        case 'red':
                            classes.push('red');
                            break;
                        case 'blue':
                            classes.push('blue');
                            break;
                        case 'green':
                            classes.push('green');
                            break;
                        case 'yellow':
                            classes.push('yellow');
                            break;
                    }
                }
                return classes.join(' ');
            };
        },
    },
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
  width: 60px;
  height: 60px;
  border: 1px solid black;
}

.green {
  background-color: green;
}
.red {
  background-color: red;
}
.blue {
  background-color: blue;
}
.yellow {
  background-color: yellow;
}
.locked {
  background-color: grey;
}
</style>
