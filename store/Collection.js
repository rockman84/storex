import BaseObject from "@/storex/base/BaseObject";
import Model from "@/storex/store/Model";


/**
 * @property {Model} model
 * @property {integer} pageSize
 */
export default class Collection extends BaseObject
{
  /**
   * data stores item collection
   * @type {[]}
   * @private
   */
  _data = [];

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

  /**
   * add item collection
   * @param item
   */
  push(item) {
    if (item instanceof this.model) {
      item.collection = this;
      console.log(this);
      return this._data.push(item);
    }
    console.log(this);
    return false;
  }

  deleteItem(id)
  {
    this._data.slice(1, 1);
  }

  sync()
  {

  }
}
