import BlogPost from "@/components/storex/example/models/BlogPost";

const blog = new BlogPost({
  title: 'No title',
});

console.log(blog.title); // No title

blog.title = 'My First Blog'
console.log(blog.title); //

blog.validate() // return false
