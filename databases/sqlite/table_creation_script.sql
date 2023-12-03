CREATE TABLE
    Player (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(150) NOT NULL
    );

CREATE TABLE
    Game (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        datePlayed DATETIME NOT NULL
    );

CREATE TABLE
    PlayerGame (
        player_id INTEGER,
        game_id INTEGER,
        PRIMARY KEY (player_id, game_id),
        FOREIGN KEY (player_id) REFERENCES Player(id),
        FOREIGN KEY (game_id) REFERENCES Game(id)
    );

CREATE TABLE
    Moves (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(150) NOT NULL,
        value INTEGER NOT NULL,
        played_by INTEGER,
        game_id INTEGER,
        FOREIGN KEY (played_by) REFERENCES Player(id),
        FOREIGN KEY (game_id) REFERENCES Game(id)
    );

CREATE TABLE
    Winner (
        game_id INTEGER,
        player_id INTEGER,
        PRIMARY KEY (player_id, game_id),
        FOREIGN KEY (game_id) REFERENCES Game(id),
        FOREIGN KEY (player_id) REFERENCES Player(id)
    );