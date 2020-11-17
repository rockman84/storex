import BaseObject from "../base/BaseObject";
import Model from "../store/Model";

/**
 * @property {Validator|string} type
 * @property {string} attribute
 * @property {Model} context
 */
export default class Validator extends BaseObject
{
  constructor(args) {
    super(args);
  }

  attributes() {
    return {
      type: null,
      attribute: null,
      context: null,
      message: null,
    };
  }

  validate()
  {
    if (false) {
      this.context.setError(this.attribute, this.message);
      return false;
    }
    return true;
  }
}
