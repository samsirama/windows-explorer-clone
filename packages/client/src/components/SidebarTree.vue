<script setup lang="ts">
import { ref, computed } from 'vue';
import { useExplorer } from '../composables/useExplorer';

const props = defineProps<{
  node: {
    id: string,
    name: string,
    type: 'FOLDER' | 'FILE',
    children?: any[],
    parentId: string | null,
    createdAt: string,
    size?: number
  }
}>();

const { selectFolder, currentFolder, openContextMenu, renamingId, renamingValue, commitRename } = useExplorer();
const isOpen = ref(false);

const vFocus = {
  mounted: (el: HTMLElement) => {
    el.focus();
    if (el instanceof HTMLInputElement) el.select();
  }
};

const isFolder = computed(() => props.node.type === 'FOLDER');
const subFolders = computed(() => props.node.children?.filter((c: any) => c.type === 'FOLDER') || []);
const hasChildren = computed(() => subFolders.value.length > 0);
const isSelected = computed(() => currentFolder.value?.id === props.node.id);

const toggle = (e: Event) => {
    e.stopPropagation(); // Prevent selection when toggling
    if (hasChildren.value) {
        isOpen.value = !isOpen.value;
    }
};

const select = () => {
   selectFolder(props.node);
};
</script>

<template>
  <div class="tree-node">
    <div class="node-content" 
         :class="{ 'selected': isSelected }"
         @click="select"
         @contextmenu.prevent.stop="openContextMenu($event, props.node)">
      
      <!-- Arrow -->
      <span class="arrow" 
            :class="{ open: isOpen, invisible: !hasChildren }"
            @click="toggle">
        ▶
      </span>
      
      <!-- Icon -->
      <span class="icon">📁</span>
      

      
      <input 
        v-if="renamingId === node.id"
        v-model="renamingValue"
        v-focus
        @blur="commitRename(node)"
        @keydown.enter="($event.target as HTMLInputElement).blur()"
        @click.stop
        class="rename-input-sidebar"
      />
      <span v-else class="label">{{ node.name }}</span>
    </div>

    <!-- Recursive Children -->
    <div v-if="isOpen && hasChildren" class="children">
      <SidebarTree 
        v-for="child in subFolders" 
        :key="child.id" 
        :node="child" 
      />
    </div>
  </div>
</template>

<style scoped>
.tree-node {
  user-select: none;
  cursor: default;
}

.node-content {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  color: var(--text-color);
  font-size: 13px;
  gap: 6px;
}

.node-content:hover {
  background-color: var(--surface-hover);
}

.node-content.selected {
  background-color: #37373d; /* Active bg */
  border-left: 2px solid var(--accent-color);
}

.children {
  padding-left: 18px; /* Indentation */
}

.arrow {
  font-size: 8px;
  transition: transform 0.1s;
  color: #888;
  display: inline-block;
  width: 12px;
  text-align: center;
}

.arrow.open {
  transform: rotate(90deg);
}

.arrow.invisible {
  opacity: 0;
}

.icon {
  font-size: 16px;
  color: #e8c64d; /* Folder yellow */
}

.rename-input-sidebar {
    background: #202020;
    color: #fff;
    border: 1px solid #0078d4;
    padding: 0 4px;
    font-family: inherit;
    font-size: inherit;
    outline: none;
    min-width: 50px;
    max-width: 150px;
    border-radius: 2px;
    height: 18px;
}
</style>
