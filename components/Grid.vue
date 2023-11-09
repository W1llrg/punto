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
            :class="{ active: cell }"
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
        }
    },
    methods: {
        toggleCell(rowIndex, cellIndex) {
            if (this.grid[rowIndex][cellIndex] === null) {
                this.grid[rowIndex][cellIndex] = "I clicked!";
            } else {
                this.grid[rowIndex][cellIndex] = "I did it again!";
            }
        }
    },
    created() {
        console.log(`grid content: ${this.grid}`)
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
