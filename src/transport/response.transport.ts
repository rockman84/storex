export class ResponseTransport {
    public readonly success : boolean;
    public readonly data: object|object[];
    public protocol: any;
    public error: any;

    constructor(success : boolean, data : object) {
        this.success = success;
        this.data = data;
    }
}