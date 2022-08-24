import {attribute} from "../src";
import {ModelEvent} from "../src";
import {BookModel} from "../example/model/book.model";
import {BookCollection} from "../example/model/book.collection";
import {AuthorModel, AuthorCollection} from "../example/model/author.model";
import {entities} from "../src/decorator/meta.entity";

test('check property', async () => {
    const data = {
        id: 123,
        name: 'Author Name',
        books: [
            {
                id: 1,
                name: 'Book 1',
            },
            {
                id: 2,
                name: 'Book 2'
            }
        ]
    };
    const author = new AuthorModel();
    await author.setAttributes(data);
    expect(author.id).toEqual(123);
    expect(author.name).toEqual('Author Name');
    expect(author.books).toBeInstanceOf(BookCollection);
    await author.books?.data;
    expect(author.books?.count).toEqual(2);
});

test('Test set Nested Attributes', async () => {
    const bookData = {
        id: 1,
        name: 'Book Name',
        author: {
            id: 2,
            name: 'Author Name'
        }
    };
    const book = new BookModel();
    await book.setAttributes(bookData);
    expect(book.name).toEqual('Book Name');
    expect(book.author).toBeInstanceOf(AuthorModel);
    expect(book.author?.name).toEqual('Author Name');

    const authorData = {
        id: 1,
        name: 'Author Name',
        books: [
            {id: 1, name: 'Book 1'},
            {id: 2, name: 'Book 2'}
        ],
    };

    const author = new AuthorModel();
    await author.setAttributes(authorData);
    expect(author.name).toEqual('Author Name');
    expect(author.books).toBeInstanceOf(BookCollection);
    expect(author.books?.count).toEqual(2);

});

test('Test Model',() => {
    const booksData = [
        {id: 1, name: 'Harry Porter', author_id: 1, show: 'wrong'},
        {id: 2, name: 'Conan', author_id: 2, show: false}
    ];
    const books = [
        new BookModel(booksData[0]),
        new BookModel(booksData[1])
    ];
    booksData.forEach( async (v, n) => {
        const book = books[n];

        // check attributes
        expect(book.name).toEqual(v.name);
        expect(book.id).toEqual(v.id);
        expect(book.oldAttributes).toEqual({});
        expect(book.getAttribute('name')).toEqual(book.name);
        expect(book.hasAttribute('id')).toBeTruthy();
        expect(book.hasAttribute('show')).toBeFalsy();
        expect(book.attributes).toMatchObject({
            name: v.name
        });

        // check old attributes
        expect(book.name = 'Demon Slayer').toEqual('Demon Slayer');
        expect(book.oldAttributes).toEqual({name: v.name});
        book.reset().then(() => {
            expect(book.oldAttributes).toEqual({});
            expect(book.isDirtyAttribute).toBeFalsy();
        });


        // check property
        expect(book.getAttribute('show')).toEqual(null);
        expect(book.show).toEqual(true);

        // check class function
        expect(book.className).toEqual('BookModel');

        // check load function
        expect(await book.load({non: 'anything'})).toBeFalsy();
        expect(await book.load({id: 3, show: false})).toBeTruthy();
        expect(book.show).toBeTruthy();


        // check event
        let changes = null;
        book.addListeners('eventAdd', (event, m) : void => {
            changes = v.name;
            m.name = v.name;
        });
        book.addListeners(ModelEvent.BEFORE_VALIDATE, (event) => {

        });
        expect(changes).toEqual(null);
        book.emit('eventAdd');
        expect(changes).toEqual(v.name);
        expect(book.name).toEqual(v.name);

        // relation hasOne
        const author = book.author;
        expect(author).toBeInstanceOf(AuthorModel);
        expect(author?.id).toEqual(book.author_id);

        const a = author?.books;
        // relation hasMany
        expect(author?.books).toBeInstanceOf(BookCollection);
        expect(author?.books?.parent).toEqual(author);

        // check validation
        expect(await book.validate()).toBeTruthy();

    });
});

test('Test Collection', async () => {
    // Collection
    const newBooks = new BookCollection();
    expect(newBooks.parent).toBeUndefined();
    expect(newBooks.data).toEqual([]);
    expect(newBooks.count).toEqual(0);
    const book = new BookModel();
    await newBooks.push(book);
    expect(newBooks.count).toEqual(1);

    await newBooks.setData([
        {name: 'Harry Porter'},
        {name: 'Dragon Ball'},
        {name: 'Deamon Slayer'}
    ]);
    // expect(newBooks.count).toEqual(3);

})

test('Test Decorator', () => {
    const attr = attribute();
    // console.log(attr(new Model(), 'hansen'));
    expect(attribute() instanceof Function).toBeTruthy();
});

