import type {Card} from "./ICard.ts";

export interface IList {
    id: number;
    title: string;
    cards: Card[];
    boardId: number;
}