import Model from "@/storex/store/Model";
import axios from "axios";

export default class AxiosModel extends Model
{
  static STATUS_OK = 'OK';

  _axios = null;

  constructor() {
    super();
    AxiosModel.prototype.axiosConfig = {
      baseUrl: 'http://localhost:3000/' + this.className.toLowerCase(),
    };
    AxiosModel.prototype.response = null;
    AxiosModel.prototype.view = 'view';
    AxiosModel.prototype.insert = 'create';
    AxiosModel.prototype.update = 'update';
    AxiosModel.prototype.remove = 'delete';
  }

  /**
   * get axios components
   * @returns {axios}
   */
  get axios() {
    if (!this._axios) {
      this._axios = axios.create(this.axiosConfig);
    }
    return this._axios;
  }

  _fetch(params = {}) {
    return super._fetch(params);
  }

  _delete() {
    return super._delete();
  }

  _insert() {
    let request = this.axios.post(this.insert, this.getAttributes());
    request.then((response) => {
      this.response = response;
      this.rawData = response.data;
      return this.response.statusText === AxiosModel.STATUS_OK;
    });

  }

  _update() {
    return super._update();
  }
}
