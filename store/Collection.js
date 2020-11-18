import BaseObject from "../base/BaseObject";
import Model from "./Model";


/**
 * @property {Model} model
 * @property {integer} pageSize
 * @property {Object} link
 */
export default class Collection extends BaseObject
{
  static EVENT_BEFORE_SYNC = 'beforeSync';
  static EVENT_AFTER_SYNC = 'afterSync';

  /**
   * data stores item collection
   * @type {[]}
   * @private
   */
  _data = [];

  _rawData = null;

  constructor(arg) {
    super(arg);
    Collection.prototype._jobDelete = [];
    if (!this.model instanceof Model) {
      throw `model attributes must instance of Model`;
    }
  }

  /**
   * set attributes config
   * @returns {Object}
   */
  attributes() {
    return {
      model : null,
      pageSize: 50,
      page: 1,
      link: {},
    };
  }

  /**
   * clean all data collection
   */
  cleanData()
  {
    this._data = [];
  }

  /**
   * get all data collection
   * @returns {[]|Doc<T>[]}
   */
  get data() {
    return this._data;
  }

  get count()
  {
    return this._data.length;
  }

  remove(attribute, value)
  {
    this._data = this._data.filter(data => data[attribute] != value);
  }

  /**
   * add item collection
   * @param item
   */
  push(item) {
    if (item instanceof this.model) {
      item.collection = this;
      return this._data.push(item);
    }
    return false;
  }

  deleteItem(id)
  {
    this._data = this._data.filter(data => data[this.model.constructor.primaryKeyAttribute] !== id);
  }

  findById(id)
  {
    return this.findByAttribute('id', id);
  }

  findByAttribute(attr, value)
  {
    return this._data.find((data) => data[attr] == value);
  }

  sync()
  {
    // update or save record
    this._data.forEach((model) => {
      if (model.isDirtyAttribute) {
        model.save();
      }
    });
    // delete record
    this._jobDelete.forEach((model) => {
      model.delete();
    });
  }

  load(params = {})
  {
    params = Object.assign({pageSize: this.pageSize, page: this.page}, params);
    const className = this.this.model;
    this._data = className.fetchAll(params);
    return this;
  }
}
