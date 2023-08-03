'use strict';
const http = require('node:http');

const port = 9999;
const statusOk = 200;
const statusBadRequest = 400;
const statusNotFound = 404;

let nextId = 1;
const posts = [];

const methods = new Map();
methods.set('/posts.get', function(request, response) {
    response.writeHead(statusOk, {'Content-Type': 'application/json'});
    response.end(JSON.stringify(posts));
});
methods.set('/posts.getById', function(request, response) {});
methods.set('/posts.post', function(request, response) {
    const url = new URL(request.url, `http://${request.headers.host}`);
    const searchParams = url.searchParams; 
    
    if (!searchParams.has('content')) {
        response.writeHead(statusBadRequest);
        response.end();
        return;
    }

    const content = searchParams.get('content');

    const post = {
        id: nextId++,
        content: content,
        created: Date.now(),
    };

    posts.unshift(post);
    response.writeHead(statusOk, {'Content-Type': 'application/json'});
    response.end(JSON.stringify(post));

});
methods.set('/posts.edit', function(request, response) {});
methods.set('/posts.delete', function(request, response) {});

const server = http.createServer(function (request, response) {
       const url = new URL(request.url, `http://${request.headers.host}`);
       const pathname = url.pathname;       

       const method = methods.get(pathname);
       if (method === undefined) {
            response.writeHead(statusNotFound);
            response.end();
            return;
       }

       method(request, response);
});

server.listen(port);

// class Demo {
//     get property() {
//         console.log('get');
//         return 'property';
//     }
//     set property(value) {
//         console.log(`set ${value}`);
//     }
// }

// const demo = new Demo();
// const property = demo.property;
// demo.property = 'new value';