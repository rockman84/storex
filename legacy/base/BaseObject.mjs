import Event from "./Event";

/**
 * base object class
 */
export default class BaseObject
{
  /**
   * event on reset attributes
   * @type {string}
   */
  static EVENT_RESET_ATTRIBUTES = 'resetAttributes';

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

  _listeners = {};

  #_logs = [];

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
      }
    }

    this.init();
  }

  init()
  {
    return true;
  }

  /**
   * get class name
   * @returns {String}
   */
  get className()
  {
    return this.constructor.name;
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
   * @param only
   * @returns {{}|null|*}
   */
  getAttributes(only = null)
  {
    if (only === null) {
      return this._attributes;
    } else if (Array.isArray(only)) {
      let result = {};
      only.forEach((key) => {
        if (typeof this._attributes[key] != 'undefined') {
          result[key] = this._attributes[key];
        }
      });
      return result;
    }
    return null;
  }

  /**
   * get attribute value
   * @param key
   * @returns {boolean|*}
   */
  getAttribute(key)
  {
    if (typeof this._attributes[key] === 'undefined') {
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
    const event = new Event({
      name: BaseObject.EVENT_RESET_ATTRIBUTES,
      target: this,
      params: {
        dirtyAttribute: this.getAttributes(),
      }
    });
    this.emit(event);
    this.setAttributes(this._oldAttributes);
    this._clearOldAttribute();
    return this;
  }

  /**
   *
   * @returns {{}}
   */
  get listeners()
  {
    return this._listeners;
  }

  /**
   * add new listener event
   * @param name
   * @param caller
   */
  addListeners(name, caller)
  {
    if (typeof this._listeners[name] === 'undefined') {
      this._listeners[name] = [];
    }
    this._listeners[name].push(caller);
  }

  /**
   * trigger listener by event name
   * @param eventName
   * @param event {Event}
   * @returns {null}
   */
  emit(event)
  {
    if (!event instanceof Event) {
      throw `event must instance of Event`;
    }
    if (typeof this.listeners[event.name] === 'undefined') {
      return true;
    }
    let value = true;
    for (const key in this.listeners[event.name] ) {
      value = this.listeners[event.name][key](event) && value;
    }
    return value;
  }

  get logs()
  {
    return this.#_logs;
  }

  set log(message){
    this.#_logs.push(message);
  }

  clearLogs()
  {
    this.#_logs = [];
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
