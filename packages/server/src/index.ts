import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { foldersController } from "./interfaces/http/folders.controller";
import { FolderService } from "./application/services/folder.service";
import { FolderRepository } from "./infrastructure/repositories/folder.repository";

const folderRepository = new FolderRepository();
const folderService = new FolderService(folderRepository);

const app = new Elysia()
  .use(cors())
  .use(swagger())
  .use(foldersController(folderService))
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

export type App = typeof app;
