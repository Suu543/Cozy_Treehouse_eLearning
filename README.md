# Cozy_Treehouse_eLearning
Cozy_Treehouse_eLearning

## Part-1: Client Setup
```javascript
mkdir client
cd client
npm init -y
npm install next react react-dom

/*
_app.js
- Next.js uses the App component to initialize pages.
- This app component runs before any page gets ready for users to see
- This is a perfect place to add your bootstrap css so that it is available for the
- IMPORTANT = Restart the server
*/

// Bootstrap and ant design
npm i bootstrap antd
https://ant.design/

npm i @ant-design/icons
```
## Part-2: Server Setup
```javascript
npm i bcrypt cors dotenv esm express jsonwebtoken mongoose morgan nodemon

// package.json
"start": "nodemon -r esm server.js"
```
## Part-3: Axios Post Request
```javascript
npm i axios
```

## Part-4: User Model + Bcrypt Helper Functions
```javascript
models/user.js
utils/auth.js
```

## Part-5: Registration
```javascript
// Toast Alert
npm i react-toastify

// Loading Spinner
Slow 3G - Throttling

// Env and gitignore files
// Custom next dev server (for dev mode only)
/*
Nextjs setup custom server
- to use cookie based auth system we need to have both client and server running on same origin/domain
- We need to use proxy for that because our client/nextjs is running on 3000
- and our server is running on 8000

Use Proxy in nextjs
- To use proxy we need to create custom server,
- This is only for development mode
- In production, we will use same origin/domain so we don't have to worry about it.
- We can simply run build then start next app

*/
// Client 
npm i http-proxy-middleware
https://nextjs.org/docs/advanced-features/custom-server
```
## Part-6: Login
```javascript
/*
Server
- To login user we need to check if user's password is correct
- We need to take user's password, hash it then compare with the hashed password with the saved one
- Then we need to generate jsonwebtoken / JWT and send it to client
- This will be used to access protected routes

npm i jsonwebtoken
*/
```

## Part-7: Global State, CSRF, axios interceptors and protected routes
Axios Interceptors:
- Axios interceptors are functions that Axios calls for every request. You can use intereptors to transform the request before Axios sends it,
- or transform the response before Axios returns the response to your code. You can think of interceptors as Axios equivalent to middleware in Express or Mongoose

What is CSRF (Cross-Site Request Forgery)?
- https://www.synopsys.com/glossary/what-is-csrf.html
```javascript
npm i csurf
```

Protected Route
- Create a protected page and restrict only to logged in user with valid token
- To verify if token is valid, you need to send request to backend (Browser will include cookie token in headers automatically)
- If you get successful response then you can show the protected page to the user
```javascript
npm i express-jwt
```