import dotenv from 'dotenv';
dotenv.config();
import server from './server';
import { connectDatabase } from './database';
connectDatabase().then(() => {
  server.listen(process.env.PORT, () => {
    console.log(`Application Started on port ${process.env.PORT}`);
  });
})

