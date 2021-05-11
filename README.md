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