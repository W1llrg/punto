
export class Deck {
    colors: string[];
    cards: Card[];
    sizePerColor: number = 9;

    constructor(colors: string[], createCards: boolean = false) {
        this.colors = colors;
        this.cards = [];
        if (createCards) {
            this.createCards();
        }
    }

    /** creates a full deck of Punto */
    createCards() {
        for (let color of this.colors) {
            for (let i = 0; i < this.sizePerColor; i++) {
                this.cards.push(new Card(`${color}${i}`, color, "sprite"));
                this.cards.push(new Card(`${color}${i}`, color, "sprite"));
            }
        }
    }

    /** splits the deck for 2 players */
    split2() {
        let decks: Deck[] = [];
        
        decks.push(new Deck([this.colors[0], this.colors[1]]));
        decks.push(new Deck([this.colors[2], this.colors[3]]));

        for (let card of this.cards) {
            if (card.getColor() === decks[0].colors[0] || card.getColor() === decks[0].colors[1]) {
                decks[0].cards.push(card);
            }
            else {
                decks[1].cards.push(card);
            }
        }

        return decks;
    }

    /** shuffles the deck */
    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * i);
            const temp = this.cards[i];
            this.cards[i] = this.cards[j];
            this.cards[j] = temp;
        }
    }

    /** returns the top card of the deck */
    pop() {
        return this.cards.pop();
    }

    getDeckSize() {
        return this.cards.length;
    }

    getColors() {
        return this.colors;
    }

    toString() {
        let result = "";
        for (let card of this.cards) {
            result += `${card.name} `;
        }
        return result;
    }
}

class Card {
    name: string;
    color: string;
    sprite: string;

    constructor(name: string, color: string, sprite: string) {
        this.name = name;
        this.color = color;
        this.sprite = sprite;
    }

    getName() {
        return this.name;
    }

    getColor() {
        return this.color;
    }

    getSprite() {
        return this.sprite;
    }
}
