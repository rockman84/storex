import {Model} from "./model";
import {TransportInterface} from "./transport/transport.interface";
import {FetchTransport} from "./transport/fetch.transport";

export class ApiModel extends Model
{
    get transport() : TransportInterface
    {
        return new FetchTransport('http://api.iweb.dev.id:90/example/author');
    }

    public async save() : Promise<boolean>
    {
        if (!(await this.validate()) || !(await this.beforeSave(this._isNew))) {
            return false;
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
        return response.success;
    }

    public async beforeSave(insert : boolean) : Promise<boolean>
    {
        return true;
    }

    public async afterSave(oldAttributes : object) : Promise<void>
    {
        return;
    }

    public async delete()
    {
        this.clearOldAttributes();
        this._attributes = {};
    }

    public async find()
    {

    }
}