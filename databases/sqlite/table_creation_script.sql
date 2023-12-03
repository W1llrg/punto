CREATE TABLE
    Player (
        name VARCHAR(150) NOT NULL,
    );

CREATE TABLE
    Game (
        datePlayed DATETIME NOT NULL,
    );

CREATE TABLE
    PlayerGame (
        player_id INT,
        game_id INT,
        PRIMARY KEY (player_id, game_id),
        FOREIGN KEY (player_id) REFERENCES Player(id),
        FOREIGN KEY (game_id) REFERENCES Game(id)
    );

CREATE TABLE
    Moves (
        name VARCHAR(150) NOT NULL,
        value INT NOT NULL,
        played_by INT,
        game_id INT,
        FOREIGN KEY (played_by) REFERENCES Player(id),
        FOREIGN KEY (game_id) REFERENCES Game(id)
    );

CREATE TABLE
    Winner (
        game_id INT,
        player_id INT,
        PRIMARY KEY (player_id, game_id),
        FOREIGN KEY (game_id) REFERENCES Game(id),
        FOREIGN KEY (player_id) REFERENCES Player(id)
    );