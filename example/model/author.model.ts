import {ApiCollection, attribute, hasMany} from "../../src";
import {BookCollection} from "./book.collection";
import {ApiModel} from "../../src";
import {FetchTransport} from "../../src/transport/fetch.transport";

const transport = new FetchTransport('http://api.iweb.dev.id:90/example/author');

export class AuthorCollection extends ApiCollection
{
    transport = transport;
    protected modelClass = AuthorModel;
}

export class AuthorModel extends ApiModel
{
    transport = transport;

    @attribute({defaultValue: null, isIndex: true})
    id? : string;

    @attribute({defaultValue: null})
    name? : string;

    @hasMany({collectionClass: BookCollection, attribute: 'id', targetAttribute: 'author_id'})
    books?: BookCollection;
}