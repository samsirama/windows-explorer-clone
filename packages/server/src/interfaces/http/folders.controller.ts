import { Elysia } from "elysia";
import { FolderService } from "../../application/services/folder.service";

export const foldersController = (service: FolderService) =>
  new Elysia({ prefix: "/folders" })
    .get("/", async ({ query }) => {
      if (query && query.q) {
        return await service.searchNodes(query.q as string);
      }
      return await service.getTreeStructure();
    })
    .get("/:id", async ({ params: { id } }) => {
      return await service.getFolderContents(id);
    });
