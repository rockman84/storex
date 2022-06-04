import {BookModel} from "./model/book.model";

const book = new BookModel();
book.load({id: '1000', name: 'siti nurbaya', status: 'ikan'});

const book2 = new BookModel();

// book.name = 'Sherlock';

book2.name = 'Harry Porter';
book2.name = 'Wong';
book2.id = 'asdasd';

console.log(book.hasAttribute('id'));
console.log(book.name);
console.log(book.attributes);
console.log(book.oldAttributes);


console.log(book2.hasAttribute('id'));
console.log(book2.name);
console.log(book2.attributes);
console.log(book2.oldAttributes);

