/**
 * @property {string} firstName
 */
import BaseObject from "@/sky/base/BaseObject";
import Collection from "@/sky/store/Collection";

export default class Model extends BaseObject
{
  /**
   * relations model
   * @type {{}}
   * @private
   */
  _relations = {};

  constructor(args) {

    super(args);
    Model.prototype.isNewRecord = true;
    Model.prototype.extraParams = {};
    Model.prototype.primaryKeyAttribute = 'id';
    Model.prototype._errors = [];
    Model.prototype.collection = null;
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
      this._relations[name] = new Collection({
        model: className,
        link: link,
      });
    }
    console.log('use cache');
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
    if (typeof this._relations[name] == 'undefined') {
      this._relations[name] = className.find(link);
    }
    return this._relations[name]
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

  afterSave() {
    return true;
  }

  save(validate = true) {
    if (this.validate(validate) && this.beforeSave()) {
      let saving = false;
      if (this.isNewRecord) {
        saving = this.insert();
      } else {
        saving = this.update();
      }
      if (saving) {
        this.isNewRecord = false;
        this.afterSave(this.isNewRecord, this.getOldAttributes());
        this._clearOldAttribute();
        return true;
      }
      return true;
    }
    return false;
  }

  beforeSave(insert, oldAttributes) {
    return true;
  }

  static find()
  {
    throw `find not supported`;
  }

  beforeFind()
  {
    return true;
  }

  afterFind()
  {
    return true;
  }

  insert()
  {
    throw `insert not supported`;
  }

  update()
  {
    throw `insert not supported`;
  }

  delete()
  {
    if (!this.beforeDelete() || this.isNewRecord) {
      return false;
    }
    this.afterDelete();
    return true;
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
