import { Deck } from "@/composables/useDeckBuilder";

export class Player {
    name: string;
    deck: Deck;

    constructor(name: string, deck: Deck) {
        this.name = name;
        this.deck = deck;
    }

    playCard() {
        return this.deck.pop();
    }

    // ////////////////////////////////////////////

    getName() {
        return this.name;
    }

    getDeck() {
        return this.deck;
    }

    toString() {
        return `Player ${this.name} has ${this.deck.getDeckSize()} cards left in their deck.`;
    }
}