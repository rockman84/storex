import {AuthorModel} from "./author.model";
import {hasOne, attribute} from "../../src";
import {ApiModel} from "../../src";
import {FetchTransport} from "../../src/transport/fetch.transport";

const transport = new FetchTransport('http://api.iweb.dev.id:90/example/book');

export class BookModel extends ApiModel
{
    transport = transport;

    @attribute({isIndex: true})
    public id? : number;

    @attribute()
    public name? : string;

    @attribute()
    public author_id? : number;

    show?: boolean = true;

    @hasOne({
        modelClass: AuthorModel,
        attribute: 'author_id', targetAttribute: 'id', createModelWhenEmpty: true})
    public author? : AuthorModel;
}