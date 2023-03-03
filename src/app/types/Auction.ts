import { Article } from "./Article";

export interface Auction {
    uid: string,
    title: string,
    description: string,
    startPrice: number,
    increasePrice: number,
    dueDate: string,
    articles: Article[],
}