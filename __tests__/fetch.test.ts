import {FetchTransport} from "../src/transport/fetch.transport";
import 'isomorphic-fetch';
import {BookModel} from "../example/model/book.model";
import {AuthorModel} from "../example/model/author.model";


test('Fetch', async () => {
    const author = new AuthorModel({
        name: 'Hansen Keren',
    });
    let result = await author.save();
    expect(result).toBeTruthy();
    expect(author.errors).toEqual({});
    expect(author.id).toBeDefined();

    author.name = 'Hans';
    result = await author.save();
    expect(result).toBeTruthy();
});