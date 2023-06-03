
import express from 'express';      // Importing module 'express' to get acces to 'body' property in requests
import cors from 'cors';            // Importing module 'cors' to enable some external connections (prevented by default). 
import logger from 'morgan';        // Importing module 'morgan' to handle messages in the terminal when requests come in

const FRONTEND_URL = process.env.ORIGIN || 'http://localhost:5173';

// Middleware Configuration function
export default function configuration (app) {
    app.use(logger('dev'));
    app.use(cors({credentials: true, origin: FRONTEND_URL}));
    app.use(express.json());
    app.use(express.urlencoded({extended: false}));
    // app.use('/static', express.static(__dirname + '/public'));
};