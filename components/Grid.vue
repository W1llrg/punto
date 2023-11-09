
<template>
  <div class="grid">
    <div v-for="(row, rowIndex) in grid" :key="rowIndex" class="row">
      <div
        v-for="(cell, cellIndex) in row"
        :key="cellIndex"
        class="cell"
        :class="{ active: cell }"
        @click="toggleCell(rowIndex, cellIndex)"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      grid: Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => false))
    }
  },
  methods: {
    toggleCell(rowIndex, cellIndex) {
      this.grid[rowIndex][cellIndex] = !this.grid[rowIndex][cellIndex]
    }
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
</style>
