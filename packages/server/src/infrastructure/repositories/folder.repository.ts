import { db } from "../../db";
import { nodes } from "../../db/schema";
import { eq, isNull } from "drizzle-orm";

export class FolderRepository {
  async getAllFolders() {
    // Return ALL nodes (Folders + Files) to build complete client-side tree where possible,
    // or just folders if we want to mimic strictly.
    // However, to satisfy "Files in Root" request, we should return all.
    return await db.select().from(nodes);
  }

  async getFolderById(id: string) {
    const folder = await db.query.nodes.findFirst({
      where: eq(nodes.id, id),
      with: {
        children: true,
      },
    });
    return folder;
  }

  async getRootFolders() {
    return await db.select().from(nodes).where(isNull(nodes.parentId));
  }

  async createNode(data: typeof nodes.$inferInsert) {
    return await db.insert(nodes).values(data).returning();
  }

  async searchNodes(query: string) {
    // We want to find files AND folders matching the name.
    return await db.query.nodes.findMany({
      where: (node, { ilike }) => ilike(node.name, `%${query}%`),
    });
  }

  async deleteNode(id: string) {
    return await db.delete(nodes).where(eq(nodes.id, id)).returning();
  }

  async updateNode(id: string, data: Partial<typeof nodes.$inferInsert>) {
    return await db.update(nodes).set(data).where(eq(nodes.id, id)).returning();
  }
}
