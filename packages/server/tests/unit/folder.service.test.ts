import { describe, expect, it } from "bun:test";
import { FolderService } from "../../src/application/services/folder.service";

describe("FolderService", () => {
  it("should build a tree structure from flat list", async () => {
    // Mock Repository
    const mockRepo = {
      getAllFolders: async () => [
        { id: "1", name: "Root", parentId: null, type: "FOLDER" },
        { id: "2", name: "Child", parentId: "1", type: "FOLDER" },
        { id: "3", name: "Grandchild", parentId: "2", type: "FOLDER" },
      ],
      getFolderById: async () => null,
      searchNodes: async () => [],
      getRootFolders: async () => [],
      createNode: async () => [],
    } as any;

    const service = new FolderService(mockRepo);
    const tree = await service.getTreeStructure();

    // Expect Root to be at top
    expect(tree.length).toBe(1);
    expect(tree[0].id).toBe("1");

    // Expect Child to be nested
    expect(tree[0].children.length).toBe(1);
    expect(tree[0].children[0].id).toBe("2");

    // Expect Grandchild to be nested
    expect(tree[0].children[0].children.length).toBe(1);
    expect(tree[0].children[0].children[0].id).toBe("3");
  });
});
