import Model from "@/components/storex/store/Model";
import Event from "@/components/storex/base/Event";
import Collection from "@/components/storex/store/Collection";

export default class ActiveModel extends Model
{
  load(params = null)
  {
    let data = this._fetch(params);
    this.rawData = data;
    this.setAttributes(data);
  }

  /**
   * event trigger after save data
   * @param insert
   * @param oldAttributes
   * @returns {boolean}
   */
  afterSave(insert, oldAttributes) {
    this.#_isNewRecord = false;
    this._clearOldAttribute();
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
   * action save
   * @param validate
   * @param attributes
   * @returns {Promise<Model>}
   */
  save(success = null, error = null, validate = true, attributes = null,) {
    if ((validate && this.validate()) && this.beforeSave(this.isNewRecord)) {
      if (this.isNewRecord) {
        this._insert(this.getAttributes(attributes)).then(() => {
          this.afterSave(this.isNewRecord, this.getOldAttributes());
          success(this);
        }).catch(error);
      } else {
        this._update(this.getAttributes(attributes)).then(success).catch(error);
      }
    }
  }

  static fetchAll(params = null)
  {
    return [];
  }

  async _fetch(params = null)
  {
    return localStorage.getItem(this.primaryKey);
  }

  async _insert(attributes = null)
  {
    localStorage.setItem(this.primaryKey, this.getAttributes(attributes));
    return true;
  }

  async _update(attributes = null)
  {
    localStorage.setItem(this.primaryKey, this.getAttributes(attributes));
    return true;
  }

  async _delete()
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
