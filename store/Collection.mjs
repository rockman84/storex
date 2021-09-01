import BaseObject from "../base/BaseObject";
import Model from "./Model";
import Event from "../base/Event";

'use strict';

/**
 * @property {Model} model
 * @property integer pageSize
 * @property {Object} link
 */
export default class Collection extends BaseObject
{
  static EVENT_BEFORE_SYNC = 'beforeSync';
  static EVENT_AFTER_SYNC = 'afterSync';
  /**
   * event before add item collection
   * @type {string}
   */
  static EVENT_BEFORE_ADD_ITEM = 'beforeAddItem';

  /**
   * event after add item collection
   * @type {string}
   */
  static EVENT_AFTER_ADD_ITEM = 'afterAddItem';

  static EVENT_BEFORE_REMOVE_ITEM = 'beforeRemove';

  static EVENT_AFTER_REMOVE_ITEM = 'afterRemove';

  static EVENT_AFTER_FIND = 'afterFind';

  /**
   * data stores item collection
   * @type {[]}
   * @private
   */
  _data = [];

  _rawData = null;

  _remove = [];

  _source;

  constructor(arg) {
    super(arg);
    Collection.prototype._jobDelete = [];
  }

  /**
   * set attributes config
   * @returns {Object}
   */
  attributes() {
    return {
      pageSize: 50,
      page: 1,
      link: {},
    };
  }

  /**
   * clean all data collection without trigger event
   */
  cleanData()
  {
    this._data = [];
  }

  /**
   * remove all data with trigger event
   */
  removeAll()
  {
    this.remove(() => true);
  }

  /**
   * get all data collection
   * @returns {[]|Doc<T>[]}
   */
  get data() {
    return this._data;
  }

  set data(data) {
    this._data = data;
  }

  get count()
  {
    return this._data.length;
  }

  /**
   * remove item collection
   * @param conditions {function}
   * @returns {Model[]}
   */
  remove(conditions)
  {
    const removeItem = [];
    if (typeof conditions !== 'function') {
      return [];
    }
    this._data = this._data.filter((item) => {
      if (conditions(item) && this.beforeRemove(item)) {
        this._remove.push(item);
        removeItem.push(item);
        this.afterRemove(item);
        return false;
      } else {
        return true;
      }
    });
    return removeItem;
  }

  /**
   *
   * @param item {Model}
   * @returns {*}
   */
  beforeRemove(item)
  {
    return this.emit(new Event(Collection.EVENT_BEFORE_REMOVE_ITEM, this, {items: item}));
  }

  /**
   * trigger after remove item
   * @param item {Model}
   */
  afterRemove(item)
  {
    this.emit(new Event(Collection.EVENT_AFTER_REMOVE_ITEM, this, {items: item}));
  }

  /**
   * remove item collection by id key
   * @param id
   * @returns {Model[]}
   */
  removeItemId(id)
  {
    return this.remove((item) => {
      return item[this.constructor.modelClass.primaryKeyAttribute] == id;
    })
  }

  /**
   * add item collection
   * @param item
   */
  push(item) {
    if (this.beforePush(item) && item instanceof this.constructor.modelClass) {
      const pushed = this._data.push(item);
      this.afterPush(item);
      return pushed;
    }
    return false;
  }

  beforePush(item)
  {

    return this.emit(new Event(Collection.EVENT_BEFORE_ADD_ITEM, this, {item: item}));
  }

  afterPush(item)
  {
    this.emit(new Event(Collection.EVENT_AFTER_ADD_ITEM, this, {item: item}));
  }

  find(conditions)
  {
    let result = [];
    if (typeof conditions !== 'function') {
      return result;
    }
    return this._data.find(conditions);
  }

  filter(conditions)
  {
    return this._data.filter(conditions);
  }

  findById(id)
  {
    return this.find((item) => {
      return item[this.constructor.modelClass.primaryKeyAttribute] == id;
    });
  }

  findByAttribute(attr, value)
  {
    return this.find((item) => item[attr] == value);
  }

  sync()
  {
    if (!this.emit(new Event(Collection.EVENT_BEFORE_SYNC, this))) {
      return false;
    }
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
    const className = this.constructor.modelClass;
    if (className instanceof ActiveModel) {
      this._data = className.fetchAll(params);
      return this;
    }
  }

  static get modelClass()
  {
    return Model;
  }
}
