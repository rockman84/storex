export class ResponseTransport {
    public readonly success : boolean;
    public readonly data: object;
    constructor(success : boolean, data : object) {
        this.success = success;
        this.data = data;
    }
}