
import mongoose from "mongoose"; // Importing module 'mongoose' to handle exchanges with the database

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skweez';

mongoose
    .connect(MONGODB_URI)
    .then((x) => {console.log(`Welcome to Mongo! Connection to database ${x.connections[0].name} opened.`);})
    .catch((error) => console.log(`An error has occured while trying to connect: ${error}.`));