
import express from 'express';
import logger from 'pino-http';
import cors from 'cors';
import "dotenv/config"

import { getContacts, getContactById } from './services.js/contacts.js';

export function setupServer() {
    const app = express();
    const {PORT} =process.env;

  app.use(cors());

  app.use(
    logger({
      transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
          },
      },
    }),
  );

  app.get("/api/contacts", async (req, res) => {
   const data =await getContacts();

   res.json({
       status: 200,
       message: "Successfully found contacts!",
       data, // дані, отримані в результаті обробки запиту
   });
  });

  // eslint-disable-next-line no-unused-vars
  app.get("/api/contacts/:contactId", async (req, res, next) => {
    const {contactId} = req.params;
    const data = await getContactById(contactId);

    if(!data) {
        return res.status(404).json({
            status: 404,
            message: `Contact with id ${contactId} not found!`,            
        });
    }

    res.json({
        status: 200,
	    message: "Successfully found contact with id {contactId}!",
	    data,
});
  });

  // eslint-disable-next-line no-unused-vars
  app.use('*', (req, res, next) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
