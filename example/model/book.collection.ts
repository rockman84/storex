import {ApiCollection} from "../../src";
import {FetchTransport} from "../../src/transport/fetch.transport";
import {BookModel} from "./book.model";

const transport = new FetchTransport('http://api.iweb.dev.id:90/example/book');


export class BookCollection extends ApiCollection
{
    transport = transport;
    protected modelClass = BookModel;
}
