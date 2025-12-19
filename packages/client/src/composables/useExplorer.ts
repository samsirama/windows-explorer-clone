import { ref, computed } from "vue";

const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/folders`
  : "/api/folders";

export interface Node {
  id: string;
  name: string;
  type: "FOLDER" | "FILE";
  parentId: string | null;
  children?: Node[];
  size?: number;
  createdAt: string;
}

export interface Tab {
  id: string;
  history: (Node | null)[]; // null represents Root
  historyIndex: number;
  currentFolder: Node | null;
  currentFiles: Node[];
  selectedItem: Node | null;
}

// Helper
const findNode = (nodes: Node[], id: string): Node | null => {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNode(node.children, id);
      if (found) return found;
    }
  }
  return null;
};

// Global State
const treeData = ref<Node[]>([]);
const tabs = ref<Tab[]>([]);
const activeTabId = ref<string>("");

// --- Context Menu State ---
const contextMenu = ref({
  visible: false,
  x: 0,
  y: 0,
  target: null as Node | null,
});

const propertiesModal = ref({
  visible: false,
  node: null as Node | null,
});

const renamingId = ref<string | null>(null);
const renamingValue = ref<string>("");

const clipboard = ref<{ action: "COPY" | "CUT"; nodes: Node[] } | null>(null);

// Helper
const removeNodeFromTree = (nodes: Node[], id: string): boolean => {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === id) {
      nodes.splice(i, 1);
      return true;
    }
    if (nodes[i].children) {
      if (removeNodeFromTree(nodes[i].children!, id)) return true;
    }
  }
  return false;
};

export function useExplorer() {
  // Initialize first tab if empty
  if (tabs.value.length === 0) {
    const initialTab: Tab = {
      id: crypto.randomUUID(),
      history: [null],
      historyIndex: 0,
      currentFolder: null,
      currentFiles: [],
      selectedItem: null,
    };
    tabs.value.push(initialTab);
    activeTabId.value = initialTab.id;
  }

  const activeTab = computed(
    () => tabs.value.find((t) => t.id === activeTabId.value) || tabs.value[0]
  );

  const formattedBreadcrumbs = computed(() => {
    const crumbs = [];
    let current = activeTab.value.currentFolder;

    // Helper to find a node by ID in the tree
    // We need this because we only have 'parentId' string, not reference

    while (current) {
      crumbs.unshift({ id: current.id, name: current.name });
      if (current.parentId) {
        current = findNode(treeData.value, current.parentId);
        // Fallback: If parent not found in tree (stale?), try to infer?
        // No, strict tree is safer.
      } else {
        current = null;
      }
    }

    crumbs.unshift({ id: null, name: "This PC" });
    return crumbs;
  });

  const fetchTree = async () => {
    try {
      const res = await fetch(API_BASE);
      treeData.value = await res.json();
    } catch (e) {
      console.error("Failed to fetch tree", e);
    }
  };

  // --- Navigation Logic ---

  const navigateTo = async (folder: Node | null) => {
    const tab = activeTab.value;

    // Prevent navigating to same folder
    if (folder?.id === tab.currentFolder?.id) return;

    // 1. Update History
    // Remove forward history if we are in middle of stack
    if (tab.historyIndex < tab.history.length - 1) {
      tab.history = tab.history.slice(0, tab.historyIndex + 1);
    }
    tab.history.push(folder);
    tab.historyIndex++;

    // 2. Load Data
    await loadFolderData(folder);
  };

  const loadFolderData = async (folder: Node | null) => {
    const tab = activeTab.value;

    // Ensure we are using the Tree's version of the node (if available) for consistency
    const realNode = folder
      ? findNode(treeData.value, folder.id) || folder
      : null;

    tab.currentFolder = realNode;
    tab.selectedItem = null;

    if (!realNode) {
      // Root
      tab.currentFiles = treeData.value;
    } else {
      if (realNode.children) {
        tab.currentFiles = realNode.children;
      } else {
        tab.currentFiles = [];
        // If children are missing but should exist, maybe trigger fetch?
        // But for now, assume tree is source of truth.
      }
    }
  };

  const navigateBack = async () => {
    const tab = activeTab.value;
    if (tab.historyIndex > 0) {
      tab.historyIndex--;
      const prevFolder = tab.history[tab.historyIndex];
      await loadFolderData(prevFolder);
    }
  };

  const navigateForward = async () => {
    const tab = activeTab.value;
    if (tab.historyIndex < tab.history.length - 1) {
      tab.historyIndex++;
      const nextFolder = tab.history[tab.historyIndex];
      await loadFolderData(nextFolder);
    }
  };

  const navigateUp = async () => {
    const tab = activeTab.value;
    if (!tab.currentFolder) return; // Already at root

    // Find parent in treeData (This is O(N) search in client, acceptable for UI)
    // Helper to find parent
    const findParent = (nodes: Node[], targetId: string): Node | null => {
      for (const node of nodes) {
        if (node.children) {
          if (node.children.some((c) => c.id === targetId)) return node;
          const found = findParent(node.children, targetId);
          if (found) return found;
        }
      }
      return null;
    };

    const parent = findParent(treeData.value, tab.currentFolder.id);
    await navigateTo(parent); // Parent is null if root
  };

  const refresh = async () => {
    const currentId = activeTab.value.currentFolder?.id;
    await fetchTree();

    if (currentId) {
      const freshNode = findNode(treeData.value, currentId);
      if (freshNode) {
        activeTab.value.currentFolder = freshNode;
        await loadFolderData(freshNode);
      } else {
        // Folder might have been deleted, go to root
        activeTab.value.currentFolder = null;
        await loadFolderData(null);
      }
    } else {
      await loadFolderData(null);
    }
  };

  // --- Interaction ---

  const selectItem = (node: Node) => {
    activeTab.value.selectedItem = node;
  };

  const openItem = (node: Node) => {
    if (node.type === "FOLDER") {
      navigateTo(node);
    }
  };

  // --- Tab Management ---
  const addTab = () => {
    const newTab: Tab = {
      id: crypto.randomUUID(),
      history: [null],
      historyIndex: 0,
      currentFolder: null,
      currentFiles: treeData.value,
      selectedItem: null,
    };
    tabs.value.push(newTab);
    activeTabId.value = newTab.id;
  };

  const closeTab = (id: string) => {
    if (tabs.value.length <= 1) return; // Don't close last tab
    const index = tabs.value.findIndex((t) => t.id === id);
    tabs.value = tabs.value.filter((t) => t.id !== id);

    if (activeTabId.value === id) {
      // Switch to nearest tab
      const newIndex = index > 0 ? index - 1 : 0;
      activeTabId.value = tabs.value[newIndex].id;
    }
  };

  const setActiveTab = (id: string) => {
    activeTabId.value = id;
  };

  // Compatibility for Search (Global for now, or per tab?)
  // Let's make search per tab
  const search = async (query: string) => {
    if (!query) {
      // Reset to current folder view
      loadFolderData(activeTab.value.currentFolder);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}?q=${encodeURIComponent(query)}`);
      activeTab.value.currentFiles = await res.json();
      // We don't change currentFolder, just the view (Files)
    } catch (e) {
      console.error("Search failed", e);
    }
  };

  // --- Compatibility Proxies ---
  const currentFolder = computed(() => activeTab.value.currentFolder);
  const currentFiles = computed(() => activeTab.value.currentFiles);
  const selectedItem = computed(() => activeTab.value.selectedItem);
  const selectFolder = navigateTo; // Alias for compatibility

  // State moved to global scope

  const openContextMenu = (e: MouseEvent, node: Node | null) => {
    e.preventDefault();
    contextMenu.value = {
      visible: true,
      x: e.clientX,
      y: e.clientY,
      target: node,
    };
  };

  const closeContextMenu = () => {
    contextMenu.value.visible = false;
  };

  const closeProperties = () => {
    propertiesModal.value.visible = false;
  };

  // --- Actions (Real Implementation) ---
  const handleContextAction = async (action: string) => {
    const target = contextMenu.value.target;
    const targetNode = target;
    closeContextMenu();

    const currentFolderId = activeTab.value.currentFolder?.id || null;

    try {
      switch (action) {
        case "OPEN":
          if (targetNode) openItem(targetNode);
          break;

        case "CUT":
          if (targetNode)
            clipboard.value = { action: "CUT", nodes: [targetNode] };
          break;

        case "COPY":
          if (targetNode)
            clipboard.value = { action: "COPY", nodes: [targetNode] };
          break;

        case "PASTE":
          if (clipboard.value && clipboard.value.nodes.length > 0) {
            // ... existing paste logic ...
            const nodesToPaste = clipboard.value.nodes;
            const isCut = clipboard.value.action === "CUT";

            console.log(
              `Pasting ${nodesToPaste.length} items. Mode: ${
                isCut ? "MOVE" : "COPY"
              }`
            );

            for (const node of nodesToPaste) {
              if (isCut) {
                // Move: PATCH parentId
                await fetch(`${API_BASE}/${node.id}`, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ parentId: currentFolderId }),
                });
              } else {
                // Copy: CREATE new node
                // Prevent duplicate name? For now allow, server handles ID.
                await fetch(API_BASE, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    name: `${node.name} (Copy)`,
                    type: node.type,
                    parentId: currentFolderId,
                    size: node.size,
                  }),
                });
              }
            }

            // Clear clipboard if cut
            if (isCut) clipboard.value = null;

            await refresh();
          }
          break;

        case "DELETE":
          if (targetNode) {
            if (
              confirm(`Are you sure you want to delete "${targetNode.name}"?`)
            ) {
              // Optimistic Delete
              activeTab.value.currentFiles =
                activeTab.value.currentFiles.filter(
                  (n) => n.id !== targetNode.id
                );

              // Optimistic Delete from Tree (Sidebar)
              removeNodeFromTree(treeData.value, targetNode.id);

              await fetch(`${API_BASE}/${targetNode.id}`, { method: "DELETE" });
              // await refresh(); // Optimistic!
            }
          }
          break;

        case "RENAME":
          if (targetNode) {
            renamingId.value = targetNode.id;
            renamingValue.value = targetNode.name; // Initialize input
          }
          break;

        case "NEW_FOLDER":
        case "NEW_FILE":
          {
            const type = action === "NEW_FOLDER" ? "FOLDER" : "FILE";
            const defaultName =
              type === "FOLDER" ? "New Folder" : "New Text Document.txt";

            // Create using API first to get ID
            const res = await fetch(API_BASE, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: defaultName,
                type,
                parentId: currentFolderId,
                size: 0,
              }),
            });
            const newTask = await res.json();
            // API returns array from .returning()?
            const newNode = Array.isArray(newTask) ? newTask[0] : newTask;

            activeTab.value.currentFiles.push(newNode);

            // Enter rename mode
            renamingId.value = newNode.id;
            renamingValue.value = newNode.name; // Initialize input
          }
          break;

        case "PROPERTIES":
          if (targetNode) {
            propertiesModal.value = { visible: true, node: targetNode };
          }
          break;
      }
    } catch (e) {
      console.error("Action failed", e);
      alert("Operation failed. See console.");
    }
  };

  // Helper to commit rename
  const commitRename = async (node: Node) => {
    const newName = renamingValue.value;
    renamingId.value = null; // Exit rename mode
    renamingValue.value = "";

    if (!newName || newName === node.name) return;

    // Optimistic Update
    const oldName = node.name;
    node.name = newName;

    try {
      await fetch(`${API_BASE}/${node.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      });
    } catch (e) {
      console.error("Rename failed", e);
      node.name = oldName; // Revert name on fail
      await refresh();
    }
  };

  return {
    treeData,
    tabs,
    activeTab,
    activeTabId,
    fetchTree,
    navigateTo,
    navigateBack,
    navigateForward,
    navigateUp,
    refresh,
    search,
    formattedBreadcrumbs,
    selectItem,
    openItem,
    addTab,
    closeTab,
    setActiveTab,
    // Exports suitable for FolderView and SidebarTree
    currentFolder,
    currentFiles,
    selectedItem,
    selectFolder,
    // Context Menu
    contextMenu,
    propertiesModal,
    openContextMenu,
    closeContextMenu,
    closeProperties,
    handleContextAction,
    clipboard,
    renamingId,
    renamingValue,
    commitRename,
  };
}
