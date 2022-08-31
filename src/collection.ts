import {Model} from "./model";
import {BaseObject} from "./base/base.object";
import {Event} from "./base/event";

export class Collection<T = undefined> extends BaseObject
{
    private readonly _parent? : T|undefined;

    private _data : typeof Model[] = [];

    private _removed : typeof Model[] = [];

    protected modelClass : typeof Model = Model;

    public get parent() : T|undefined
    {
        return this._parent;
    }

    public constructor(parent? : T) {
        super();
        this._parent = parent;
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
    public async setData(data : object[])
    {
        this.clearData();
        for (const value of data) {
            if (value instanceof this.modelClass) {
                await this.push(value);
            } else {
                const model = new this.modelClass();
                await model.setAttributes(value);
                await this.push(model);
            }
        }
    }

    /**
     * convert to json
     */
    public toJson()
    {
        const data:[] = [];
        this.data.forEach((model) => {
            // @ts-ignore
            return data.push((model.toJson()));
        });
        return data;
    }

    /**
     * clear all data item
     */
    public clearData() : void
    {
        this._data = [];
        this._removed = [];
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

    public indexOf(search: any, fromIndex? : number)
    {
        return this._data.indexOf(search, fromIndex);
    }

    async beforeRemove(item: typeof Model) {
        return true;
    }

    async afterRemove(item: typeof Model) {
        return true;
    }

    async remove(predicate: (value : any, index?: number) => boolean) : Promise<typeof Model[]>
    {
        const newItems = [];
        for (const item of this._data) {
            if (predicate(item) && await this.beforeRemove(item)) {
                this._removed.push(item);
                await this.afterRemove(item);
            } else {
                newItems.push(item)
            }
        }
        this._data = newItems;
        return this._removed;
    }

    public async validateAll() : Promise<boolean>
    {
        let valid = true;
        for (const item of this._data) {
            // @ts-ignore
            valid = await item.validate() && valid;
        }
        return valid;
    }
}

export enum CollectionEvent {
    BEFORE_PUSH = 'beforePush',
    AFTER_PUSH = 'afterPush',
    BEFORE_REMOVE = 'beforeRemove',
    AFTER_REMOVE = 'afterRemove',
}