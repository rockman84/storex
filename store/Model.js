/**
 * @property {string} firstName
 */
import BaseObject from "@/storex/base/BaseObject";
import Collection from "@/storex/store/Collection";

export default class Model extends BaseObject
{
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

  get rawData()
  {
    return this._rawData;
  }

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
  validate(validate = true) {
    if (!validate) {
      return true;
    }
    this._errors = {};
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

  afterSave() {
    return true;
  }

  beforeSave(insert, oldAttributes) {
    return true;
  }

  save(validate = true) {
    if (this.validate(validate) && this.beforeSave()) {
      let saving = false;
      if (this.isNewRecord) {
        saving = this._insert();
      } else {
        saving = this._update();
      }
      console.log(saving);
      if (saving) {
        this.isNewRecord = false;
        this.afterSave(this.isNewRecord, this.getOldAttributes());
        this._clearOldAttribute();
        return true;
      }
    }
    return false;
  }

  _fetch(params = {})
  {
    return localStorage.getItem(this.id);
  }

  _insert()
  {
    localStorage.setItem(this[this.primaryKeyAttribute], this.getAttributes());
    return true;
  }

  _update()
  {
    localStorage.setItem(this.id, this.getAttributes());
    return true;
  }

  _delete()
  {
    localStorage.removeItem(this.id);
    return true;
  }

  delete()
  {
    if (!this.beforeDelete() || this.isNewRecord) {
      return false;
    }
    let result = this._delete();
    this.afterDelete();
    return result;
  }

  afterDelete()
  {
    return true;
  }

  beforeDelete()
  {
    return true;
  }
}
