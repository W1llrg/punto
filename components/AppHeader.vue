<template>
    <header>
        <div class="left">
            <button>Game</button>
            <button>About</button>
        </div>
        <div class="middle">
            <h1>Punto Game</h1>
        </div>
    </header>
</template>

<style>
    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background-color: #43fac3;
        color: #fff;
    }

    .left {
        display: flex;
        align-items: center;
    }

    button {
        margin-right: 1rem;
        background-color: transparent;
        border: none;
        color: #fff;
        font-size: 1.2rem;
        cursor: pointer;
    }

    h1 {
        font-size: 2rem;
        margin: 0;
    }
</style>
