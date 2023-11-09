<template>
    <h1 class="main-title" style="text-align: center;">Puntooooooo</h1>
    <div clash="grid">
        <Grid :grid="grid"/>
    </div>
</template>

<style scoped>
    .grid {
        display: flex;
        flex-wrap: wrap;
        align-content: center;
    }
</style>

<script>
export default {
    data() {
        return {
            grid: Array.from({ length: 11 }, () => Array.from({ length: 11 }, () => null))
        }
    }
}
</script>

