import { Deck } from "@/composables/useDeckBuilder";

/**
 * a class representing a player for the game
 */
export class Player {
    name: string;
    deck: Deck;

    constructor(name: string) {
        this.name = name;
        this.deck = new Deck([]);
    }

    /**
     * assigns a deck to the player
     * @param deck the deck to set for the player
     */
    setDeck(deck: Deck) {
        this.deck = deck;
    }

    /** returns the next available card in the deck and removes it from the deck */
    playCard() {
        return this.deck.pop();
    }

    /** returns the name of the player */
    getName() {
        return this.name;
    }

    /** returns the deck of the player */
    getDeck() {
        return this.deck;
    }

    toString() {
        return `Player ${this.name} has ${this.deck.getDeckSize()} cards left in their deck.`;
    }
}