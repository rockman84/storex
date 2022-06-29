import {FetchTransport} from "../src/transport/fetch.transport";
import 'isomorphic-fetch';
import {BookModel} from "../example/model/book.model";
import {AuthorModel} from "../example/model/author.model";
import {AuthorCollection} from "../example/model/author.collection";


test('Fetch', async () => {

    // fetch transport components
    const fetch = new FetchTransport('http://localhost');
    const url = fetch.createUrl('author/{id}/{name}', {id:123, name: 'harry', status: true, type: 'book'})
    expect(url).toEqual('http://localhost/author/123/harry?status=true&type=book');

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

    const newAuthor = await AuthorModel.findOne({id: '00bd0e94-f4c0-11ec-9295-0242ac140002'});

    console.log('findOne', newAuthor.attributes);

    const authors = await AuthorCollection.findAll({page:7});
    expect(authors.count).toEqual(authors.pagination.pageSize);
    console.log(authors.pagination);

});