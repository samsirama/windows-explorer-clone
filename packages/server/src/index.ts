/// <reference types="bun-types" />
import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { foldersController } from "./interfaces/http/folders.controller";
import { FolderService } from "./application/services/folder.service";
import { FolderRepository } from "./infrastructure/repositories/folder.repository";

const folderRepository = new FolderRepository();
const folderService = new FolderService(folderRepository);

// Export app for serverless usage
export const app = new Elysia()
  .use(
    cors({
      origin: true, // Reflect request origin
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    })
  )
  .use(swagger())
  .get("/", () => "Hello from Elysia Server!") // Health check
  .use(foldersController(folderService));

// Only listen if run directly (not imported)
// @ts-ignore
if (import.meta.main) {
  app.listen(process.env.PORT || 3000);
  console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
  );
}

export type App = typeof app;
