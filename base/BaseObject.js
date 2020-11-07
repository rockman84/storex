export default class BaseObject
{
  /**
   * attributes
   * @type {{}}
   * @private
   */
  _attributes = {};

  /**
   * changes old attribute
   * @type {{}}
   * @private
   */
  _oldAttributes = {};

  constructor(args = {}) {

    // auto getter and setter attributes
    let attributes = this.attributes();
    let properties = {};
    for (const attr in this.attributes()) {
      if (this.hasOwnProperty(attr)) {
        throw `attribute ` + attr + ` already exist in property`;
      }
      this._attributes[attr] = attributes[attr];
      properties[attr] = BaseObject._getAccessor(this, attr);
    }
    Object.defineProperties(this, properties);

    // set property or attribute
    for(const key in args) {
      if (this.hasAttribute(key)) {
        this._attributes[key] = args[key];
      } else {
        this[key] = args[key];
        console.log(args[key]);
      }
    }
  }

  init()
  {
    return true;
  }

  /**
   *
   * @returns {{}}
   */
  attributes()
  {
    return {};
  }

  /**
   * get all attributes
   * @param key
   * @returns {{}|boolean|*}
   */
  getAttributes(key = null)
  {
    if (key === null) {
      return this._attributes;
    } else if (typeof this._oldAttributes[key] == 'undefined') {
      return false;
    }
    return this._attributes[key];
  }

  /**
   * set value attribute
   * @param data
   * @returns {BaseObject}
   */
  setAttributes(data)
  {
    for (const key in data) {
      if (this.hasAttribute(key)) {
        this._attributes[key] = data[key];
      }
    }
    return this;
  }

  /**
   * check is object has attribute
   * @param attribute
   * @returns {boolean}
   */
  hasAttribute(attribute){
    return typeof this._attributes[attribute] !== 'undefined';
  }

  /**
   * get old value attributes
   * @param key
   * @returns {{}|boolean|*}
   */
  getOldAttributes(key = null)
  {
    if (key === null) {
      return this._oldAttributes;
    } else if (typeof this._oldAttributes[key] == 'undefined') {
      return false;
    }
    return this._oldAttributes[key];
  }

  get oldAttribute()
  {
    return this._oldAttributes;
  }

  get isDirtyAttribute()
  {
    return Object.entries(this._oldAttributes).length != 0;
  }

  /**
   * clear old attributes
   * @private
   */
  _clearOldAttribute()
  {
    this._oldAttributes = {};
  }

  /**
   * reset value and clear old attributes
   * @returns {BaseObject}
   */
  reset()
  {
    this.setAttributes(this._oldAttributes);
    this._clearOldAttribute();
    return this;
  }

  /**
   * helper to set magic getter and setter
   * @param obj
   * @param key
   * @returns {{set: set, enumerable: boolean, get(): *, configurable: boolean}|*}
   * @private
   */
  static _getAccessor(obj, key) {
    return {
      enumerable: true,
      configurable: true,
      get() {
        return obj._attributes[key];
      },
      set: function (value) {
        if (typeof obj._oldAttributes[key] === 'undefined' && value != obj._attributes[key]) {
          obj._oldAttributes[key] = obj._attributes[key];
        }
        obj._attributes[key] = value;
      }
    };
  }
}
