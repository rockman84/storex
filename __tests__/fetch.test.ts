import {FetchTransport} from "../src/transport/fetch.transport";
import 'isomorphic-fetch';
import {BookModel} from "../example/model/book.model";
import {AuthorModel} from "../example/model/author.model";


test('Fetch', async () => {
    const author = new AuthorModel({
        name: 'Hansen Keren',
    });
    let result = await author.save();
    expect(result.success).toBeTruthy();
    expect(author.errors).toEqual({});
    expect(author.id).toBeDefined();

    author.name = 'Hans asasas';

    result = await author.save();
    expect(result.success).toBeTruthy();
    console.log(author.errors);
    console.log(author.attributes);
    const url = new URLSearchParams((author.attributes as any));
    console.log(url.toString());
});