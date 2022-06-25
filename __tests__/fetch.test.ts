import {FetchTransport} from "../src/transport/fetch.transport";
import 'isomorphic-fetch';
import {BookModel} from "../example/model/book.model";
import {AuthorModel} from "../example/model/author.model";


test('Fetch', async () => {
    const transport = new FetchTransport('http://api.iweb.dev.id:90/example/author/create');
    // const request = transport.createRequest();
    // const response = await fetch(request);
    // expect(response.status).toEqual(200);

    const book = new BookModel({
        name: 'Harry Porter'
    });
    const author = new AuthorModel({
        name: 'Han',
    });
    const responseAuthor = await transport.create(author);
    if (responseAuthor instanceof Response) {
        console.log(responseAuthor.status);
    }


    console.log('erros', author.errors);
    console.log(author.getError('name')[0]);
    console.log('old', author.oldAttributes);


});