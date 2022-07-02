import {FetchTransport} from "../src/transport/fetch.transport";
import 'isomorphic-fetch';
import {AuthorModel, AuthorCollection} from "../example/model/author.model";

test('Fetch', async () => {

    // fetch transport components
    const fetch = new FetchTransport('http://localhost');
    const url = fetch.createUrl('author/{id}/{first_name}', {id:123, first_name: 'harry', status: true, type: 'book'})
    expect(url).toEqual('http://localhost/author/123/harry?status=true&type=book');

    const author = new AuthorModel({
        name: 'JK Rowling',
    });

    // save
    let result = await author.save(['id', 'name']);
    expect(result.success).toBeTruthy();
    expect(author.errors).toEqual({});
    expect(author.id).toBeDefined();

    // update
    author.name = 'JK';
    result = await author.save();
    expect(result.success).toBeFalsy();
    author.name = 'Johnny Deep';
    result = await author.save();
    expect(result).toBeTruthy();


    // find one
    const newAuthor = await AuthorModel.findOne(author.getAttributesBy(['id']));

    // find all
    const authors = await AuthorCollection.findAll({page:4});
    expect(authors.count).toEqual(authors.pagination.pageSize);

    // delete
    const resultDelete = await newAuthor.delete();
    expect(resultDelete.success).toBeTruthy();

});