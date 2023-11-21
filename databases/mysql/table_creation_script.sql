CREATE DATABASE IF NOT EXISTS punto;

CREATE TABLE Player 
(
	id INT auto_increment,
	name VARCHAR(150) NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE Game 
(
    id INT auto_increment,
    datePlayed DATETIME NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE PlayerGame
(
    player_id INT,
    game_id INT,
    PRIMARY KEY (player_id, game_id),
    FOREIGN KEY (player_id) REFERENCES Player(id),
    FOREIGN KEY (game_id) REFERENCES Game(id)
);

CREATE TABLE Moves
(
    id INT auto_increment,
    name VARCHAR(150) NOT NULL,
    value INT NOT NULL,
    played_by INT,
    game_id INT,
    PRIMARY KEY (id),
    FOREIGN KEY (played_by) REFERENCES Player(id),
    FOREIGN KEY (game_id) REFERENCES Game(id)
);

CREATE TABLE Winner
(
    game_id INT,
    player_id INT,
    PRIMARY KEY (player_id, game_id),
    FOREIGN KEY (game_id) REFERENCES Game(id),
    FOREIGN KEY (player_id) REFERENCES Player(id)
);