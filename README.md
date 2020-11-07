# storex
Centralized Store Management

### model
```
class User extends Model
{
    attributes() {
        return {
            id: null,
            email: null,
            username: null,
        };
    }
    get comment()
    {
        return this.hasMany(Comment, {user_id: this.id}, 'comment);
    }
}

class Comment extends Model {
    attributes() {
        return {
            id: null,
            user_id : null,
            message: null,
        }
    }
}

```

```
let user = new User({
    id: 1,
    email: 'sample@email.com',
    username: 'john_xs' 
});

user.email // sample@email.com
user.email = 'my@email.com' // my@email.com
user.comment.push(new Comment({
    id: 1,
    message: 'Hi There!',
}));

console.log(user.comment.data);

```
