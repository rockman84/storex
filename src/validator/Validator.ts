import {BaseObject} from "../base/BaseObject";
import Model from "../store/Model";

/**
 * Base Validator Class
 *
 * @property {Validator|string} type
 * @property {string} attribute
 * @property {Model} context
 * @property {boolean} skipOnEmpty
 * @property {function|boolean} when
 */
export default class Validator extends BaseObject
{
    constructor(args)
    {
        super(args);
        if (!this.context instanceof Model) {
            throw `context must instance of Model`;
        }
    }

    attributes()
    {
        return {
            type: null,
            attribute: null,
            context: null,
            message: 'errors filed',
            skipOnEmpty: true,
            when: true,
        };
    }

    checkValue(value)
    {
        return true;
    }

    validate()
    {
        let when = true;
        if (typeof this.when === 'function') {
            when = this.when(this.context, this);
        }
        if (when) {
            return this.checkValue(this.context.getAttribute(this.attribute));
        }
    }

    static isEmpty(value)
    {
        if (typeof value === 'number' || typeof value === 'boolean') {
            return false;
        }
        return value == '' || value === null;
    }

    static typeof(type, value)
    {
        return typeof value === type;
    }

    isSkip(value)
    {
        return this.skipOnEmpty && Validator.isEmpty(value);
    }
}
