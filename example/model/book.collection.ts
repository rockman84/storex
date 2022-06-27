import {Collection} from "../../src";
import {ApiCollection} from "../../src/api.collection";
import {BookModel} from "./book.model";

export class BookCollection extends ApiCollection
{
    protected modelClass = BookModel;
}