import {attribute, hasMany} from "../../src";
import {BookCollection} from "./book.collection";
import {ApiModel} from "../../src/ApiModel";

export class AuthorModel extends ApiModel
{
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