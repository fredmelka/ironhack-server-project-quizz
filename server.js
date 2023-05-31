
import app from './app.js';

const PORT = process.env.PORT;
const SERVER_URL = process.env.MONGODB_URI;

app.listen(PORT, () => {console.log(`Server is running at address ${SERVER_URL}:${PORT}`);});