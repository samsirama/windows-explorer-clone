<script setup lang="ts">
import { useExplorer, Node } from '../composables/useExplorer';
import { computed, ref } from 'vue';

const { propertiesModal, closeProperties } = useExplorer();
const activeTab = ref('General');
const tabs = ['General', 'Sharing', 'Security', 'Previous Versions', 'Customize'];

const node = computed(() => propertiesModal.value.node);

const formatDate = (date: string) => {
    if(!date) return '';
    return new Date(date).toLocaleString();
}

const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i] + ` (${bytes.toLocaleString()} bytes)`;
}
</script>

<template>
  <div v-if="propertiesModal.visible && node" class="modal-overlay">
    <div class="modal-window">
        <!-- Header -->
        <div class="modal-header">
            <span class="icon">{{ node.type === 'FOLDER' ? '📁' : '📄' }}</span>
            <span class="title">{{ node.name }} Properties</span>
            <button class="close-btn" @click="closeProperties">✕</button>
        </div>

        <!-- Tabs -->
        <div class="tabs-row">
            <button 
                v-for="tab in tabs" 
                :key="tab"
                class="tab-btn"
                :class="{ active: activeTab === tab }"
                @click="activeTab = tab"
            >
                {{ tab }}
            </button>
        </div>

        <!-- Content Area -->
        <div class="modal-content">
            <div v-if="activeTab === 'General'" class="general-tab">
                <div class="top-info">
                   <div class="big-icon">{{ node.type === 'FOLDER' ? '📁' : '📄' }}</div>
                   <input type="text" v-model="node.name" class="name-input" readonly />
                </div>
                
                <div class="separator"></div>

                <div class="prop-row">
                    <span class="label">Type:</span>
                    <span class="value">{{ node.type === 'FOLDER' ? 'File folder' : 'File' }}</span>
                </div>
                
                <div class="prop-row">
                    <span class="label">Location:</span>
                    <span class="value">C:\Users\User\Desktop</span> <!-- Mock -->
                </div>

                <div class="prop-row">
                    <span class="label">Size:</span>
                    <span class="value">{{ formatSize(node.size || 0) }}</span>
                </div>

                <div class="prop-row">
                    <span class="label">Size on disk:</span>
                    <span class="value">{{ formatSize(node.size || 0) }}</span>
                </div>

                <div class="prop-row" v-if="node.type === 'FOLDER'">
                    <span class="label">Contains:</span>
                    <span class="value">{{ node.children?.length || 0 }} Files, 0 Folders</span>
                </div>

                <div class="separator"></div>

                <div class="prop-row">
                    <span class="label">Created:</span>
                    <span class="value">{{ formatDate(node.createdAt) }}</span>
                </div>

                <div class="separator"></div>

                <div class="prop-row">
                    <span class="label">Attributes:</span>
                    <div class="checkboxes">
                        <label><input type="checkbox" disabled> Read-only</label>
                        <label><input type="checkbox" disabled> Hidden</label>
                    </div>
                </div>

                 <div class="advanced-btn-row">
                     <button class="push-right">Advanced...</button>
                 </div>

            </div>
            
            <div v-else class="other-tab">
                <p>This tab is not implemented in logic.</p>
            </div>
        </div>

        <!-- Footer -->
        <div class="modal-footer">
            <button @click="closeProperties">OK</button>
            <button @click="closeProperties">Cancel</button>
            <button>Apply</button>
        </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    z-index: 10000;
    pointer-events: none; /* Let clicks pass through outside? No, modal blocks */
    pointer-events: auto;
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-window {
    width: 400px;
    background: #f0f0f0; /* Windows Light Mode default for Properties, usually white/gray */
    color: #000;
    border: 1px solid #999;
    box-shadow: 2px 2px 10px rgba(0,0,0,0.3);
    border-radius: 8px; /* Win 11 rounded corners */
    font-family: 'Segoe UI', sans-serif;
    font-size: 12px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

/* Dark Mode Override if parent is dark? Usually modal is light, but if 'Premium' requested, 
   maybe dark mode modal is better? The screenshot was Light Mode properties. 
   I will stick to Light Mode as per screenshot, unless user complains. 
   Wait, user project is Dark Mode. A bright white modal might look jarring.
   I'll try a darkish theme if possible, or neutral. 
   Actually screenshots showed standard Windows properties (Light).
   Let's check user request: "sesuaikan dengan kebutuhan kita".
   Given the app is Dark Mode, a Dark Properties dialog is nicer.
*/

.modal-window {
    background: #2c2c2c;
    color: #fff;
    border: 1px solid #454545;
}

.modal-header {
    display: flex;
    align-items: center;
    padding: 10px 10px;
    gap: 8px;
}
.modal-header .title { font-weight: 600; font-size: 13px; flex: 1; }
.close-btn { background: none; border: none; color: #fff; cursor: pointer; }

.tabs-row {
    display: flex;
    padding: 0 10px;
    border-bottom: 1px solid #454545;
    background: #202020;
}

.tab-btn {
    background: transparent;
    border: 1px solid transparent;
    border-bottom: none;
    padding: 6px 12px;
    color: #ccc;
    cursor: pointer;
    font-size: 12px;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
}
.tab-btn.active {
    background: #2c2c2c; /* Matches content bg */
    border-color: #454545;
    color: #fff;
    position: relative;
    top: 1px;
}

.modal-content {
    flex: 1;
    padding: 15px;
    min-height: 350px;
}

.top-info {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 15px;
}
.big-icon { font-size: 32px; }
.name-input {
    flex: 1;
    background: transparent;
    border: 1px solid #454545;
    color: #fff;
    padding: 4px;
    border-radius: 4px;
}

.separator { height: 1px; background: #454545; margin: 10px 0; }

.prop-row {
    display: flex;
    margin-bottom: 8px;
}
.prop-row .label { width: 100px; color: #aaa; }
.prop-row .value { flex: 1; }

.checkboxes {
    display: flex;
    gap: 15px;
}

.advanced-btn-row {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
}

.modal-footer {
    padding: 10px;
    background: #202020;
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    border-top: 1px solid #454545;
}

.modal-footer button {
    padding: 5px 20px;
    background: #333;
    border: 1px solid #555;
    color: #fff;
    border-radius: 4px;
    cursor: pointer;
    min-width: 70px;
}
.modal-footer button:hover { background: #444; }

</style>
