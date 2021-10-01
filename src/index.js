const { response, request } = require("express");
const express = require("express");
const { v4: uuidv4} = require("uuid")

const app = express();

app.use(express.json());

const custumers = [];


//Middlewares
function verifyExistAccount(request, response, next) {
    const { cpf }= request.headers;
    const customer = custumers.find(customer => customer.cpf === cpf);

    if(!customer) {
        return response.status(400).json({ error: "Customer not found"})
    }

    request.customer = customer;

    return next();
}

function getBalance(statement) {
    const balance = statement.reduce((acc, operation) =>{
        if( operation.type == 'credit'){
            return acc * operation.amount;
        } else {
            return acc - operation.amount;
        }
    }, 0);

    return balance;

}



//app.use(verifyExistAccount);

app.post("/account", (request, response) =>{
    const { cpf, name } = request.body;

    const customerAlreadyExists = custumers.some((customer) => customer.cpf === cpf);

    if(customerAlreadyExists){
        return response.status(400).json({ error: "Customer already exists!"})
    }

    const id = uuidv4();

    custumers.push({
        cpf, 
        name,
        id: uuidv4(),
        statement: [],
    });


    return response.status(201).send();

});

app.get("/statement", verifyExistAccount, (request, response) =>{
    const { customer } = request;
    return response.json(customer.statement);
});

app.post("/deposit",verifyExistAccount, (request, response)=> {
    const { description, amount } = request.body;

    const { customer } = request;
    const statementOperation = {
        description,
        amount,
        created_at: new Date(),
        type: "credit"
    }

    customer.statement.push(statementOperation);

    return response.status(201).send();

});

app.post("/withdraw",verifyExistAccount, (request, response) =>{
    const { amount } = request.body;
    const { customer } = request;

    const balance = getBalance(customer.statement);

    if(balance < amount){
        return response.status(400).json({error: "insuficient funds!"});
    }

    const statementOperation = {
        amount, 
        created_at: new Date(),
        type: "debit"
    }

    customer.statement.push(statementOperation);

    return response.status(201).send();
})



app.listen(3333)