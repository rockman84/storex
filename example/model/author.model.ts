import {Model} from "../../src";
import {attribute} from "../../src/decorator/attribute";
import {hasMany} from "../../src/decorator/has.many";
import {BookCollection} from "./book.collection";

export class AuthorModel extends Model
{
    @attribute()
    id? : string;

    @attribute()
    name? : string;

    @hasMany()
    books? : BookCollection;
}