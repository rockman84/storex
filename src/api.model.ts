import {Model} from "./model";
import {TransportInterface} from "./transport/transport.interface";
import {ResponseTransport} from "./transport/response.transport";
import {Event} from "./base/event";
import {FetchTransport} from "./transport/fetch.transport";

export class ApiModel extends Model
{
    protected transport : TransportInterface = new FetchTransport('http://localhost');

    /**
     * action save to create or update data from attributes
     */
    public async save(only? : string[], validate: boolean = true) : Promise<ResponseTransport>
    {
        if (!(validate && await this.validate()) || !(await this.beforeSave(this._isNew))) {
            return new ResponseTransport(false, {});
        }
        const response = this._isNew ?
            await this.transport.createOne(this, only ? this.getAttributesBy(only) : this.attributes) :
            await this.transport.updateOne(this, only ? this.getAttributesBy(only) : this.attributes);
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
        this.emit(new Event(ApiModelEvent.BEFORE_SAVE, this, {insert: insert}));
        return true;
    }

    /**
     * action after saving data
     * @param oldAttributes
     * @protected
     */
    protected async afterSave(oldAttributes : object) : Promise<void>
    {
        this.emit(new Event(ApiModelEvent.AFTER_SAVE, this, {oldAttributes: oldAttributes}));
    }

    /**
     * Delete data
     */
    public async delete() : Promise<ResponseTransport>
    {
        if (!(await this.beforeDelete())) {
            return new ResponseTransport(false, {});
        }
        const response = await this.transport.deleteOne(this);
        if (response.success) {
            this.clearOldAttributes();
            this._attributes = {};
            await this.afterDelete();
        }
        return response;
    }

    protected async beforeDelete() : Promise<boolean>
    {
        this.emit(new Event(ApiModelEvent.BEFORE_DELETE, this));
        return true;
    }

    protected async afterDelete() : Promise<void>
    {
        this.emit(new Event(ApiModelEvent.AFTER_DELETE, this));
    }

    public async findOne(query : object) : Promise<ResponseTransport>
    {
        if (!(await this.beforeFind(query))) {
            return new ResponseTransport(false, {});
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
}

export enum ApiModelEvent {
    BEFORE_SAVE = 'beforeSave',
    AFTER_SAVE = 'afterSave',
    BEFORE_DELETE = 'beforeDelete',
    AFTER_DELETE = 'afterDelete',
    BEFORE_FIND = 'beforeFind',
    AFTER_FIND = 'afterFind'
}