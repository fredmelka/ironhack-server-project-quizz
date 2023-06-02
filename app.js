
import 'dotenv/config.js';                              // Importing module 'dotenv' to get access to environment variables and settings
import './db/index.js';                                 // Importing connection to the database
import express from 'express';                          // Importing module 'express' (express is a node.js framework) to drive server management
import indexRoutes from './routes/index.routes.js';     // Importing the root of the routes
import configuration from './config/index.js';          // Importing configuration function to handle express instance uses
import errorManager from './errors/index.js';           // Importing error management function to handle error management


const app = express();
configuration(app);

// Setting default value for local title
const projectName = 'Skweez me!';
const capitalize = (string) => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalize(projectName)} - powered by Fred MELKA`;

// Initiating Server Routing
app.use('/', indexRoutes);

errorManager(app);

export default app;