<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useExplorer } from '../composables/useExplorer';
import SidebarTree from './SidebarTree.vue';
import FolderView from './FolderView.vue';
import ExplorerHeader from './ExplorerHeader.vue';
import ContextMenu from './ContextMenu.vue';
import PropertiesModal from './PropertiesModal.vue';

const { treeData, fetchTree, openContextMenu } = useExplorer();
const sidebarWidth = ref(250); // Default width
const isResizing = ref(false);

const startResize = () => {
  isResizing.value = true;
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', stopResize);
  document.body.style.cursor = 'col-resize';
  document.body.style.userSelect = 'none';
};

const handleMouseMove = (e: MouseEvent) => {
  if (isResizing.value) {
    // Limit min/max width
    const newWidth = e.clientX;
    if (newWidth > 150 && newWidth < 600) {
      sidebarWidth.value = newWidth;
    }
  }
};

const stopResize = () => {
  isResizing.value = false;
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', stopResize);
  document.body.style.cursor = '';
  document.body.style.userSelect = '';
};

onMounted(() => {
  fetchTree();
});
</script>

<template>
  <div class="explorer-window">
    <ExplorerHeader />
    
    <div class="explorer-body">
      <aside class="sidebar" :style="{ width: sidebarWidth + 'px' }">
        <nav>
           <!-- Root Level -->
           <SidebarTree v-for="node in treeData" :key="node.id" :node="node" />
        </nav>
      </aside>
      
      <!-- Resizer Handle -->
      <div class="resizer" @mousedown="startResize"></div>

      <main class="content-area" @contextmenu.prevent="openContextMenu($event, null)">
        <FolderView />
      </main>
    </div>

    <!-- Global Context Menu -->
    <ContextMenu />
    
    <!-- Properties Modal -->
    <PropertiesModal />
  </div>
</template>

<style scoped>
.explorer-window {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--bg-color);
}



.explorer-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.sidebar {
  /* removed fixed width var, using dynamic style */
  background: var(--bg-color);
  border-right: 1px solid var(--border-color);
  overflow-y: auto;
  padding: 10px 0;
  flex-shrink: 0;
}

.resizer {
  width: 5px;
  background: transparent;
  cursor: col-resize;
  flex-shrink: 0;
  margin-left: -2px; /* Overlap border slightly */
  z-index: 10;
}

.resizer:hover, .resizer:active {
  background: var(--accent-color);
  opacity: 0.5;
}

.content-area {
  flex: 1;
  background: var(--bg-color);
  padding: 0;
  overflow-y: auto;
}
</style>
