import {TransportInterface} from "./transport.interface";
import {BaseObject} from "../base/base.object";
import {Action, ResponseTransport} from "./response.transport";
import {ApiCollection} from "../api.collection";
import {ApiModel} from "../api.model";

export interface ErrorValidation {
    field: string;
    message: string;
}

export interface ApiParamsOptions {
    method: string;
    path: string;
}

export interface ApiOptions {
    createOne?: ApiParamsOptions;
    updateOne?: ApiParamsOptions;
    deleteOne?: ApiParamsOptions;
    getOne?: ApiParamsOptions;
    getMany?: ApiParamsOptions;
}

export const createResponseTransport = async (action : Action , model: ApiModel, response: Response) : Promise<ResponseTransport> =>
{
    const result = (response.status !== 204) ? await response.json() : {};
    if (response.status === 422) {
        result.forEach((error: ErrorValidation) => {
            model.addError(error.field, error.message);
        });
    }
    return new ResponseTransport(
        action,
        response.status === 200 || response.status === 201 || response.status === 204,
        result,
        response
    );
}

export class FetchTransport extends BaseObject implements TransportInterface
{
    private readonly _baseUrl : string;

    public apiOptions : ApiOptions = {
        createOne: {
            method: 'post',
            path: 'create',
        },
        updateOne: {
            method: 'put',
            path: 'update',
        },
        deleteOne: {
            method: 'delete',
            path: 'delete',
        },
        getOne: {
            method: 'get',
            path: 'view',
        },
        getMany: {
            method: 'get',
            path: 'index',
        },
    };

    constructor(baseUrl: string, apiOptions? : ApiOptions) {
        super();
        this._baseUrl = baseUrl;
        if (typeof apiOptions !== 'undefined') {
            this.apiOptions = {...apiOptions};
        }
    }

    public createUrl(url: string | undefined, params : object = {}) : string
    {
        if (typeof url === 'undefined') {
            throw new Error('Not Supported Url');
        }

        const normalizeUrl = url.replace(/{(\w+)}/g,(substring, field) => {
            if (typeof (params as any)[field] !== 'undefined') {
                const value = (params as any)[field];
                delete (params as any)[field];
                return value;
            }
        });
        let queryParams = '';
        if (params) {
            queryParams = '?' + (new URLSearchParams((params as any))).toString();
        }
        return `${this._baseUrl}/${normalizeUrl}${queryParams}`;
    }

    async createOne(model: ApiModel, attributes : object, query? : object, requestOptions?: RequestInit): Promise<ResponseTransport>
    {
        const request = new Request(this.createUrl(this.apiOptions.createOne?.path, query), {
            body: JSON.stringify(attributes),
            method: this.apiOptions.createOne?.method,
            headers: {
                'Content-Type' : 'application/json'
            },
            ...requestOptions
        });

        const response = await fetch (request);
        return await createResponseTransport(Action.CREATE_ONE, model, response);
    }

    async updateOne(model: ApiModel, attributes: object, query?: object, requestOptions?: RequestInit): Promise<ResponseTransport>
    {
        const url = this.createUrl(this.apiOptions.updateOne?.path, {
            id: model.getAttribute('id')
        });

        const request = new Request(url, {
            body: JSON.stringify(attributes),
            method: this.apiOptions.updateOne?.method,
            headers: {
                'Content-Type' : 'application/json'
            },
            ...requestOptions
        });

        const response = await fetch (request);
        return await createResponseTransport(Action.UPDATE_ONE, model, response);
    }

    async deleteOne(model: ApiModel, query? : object, requestOptions?: RequestInit): Promise<ResponseTransport>
    {
        const request = new Request(this.createUrl(this.apiOptions.deleteOne?.path, query),{
            method: this.apiOptions.deleteOne?.method,
            headers: {
                'Content-Type' : 'application/json'
            },
        });
        const response = await fetch(request);
        return await createResponseTransport(Action.DELETE_ONE, model, response);
    }

    async getMany(collection: ApiCollection, query?: object, requestOptions?: RequestInit): Promise<ResponseTransport>
    {
        const request = new Request(this.createUrl(this.apiOptions.getMany?.path, query), {
            method: this.apiOptions.getMany?.method,
            headers: {
                'Content-Type' : 'application/json'
            },
            ...requestOptions
        });
        const response = await fetch(request);
        const result = await response.json();
        const success = response.status === 200 || response.status === 201;
        if (success) {
            collection.pagination.totalCount = parseInt(response.headers.get('X-Pagination-Total-Count') as any, 10);
            collection.pagination.totalPage = parseInt(response.headers.get('X-Pagination-Page-Count') as any, 10);
            collection.pagination.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page') as any, 10);
            collection.pagination.pageSize = parseInt(response.headers.get('X-Pagination-Per-Page') as any, 10);
        }
        return new ResponseTransport(Action.GET_MANY, success, result, response);
    }

    async getOne(model: ApiModel, query? : object, requestOptions?: RequestInit): Promise<ResponseTransport>
    {
        const request = new Request(this.createUrl(this.apiOptions.getOne?.path, query), {
            method: this.apiOptions.getOne?.method,
            headers: {
                'Content-Type' : 'application/json'
            },
            ...requestOptions,
        });
        const response = await fetch(request);
        const result = await response.json();
        return new ResponseTransport(
            Action.GET_ONE,
            response.status === 200,
            result,
            response,
        );
    }
}