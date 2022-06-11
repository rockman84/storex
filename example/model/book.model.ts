import {Model} from "../../src";
import {AuthorModel} from "./author.model";
import {hasOne, attribute} from "../../src";

export class BookModel extends Model
{
    @attribute()
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