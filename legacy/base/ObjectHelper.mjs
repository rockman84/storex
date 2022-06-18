export default class ObjectHelper
{

  static forEach(obj, callback)
  {
    if (Array.isArray(obj)) {
      obj.forEach(callback);
    } else {
      Object.entries(obj).forEach(([prop, val], index) => {
        callback(prop, val, index);
      });
    }
  }

  static isObject(value)
  {
    return typeof value === 'object' && value !== null;
  }

  static isArray(value)
  {
    return Array.isArray(value);
  }

  static merge(value, merge)
  {
    if (ObjectHelper.isObject(value)) {
      Object.assign(value, merge);
    } else {
      value.concat(merge);
    }
  }

  static propertyExist(obj, key)
  {
    if (ObjectHelper.isObject(obj)) {
      return obj.hasOwnProperty(key);
    }
  }
}
