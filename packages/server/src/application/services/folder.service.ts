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

  async createNode(data: any) {
    return await this.repo.createNode(data);
  }

  async deleteNode(id: string) {
    // TODO: Recursive delete for folders?
    // For now, let's assume cascade or simple delete
    return await this.repo.deleteNode(id);
  }

  async updateNode(id: string, data: any) {
    return await this.repo.updateNode(id, data);
  }
}
