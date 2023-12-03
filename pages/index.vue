<template>
    <h1 class="main-title" style="text-align: center;">Puntooooooo</h1>
    <div class="desc">
        <p>
            Bienvenue sur le jeu du Punto!<br>
            Entrez vos noms puis cliquez sur jouer!
        </p>
    </div>

    <div class="input-field">
        <label for="playerName1">Nom du joueur 1:</label>
        <input type="text" id="playerName1" placeholder="Entrez votre nom">
    </div>

    <div class="input-field">
        <label for="playerName2">Nom du joueur 2:</label>
        <input type="text" id="playerName2" placeholder="Entrez votre nom">
    </div>

    <button @click="startGame">Jouer</button>
    <button @click="manageDb">Gérer les BDD</button>
</template>

<style scoped>
    .desc {
        text-align: center;
    }
</style>

<script>
    export default {
        methods: {
            startGame() {
                const p1 = document.getElementById('playerName1').value;
                const p2 = document.getElementById('playerName2').value;
                console.log(this.p1);
                console.log(this.p2);

                this.$router.push({
                    name: 'game',
                    query: {
                        p1: p1,
                        p2: p2,
                    }
                });
            },
            manageDb() {
                this.$router.push({
                    name: 'databases',
                });
            }
        }
    }
</script>