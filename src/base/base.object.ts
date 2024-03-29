import {Event} from "./event";

export interface BaseObjectInterface {
    className: string;
    listeners: object;
    emit(emit: string) : void;
}

export class BaseObject implements BaseObjectInterface {

    /**
     * listeners mapping
     * @protected
     */
    protected _listeners : object = {};

    /**
     * get class name
     */
    public get className() : string
    {
        return this.constructor.name;
    }

    /**
     * get all listeners
     */
    public get listeners() : object
    {
        return this._listeners;
    }

    /**
     * add listeners
     * @param name
     * @param callers
     */
    public addListeners(name : string, callers : (e: Event|string, object: this) => void) : void
    {
        if (typeof (this._listeners as any)[name] === 'undefined') {
            (this._listeners as any)[name] = [];
        }
        (this._listeners as any)[name].push(callers);
    }

    /**
     * trigger listeners event
     * @param event
     */
    public emit(event : BaseObjectEvent|Event|string) : void
    {
        const name = event instanceof Event ? event.name : event;
        if (typeof (this.listeners as any)[name] === 'undefined') {
            return;
        }
        for (const key of Object.keys((this.listeners as any)[name]) ) {
            (this.listeners as any)[name][key](event, this);
        }
    }
}

/**
 * Event of BaseObject
 */
export enum BaseObjectEvent {
    CHANGED_ATTRIBUTE = 'changedAttribute',
    BEFORE_LOAD = 'beforeLoad',
    AFTER_LOAD = 'afterLoad',
}