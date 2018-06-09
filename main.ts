import { Server } from "./server/server";

const server = new Server();
server
  .bootstrap()
  .then(server => {
    console.log(`Server is listening on`, server.application.address());
  })
  .catch(err => {
    console.log(`Server failure ${err}`);
    console.error(err);
    process.exit(1);
  });
