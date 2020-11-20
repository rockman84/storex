import BaseObject from "../base/BaseObject";
import Collection from "./Collection";
import Event from "../base/Event";
import Validator from "../validator/Validator";
import BuildValidator from "../validator/BuildValidator";

/**
 * class Model
 */
export default class Model extends BaseObject
{
  /**
   * event before save
   * @type {string}
   */
  static EVENT_BEFORE_SAVE = 'beforeSave';

  /**
   * event after save
   * @type {string}
   */
  static EVENT_AFTER_SAVE = 'afterSave';

  /**
   * event before delete
   * @type {string}
   */
  static EVENT_BEFORE_DELETE = 'beforeDelete';

  /**
   * event after delete
   * @type {string}
   */
  static EVENT_AFTER_DELETE = 'afterDelete';

  /**
   * event after insert
   * @type {string}
   */
  static EVENT_AFTER_INSERT = 'afterInsert';

  /**
   * event before validate
   * @type {string}
   */
  static EVENT_BEFORE_VALIDATE = 'beforeValidate';

  /**
   * event after validate
   * @type {string}
   */
  static EVENT_AFTER_VALIDATE = 'afterValidate';

  /**
   * relations model
   * @type {{}}
   * @private
   */
  _relations = {};

  /**
   * fetch raw data
   * @type {{*}}
   * @private
   */
  _rawData = null;

  /**
   * errors storage
   * @type {[]}
   * @private
   */
  _errors = {};

  /**
   * attributes validator class
   * @type Validator[]
   * @private
   */
  _validators = [];

  #_isNewRecord = true;

  static collectionClass = Collection;

  static primaryKeyAttribute = 'id';

  constructor(args) {

    super(args);
    /**
     * check is new record
     * @type {boolean}
     */
    Model.prototype.isNewRecord = true;
    Model.prototype.collection = null;
    Model.prototype.show = true;
  }

  /**
   * relation has many will send collection
   * @param className
   * @param link
   * @param name
   * @returns {Collection}
   */
  hasMany(className, link, name) {
    if (typeof this._relations[name] == 'undefined') {
      this._relations[name] = new className.collectionClass({
        model: className,
        link: link,
      });
    }
    return this._relations[name];
  }

  /**
   * relation has one will return model
   * @param className
   * @param link
   * @returns {Model}
   */
  hasOne(className, link, name)
  {
    if (!className instanceof Model) {
      throw `className must instance of Model`;
    }
    if (typeof this._relations[name] == 'undefined') {
      this._relations[name] = className.find(link);
    }
    return this._relations[name]
  }

  /**
   * get primary key value
   * @returns {*}
   */
  get primaryKey()
  {
    if (typeof this[this.constructor.primaryKeyAttribute] == 'undefined') {
      throw `can't find Id key in attributes`;
    }
    return this[this.constructor.primaryKeyAttribute];
  }

  /**
   * get raw data
   * @returns {null}
   */
  get rawData()
  {
    return this._rawData;
  }

  /**
   * set raw data
   * @param data
   */
  set rawData(data)
  {
    this._rawData = data;
  }

  /**
   * get all errors message
   * @returns {[]}
   */
  get errors()
  {
    return this._errors;
  }

  /**
   * set error model
   * @param attribute
   * @param message
   */
  setError(attribute, message)
  {
    this._errors[attribute] = message;
  }

  /**
   * get error by attribute
   * @param key
   * @returns {null|*}
   */
  getErrorMessage(key)
  {
    if (typeof this._errors[key] === 'undefined') {
      return '';
    }
    return this._errors[key];
  }

  /**
   * ```
   * return {
   *   id: [
   *     {type: 'integer', min: 3, max: 15},
   *     {type: 'email'}
   *   ],
   *   name: [
   *     {type: 'string', min: 4, max: 30},
   *     {type: CustomValidationClass, foo: 'any', bar: 'any'},
   *     ['customValidationMethod', {foo: 'any', bar: 'any'}],
   *   ]
   * };
   * ```
   * define rule attributes
   * @returns {{}}
   */
  rules() {
    return {};
  }

  /**
   * check value attributes base on rule
   * @param validate
   * @returns {boolean}
   */
  validate(attributes = null) {
    if (!this.beforeValidate()) {
      return false;
    }
    const me = this;
    this._errors = {};
    this.validators.forEach((validator) => {
      // skip validate when attribute has error
      if (this.getErrorMessage(validator.attribute)) {
        return;
      }
      if (validator instanceof Validator) {
        // run validation object
        validator.validate();
      } else if (Array.isArray(validator)) {
        // run custom validation method
        me[validator[1]](validator[0], (typeof validator[2] === 'undefined') ? {} : validator[2]);
      }
    });
    this.afterValidate();
    return Object.keys(this.errors).length === 0;
  }

  get validators()
  {
    if (this._validators.length === 0) {
      const rules = this.rules();
      const me = this;
      Object.keys(rules).forEach((key) => {
        if (Array.isArray(rules[key])) {
          rules[key].forEach((rule) => {
            this._validators.push(me._createValidator(key, rule));
          });
        }
      });
    }
    return this._validators;
  }

  /**
   * init object validation by attribute
   * @param attribute
   * @param rule
   * @returns {null|Validator|BuildValidator|Array}
   * @private
   */
  _createValidator(attribute, rule)
  {
    let roleObj = null;
    if (Array.isArray(rule)) {
      rule.unshift(attribute);
      return rule;
    } else if (typeof rule.type !== 'undefined') {
      rule.context = this;
      rule.attribute = attribute;
      if (typeof rule.type == 'string') {
        roleObj = new BuildValidator(rule);
      } else if (rule.type instanceof Validator) {
        roleObj = new rule.type(rule);
      } else {
        throw `can't set validator`;
      }
    } else if (typeof rule === 'string') {
      roleObj = new BuildValidator({
        type: rule,
        attribute: attribute,
        context: this,
      });
    }
    return roleObj;
  }

  /**
   * event trigger before validate
   * @returns {boolean}
   */
  beforeValidate()
  {
    const event = new Event(Model.EVENT_BEFORE_VALIDATE, this);
    this.emit(event.name, event);
    return true;
  }

  /**
   * event trigger after validate
   * @returns {boolean}
   */
  afterValidate()
  {
    const event = new Event(Model.EVENT_AFTER_VALIDATE, this);
    this.emit(event.name, event);
  }

  load(params = null)
  {
    let data = this._fetch(params);
    this._rawData = data;
    this.setAttributes(data);
  }

  /**
   * event trigger after save data
   * @param insert
   * @param oldAttributes
   * @returns {boolean}
   */
  afterSave(insert, oldAttributes) {
    const event = new Event(Model.EVENT_AFTER_SAVE, this, {
      oldAttributes: oldAttributes,
      insert: insert,
    });
    this.emit(event.name, event);
  }

  /**
   * event trigger before save data
   * @param insert
   * @returns {boolean}
   */
  beforeSave(insert) {
    const event = new Event(Model.EVENT_BEFORE_SAVE, this, {
      insert: insert,
    });
    this.emit(event.name, event);
    return true;
  }

  /**
   * action save data
   * @param validate
   * @returns {boolean}
   */
  save(validate = true, attributes = null) {
    if ((validate && this.validate()) && this.beforeSave(this.isNewRecord)) {
      let saving = false;
      if (this.isNewRecord) {
        saving = this._insert(this.getAttributes(attributes));
      } else {
        saving = this._update(this.getAttributes(attributes));
      }
      if (saving) {
        this.afterSave(this.isNewRecord, this.getOldAttributes());
        this.isNewRecord = false;
        this._clearOldAttribute();
        return true;
      }
    }
    return false;
  }

  _fetch(params = null)
  {
    return localStorage.getItem(this.primaryKey);
  }

  static fetchAll(params = null)
  {
    return [];
  }

  _insert(attributes = null)
  {
    localStorage.setItem(this.primaryKey, this.getAttributes(attributes));
    return true;
  }

  _update(attributes = null)
  {
    localStorage.setItem(this.primaryKey, this.getAttributes(attributes));
    return true;
  }

  _delete()
  {
    localStorage.removeItem(this.primaryKey);
    return true;
  }

  delete()
  {
    if (!this.beforeDelete() || this.isNewRecord) {
      return false;
    }
    const result = this._delete();
    if (result) {
      if (this.collection instanceof Collection) {
        this.collection.remove(this.constructor.primaryKeyAttribute, this.primaryKey);
      }
      this.afterDelete();
    }
    return result;
  }

  /**
   * event trigger after delete data
   * @returns {boolean}
   */
  afterDelete()
  {
    const event = new Event(Model.EVENT_AFTER_DELETE, this);
    this.emit(event.name, this);
  }

  /**
   * event trigger before delete data
   * @returns {boolean}
   */
  beforeDelete()
  {
    const event = new Event(Model.EVENT_BEFORE_DELETE, this);
    this.emit(event.name, this);
    return true;
  }
}
