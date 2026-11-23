# AdonisJS

### MVC Recap

1. **Defining the routes** → bind controllers to them and write logic to handle the HTTP requests within the controllers.
2. **Controllers** → use models to fetch data from the database and return a JSON response 
3. **Models** → Classes to interface with the database layer 

## Starting Project

`npm init adonisjs@latest hello-world -- --kit=api --auth-guard=access_tokens`

`node ace serve --hmr`

## File Structure

- The `bin/server.ts` file boots the application in the web environment to listen for HTTP requests.
- The `bin/console.ts` file boots the Ace commandline and executes commands.
- The `bin/test.ts` file boots the application to run tests.

# Routing

Explicit Param Validation via `where` params can be casted to their respective type with `cast`

```python
import router from '@adonisjs/core/services/router'

router
  .get('/posts/:id', ({ params }) => {})
  .where('id', {
    match: /^[0-9]+$/,
    cast: (value) => Number(value),
  })

```

```python
import router from '@adonisjs/core/services/router'

// Validate id to be numeric + cast to number data type
router.where('id', router.matchers.number())

// Validate id to be a valid UUID
router.where('id', router.matchers.uuid())

// Validate slug to match a given slug regex: regexr.com/64su0
router.where('slug', router.matchers.slug())

```

### Middleware

```python
  .use((_, next) => {
    console.log('Inside middleware')
    return next()
  })
```

### Prefix

```python
router
  .group(() => {
    router.get('users', () => {})
    router.get('payments', () => {})
  })
  .prefix('/api')

```