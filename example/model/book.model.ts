import {BaseObject} from "../../src";
import {attribute} from "../../src/decorator/attributes";

export class BookModel extends BaseObject
{
    @attribute
    public id : string|null = null;

    @attribute
    public name : string|null = null;
}