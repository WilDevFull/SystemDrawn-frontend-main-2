import { lazy, type ComponentType } from 'react';

type ViteImportMeta = ImportMeta & {
  glob<T>(patterns: string[]): Record<string, () => Promise<T>>;
};

const screenModules = (import.meta as ViteImportMeta).glob<{ default: ComponentType }>([
  '../pages/*/*.tsx',
  '../pages/*/*/*.tsx',
]);

// name: caminho relativo a src/pages, sem extensão (ex.: 'user/perfil').
export function lazyScreen(name: string) {
  const loadScreen = screenModules[`../pages/${name}.tsx`];

  if (!loadScreen) {
    throw new Error(`Rota sem tela correspondente: src/pages/${name}.tsx`);
  }

  return lazy(loadScreen as () => Promise<{ default: ComponentType }>);
}
