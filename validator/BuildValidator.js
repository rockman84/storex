import Validator from "./Validator";

/**
 * Build-in Basic Validator
 * type:
 * - string
 * - number
 * - boolean
 * - symbol
 * - function
 * - bigint
 * - object
 * - required
 * - default
 * - instanceOf
 *
 * @property {number} max
 * @property {number} min
 * @property {mix} value
 */
export default class BuildValidator extends Validator
{
  attributes() {
    return Object.assign(super.attributes(), {
      max: null,
      min: null,
      value: null,
    });
  }

  checkValue(value) {
    const types = ['string', 'number', 'boolean', 'symbol', 'function', 'bigint', 'object'];
    let result = false;
    if (!this.isSkip(value) && types.includes(this.type)) {
      result = Validator.typeof(this.type, value);
      if (!result) {
        this.context.setError(this.attribute, `${this.attribute} must be ${this.type}`);
      } else if (this.type == 'string') {
        if (this.max && value.length >= this.max) {
          this.context.setError(this.attribute, `${this.attribute} max ${this.max} characters`);
        } else if (this.min && value.length <= this.min) {
          this.context.setError(this.attribute, `${this.attribute} min ${this.min} characters`);
        }
      }

    } else if (this.type === 'required') {
      result = !Validator.isEmpty(value);
      if (!result) {
        this.context.setError(this.attribute, `${this.attribute} can not be empty`);
      }
    } else if (this.type === 'default' && Validator.isEmpty(value)) {
      let defaultValue = value;
      if (typeof this.value === 'function') {
        defaultValue = this.value(this.context);
      };
      this.context[this.attribute] = defaultValue;
    } else if (this.type === 'instanceOf') {
      result = value instanceof this.value;
      if (!result) {
        this.context.setError(this.attribute, `${this.attribute} must be instance of ${this.value.name}`);
      }
    }
    return result;
  }

}
