import {TransportInterface} from "./transport.interface";
import {BaseObject} from "../base/base.object";
import {Model} from "../model";
import {Collection} from "../collection";

interface ErrorValidation {
    field: string;
    message: string;
};

export class FetchTransport extends BaseObject implements TransportInterface
{
    private readonly _baseUrl : string;

    constructor(baseUrl: string) {
        super();
        this._baseUrl = baseUrl;
    }

    createRequest(init? : RequestInit)
    {
        const defaultOpts = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        };
        const opts = {...defaultOpts, ...init};
        return new Request(this._baseUrl, opts);
    }

    async create(model : Model, options? : RequestInit) : Promise<Response|boolean>
    {
        if (await model.validate()) {
            const request = this.createRequest({
                body: JSON.stringify(model.attributes),
                method: 'POST',
            });

            const response = await fetch(request);
            const result = await response.json();
            if (response.status === 422) {
                FetchTransport.setErrorValidation(model, result);
            }
            if (response.status === 200 || response.status === 201) {
                model.setAttributes(result);
                model.clearOldAttributes();
            }
            return response;
        }
        return false;
    }

    async update(model: typeof Model, options? : RequestInit)
    {

    }

    async getOne(model: typeof Model, options? : RequestInit)
    {

    }

    async getAll(collection: Collection, options? : RequestInit)
    {

    }

    static setErrorValidation(model: Model, result : ErrorValidation[]) : void
    {
        result.forEach((error: ErrorValidation) => {
            model.addError(error.field, error.message);
        });
    }
}