import {Collection} from "./collection";
import {Action, ResponseTransport} from "./transport/response.transport";
import {FetchTransport} from "./transport/fetch.transport";
import {TransportInterface} from "./transport/transport.interface";
import {ApiModel} from "./api.model";
import {Event} from "./base/event";

/**
 * interface of pagination attributes
 */
export interface PaginationOptions {
    totalCount : number,
    totalPage: number,
    currentPage: number,
    pageSize: number,
}

export class ApiCollection extends Collection
{
    /**
     * item model class name
     * @protected
     */
    protected modelClass : typeof ApiModel = ApiModel;

    /**
     * pagination properties
     */
    public pagination : PaginationOptions = {
        totalCount: 0,
        totalPage: 0,
        currentPage: 1,
        pageSize: 20,
    };

    /**
     * transport protocol to communication API
     */
    public transport : TransportInterface = new FetchTransport('http://localhost');

    /**
     * Event before find
     */
    public async beforeFind() : Promise<boolean>
    {
        this.emit(new Event(ApiCollectionEvent.BEFORE_FIND, this));
        return true;
    }

    /**
     * event after find
     * @param response
     */
    public async afterFind(response: ResponseTransport) : Promise<void>
    {
        this.emit(new Event(ApiCollectionEvent.AFTER_FIND, this));
    }

    /**
     * action to load data from API, this will action getMany transport protocol
     * @param query
     */
    public async findAll(query?: object) : Promise<ResponseTransport>
    {
        if (!(await this.beforeFind())) {
            return new ResponseTransport(Action.GET_MANY, false, (query as any));
        }
        const response = await this.transport.getMany(this, query);
        if (response.success) {
            this.data = (response.data as object[]);
            await this.afterFind(response);
        }
        return response;
    }

    /**
     * find all
     * @param query
     */
    public static async findAll(query?: object)
    {
        const collection = new this();
        await collection.findAll(query);
        return collection;
    }
}

/**
 * list event api collection
 */
export enum ApiCollectionEvent {
    BEFORE_FIND = 'beforeFind',
    AFTER_FIND = 'afterFind',
}