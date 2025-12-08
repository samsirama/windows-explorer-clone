import { ref, computed } from "vue";

const API_BASE = "/api/folders";

interface Node {
  id: string;
  name: string;
  type: "FOLDER" | "FILE";
  parentId: string | null;
  children?: Node[];
  size?: number;
  createdAt: string;
}

// Shared state (Singleton pattern)
const treeData = ref<Node[]>([]);
const currentFolder = ref<Node | null>(null);
const currentFiles = ref<Node[]>([]);
const selectedItem = ref<Node | null>(null);

export function useExplorer() {
  const formattedBreadcrumbs = computed(() => {
    if (!currentFolder.value) return ["Home"];
    return ["Home", currentFolder.value.name];
  });

  const fetchTree = async () => {
    try {
      const res = await fetch(API_BASE);
      treeData.value = await res.json();
    } catch (e) {
      console.error("Failed to fetch tree", e);
    }
  };

  const search = async (query: string) => {
    if (!query) {
      if (currentFolder.value) {
        selectFolder(currentFolder.value);
      } else {
        currentFiles.value = [];
      }
      return;
    }
    try {
      const res = await fetch(`${API_BASE}?q=${encodeURIComponent(query)}`);
      currentFiles.value = await res.json();
      currentFolder.value = null; // Deselect folder context when searching
    } catch (e) {
      console.error("Search failed", e);
    }
  };

  const selectFolder = async (folder: Node) => {
    currentFolder.value = folder;
    selectedItem.value = null; // Reset selection when changing folder

    if (folder.children) {
      currentFiles.value = folder.children;
    } else {
      currentFiles.value = [];
    }
  };

  const selectItem = (node: Node) => {
    selectedItem.value = node;
  };

  const openItem = (node: Node) => {
    if (node.type === "FOLDER") {
      selectFolder(node);
    }
  };

  return {
    treeData,
    currentFolder,
    currentFiles,
    fetchTree,
    selectFolder,
    search,
    formattedBreadcrumbs,
    selectedItem,
    selectItem,
    openItem,
  };
}
