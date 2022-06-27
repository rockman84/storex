import {Collection} from "../../src";
import {hasMany} from "../../src/decorator/has.many";
import {ApiCollection} from "../../src/api.collection";
import {AuthorModel} from "./author.model";

export class AuthorCollection extends ApiCollection
{
    protected modelClass = AuthorModel;
}