import {TransportInterface} from "./transport.interface";
import {BaseObject} from "../base/base.object";
import {Model} from "../model";
import {Collection} from "../collection";

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
            headers: {}
        };
        const opts = {...defaultOpts, ...init};
        return new Request(this._baseUrl, opts);
    }

    async create(model : Model, options? : RequestInit) : Promise<Response|false>
    {
        if (await model.validate()) {
            const request = this.createRequest({
                body: JSON.stringify(model.attributes),
                method: 'POST',
            });

            const response = await fetch(request);
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
}