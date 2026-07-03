import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { runMcpServer } from "./server.js";

const envPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../.env",
);

dotenv.config({ path: envPath });

void runMcpServer();
