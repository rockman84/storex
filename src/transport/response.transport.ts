export class ResponseTransport {
    public readonly success : boolean;
    public readonly data: object|object[];
    public protocol: any;
    public error: any;

    constructor(success : boolean, data : object, protocol? : any) {
        this.success = success;
        this.data = data;
        this.protocol = protocol;
    }
}