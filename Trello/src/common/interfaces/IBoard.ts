import type { IList } from "./IList";

interface Custom{
    background: string;
}

export interface IBoard{
    id: number;
    title: string;
    custom: Custom[];
    lists: IList[];
}