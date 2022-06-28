import {FetchTransport} from "../src/transport/fetch.transport";
import 'isomorphic-fetch';
import {BookModel} from "../example/model/book.model";
import {AuthorModel} from "../example/model/author.model";
import {AuthorCollection} from "../example/model/author.collection";


test('Fetch', async () => {
    const author = new AuthorModel({
        name: 'Hansen Keren',
    });
    let result = await author.save(['id', 'name']);
    console.log(author.errors);
    expect(result.success).toBeTruthy();
    expect(author.errors).toEqual({});
    expect(author.id).toBeDefined();

    author.name = 'Hans';

    result = await author.save();
    expect(result.success).toBeFalsy();
    console.log(author.errors);
    console.log(author.attributes);

    const newAuthor = await AuthorModel.findOne({});
    console.log(newAuthor.attributes);

    const authors = await AuthorCollection.findAll({page:7});
    console.log(authors.pagination);

});