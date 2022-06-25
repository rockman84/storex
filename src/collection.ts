import {Model} from "./model";
import {BaseObject} from "./base/base.object";
import {Event} from "./base/event";

export class Collection extends BaseObject
{
    private _parent? : typeof Model|null;

    private _data : typeof Model[] = [];

    protected modelClass: typeof Model = Model;

    public get parent()
    {
        return this._parent;
    }

    /**
     * get data item
     */
    public get data() : typeof Model[]
    {
        return this._data;
    }

    /**
     * set new dataset item
     * @param data
     */
    public set data(data : object[])
    {
        this.clearData();
        data.forEach(async (value) => {
            if (value instanceof this.modelClass) {
                await this.push(value);
            } else {
                await this.push(new this.modelClass(value));
            }
        });
    }

    /**
     * clear all data item
     */
    public clearData() : void
    {
        this._data = [];
    }

    /**
     * count data items
     */
    public get count()
    {
        return this._data.length;
    }

    /**
     * push item to data
     * @param item
     */
    public async push(item : Model) : Promise<Model|null>
    {
        if (await this.beforePush(item)) {
            this._data.push((item as any));
            await this.afterPush(item);
            return item;
        }
        return null;
    }

    /**
     * event before push item to data
     * @param item
     */
    public async beforePush(item : Model) : Promise<boolean>
    {
        this.emit(new Event(CollectionEvent.BEFORE_PUSH, this, item));
        return true;
    }

    /**
     * event after push item to data
     * @param item
     */
    public async afterPush(item : Model) : Promise<void>
    {
        this.emit(new Event(CollectionEvent.AFTER_PUSH, this, item));
        return;
    }

    public validateAll() : boolean
    {
        let valid = true;
        this._data.forEach(async (item : any, index : number) => {
            valid = await item.validate() && valid;
        });
        return valid;
    }
}

export enum CollectionEvent {
    BEFORE_PUSH = 'beforePush',
    AFTER_PUSH = 'afterPush'
}