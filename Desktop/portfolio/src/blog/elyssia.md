# Elyssia

**Context** can be only retrieve in a route handler, consists of:

- **path** - Pathname of the request
- **body** - [**HTTP message**](https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages), form or file upload.
- **query** - [**Query String**](https://en.wikipedia.org/wiki/Query_string), include additional parameters for search query as JavaScript Object. (Query is extracted from a value after pathname starting from '?' question mark sign)
- **params** - Elysia's path parameters parsed as JavaScript object
- **headers** - [**HTTP Header**](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers), additional information about the request like User-Agent, Content-Type, Cache Hint.
- **request** - [**Web Standard Request**](https://developer.mozilla.org/en-US/docs/Web/API/Request)
- **redirect** - A function to redirect a response
- **store** - A global mutable store for Elysia instance
- **cookie** - A global mutable signal store for interacting with Cookie (including get/set)
- **set** - Property to apply to Response:
    - **status** - [**HTTP status**](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status), defaults to 200 if not set.
    - **headers** - Response headers
    - **redirect** - Response as a path to redirect to
- **error** - A function to return custom status code
- **server** - Bun server instance

## Important Things

### Derive

**Derive** → Retrieve values from existing properties in **Context** and assign an new properties.

**derive** can access request properties like **headers**, **query**, **body** where **store**, and **decorate** can't.

- Create a new property from existing properties in **Context** without validation or type checking
- When you need to access request properties like **headers**, **query**, **body** without validation

### Resolve

Resolve is called at **beforeHandle** lifecycle or **after validation**, allowing us to **derive** request properties safely.

### **When to use[​](https://elysiajs.com/essential/handler.html#when-to-use-3)**

- Create a new property from existing properties in **Context** with type integrity (type checked)
- When you need to access request properties like **headers**, **query**, **body** with validation

### Decorate

Called directly At Call Time, assigns additional properties 

- A constant or readonly value object to **Context**
- Non primitive value or class that may contain internal mutable state
- Additional functions, singleton, or immutable property to all handlers

### **Macro[​](https://elysiajs.com/essential/handler.html#macro)**

Macro allows us to define a custom field to the hook.

```jsx
const plugin = new Elysia({ name: 'plugin' })
    .macro(({ onBeforeHandle }) => ({
        hi(word: string) {
            onBeforeHandle(() => {
                console.log(word)
            })
        }
    }))
    

const app = new Elysia()
    .use(plugin)
    .get('/', () => 'hi', {
        hi: 'Elysia'
    })
```

on the app side… 

Declaring we want to use the “plugins” provided. Within the plugins macro thing, we only contain one plugin called “hi” that accepts an arguement. 

As another parameter, we specify that we want to call hi and pass in the argument