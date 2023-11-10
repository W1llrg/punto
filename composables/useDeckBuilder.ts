
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
            console.log(color);
            for (let i = 0; i < this.sizePerColor; i++) {
                this.cards.push(new Card(`${color}${i}`, color, "sprite"));
                this.cards.push(new Card(`${color}${i}`, color, "sprite"));
            }
        }
    }

    toString() {
        let result = "cards in the deck:\n\n";
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
}
