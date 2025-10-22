import { createServer } from "http";
import next from "next";
import { getIO } from "./src/app/(backend)/lib/socket";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => handle(req, res));
  getIO(server); // Initialize socket.io
  server.listen(3000, () => console.log("🚀 Server ready on http://localhost:3000"));
});
