
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

mongoose
    .connect(MONGODB_URI)
    .then((x) => {console.log(`Welcome to Mongo! Connection to database ${x.connections[0].name} opened.`);})
    .catch((error) => console.log(`An error has occured while trying to connect: ${error}.`));