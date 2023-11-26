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
        console.log(`initial allowedCells: ${this.allowedCells}`);
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

            // first card = center of the grid
            if (!this.cardPlaced && rowIndex === 5 && cellIndex === 5) {
                const card = pDeck.pop();
                this.grid[rowIndex][cellIndex] = card.getName();
                this.cardsPlayed[rowIndex][cellIndex] = card;
                this.cardPlaced = true;
                this.playerTurn = (this.playerTurn + 1) % this.players.length;
                this.updateBoundaries(rowIndex, cellIndex);
            } else {

                if (this.grid[rowIndex][cellIndex] === null && this.isAdjacentPlaced(rowIndex, cellIndex)) {
                    if (this.allowedCells[rowIndex][cellIndex] === false) {
                        console.log('cannot place card here!');
                        return;
                    }

                    const card = pDeck.pop();
                    if (card === undefined) {
                        console.log('no more cards in the deck!');
                    } else {
                        this.grid[rowIndex][cellIndex] = card.getName();
                        this.cardsPlayed[rowIndex][cellIndex] = card;
                    }

                    this.playerTurn = (this.playerTurn + 1) % this.players.length;
                    this.updateBoundaries(rowIndex, cellIndex);
                } else {
                    console.log('cannot place card here!');
                }
            }
            this.checkVictory(p);
        },

        updateBoundaries(rowIndex, cellIndex) {
            const maxGridSize = 6;

            // vertical, rows
            if (this.maxRow.length < maxGridSize && !this.maxRow.includes(rowIndex)) {
                this.maxRow.push(rowIndex);
            }
            if (this.maxRow.length >= maxGridSize) {
                this.updateAllowedCells(true, false);
            }

            // horizontal, columns/cells
            if (this.maxCell.length < maxGridSize && !this.maxCell.includes(cellIndex)) {
                this.maxCell.push(cellIndex);
            }
            if (this.maxCell.length >= maxGridSize) {
                this.updateAllowedCells(false, true);
            }
        },

        updateAllowedCells(r = false, c = false) {
            
            this.allowedCells.forEach((row, rowIndex) => {
                // rows
                if (r && !this.maxRow.includes(rowIndex)) {
                    this.allowedCells[rowIndex].fill(false);
                }

                // columns
                if (c) {
                    row.forEach((cell, cellIndex) => {
                        if (!this.maxCell.includes(cellIndex)) {
                            this.allowedCells[rowIndex][cellIndex] = false;
                        }
                    });
                }
            });
        },

        checkVictory(player) {

            const pColors = player.getDeck().getColors();
            let hMax = [];
            let vMax = [];
            let dMax = [];
            
            for (let color of pColors) {
                hMax.push(this.horizontalCheck(color));
                // vMax = this.verticalCheck(color);
                // dMax = this.diagonalCheck(color);
            }

            console.log(`hMax: ${hMax}`);

        },

        /**
         * find the max color streak in each row
         * @param {*} color the color to check for
         * @returns the max streak of the given color
         */
        horizontalCheck(color) {

            let streaks = [];   // stores the max streak of each row

            // iterate over each row
            this.cardsPlayed.forEach((row, rowIndex) => {
                let streak = [];
                // iterate over each cell of given row
                row.forEach((cell, cellIndex) => {

                    if (cell !== null && cell.getColor() === color) {

                        if (streak.length === 0) {
                            streak.push(cell);
                        } else {
                            if (streak[streak.length - 1].getColor() === color) {
                                streak.push(cell);
                            }
                        }

                    } else {
                        // store the max streak of the row
                        streaks.push(streak);
                        streak = [];
                    }
                });
                streaks.push(streak);
            });

            // find the max streak of all rows
            let max = 0;
            streaks.forEach(streak => {
                if (streak.length > max) {
                    max = streak.length;
                }
            });

            return max;        
        },

        verticalCheck(color) {

            let streaks = [];   // stores the max streak of each column
            
            // iterate over each column
            for (let column = 0; row < this.cardsPlayed[0].length; row++) {
                let streak = [];

                // iterate over each cell of given column
                for (let row = 0; row < this.cardsPlayed.length; row++) {
                    const cell = this.cardsPlayed[row][column];
                    if (cell !== null && cell.getColor() === color) {

                        if (streak.length === 0) {
                            streak.push(cell);
                        } else {
                            if (streak[streak.length - 1].getColor() === color) {
                                streak.push(cell);
                            } else {
                                streak = [];
                                streak.push(cell);
                            }
                        }

                    }
                }

            }

            // find the max streak of all columns
            let max = 0;
            streaks.forEach(streak => {
                if (streak.length > max) {
                    max = streak.length;
                }
            });

            return max;
        },

        diagonalCheck(color) {
            console.log(`not implemented yet!`);
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
                if (!this.allowedCells[rowIndex][cellIndex]) {
                    classes.push('locked');
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
