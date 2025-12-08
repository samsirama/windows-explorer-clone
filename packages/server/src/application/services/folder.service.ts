import { FolderRepository } from "../../infrastructure/repositories/folder.repository";

export class FolderService {
  constructor(private repo: FolderRepository) {}

  async getTreeStructure() {
    const folders = await this.repo.getAllFolders();

    // Algorithm: Build Tree from Flat List
    const map = new Map();
    const roots: any[] = [];

    // 1. Initialize map
    for (const folder of folders) {
      map.set(folder.id, { ...folder, children: [] });
    }

    // 2. Build hierarchy
    for (const folder of folders) {
      const node = map.get(folder.id);
      if (folder.parentId && map.has(folder.parentId)) {
        const parent = map.get(folder.parentId);
        parent.children.push(node);
      } else {
        // If parentId is null OR parent not found (orphaned), treat as root
        roots.push(node);
      }
    }

    return roots;
  }

  async getFolderContents(id: string) {
    return await this.repo.getFolderById(id);
  }

  async searchNodes(query: string) {
    return await this.repo.searchNodes(query);
  }
}
