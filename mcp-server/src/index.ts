#!/usr/bin/env node

import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { runMcpServer } from "./server.js";

dotenv.config({
  path: path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../.env",
  ),
});

void runMcpServer();