# A project Nodejs backend architecture E-commerce

> Author: Tuantq - quoctuanit2018@gmail.com
---

> #### **Documents:**
> - [*Connect MongoDB to Node.js Using Mongoose and 7 things to implement in the system*](./docs/7_things_when_connect_mongodb.md)


#### Run this project
```
node --watch server.js
```

#### Packages install in this project:
- **Express.js** is a web application framework for Node.js,designed to simplify the process of building robust and scalable web applications and APIs
    ```
    npm i express --save
    ```
- **Morgan** is a popular middleware for Node.js web applications that provides HTTP request logging
    ```
    npm i morgan --save-dev
    ```
- **Helmet** is a popular package for securing Express.js applications by setting various HTTP headers
    ```
    npm install helmet --save-dev
    ```
- **Compression** is commonly used in Node.js applications to enable gzip compression for HTTP responses, which helps in reducing the size of the data sent over the network.
    ```
    npm i compression --save-dev
    ```
- **Mongoose** is an ODM (Object-Document Mapper) for MongoDB and is commonly used with Node.js applications.
    ```
    npm install mongoose
    ```    
- **dotenv** package is commonly used in Node.js applications to load environment variables from a .env file into process.env.
    ```
    npm install dotenv
    ```