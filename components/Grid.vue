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
        }
    },
    created() {
        //choose a random player to start
        this.playerTurn = Math.floor(Math.random() * 2);
        console.log(`player ${this.playerTurn} starts!`);
        console.log(`${this.players[this.playerTurn]} starts!`);

        // init cards played
        this.cardsPlayed = Array.from({ length: 11 }, () => Array.from({ length: 11 }, () => null));
    },
    methods: {
        toggleCell(rowIndex, cellIndex) {
            const curPlayer = this.players[this.playerTurn]; 
            this.playCard(curPlayer, rowIndex, cellIndex);
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
        },
        playCard(p, rowIndex, cellIndex) {
            console.log(`player ${p} turn!`);
            const pDeck = p.getDeck();
            if (!this.cardPlaced) {

                const card = pDeck.pop();
                this.grid[rowIndex][cellIndex] = card.getName();
                this.cardsPlayed[rowIndex][cellIndex] = card;
                this.cardPlaced = true;
                this.playerTurn = (this.playerTurn + 1) % this.players.length;

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

                } else {
                    console.log('cannot place card here!');
                }
                this.playerTurn = (this.playerTurn + 1) % this.players.length;

            }
        }
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
        }
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
</style>
