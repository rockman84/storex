import {ApiCollection, attribute, hasMany} from "../../src";
import {BookCollection} from "./book.model";
import {ApiModel} from "../../src";
import {FetchTransport} from "../../src/transport/fetch.transport";

export const transport = new FetchTransport('http://api.iweb.dev.id:90/example/author');

export class AuthorModel extends ApiModel
{
    transport = transport;

    @attribute()
    id? : string;

    @attribute()
    name? : string;

    @hasMany({collectionClass: BookCollection, attribute: 'id', targetAttribute: 'author_id'})
    books? : BookCollection;

}

export class AuthorCollection extends ApiCollection
{
    transport = transport;
    protected modelClass = AuthorModel;
}