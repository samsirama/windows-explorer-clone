<script setup lang="ts">
import { useExplorer } from '../composables/useExplorer';
import { onMounted, onUnmounted, ref, watch } from 'vue';

const { contextMenu, handleContextAction, closeContextMenu, clipboard } = useExplorer();
const menuRef = ref<HTMLElement | null>(null);

// Close on outside click
const handleClickOutside = (e: MouseEvent) => {
  if (menuRef.value && !menuRef.value.contains(e.target as Node)) {
    closeContextMenu();
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

// Windows 11 Icons
const icons = {
    cut: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M2.5 3C2.5 3.5 2.5 12.5 2.5 12.5C2.5 13.33 3.17 14 4 14C4.83 14 5.5 13.33 5.5 12.5C5.5 11.95 5.17 11.48 4.69 11.23L6.85 8.5L9 11.23C8.52 11.48 8.19 11.95 8.19 12.5C8.19 13.33 8.86 14 9.69 14C10.52 14 11.19 13.33 11.19 12.5C11.19 12.18 11.08 11.89 10.91 11.65L13.15 8.79C13.68 8.19 13.59 7.28 12.98 6.79L5.35 0.5H5.09L5.43 3H2.5ZM9.69 13C9.41 13 9.19 12.78 9.19 12.5C9.19 12.22 9.41 12 9.69 12C9.97 12 10.19 12.22 10.19 12.5C10.19 12.78 9.97 13 9.69 13ZM4 13C3.72 13 3.5 12.78 3.5 12.5C3.5 12.22 3.72 12 4 12C4.28 12 4.5 12.22 4.5 12.5C4.5 12.78 4.28 13 4 13ZM12.19 7.64L10.22 10.14C10.07 10.05 9.89 10 9.69 10C9.36 10 9.06 10.11 8.82 10.28L6.85 7.78L12.19 7.64Z"/></svg>`,
    copy: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M4 1.5H11C11.83 1.5 12.5 2.17 12.5 3V4H13C14.1 4 15 4.9 15 6V13C15 14.1 14.1 15 13 15H6C4.9 15 4 14.1 4 13V12H3C2.17 12 1.5 11.33 1.5 10.5V3C1.5 2.17 2.17 1.5 3 1.5H4ZM5 6V12C5 12.55 5.45 13 6 13H13C13.55 13 14 12.55 14 12V6C14 5.45 13.55 5 13 5H6C5.45 5 5 5.45 5 6ZM3 10.5C3 10.78 3.22 11 3.5 11H4V6C4 4.9 4.9 4 6 4H11V3C11 2.72 10.78 2.5 10.5 2.5H3.5C3.22 2.5 3 2.72 3 3V10.5Z"/></svg>`,
    rename: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M2 13.5V11.5H3V13.5H2ZM2 9.5H3V10.5H2V9.5ZM13 11.5V13.5H14V11.5H13ZM13 9.5H14V10.5H13V9.5ZM4 13.5H12V12.5H4V13.5ZM9.67 2.45L13.55 6.33L7.5 12.38L3.62 8.5L9.67 2.45ZM4.33 8.5L7.5 11.67L12.84 6.33L9.67 3.16L4.33 8.5Z"/></svg>`,
    delete: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M12.5 3.5L11.5 2.5H4.5L3.5 3.5H1V5H2V14.5H14V5H15V3.5H12.5ZM13 13.5H3V5H13V13.5ZM6 12.5H7V6.5H6V12.5ZM9 12.5H10V6.5H9V12.5Z"/></svg>`,
    share: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M11 2.5L14 5.5L11 8.5V6H7C4.79 6 3 7.79 3 10C3 11.3 3.63 12.44 4.6 13.18L3.9 14.1C2.5 13.13 1.5 11.45 1.5 9.5C1.5 6.46 3.96 4 7 4H11V2.5Z"/></svg>`
};

</script>

<template>
  <div 
    v-if="contextMenu.visible" 
    ref="menuRef"
    class="context-menu"
    :style="{ top: contextMenu.y + 'px', left: contextMenu.x + 'px' }"
  >
     <!-- Top Bar (Icon Only Actions) -->
     <div class="icon-row" v-if="contextMenu.target">
        <button v-html="icons.cut" title="Cut" @click="handleContextAction('CUT')"></button>
        <button v-html="icons.copy" title="Copy" @click="handleContextAction('COPY')"></button>
        <button v-html="icons.rename" title="Rename" @click="handleContextAction('RENAME')"></button>
        <button v-html="icons.share" title="Share" @click="handleContextAction('SHARE')"></button>
        <button class="delete-btn" v-html="icons.delete" title="Delete" @click="handleContextAction('DELETE')"></button>
     </div>
     
     <div class="separator" v-if="contextMenu.target"></div>

     <!-- List Actions -->
     <div class="menu-item" @click="handleContextAction('OPEN')" v-if="contextMenu.target">
        <span class="label">Open</span>
     </div>
     <div class="menu-item" v-if="contextMenu.target">
        <span class="label">Open with...</span>
        <span class="shortcut">></span>
     </div>
     <div class="menu-item disabled" v-if="contextMenu.target">
        <span class="label">Add to Favorites</span>
     </div>

     <div class="separator" v-if="contextMenu.target"></div>
     
     <div class="menu-item" 
          :class="{ disabled: !clipboard }"
          @click="clipboard ? handleContextAction('PASTE') : null">
        <span class="icon">📋</span>
        <span class="label">Paste</span>
     </div>
     
     <div class="separator"></div>

     <!-- Background Actions -->
     <div class="menu-item" @click="handleContextAction('NEW_FOLDER')">
        <span class="icon">📁</span>
        <span class="label">New Folder</span>
     </div>
     <div class="menu-item" @click="handleContextAction('NEW_FILE')">
        <span class="icon">📄</span>
        <span class="label">New Text Document</span>
     </div>
     
     <div class="separator"></div>

     <div class="menu-item" @click="handleContextAction('PROPERTIES')" v-if="contextMenu.target">
        <span class="label">Properties</span>
     </div>
  </div>
</template>

<style scoped>
.context-menu {
    position: fixed;
    width: 260px;
    background: rgba(44, 44, 44, 0.95); /* Acrylic */
    backdrop-filter: blur(10px);
    border: 1px solid #454545;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.5);
    padding: 6px;
    z-index: 9999;
    color: #fff;
    font-size: 13px;
    animation: fade-in 0.1s ease-out;
}

@keyframes fade-in {
    from { opacity: 0; transform: scale(0.98); }
    to { opacity: 1; transform: scale(1); }
}

.icon-row {
    display: flex;
    justify-content: space-between;
    padding: 4px 8px;
    margin-bottom: 4px;
}

.icon-row button {
    background: transparent;
    border: none;
    color: #fff;
    width: 32px;
    height: 32px;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.icon-row button:hover {
    background: rgba(255,255,255,0.1);
}

.delete-btn:hover {
    background: #c42b1c !important; /* Windows 11 Red Hover for Delete */
}

.separator {
    height: 1px;
    background: #454545;
    margin: 4px 0;
}

.menu-item {
    display: flex;
    align-items: center;
    padding: 8px 10px;
    border-radius: 4px;
    cursor: pointer;
    gap: 10px;
}

.menu-item:hover {
    background: rgba(255,255,255,0.1);
}

.menu-item.disabled {
    color: #777;
    cursor: default;
}
.menu-item.disabled:hover { background: transparent; }

.label { flex: 1; }
.shortcut { color: #888; }
.icon { font-size: 14px; }
</style>
