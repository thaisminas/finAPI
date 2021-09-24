const { response } = require('express');
const express = require('express');

const app = express();

app.use(express.json());

app.get('/courses', (request, response) => {
    return response.json(["curso 1", "curso 2", "curso 3"]);
});

app.post('/courses', (request, response) => {
    return response.json(["curso 1", "curso 2", "curso 3"]);
});

app.put('/courses/:id', (request, response) => {
    return response.json(["curso 6", "curso 2", "curso 3"]);
});

app.patch('/courses/:id', (request, response) => {
    return response.json(["curso 6", "curso 2", "curso 3"]);
});

app.delete('/courses/:id', (request, response) => {
    return response.json(["curso 6", "curso 2", "curso 3"]);
});


app.listen(3333)