<template>
  <div class="about">
    <h1>Author: {{author.name}}</h1>
    <form @submit:.prevent>
      <p>Name: <input v-model="author.name"></p>
      <a @click="onResetAuthor" v-if="author.isDirtyAttribute" href="#">Reset</a>
    </form>

    <h1>Add Book: {{bookModel.name}}</h1>
    <form @submit.prevent>
      <input v-model="bookModel.name">
      <button @click="onAddBook">Add Book</button>

    </form>

    Total Books : {{books.count}}

    <ul v-for="book in books.data">
      <li>{{book.name}}</li>
    </ul>
  </div>
</template>
<script>
import {BookModel} from "../../../../model/book.model";
import {BookCollection} from "../../../../model/book.collection";
import {AuthorModel} from "../../../../model/author.model";

export default {
  data() {
    const author = new AuthorModel({name: 'JK Rowling'});
    return {
      bookModel: new BookModel(),
      author: author,
      books: author.books,
    };
  },
  methods: {
    onAddBook() {
      console.log('valid', this.books.validateAll());
      this.bookModel.id = Math.random();
      this.books.push(this.bookModel);
      this.bookModel = new BookModel();
    },
    onResetAuthor() {
      this.author.reset();
    }
  }
}
</script>
