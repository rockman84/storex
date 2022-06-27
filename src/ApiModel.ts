import {Model} from "./model";
import {TransportInterface} from "./transport/transport.interface";
import {FetchTransport} from "./transport/fetch.transport";
import {ResponseTransport} from "./transport/response.transport";
import {attribute} from "./decorator/attribute";

export class ApiModel extends Model
{
    get transport() : TransportInterface
    {
        return new FetchTransport('http://api.iweb.dev.id:90/example/author');
    }

    public async save() : Promise<ResponseTransport>
    {
        if (!(await this.validate()) || !(await this.beforeSave(this._isNew))) {
            return new ResponseTransport(false, {});
        }
        const response = this._isNew ?
            await this.transport.createOne(this) :
            await this.transport.updateOne(this);
        if (response.success) {
            this._isNew = false;
            this.setAttributes(response.data);
            await this.afterSave(this._oldAttributes);
            this.clearOldAttributes();
        }
        return response;
    }

    public async beforeSave(insert : boolean) : Promise<boolean>
    {
        return true;
    }

    public async afterSave(oldAttributes : object) : Promise<void>
    {
        return;
    }

    public async delete() : Promise<ResponseTransport>
    {
        const response = await this.transport.deleteOne(this);
        if (response.success) {
            this.clearOldAttributes();
            this._attributes = {};
        }
        return response;
    }

    public async find(query : object|string) : Promise<ResponseTransport>
    {
        const response = await this.transport.getOne(this);
        if (response.success) {
            this._isNew = false;
            this.clearOldAttributes();
            this.setAttributes(response.data);
        }
        return response;
    }

    public static async findOne(query: object)
    {
        const model = new this();
        await model.find(query);
        return model;
    }
}