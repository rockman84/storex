import {Collection} from "./collection";
import {ResponseTransport} from "./transport/response.transport";
import {FetchTransport} from "./transport/fetch.transport";
import {TransportInterface} from "./transport/transport.interface";
import {ApiModel} from "./api.model";

export class ApiCollection extends Collection
{
    public transport : TransportInterface = new FetchTransport('http://api.iweb.dev.id:90/example/author');

    public async findAll(query?: object) : Promise<ResponseTransport>
    {
        const response = await this.transport.getMany(this);
        if (response.success) {
            (response.data as object[]).forEach((item, index) => {
                this.push(new ApiModel(item));
            });
        }
        return response;
    }
}