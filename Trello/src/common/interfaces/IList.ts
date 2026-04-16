import type {ICard} from "./ICard.ts";

export interface IList {
    id: number;
    title: string;
    cards: ICard[];
    boardId: number;
}