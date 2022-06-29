/**
 * Action list
 */
export enum Action {
    CREATE_ONE = 'createOne',
    UPDATE_ONE = 'updateOne',
    DELETE_ONE = 'deleteOne',
    GET_ONE = 'getOne',
    GET_MANY = 'getMany',
}

export class ResponseTransport {
    /**
     * action name @see enum Action
     */
    public readonly action : Action;

    /**
     * is success response
     */
    public readonly success : boolean;

    /**
     * data return
     */
    public readonly data: object|object[];

    /**
     * protocol instance
     */
    public readonly protocol: any;

    constructor(action: Action, success : boolean, data : object, protocol? : any) {
        this.action = action;
        this.success = success;
        this.data = data;
        this.protocol = protocol;
    }
}