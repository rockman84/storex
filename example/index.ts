import {BookModel} from "./model/book.model";
import {Event} from "../src/base/event";
const book = new BookModel({id: '1000', name: 'siti nurbaya', active: 'ikan'});
// book.load();

const book2 = new BookModel();

// book.name = 'Sherlock';

book2.name = 'Harry Porter';
book2.name = 'Wong';
book2.id = 'asdasd';

// console.log('rel many', book.say());

book.addListeners('hello', () => {
    console.log('called event hello');
});
console.log('relation', book.author);


//
//
// console.log(book.hasAttribute('id'));
console.log(book.attributes);
// console.log(book.oldAttributes);
//
//
// console.log(book2.hasAttribute('id'));
// console.log(book2.name);
// console.log(book2.attributes);
// console.log(book2.oldAttributes);
//
// book.emit(new Event('hello', book, {}));
