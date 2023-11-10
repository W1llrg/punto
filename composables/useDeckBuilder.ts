
export class Deck {
    colors: string[];
    cards: Card[];
    sizePerColor: number = 9;

    constructor(colors: string[]) {
        this.colors = colors;
        this.cards = [];
        this.createCards();
    }

    createCards() {
        for (let color of this.colors) {
            for (let i = 0; i < this.sizePerColor; i++) {
                this.cards.push(new Card(`${color}${i}`, color, "sprite"));
                this.cards.push(new Card(`${color}${i}`, color, "sprite"));
            }
        }
    }

    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * i);
            const temp = this.cards[i];
            this.cards[i] = this.cards[j];
            this.cards[j] = temp;
        }
    }

    pop() {
        return this.cards.pop();
    }

    getDeckSize() {
        return this.cards.length;
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
}
