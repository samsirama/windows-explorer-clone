<script setup lang="ts">
import { useExplorer } from '../composables/useExplorer';
import { computed } from 'vue';

const { 
    tabs, 
    activeTabId, 
    setActiveTab, 
    addTab, 
    closeTab,
    navigateBack,
    navigateForward,
    navigateUp,
    refresh,
    search,
    formattedBreadcrumbs,
    activeTab,
    navigateTo
} = useExplorer();

// Icons as inline SVGs for zero-dependency approach
const icons = {
    back: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M7.78 12.53L3.28 8.03L7.78 3.53L8.84 4.59L5.65 7.78H13.78V9.28H5.65L8.84 12.47L7.78 12.53Z"/></svg>`,
    forward: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8.22 3.53L12.72 8.03L8.22 12.53L7.16 11.47L10.35 8.28H2.22V6.78H10.35L7.16 3.59L8.22 3.53Z"/></svg>`,
    up: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 3.5L3.5 8L4.56 9.06L7.25 6.37V13.5H8.75V6.37L11.44 9.06L12.5 8L8 3.5Z"/></svg>`,
    refresh: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 3C5.24 3 3 5.24 3 8C3 10.76 5.24 13 8 13C10.76 13 13 10.76 13 8H14.5C14.5 11.59 11.59 14.5 8 14.5C4.41 14.5 1.5 11.59 1.5 8C1.5 4.41 4.41 1.5 8 1.5C9.79 1.5 11.42 2.22 12.6 3.4L14 2V6H10L11.53 4.47C10.63 3.56 9.38 3 8 3Z"/></svg>`,
    plus: `<svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M5.25 5.25H0.75V6.75H5.25V11.25H6.75V6.75H11.25V5.25H6.75V0.75H5.25V5.25Z"/></svg>`,
    close: `<svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><path d="M1.35 0.64L0.64 1.35L4.29 5L0.64 8.65L1.35 9.36L5 5.71L8.65 9.36L9.36 8.65L5.71 5L9.36 1.35L8.65 0.64L5 4.29L1.35 0.64Z"/></svg>`
};

const canGoBack = computed(() => activeTab.value.historyIndex > 0);
const canGoForward = computed(() => activeTab.value.historyIndex < activeTab.value.history.length - 1);
const canGoUp = computed(() => activeTab.value.currentFolder !== null);

</script>

<template>
  <div class="explorer-header-container">
    <!-- Row 1: Tab Bar -->
    <div class="tab-bar">
      <div v-for="tab in tabs" 
           :key="tab.id" 
           class="tab"
           :class="{ active: activeTabId === tab.id }"
           @click="setActiveTab(tab.id)"
      >
        <span class="tab-icon">📁</span>
        <span class="tab-title text-ellipsis">
            {{ tab.currentFolder ? tab.currentFolder.name : 'Home' }}
        </span>
        <button class="tab-close" @click.stop="closeTab(tab.id)" v-if="tabs.length > 1">
            <span v-html="icons.close"></span>
        </button>
      </div>
      
      <button class="new-tab-btn" @click="addTab" title="New Tab">
        <span v-html="icons.plus"></span>
      </button>

      <!-- Drag Region -->
      <div class="title-bar-drag"></div>
    </div>

    <!-- Row 2: Navigation & Address Bar -->
    <div class="nav-bar">
      <div class="nav-controls">
        <button class="nav-btn" :disabled="!canGoBack" @click="navigateBack" title="Back" v-html="icons.back"></button>
        <button class="nav-btn" :disabled="!canGoForward" @click="navigateForward" title="Forward" v-html="icons.forward"></button>
        <button class="nav-btn small" :disabled="!canGoUp" @click="navigateUp" title="Up" v-html="icons.up"></button>
        <button class="nav-btn small" @click="refresh" title="Refresh" v-html="icons.refresh"></button>
      </div>

      <div class="address-bar">
         <div class="breadcrumb-container">
             <span class="icon">💻</span> <!-- Minimal PC icon -->
             <div 
                v-for="(crumb, index) in formattedBreadcrumbs" 
                :key="index"
                class="crumb"
             >
                <div class="crumb-spacer" v-if="index > 0">›</div>
                <button class="crumb-btn" @click="navigateTo(crumb.id === null ? null : crumb)">{{ crumb.name }}</button>
             </div>
         </div>
      </div>
      
      <div class="search-box">
          <input type="text" placeholder="Search " @keyup.enter="(e) => search((e.target as HTMLInputElement).value)">
          <span class="search-icon">🔍</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.explorer-header-container {
    background: #000000; /* Main top bg */
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid #333;
}

/* Tab Bar */
.tab-bar {
    display: flex;
    align-items: center;
    padding: 8px 10px 0 10px; /* Slight top padding */
    background: #191919;
    height: 40px;
    gap: 4px;
    -webkit-app-region: drag; /* Electron-like drag, simplified here */
}

.title-bar-drag {
    flex: 1;
    height: 100%;
}

.tab {
    background: #2d2d2d;
    color: #aeaeae;
    height: 32px;
    border-radius: 6px 6px 0 0;
    padding: 0 10px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    min-width: 120px;
    max-width: 200px;
    cursor: pointer;
    border: 1px solid transparent;
    -webkit-app-region: no-drag;
}

.tab:hover {
    background: #363636;
}

.tab.active {
    background: #464646; /* Lighter active tab */
    color: white;
    height: 36px; /* Slightly taller to overlap bottom border usage if needed, but flex handles it */
    position: relative;
    top: 2px; /* Visual trick */
    border-radius: 6px 6px 0 0;
}

.text-ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
}

.new-tab-btn {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    -webkit-app-region: no-drag;
}
.new-tab-btn:hover { background: #333; }

.tab-close {
    background: transparent;
    border: none;
    color: inherit;
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    border-radius: 50%;
    cursor: pointer;
}
.tab-close:hover { background: rgba(255,255,255,0.2); }


/* Nav Bar */
.nav-bar {
    height: 50px;
    background: #202020;
    display: flex;
    align-items: center;
    padding: 0 12px;
    gap: 16px;
    border-top: 1px solid #111; /* Separator from tabs */
}

.nav-controls {
    display: flex;
    gap: 4px;
}

.nav-btn {
    background: transparent;
    border: none;
    color: #fff;
    width: 32px;
    height: 32px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}
.nav-btn:hover:not(:disabled) { background: rgba(255,255,255,0.1); }
.nav-btn:disabled { color: #555; cursor: default; }

.nav-btn.small { width: 28px; }

/* Address Bar */
.address-bar {
    flex: 1;
    height: 32px;
    background: #2c2c2c;
    border: 1px solid #3c3c3c;
    border-radius: 4px;
    display: flex;
    align-items: center;
    padding: 0 8px;
}

.address-bar:hover {
    border-color: #555;
    background: #333;
}

.breadcrumb-container {
    display: flex;
    align-items: center;
    font-size: 13px;
    color: #e0e0e0;
}

.crumb {
    display: flex;
    align-items: center;
}

.crumb-spacer {
    margin: 0 6px;
    color: #888;
}

.crumb-btn {
    background: transparent;
    border: none;
    color: inherit;
    padding: 2px 6px;
    border-radius: 2px;
    cursor: pointer;
}
.crumb-btn:hover { background: rgba(255,255,255,0.1); }

/* Search Box */
.search-box {
    width: 250px;
    height: 32px;
    background: #2c2c2c;
    border: 1px solid #3c3c3c;
    border-radius: 4px;
    display: flex;
    align-items: center;
    padding: 0 10px;
}
.search-box:focus-within {
    background: #333;
    border-bottom: 2px solid var(--accent-color);
}

.search-box input {
    background: transparent;
    border: none;
    color: white;
    width: 100%;
    outline: none;
    font-size: 13px;
}
.search-icon { font-size: 12px; }
</style>
