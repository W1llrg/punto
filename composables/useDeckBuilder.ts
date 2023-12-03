
/**
 * creates a deck of Punto with the default game rules
 */
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
                this.cards.push(new Card(`${color}-${i}`, color, i));
                this.cards.push(new Card(`${color}-${i}`, color, i));
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

    /** returns the name of the next card available in the deck */
    getNextCard() {
        return this.cards[this.cards.length - 1].getName();
    }

    /** returns the value of the next card available in the deck */
    getNextCardValue() {
        return this.cards[this.cards.length - 1].getValue();
    }

    /** returns the size of the deck */
    getDeckSize() {
        return this.cards.length;
    }

    /** returns the colors of the deck */
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

/**
 * creates a Punto card
 */
class Card {
    name: string;
    color: string;
    value: number;

    constructor(name: string, color: string, value: number) {
        this.name = name;
        this.color = color;
        this.value = value;
    }

    /** returns the name of the card */
    getName() {
        return this.name;
    }

    /** returns the color of the card */
    getColor() {
        return this.color;
    }

    /** returns the value of the card */
    getValue() {
        return this.value;
    }
}
