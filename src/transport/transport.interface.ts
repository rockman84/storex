import {Model} from "../model";
import {Collection} from "../collection";
import {ResponseTransport} from "./response.transport";

export interface TransportInterface {
    /**
     * create one base
     * @param model
     * @param attributes
     * @param options
     */
    createOne(model: Model, attributes: object, options?: object) : Promise<ResponseTransport>

    /**
     * update one base
     * @param model
     * @param attributes
     * @param options
     */
    updateOne(model: Model, attributes: object, options?: object) : Promise<ResponseTransport>

    /**
     * delete one base
     * @param model
     * @param options
     */
    deleteOne(model: Model, options?: object) : Promise<ResponseTransport>

    /**
     * get one
     * @param model
     * @param query
     * @param options
     */
    getOne(model: Model, query : object, options?: object) : Promise<ResponseTransport>

    /**
     * get Many
     * @param collection
     * @param options
     */
    getMany(collection: Collection, options?: object) : Promise<ResponseTransport>
}