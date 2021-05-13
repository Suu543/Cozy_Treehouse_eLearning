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

## Part-8: Sending Email and Password Reset
```javascript
npm i aws-sdk

```
How Password reset works?
1. User will enter email address
2. You will find that user based on email address from DB
3. If found, you will create password reset code
4. Then you will save that code in DB and also send to that user's email
5. If this is the correct user, he will have access to his email
6. He can copy that copy and paste in the form, enter new password then hit submit
7. On submit, our server will receive the user's email and code
8. You will try to find the user based on the email and code
9. If found, update his old password with new one and reset code back to empty
10. Done...

```javascript
npm i nanoid
```

## Part-9: Stripe OnBoarding
SETUP Stripe Payment
- Use stripe connect (check supported countries)
- Receive payment from users
- Automate the payment distribution
- 70% to sellers (instructors) and keep 30% as platform fee
- Get paid every 48 hours directly to bank account by strip

Conditional links and pages
- In topNav, show a link
- If user role includes 'Instructor', show link that says 'Create Course'
- Else show link that says 'Become Instructor'

Stripe Callback Page
- Once user completes onboarding process
- He gets redirected back to /stripe/callback
- Use useEffect to make request to backend to fetch the updated user info from stripes
- This updated info must have payment_enabled set to true 