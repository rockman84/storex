# storex
Centralized Store Management

### Model
``` typescript
// author.model.ts
class Author extends Model
{
    @attribute()
    id? : number;
    
    @attribute()
    name? : string;
}

// booksa.ts
class Booksa extends Model
{
    @attribute()
    id? : number;
    
    @attribute()
    name? : string;
    
    @hasOne()
    author? : AuthorModel
}
```

### Collection

```typescript
// book.collection.ts
import {Collection} from "./collection";

class BookCollection extends Collection
{
    
}

// author.collection.ts
class AuthorCollection extends Collection
{
    
}
```


### Validation Rule
```typescript
class Comment extends Model {
    attributes() {
        return {
            id: null,
            user_id : null,
            message: null,
        }
    },
    rule() {
        return {
            id: [
              {type: 'integer'},
              {type: 'required},
            ],
            user_id: [
              {type: 'integer'},
              {type: 'required'}
            ],
            message: [
              {type: 'string', min: 5, max: 100},
            ]
        }
    }
}

```

### Usage
```typescript
import {AuthorModel} from "./author.model";

const author = new AuthorModel({name: 'JK Rowling'});

console.log(author.name); // JK Rowling

author.name = 'Jason Mayer'
console.log(author.name); // Jason Mayer

author.reset();
console.log(author.name) //  JK Rowling

```
