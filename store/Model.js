/**
 * @property {string} firstName
 */
import BaseObject from "@/storex/base/BaseObject";
import Collection from "@/storex/store/Collection";
import Event from "@/storex/base/Event";

export default class Model extends BaseObject
{
  static EVENT_BEFORE_SAVE = 'beforeSave';
  static EVENT_AFTER_SAVE = 'afterSave';
  static EVENT_BEFORE_DELETE = 'beforeDelete';
  static EVENT_AFTER_DELETE = 'afterDelete';
  static EVENT_AFTER_INSERT = 'afterInsert';
  static EVENT_BEFORE_VALIDATE = 'beforeValidate';
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
  _errors = [];

  constructor(args) {

    super(args);
    /**
     * check is new record
     * @type {boolean}
     */
    Model.prototype.isNewRecord = true;
    Model.prototype.extraParams = {};
    Model.prototype.primaryKeyAttribute = 'id';
    Model.prototype.collection = null;
    Model.prototype.collectionClass = Collection;
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
      this._relations[name] = new this.collectionClass({
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
  hasOne(className, link)
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
    if (typeof this[this.primaryKeyAttribute] == 'undefined') {
      throw `can't find Id key in attributes`;
    }
    return this[this.primaryKeyAttribute];
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
      return null;
    }
    return this._errors[key];
  }

  /**
   * define rule attributes
   * @returns {{}}
   */
  rule() {
    return {};
  }

  /**
   * check value attributes base on rule
   * @param validate
   * @returns {boolean}
   */
  validate() {
    this.beforeValidate();
    this.afterValidate();
    return true;
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
    return true;
  }

  load(params = {})
  {
    let data = this._fetch(params);
    this._rawData = data;
    this.setAttributes(data);
  }

  static loadAll()
  {

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
    return true;
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
  save(validate = true) {
    if ((validate && this.validate()) && this.beforeSave(this.isNewRecord)) {
      let saving = false;
      if (this.isNewRecord) {
        saving = this._insert();
      } else {
        saving = this._update();
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

  _fetch(params = {})
  {
    return localStorage.getItem(this.primaryKey);
  }

  _insert()
  {
    localStorage.setItem(this.primaryKey, this.getAttributes());
    return true;
  }

  _update()
  {
    localStorage.setItem(this.primaryKey, this.getAttributes());
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
        this.collection.remove(this.primaryKeyAttribute, this.primaryKey);
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
    return true;
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
