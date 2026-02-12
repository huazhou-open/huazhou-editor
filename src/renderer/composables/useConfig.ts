import { ref, shallowRef } from 'vue';

export interface ConfigData {
  version: string;
  platforms: ModelPlatform[];
}

export interface ModelPlatform {
  id: string;
  name: string;
  baseUrl: string;
  apiKey: string;
  models: PlatformModel[];
}

export interface PlatformModel {
  id: string;
  name: string;
  displayName: string;
}

export enum ConfigGroup {
  MODEL = 'model',
  BASIC = 'basic',
}

export interface ConfigGroupItem {
  key: ConfigGroup;
  label: string;
  icon: string;
}

const CONFIG_GROUPS: ConfigGroupItem[] = [
  { key: ConfigGroup.MODEL, label: '模型配置', icon: '🤖' },
  { key: ConfigGroup.BASIC, label: '基础配置', icon: '⚙️' },
];

let configData = shallowRef<ConfigData>({
  version: '1.0.0',
  platforms: []
});

let originalConfigData: ConfigData | null = null;

export function useConfig() {
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const hasUnsavedChanges = ref(false);

  const configGroups = CONFIG_GROUPS;

  async function loadConfig(): Promise<void> {
    isLoading.value = true;
    error.value = null;

    try {
      const data = await window.electronAPI.readConfig();
      configData.value = data;
      originalConfigData = JSON.parse(JSON.stringify(data));
      hasUnsavedChanges.value = false;
    } catch (err: any) {
      error.value = err.message || '加载配置失败';
      console.error('Failed to load config:', err);
    } finally {
      isLoading.value = false;
    }
  }

  async function saveConfig(): Promise<boolean> {
    isLoading.value = true;
    error.value = null;

    try {
      await window.electronAPI.writeConfig(configData.value);
      originalConfigData = JSON.parse(JSON.stringify(configData.value));
      hasUnsavedChanges.value = false;
      return true;
    } catch (err: any) {
      error.value = err.message || '保存配置失败';
      console.error('Failed to save config:', err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  function discardChanges(): void {
    if (originalConfigData) {
      configData.value = JSON.parse(JSON.stringify(originalConfigData));
      hasUnsavedChanges.value = false;
    }
  }

  function updateConfig(updater: (config: ConfigData) => void): void {
    updater(configData.value);
    hasUnsavedChanges.value = true;
  }

  function setConfig(newConfig: ConfigData): void {
    configData.value = newConfig;
    hasUnsavedChanges.value = true;
  }

  return {
    config: configData,
    configGroups,
    isLoading,
    error,
    hasUnsavedChanges,
    loadConfig,
    saveConfig,
    discardChanges,
    updateConfig,
    setConfig,
  };
}
