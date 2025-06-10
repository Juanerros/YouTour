const express = require('express');
const createConnection = require('./conex');

const handleError = (res, message, err = null, status = 500) => {
    if (err) console.error(message, err);
    else console.log(message);
    res.status(status).send({ message });
};

module.exports = {
    createConnection,
    express,
    handleError
};