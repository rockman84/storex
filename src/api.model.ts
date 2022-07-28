import {Model} from "./model";
import {TransportInterface} from "./transport/transport.interface";
import {Action, ResponseTransport} from "./transport/response.transport";
import {Event} from "./base/event";
import {FetchTransport} from "./transport/fetch.transport";

export class ApiModel extends Model
{
    protected _isNew : boolean = true;

    protected transport : TransportInterface = new FetchTransport('http://localhost');

    /**
     * action save to create or update data from attributes
     */
    public async save(only? : string[], query?: object, validate: boolean = true) : Promise<ResponseTransport>
    {
        if (!(validate && await this.validate()) || !(await this.beforeSave(this._isNew))) {
            return new ResponseTransport(
                this._isNew ? Action.CREATE_ONE : Action.UPDATE_ONE,
                false, {}
            );
        }
        const response = this._isNew ?
            await this.transport.createOne(this, only ? this.getAttributesBy(only) : this.attributes) :
            await this.transport.updateOne(this, only ? this.getAttributesBy(only) : this.attributes, {...query, ...this.getAttributesBy(['id'])});
        if (response.success) {
            this._isNew = false;
            this.setAttributes(response.data);
            await this.afterSave(this._oldAttributes);
            this.clearOldAttributes();
        }
        return response;
    }

    /**
     * action before saving data
     * @param insert
     * @protected
     */
    protected async beforeSave(insert : boolean) : Promise<boolean>
    {
        this.emit(new Event(ApiModelEvent.BEFORE_SAVE, this, {insert}));
        return true;
    }

    /**
     * action after saving data
     * @param oldAttributes
     * @protected
     */
    protected async afterSave(oldAttributes : object) : Promise<void>
    {
        this.emit(new Event(ApiModelEvent.AFTER_SAVE, this, {oldAttributes}));
    }

    /**
     * Delete data
     */
    public async delete() : Promise<ResponseTransport>
    {
        if (this._isNew || !(await this.beforeDelete())) {
            return new ResponseTransport(Action.DELETE_ONE, false, {});
        }
        const response = await this.transport.deleteOne(this, this.getAttributesBy(['id']));
        if (response.success) {
            this._isNew = true;
            await this.afterDelete(response);
            this.clearOldAttributes();
            this._attributes = {};
        }
        return response;
    }

    /**
     * event before delete
     * @protected
     */
    protected async beforeDelete() : Promise<boolean>
    {
        this.emit(new Event(ApiModelEvent.BEFORE_DELETE, this));
        return true;
    }

    /**
     * event after delete
     * @protected
     */
    protected async afterDelete(response : ResponseTransport) : Promise<void>
    {
        this.emit(new Event(ApiModelEvent.AFTER_DELETE, this, response));
    }

    /**
     * find single data
     * @param query
     */
    public async findOne(query : object) : Promise<ResponseTransport>
    {
        if (!(await this.beforeFind(query))) {
            return new ResponseTransport(Action.GET_ONE, false, {});
        }
        const response = await this.transport.getOne(this, query);
        if (response.success) {
            this._isNew = false;
            this.clearOldAttributes();
            this.setAttributes(response.data);
            await this.afterFind(response);
        }
        return response;
    }

    protected async beforeFind(query : object) : Promise<boolean>
    {
        this.emit(new Event(ApiModelEvent.BEFORE_FIND, this, query));
        return true;
    }

    protected async afterFind(response : ResponseTransport) : Promise<void>
    {
        this.emit(new Event(ApiModelEvent.AFTER_FIND, this, response));
    }

    public static async findOne(query: object)
    {
        const model = new this();
        await model.findOne(query);
        return model;
    }

    public async fetch(input: RequestInfo | URL, init?: RequestInit)
    {
        const response = await fetch(input, init);
        const result = await response.json();
        if (response.ok) {
            this.setAttributes(result);
            this._isNew = false;
        }
        return {response, result};
    }
}

export enum ApiModelEvent {
    BEFORE_SAVE = 'beforeSave',
    AFTER_SAVE = 'afterSave',
    BEFORE_DELETE = 'beforeDelete',
    AFTER_DELETE = 'afterDelete',
    BEFORE_FIND = 'beforeFind',
    AFTER_FIND = 'afterFind'
}