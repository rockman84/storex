import {attribute} from "../../../src";
import {ModelEvent} from "../../../src";
import {BookModel} from "../../../example/model/book.model";
import {AuthorModel} from "../../../example/model/author.model";
import {BookCollection} from "../../../example/model/book.collection";
import {AuthorCollection} from "../../../example/model/author.collection";

test('Test Model',() => {
    const booksData = [
        {id: 1, name: 'Harry Porter', author_id: 1, show: 'wrong'},
        {id: 2, name: 'Conan', author_id: 2, show: false}
    ];
    const books = [
        new BookModel(booksData[0]),
        new BookModel(booksData[1])
    ];
    booksData.forEach( (v, n) => {
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
        expect(book.clearOldAttributes()).toBeUndefined();
        expect(book.oldAttributes).toEqual({});

        // check property
        expect(book.getAttribute('show')).toEqual(null);
        expect(book.show).toEqual(true);

        // check class function
        expect(book.className).toEqual('BookModel');

        // check load function
        expect(book.load({non: 'anything'})).toBeFalsy();
        expect(book.load({id: 3, show: false})).toBeTruthy();
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

        // relation hasMany
        expect(author?.books).toBeInstanceOf(BookCollection);
        expect(author?.books?.parent).toEqual(author);

        // check validation
        //expect(book.validate()).toBeTruthy();
    });
});

test('Test Collection', () => {
    // Collection
    const newBooks = new BookCollection();
    expect(newBooks.parent).toBeUndefined();
    expect(newBooks.data).toEqual([]);
    expect(newBooks.count).toEqual(0);

})

test('Test Decorator', () => {
    const attr = attribute();
    // console.log(attr(new Model(), 'hansen'));
    expect(attribute() instanceof Function).toBeTruthy();
});
