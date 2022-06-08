import {BaseObject} from "../../src";
import {attribute} from "../../src/decorator/attributes";
import {Model} from "../../src/Model";
import {AuthorModel} from "./author.model";
import {getHasMany, hasMany} from "../../src/decorator/has.many";
import {hasOne} from "../../src/decorator/has.one";

export class BookModel extends Model
{
    @attribute()
    public id? : number;

    @attribute()
    public name? : string;

    show?: boolean = true;

    @hasOne(AuthorModel.name)
    public author? : AuthorModel;
}