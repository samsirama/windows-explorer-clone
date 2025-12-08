<script setup lang="ts">
import { useExplorer } from '../composables/useExplorer';

const { currentFiles, selectFolder, selectItem, openItem, selectedItem } = useExplorer();

const formatDate = (date: string) => {
    if (!date) return '';
    return new Date(date).toLocaleString();
};

const formatSize = (bytes: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    return (bytes / 1024).toFixed(1) + ' KB';
};

const handleRowClick = (node: any) => {
    selectItem(node);
};

const handleRowDblClick = (node: any) => {
    openItem(node);
};
</script>

<template>
  <div class="folder-view">
    <div class="header-row">
       <div class="col-name">Name</div>
       <div class="col-date">Date modified</div>
       <div class="col-type">Type</div>
       <div class="col-size">Size</div>
    </div>
    
    <div class="file-list">
      <div 
        v-for="node in currentFiles" 
        :key="node.id" 
        class="file-row"
        :class="{ 'selected': selectedItem?.id === node.id }"
        @click="handleRowClick(node)"
        @dblclick="handleRowDblClick(node)"
      >
         <div class="col-name">
            <span class="icon">{{ node.type === 'FOLDER' ? '📁' : '📄' }}</span>
            {{ node.name }}
         </div>
         <div class="col-date">{{ formatDate(node.createdAt) }}</div>
         <div class="col-type">{{ node.type === 'FOLDER' ? 'File folder' : 'File' }}</div>
         <div class="col-size">{{ formatSize(node.size || 0) }}</div>
      </div>
      <div v-if="currentFiles.length === 0" class="empty-state">
         This folder is empty.
      </div>
    </div>
  </div>
</template>

<style scoped>
.folder-view {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.header-row {
  display: flex;
  padding: 8px 16px;
  border-bottom: 1px solid var(--border-color);
  font-size: 12px;
  color: var(--text-color);
  font-weight: 600;
}

.file-list {
  flex: 1;
  overflow-y: auto;
}

.file-row {
  display: flex;
  padding: 8px 16px;
  font-size: 13px;
  color: var(--text-color);
  align-items: center;
}

.file-row:hover {
  background-color: var(--surface-hover);
}

.file-row.selected {
  background-color: #37373d;
  border: 1px solid var(--border-color); /* Optional visual cue */
}

.col-name { flex: 4; display: flex; align-items: center; gap: 8px; }
.col-date { flex: 2; color: #ccc; }
.col-type { flex: 2; color: #ccc; }
.col-size { flex: 1; text-align: right; color: #ccc; }

.icon { font-size: 16px; }

.empty-state {
    padding: 20px;
    text-align: center;
    color: #666;
}
</style>
