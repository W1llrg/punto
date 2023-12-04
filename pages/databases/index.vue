<template>
    <div>
        <button @click="selectDatabase('sqlite')">SQLite</button>
        <button @click="selectDatabase('mysql')">MySQL</button>
        <button @click="selectDatabase('mongo')">MongoDB</button>

        <div v-if="selectedDatabase === 'sqlite'">
            <h2>SQLite Database</h2>
            <button @click="purgeDatabase('sqlite')">Purge</button>
            <div v-if="sqliteData">
                <ul>
                    <li v-for="item in sqliteData" :key="item.id">{{ item.name }}</li>
                </ul>
            </div>
        </div>

        <div v-if="selectedDatabase === 'mysql'">
            <h2>MySQL Database</h2>
            <button @click="purgeDatabase('mysql')">Purge</button>
            <div v-if="mysqlData">
                <ul>
                    <li v-for="item in mysqlData" :key="item.id">{{ item.name }}</li>
                </ul>
            </div>
        </div>

        <div v-if="selectedDatabase === 'mongo'">
            <h2>MongoDB Database</h2>
            <button @click="purgeDatabase('mongo')">Purge</button>
            <div v-if="mongoData">
                <ul>
                    <li v-for="item in mongoData" :key="item.id">{{ item.name }}</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      selectedDatabase: null,
      sqliteData: null,
      mysqlData: null,
      mongoData: null
    };
  },
  methods: {
    selectDatabase(database) {
        this.selectedDatabase = database;
        this.displayData(database);
    },
    async purgeDatabase(database) {
        await axios.delete(`http://localhost:3001/${database}/empty-base`);
    },
    async displayData(database) {
        await axios.get(`http://localhost:3001/${database}/get-players`)
            .then(response => {
                if (database === 'sqlite') {
                    this.sqliteData = JSON.stringify(response.data);
                } else if (database === 'mysql') {
                    this.mysqlData = JSON.stringify(response.data);
                } else if (database === 'mongo') {
                    this.mongoData = JSON.stringify(response.data);
                }
            })
            .catch(error => {
                console.error(error);
            });
        console.log(this.sqliteData);
    }
  }
};
</script>