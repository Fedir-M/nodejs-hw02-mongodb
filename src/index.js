// src/index.js
import { initMongoConnection } from './db/initMongoConnection.js';

import { setupServer } from './server.js';



const bootstrap = async () => {
    await initMongoConnection(); // Initialize MongoDB connection
    setupServer(); // Setup the server
}

bootstrap()