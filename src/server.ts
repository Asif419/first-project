import config from './app/config';
import app from './app';
import mongoose from 'mongoose';
import { Server } from 'http';

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);

    server = app.listen(config.port, () => {
      console.log(`App listening on port ${config.port}`);
    });
  } catch (error) { /* empty */ }
}

main();

process.on('unhandledRejection', () => {
  
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on('uncaughtException', () => {
  console.log(`😁 uncaughtException is detected, shutting down ...`);
  process.exit(1);
});
