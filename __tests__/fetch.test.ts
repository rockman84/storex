import {FetchTransport} from "../src/transport/fetch.transport";

test('Fetch', async () => {
    const transport = new FetchTransport('http://localhost:90');
    const request = transport.createRequest();
    console.log(request.url);
    const response = await fetch(request);
    console.log(response.status);
});