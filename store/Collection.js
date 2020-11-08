import BaseObject from "@/storex/base/BaseObject";
import Model from "@/storex/store/Model";


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
   * @returns {{link: {}, pageSize: number, model: null}}
   */
  attributes() {
    return {
      model : null,
      pageSize: 50,
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
    this._data.slice(1, 1);
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

  }

  load(params)
  {
    this._data = this.model.load(params);
  }
}
