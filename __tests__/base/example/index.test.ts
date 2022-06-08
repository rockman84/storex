import {BookModel} from "../../../example/model/book.model";

test('Test Book', () => {
    const booksData = [
        {id: 1, name: 'Harry Porter', show: 'wrong'},
        {id: 2, name: 'Conan', show: false}
    ];
    const books = [
        new BookModel(booksData[0]),
        new BookModel(booksData[1])
    ];
    booksData.forEach((v, n) => {
        const book = books[n];

        // check attributes
        expect(book.name).toEqual(v.name);
        expect(book.id).toEqual(v.id);
        expect(book.getAttribute('name')).toEqual(book.name);
        expect(book.hasAttribute('id')).toBeTruthy();
        expect(book.hasAttribute('show')).toBeFalsy();
        expect(book.attributes).toMatchObject({
            name: v.name
        });

        // check property
        expect(book.getAttribute('show')).toEqual(null);
        expect(book.show).toEqual(true);

        // check base function
        expect(book.className).toEqual('BookModel');

        // check event
        let changes = null;
        book.addListeners('eventAdd', () : void => {
            changes = book.name + ' - Part 1'
        });
        expect(changes).toEqual(null);
        book.emit('eventAdd');
        expect(changes).toEqual(v.name + ' - Part 1');
    });
})