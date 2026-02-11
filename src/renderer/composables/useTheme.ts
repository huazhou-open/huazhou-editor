import { ref, watch } from 'vue';

export type Theme = 'light' | 'dark';

export function useTheme() {
  const currentTheme = ref<Theme>('light');

  const toggleTheme = () => {
    currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light';
    applyTheme();
  };

  const setTheme = (theme: Theme) => {
    currentTheme.value = theme;
    applyTheme();
  };

  const applyTheme = () => {
    document.body.classList.toggle('dark-theme', currentTheme.value === 'dark');
    document.body.classList.toggle('light-theme', currentTheme.value === 'light');
  };

  const applyCodeMirrorTheme = (setEditorTheme: (theme: string) => void) => {
    const theme = currentTheme.value === 'dark' ? 'dracula' : 'default';
    setEditorTheme(theme);
  };

  // Apply theme on mount
  const initTheme = () => {
    applyTheme();
  };

  return {
    currentTheme,
    toggleTheme,
    setTheme,
    applyTheme,
    applyCodeMirrorTheme,
    initTheme
  };
}
