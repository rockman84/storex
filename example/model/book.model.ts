import {Model} from "../../src";
import {AuthorModel} from "./author.model";
import {hasOne, attribute} from "../../src";
import {ApiModel} from "../../src/api.model";

export class BookModel extends ApiModel
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