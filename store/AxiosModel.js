import Model from "./Model";
import axios from "axios";
import ObjectHelper from "@/components/storex/base/ObjectHelper";

'use strict';

/**
 * https://github.com/axios/axios
 */
export default class AxiosModel extends Model
{
  static STATUS_OK = 'OK';
  static STATUS_FAIL = 'fail';

  _axios = null;

  #_response = null;

  constructor() {
    super();
    AxiosModel.prototype.axiosConfig = {
      baseURL: 'http://localhost:8080/api',
    };

    AxiosModel.prototype.actions = {
      index: {
        method: 'get',
      },
      view: {
        method: 'get',
      },
      insert: {
        method: 'post',
        url: '/user'
      },
      update: {
        method: 'post',
      },
      remove: {
        method: 'post',
      }
    };
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

  async createRequest(action, config = {})
  {
    this.#_response = {};

    const requestConfig = Object.assign({
      data: this.getAttributes(),
      url: this.className.toLowerCase() + '/' + action,
    }, this.actions[action], config);

    await this.axios.request(requestConfig).then((response) => {
      this.#_response = response;
    }).catch((error) => {
      if (error.response) {
        this.#_response = Object.assign(this.#_response, error.response);
        if (this.#_response.status === 422) {
          ObjectHelper.forEach(this.#_response.data, (attr, error) => {
            this.setError(attr, error[0]);
          });
        }
      }
      this.setError('_request', error.message);
    });
    return this.#_response;
  }

  get response()
  {
    return this.#_response;
  }

  async _fetch(params = {}) {
    const response = await this.createRequest('index', {params: params});
    return response ? response.statusText === AxiosModel.STATUS_OK : false;
  }

  async _delete() {
    const response = await this.createRequest('delete');
    return response ? response.statusText === AxiosModel.STATUS_OK : false;
  }

  async _insert() {
    const response = await this.createRequest('insert');

    return response ? response.statusText === AxiosModel.STATUS_OK : false;
  }

  async _update() {
    const response = await this.createRequest('update');
    return response ? response.statusText === AxiosModel.STATUS_OK : false;
  }
}
