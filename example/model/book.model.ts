import {BaseObject} from "../../src";
import {attribute} from "../../src/decorator/attribute";
import {Model} from "../../src/Model";
import {AuthorModel} from "./author.model";
import {hasMany} from "../../src/decorator/has.many";
import {hasOne} from "../../src/decorator/has.one";

export class BookModel extends Model
{
    @attribute()
    public id? : number;

    @attribute()
    public name? : string;

    show?: boolean = true;

    @hasOne()
    public author? : AuthorModel;
}