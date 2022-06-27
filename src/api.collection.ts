import {Collection} from "./collection";
import {ResponseTransport} from "./transport/response.transport";
import {FetchTransport} from "./transport/fetch.transport";
import {TransportInterface} from "./transport/transport.interface";
import {ApiModel} from "./api.model";

export class ApiCollection extends Collection
{
    protected modelClass : typeof ApiModel = ApiModel;

    public transport : TransportInterface = new FetchTransport('http://api.iweb.dev.id:90/example/author');

    public async findAll(query?: object) : Promise<ResponseTransport>
    {
        const response = await this.transport.getMany(this);
        console.log(response.data);
        if (response.success) {
            this.data = (response.data as object[]);
        }
        return response;
    }

    public static async findAll(query?: object)
    {
        const collection = new this();
        await collection.findAll(query);
        return collection;
    }
}