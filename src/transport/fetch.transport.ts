import {TransportInterface} from "./transport.interface";
import {BaseObject} from "../base/base.object";
import {Model} from "../model";
import {Collection} from "../collection";
import {ResponseTransport} from "./response.transport";

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

export const createResponseTransport = async (model: Model, response: Response) : Promise<ResponseTransport> =>
{
    const result = await response.json();
    if (response.status === 422) {
        result.forEach((error: ErrorValidation) => {
            model.addError(error.field, error.message);
        });
    }
    return new ResponseTransport(
        response.status === 200 || response.status === 201,
        result
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
            method: 'post',
            path: 'delete',
        },
        getOne: {
            method: 'post',
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
        let queryParams = '';
        if (params) {
            queryParams = '?' + (new URLSearchParams((params as any))).toString();
        }
        return `${this._baseUrl}/${url}${queryParams}`;
    }

    async createOne(model: Model, attributes : object, requestOptions?: RequestInit): Promise<ResponseTransport>
    {
        const request = new Request(this.createUrl(this.apiOptions.createOne?.path), {
            body: JSON.stringify(attributes),
            method: this.apiOptions.createOne?.method,
            headers: {
                'Content-Type' : 'application/json'
            },
            ...requestOptions
        });

        const response = await fetch (request);
        return await createResponseTransport(model, response);
    }

    async updateOne(model: Model, attributes: object, requestOptions?: RequestInit): Promise<ResponseTransport>
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
        return await createResponseTransport(model, response);
    }

    async deleteOne(model: Model, requestOptions?: RequestInit): Promise<ResponseTransport>
    {
        const request = new Request(this.createUrl(this.apiOptions.deleteOne?.path),{
            method: this.apiOptions.deleteOne?.method,
            headers: {
                'Content-Type' : 'application/json'
            },
        });
        const response = await fetch(request);
        return await createResponseTransport(model, response);
    }

    async getMany(model: Collection, requestOptions?: RequestInit): Promise<ResponseTransport>
    {
        new URLSearchParams();
        const request = new Request(this.createUrl(this.apiOptions.getMany?.path), {
            method: this.apiOptions.getMany?.method,
            headers: {
                'Content-Type' : 'application/json'
            },
            ...requestOptions
        });
        const response = await fetch(request);
        const result = await response.json();
        return new ResponseTransport(true, result);
    }

    async getOne(model: Model, query : object, requestOptions?: RequestInit): Promise<ResponseTransport>
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
            response.status === 200,
            result,
        );
    }
}