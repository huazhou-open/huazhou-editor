import { ref, computed } from 'vue';
import type { ModelPlatform, PlatformModel } from './useConfig';

// Browser-compatible UUID v4 generation
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function useModelConfig() {
  const editingPlatform = ref<ModelPlatform | null>(null);
  const showPlatformDialog = ref(false);
  const showModelDialog = ref(false);
  const editingModelPlatformId = ref<string | null>(null);
  const editingModel = ref<PlatformModel | null>(null);

  function createEmptyPlatform(): ModelPlatform {
    return {
      id: generateUUID(),
      name: '',
      baseUrl: '',
      apiKey: '',
      models: []
    };
  }

  function createEmptyModel(): PlatformModel {
    return {
      id: generateUUID(),
      name: '',
      displayName: ''
    };
  }

  function openAddPlatformDialog(): void {
    editingPlatform.value = createEmptyPlatform();
    showPlatformDialog.value = true;
  }

  function openEditPlatformDialog(platform: ModelPlatform): void {
    editingPlatform.value = { ...platform, models: [...platform.models] };
    showPlatformDialog.value = true;
  }

  function closePlatformDialog(): void {
    editingPlatform.value = null;
    showPlatformDialog.value = false;
  }

  function openAddModelDialog(platformId: string): void {
    editingModelPlatformId.value = platformId;
    editingModel.value = createEmptyModel();
    showModelDialog.value = true;
  }

  function openEditModelDialog(platformId: string, model: PlatformModel): void {
    editingModelPlatformId.value = platformId;
    editingModel.value = { ...model };
    showModelDialog.value = true;
  }

  function closeModelDialog(): void {
    editingModel.value = null;
    editingModelPlatformId.value = null;
    showModelDialog.value = false;
  }

  function validatePlatform(platform: ModelPlatform): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!platform.name.trim()) {
      errors.push('平台名称不能为空');
    }

    if (!platform.baseUrl.trim()) {
      errors.push('API 地址不能为空');
    } else {
      try {
        new URL(platform.baseUrl);
      } catch {
        errors.push('API 地址格式不正确');
      }
    }

    if (!platform.apiKey.trim()) {
      errors.push('API 密钥不能为空');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  function validateModel(model: PlatformModel): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!model.name.trim()) {
      errors.push('模型标识不能为空');
    }

    if (!model.displayName.trim()) {
      errors.push('显示名称不能为空');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  return {
    editingPlatform,
    showPlatformDialog,
    showModelDialog,
    editingModelPlatformId,
    editingModel,
    createEmptyPlatform,
    createEmptyModel,
    openAddPlatformDialog,
    openEditPlatformDialog,
    closePlatformDialog,
    openAddModelDialog,
    openEditModelDialog,
    closeModelDialog,
    validatePlatform,
    validateModel
  };
}
