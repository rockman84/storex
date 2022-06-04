import {BaseObject} from "../../src";
import {attribute} from "../../src/decorator/attributes";
import {Model} from "../../src/Model";

export class BookModel extends Model
{
    @attribute
    public id : string|null = null;

    @attribute
    public name : string|null = null;
}