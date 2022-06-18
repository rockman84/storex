import {Model} from "../../src";
import {attribute, hasMany} from "../../src";
import {BookCollection} from "./book.collection";

export class AuthorModel extends Model
{
    @attribute()
    id? : string;

    @attribute()
    name? : string;

    @hasMany({collectionClass: BookCollection ,attribute: 'id', targetAttribute: 'author_id'})
    books? : BookCollection;

    public rule(): object[] {
        return [

        ];
    }
}