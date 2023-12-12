# Guide d'installation

## Prérequis

- [Node.js](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com/)
- [MySQL](https://www.mysql.com/fr/)
- [Sqlite](https://www.sqlite.org/index.html)
- [Docker](https://www.docker.com/)

## Installation

Cloner le projet, puis suivre les étapes suivantes :

### 1. Installation des dépendances

```bash
yarn install
```

### 2. Mise en place de MySQL

Il faut d'abord créer une base de données MySQL en local nommée `punto`. Il faut ensuite créer un utilisateur
`puntoadmin`. Toutes les informations sont renseignées dans le script de création de table disponible au chemin
`./databases/mysql/table_creation_script.sql`.

Une fois la base créée, il faut lancer le script de création de table.

### 3. Mise en place de Sqlite

Il faut créer une base de données dans le répertoire `./server/db` nommée `punto.sqlite` si elle n'existe pas déjà.
Il faut ensuite exécuter le script de création de table disponible au chemin `./databases/sqlite/table_creation_script.sql` avec l'outil de votre choix.

La base est normalement déjà générée avec des données dedans.

### 4. Mise en place de MongoDB

Il faut récupérer l'image officielle de MongoDB sur Docker Hub :

```bash
docker pull mongo:latest
```

Il faut ensuite lancer le conteneur :

```bash
docker run -d -p 27017:27017 --name punto-mongo mongo:latest
```

Il faut maintenant mettre en place la base de données à l'intérieur du conteneur. Pour cela, se connecter au conteneur :

```bash
docker exec -it punto-mongo mongosh
```

Il faut ensuite créer la base de données `punto` :

```bash
use punto
```

L'ORM se chargera de créer les collections et les documents nécessaires lors de l'exécution du code.

### 5. Mise en place de Neo4j

Il faut récupérer l'image officielle de Neo4j sur Docker Hub :

```bash
docker pull neo4j:latest
```

Il faut ensuite lancer le conteneur :

```bash
docker run -d -p 7687:7687 -p 7474:7474 --name neo4j-punto neo4j:latest
```

Une fois le conteneur lancé, il faut changer le mot de passe de l'utilisateur `neo4j` :

```bash
# se connecter au conteneur
docker exec -it neo4j-punto cypher-shell -u neo4j -p neo4j

# à la connexion, changer le mot de passe quand demandé
# ctrl + d pour quitter
```

Pas besoin de configuration supplémentaire pour Neo4J.

### 6. Lancement de l'application et du serveur

Pour démarrer l'application, il suffit de lancer la commande suivante :

```bash
yarn run dev
```

L'application est maintenant accessible à l'adresse `http://localhost:3000`.
La commande se chargera de démarrer le serveur et de lancer l'application, pas besoin de lancer les deux séparément.

Vérifier dans le terminal que le serveur a bien réussi à se connecter aux trois base de données.
Il devrait retourner les messages suivants :

```bash
>> MYSQL: Database connection established
>> SQLITE: Database connection established
>> MONGO: Database connection established
>> NEO4J: Database connection established
```
