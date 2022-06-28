import {attribute, hasMany} from "../../src";
import {BookCollection} from "./book.collection";
import {ApiModel} from "../../src/api.model";
import {FetchTransport} from "../../src/transport/fetch.transport";
import {TransportInterface} from "../../src/transport/transport.interface";

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

    public rule(): object[] {
        return [

        ];
    }
}