<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Box, Tools, Plus, Loading } from '@element-plus/icons-vue';
import { useConfig, ConfigGroup } from '../composables/useConfig';

const emit = defineEmits<{
  close: [];
}>();

const activeConfigGroup = ref<ConfigGroup>(ConfigGroup.MODEL);
const selectedPlatform = ref<any>(null);

const {
  config,
  configGroups,
  isLoading,
  error,
  hasUnsavedChanges,
  loadConfig,
  saveConfig,
  discardChanges
} = useConfig();

const isSaving = ref(false);

// 平台编辑相关
const editingPlatform = ref<any>(null);
const editingModel = ref<any>(null);
const editingModelPlatformId = ref<string>('');

// 平台表单
const platformForm = ref({
  name: '',
  baseUrl: '',
  apiKey: ''
});

// 模型表单
const modelForm = ref({
  name: '',
  displayName: ''
});

// 组件挂载时加载配置
onMounted(() => {
  loadConfig();
});

async function handleSaveConfig() {
  isSaving.value = true;

  try {
    const success = await saveConfig();
    if (success) {
      ElMessage.success('配置保存成功');
    } else {
      ElMessage.error('保存失败，请重试');
    }
  } catch (err: any) {
    ElMessage.error(err.message || '保存失败，请重试');
  } finally {
    isSaving.value = false;
  }
}

function handleCloseConfig() {
  if (hasUnsavedChanges.value) {
    ElMessageBox.confirm(
      '有未保存的更改，确定要退出配置吗？',
      '提示',
      {
        confirmButtonText: '退出',
        cancelButtonText: '继续编辑',
        type: 'warning',
      }
    ).then(() => {
      discardChanges();
      emit('close');
    }).catch(() => {
      // User canceled
    });
  } else {
    emit('close');
  }
}

function handleSelectGroup(groupKey: string) {
  activeConfigGroup.value = groupKey as ConfigGroup;
}

function deletePlatform(platform: any) {
  ElMessageBox.confirm(
    `确定要删除平台 "${platform.name}" 吗？`,
    '删除确认',
    {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    const index = config.value.platforms.findIndex((p: any) => p.id === platform.id);
    if (index >= 0) {
      config.value.platforms.splice(index, 1);
      ElMessage.success('平台已删除');
    }
  });
}

function deleteModel(platform: any, model: any) {
  ElMessageBox.confirm(
    `确定要删除模型 "${model.displayName}" 吗？`,
    '删除确认',
    {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    const platformIndex = config.value.platforms.findIndex((p: any) => p.id === platform.id);
    if (platformIndex >= 0) {
      const platform = config.value.platforms[platformIndex];
      const modelIndex = platform.models.findIndex((m: any) => m.id === model.id);
      if (modelIndex >= 0) {
        platform.models.splice(modelIndex, 1);
        ElMessage.success('模型已删除');
      }
    }
  });
}

function openPlatformDialog(platform?: any) {
  if (platform) {
    editingPlatform.value = platform;
    platformForm.value = {
      name: platform.name,
      baseUrl: platform.baseUrl,
      apiKey: platform.apiKey
    };
  } else {
    editingPlatform.value = {};
    platformForm.value = {
      name: '',
      baseUrl: '',
      apiKey: ''
    };
  }
}

function savePlatform() {
  if (!platformForm.value.name || !platformForm.value.baseUrl) {
    ElMessage.warning('请填写平台名称和基础URL');
    return;
  }

  if (editingPlatform.value.id) {
    // 编辑现有平台
    const platform = config.value.platforms.find((p: any) => p.id === editingPlatform.value.id);
    if (platform) {
      platform.name = platformForm.value.name;
      platform.baseUrl = platformForm.value.baseUrl;
      platform.apiKey = platformForm.value.apiKey;
    }
  } else {
    // 添加新平台
    config.value.platforms.push({
      id: Date.now().toString(),
      name: platformForm.value.name,
      baseUrl: platformForm.value.baseUrl,
      apiKey: platformForm.value.apiKey,
      models: []
    });
  }

  editingPlatform.value = null;
  ElMessage.success('平台保存成功');
}

function openModelDialog(platformId: string, model?: any) {
  editingModelPlatformId.value = platformId;
  if (model) {
    editingModel.value = model;
    modelForm.value = {
      name: model.name,
      displayName: model.displayName
    };
  } else {
    editingModel.value = {};
    modelForm.value = {
      name: '',
      displayName: ''
    };
  }
}

function saveModel() {
  if (!modelForm.value.name || !modelForm.value.displayName) {
    ElMessage.warning('请填写模型名称和显示名称');
    return;
  }

  const platform = config.value.platforms.find((p: any) => p.id === editingModelPlatformId.value);
  if (!platform) {
    ElMessage.error('平台不存在');
    return;
  }

  if (!platform.models) {
    platform.models = [];
  }

  if (editingModel.value.id) {
    // 编辑现有模型
    const model = platform.models.find((m: any) => m.id === editingModel.value.id);
    if (model) {
      model.name = modelForm.value.name;
      model.displayName = modelForm.value.displayName;
    }
  } else {
    // 添加新模型
    platform.models.push({
      id: Date.now().toString(),
      name: modelForm.value.name,
      displayName: modelForm.value.displayName
    });
  }

  editingModel.value = null;
  editingModelPlatformId.value = '';
  ElMessage.success('模型保存成功');
}
</script>

<template>
  <div class="config-view">
    <!-- Header -->
    <div class="config-header">
      <h1>配置</h1>
      <div class="config-actions">
        <el-button
          type="primary"
          :loading="isSaving"
          :disabled="!hasUnsavedChanges"
          @click="handleSaveConfig"
        >
          保存
        </el-button>
        <el-button @click="handleCloseConfig">
          返回
        </el-button>
      </div>
    </div>

    <!-- Error Alert -->
    <div v-if="error" class="error-section">
      <el-alert
        type="error"
        :closeable="false"
        show-icon
      >
        {{ error }}
      </el-alert>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-section">
      <el-icon class="is-loading" :size="40">
        <Loading />
      </el-icon>
      <p>加载配置中...</p>
    </div>

    <!-- Config Content - 左右布局 -->
    <div v-else class="config-container">
      <!-- 左侧边栏 -->
      <div class="config-sidebar">
        <el-menu
          :default-active="[activeConfigGroup]"
          @select="handleSelectGroup"
          class="config-menu"
        >
          <el-menu-item
            v-for="group in configGroups"
            :key="group.key"
            :index="group.key"
          >
            <template #title>
              <span class="menu-icon">{{ group.icon }}</span>
              <span>{{ group.label }}</span>
            </template>
          </el-menu-item>
        </el-menu>
      </div>

      <!-- 右侧内容区 -->
      <div class="config-content">
        <div v-if="activeConfigGroup === ConfigGroup.MODEL" class="model-config-container">
          <!-- 左侧：平台列表 -->
          <div class="platform-list-panel">
            <div class="panel-header">
              <h3>平台列表</h3>
              <el-button type="primary" size="small" @click="openPlatformDialog()">
                <el-icon><Plus /></el-icon>
                添加
              </el-button>
            </div>

            <el-empty v-if="!config.platforms || config.platforms.length === 0" description="暂无平台">
              <el-button type="primary" @click="openPlatformDialog()">
                添加第一个平台
              </el-button>
            </el-empty>

            <div v-else class="platform-items">
              <div
                v-for="platform in config.platforms"
                :key="platform.id"
                :class="['platform-item', { active: selectedPlatform && selectedPlatform.id === platform.id }]"
                @click="selectedPlatform = platform"
              >
                <div class="platform-item-info">
                  <el-icon :size="18" color="#409eff"><Box /></el-icon>
                  <span class="platform-item-name">{{ platform.name }}</span>
                </div>
                <div class="platform-item-actions">
                  <el-button size="small" link @click.stop="openPlatformDialog(platform)">
                    编辑
                  </el-button>
                  <el-button size="small" link type="danger" @click.stop="deletePlatform(platform)">
                    删除
                  </el-button>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧：平台详情 -->
          <div class="platform-detail-panel">
            <el-empty v-if="!selectedPlatform" description="请选择一个平台查看详情" :image-size="120" />

            <div v-else class="platform-detail">
              <!-- 平台信息 -->
              <div class="platform-info-section">
                <div class="info-header">
                  <h3>{{ selectedPlatform.name }}</h3>
                  <el-button type="primary" size="small" @click="openPlatformDialog(selectedPlatform)">
                    编辑信息
                  </el-button>
                </div>
                <el-descriptions :column="1" border>
                  <el-descriptions-item label="基础URL">{{ selectedPlatform.baseUrl }}</el-descriptions-item>
                  <el-descriptions-item label="API密钥">
                    <span>{{ selectedPlatform.apiKey ? '已配置' : '未配置' }}</span>
                  </el-descriptions-item>
                </el-descriptions>
              </div>

              <!-- 模型列表 -->
              <div class="models-section">
                <div class="section-header">
                  <h4>模型列表</h4>
                  <el-button type="primary" size="small" @click="openModelDialog(selectedPlatform.id)">
                    <el-icon><Plus /></el-icon>
                    添加模型
                  </el-button>
                </div>

                <el-empty v-if="!selectedPlatform.models || selectedPlatform.models.length === 0" description="暂无模型" :image-size="60" />

                <div v-else class="model-grid">
                  <div
                    v-for="model in selectedPlatform.models"
                    :key="model.id"
                    class="model-card"
                  >
                    <div class="model-card-content">
                      <div class="model-header">
                        <el-icon :size="20" color="#67c23a"><Tools /></el-icon>
                        <span class="model-display-name">{{ model.displayName }}</span>
                      </div>
                      <div class="model-body">
                        <el-tag size="small" type="info">{{ model.name }}</el-tag>
                      </div>
                      <div class="model-footer">
                        <el-button size="small" link @click="openModelDialog(selectedPlatform.id, model)">
                          编辑
                        </el-button>
                        <el-button size="small" link type="danger" @click="deleteModel(selectedPlatform, model)">
                          删除
                        </el-button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <el-empty
          v-else
          :description="`${configGroups.find(g => g.key === activeConfigGroup)?.label} 配置即将推出...`"
        />
      </div>
    </div>
  </div>

  <!-- 平台编辑对话框 - 使用 teleport 将对话框渲染到 body -->
  <Teleport to="body">
    <el-dialog
      v-model="editingPlatform"
      :title="editingPlatform && editingPlatform.id ? '编辑平台' : '添加平台'"
      width="500px"
      @close="editingPlatform = null"
    >
      <el-form :model="platformForm" label-width="100px">
        <el-form-item label="平台名称" required>
          <el-input v-model="platformForm.name" placeholder="例如：OpenAI" />
        </el-form-item>
        <el-form-item label="基础URL" required>
          <el-input v-model="platformForm.baseUrl" placeholder="https://api.openai.com/v1" />
        </el-form-item>
        <el-form-item label="API密钥">
          <el-input v-model="platformForm.apiKey" type="password" placeholder="sk-..." show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editingPlatform = null">取消</el-button>
        <el-button type="primary" @click="savePlatform">保存</el-button>
      </template>
    </el-dialog>

    <!-- 模型编辑对话框 -->
    <el-dialog
      v-model="editingModel"
      :title="editingModel && editingModel.id ? '编辑模型' : '添加模型'"
      width="500px"
      @close="editingModel = null; editingModelPlatformId = ''"
    >
      <el-form :model="modelForm" label-width="100px">
        <el-form-item label="模型名称" required>
          <el-input v-model="modelForm.name" placeholder="例如：gpt-4" />
        </el-form-item>
        <el-form-item label="显示名称" required>
          <el-input v-model="modelForm.displayName" placeholder="例如：GPT-4" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editingModel = null; editingModelPlatformId = ''">取消</el-button>
        <el-button type="primary" @click="saveModel">保存</el-button>
      </template>
    </el-dialog>
  </Teleport>
</template>

<style scoped>
.config-view {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
}

.config-header {
  flex-shrink: 0;
  padding: 16px 20px;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.config-header h1 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.config-actions {
  display: flex;
  gap: 12px;
}

.error-section {
  flex-shrink: 0;
  padding: 16px 20px 0;
}

.loading-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

/* 关键：配置容器 - 左右布局 */
.config-container {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.config-sidebar {
  width: 220px;
  flex-shrink: 0;
  background-color: #f5f7fa;
  border-right: 1px solid #e4e7ed;
  overflow-y: auto;
}

.config-content {
  flex: 1;
  overflow-y: auto;
  background-color: #ffffff;
  padding: 20px;
}

/* 模型配置容器 - 左右布局 */
.model-config-container {
  height: 100%;
  display: flex;
  gap: 20px;
}

/* 左侧：平台列表 */
.platform-list-panel {
  width: 280px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  border-right: 1px solid #e4e7ed;
  padding-right: 20px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-header h3 {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
}

.platform-items {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.platform-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #f5f7fa;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.platform-item:hover {
  background-color: #e6f7ff;
}

.platform-item.active {
  background-color: #e6f7ff;
  border: 1px solid #1890ff;
}

.platform-item-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.platform-item-name {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.platform-item-actions {
  display: flex;
  gap: 4px;
}

/* 右侧：平台详情 */
.platform-detail-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.platform-detail {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.platform-info-section {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.info-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.models-section {
  display: flex;
  flex-direction: column;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h4 {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
}

.model-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 12px;
}

.model-card {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  overflow: hidden;
  background-color: #ffffff;
  transition: all 0.2s;
}

.model-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.model-card-content {
  display: flex;
  flex-direction: column;
  padding: 16px;
}

.model-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.model-display-name {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.model-body {
  margin-bottom: 12px;
}

.model-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.config-menu {
  border-right: none;
}

.menu-icon {
  margin-right: 8px;
  font-size: 16px;
}

</style>
