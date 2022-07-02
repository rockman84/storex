import {ApiCollection, attribute, hasMany} from "../../src";
import {BookModel} from "./book.model";
import {BookCollection} from "./book.collection";
import {ApiModel} from "../../src";
import {FetchTransport} from "../../src/transport/fetch.transport";
import {entity} from "../../src/decorator/entity";

console.log(BookModel);
console.log(BookCollection);
const transport = new FetchTransport('http://api.iweb.dev.id:90/example/author');

export class AuthorCollection extends ApiCollection
{
    transport = transport;
    protected modelClass = AuthorModel;
}

@entity()
export class AuthorModel extends ApiModel
{
    transport = transport;

    @attribute({defaultValue: null})
    id? : string;

    @attribute({defaultValue: null})
    name? : string;

    @hasMany({collection: BookCollection, attribute: 'id', targetAttribute: 'author_id'})
    books?: BookCollection;
}