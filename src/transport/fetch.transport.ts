import {TransportInterface} from "./transport.interface";
import {BaseObject} from "../base/base.object";
import {Model} from "../model";
import {Collection} from "../collection";
import {ResponseTransport} from "./response.transport";

export interface ErrorValidation {
    field: string;
    message: string;
};

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

export const ModelAction = async (response : Response, model : Model) => {

}

export class FetchTransport extends BaseObject implements TransportInterface
{
    private readonly _baseUrl : string;

    private _result : object[] = [];

    public apiOptions : ApiOptions = {
        createOne: {
            method: 'post',
            path: 'create',
        },
        updateOne: {
            method: 'post',
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

    constructor(baseUrl: string) {
        super();
        this._baseUrl = baseUrl;
    }

    public setErrorValidation(model: Model, result : ErrorValidation[]) : void
    {
        result.forEach((error: ErrorValidation) => {
            model.addError(error.field, error.message);
        });
    }

    async createOne(model: Model, requestOptions?: RequestInit): Promise<ResponseTransport>
    {
        const request = new Request(this._baseUrl + '/' + this.apiOptions.createOne?.path, {
            body: JSON.stringify(model.attributes),
            method: this.apiOptions.createOne?.method,
            headers: {
                'Content-Type' : 'application/json'
            },
            ...requestOptions
        });

        const response = await fetch (request);
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

    async deleteOne(model: Model, requestOptions?: RequestInit): Promise<any>
    {
        return Promise.resolve(undefined);
    }

    async getMany(model: Collection, requestOptions?: RequestInit): Promise<any>
    {
        return Promise.resolve(undefined);
    }

    async getOne(url: string): Promise<any>
    {
        return Promise.resolve(undefined);
    }

    async updateOne(model: Model, requestOptions?: RequestInit): Promise<ResponseTransport>
    {
        return new ResponseTransport(
            false,
            {}
        );
    }
}