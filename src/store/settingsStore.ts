const AsyncStorage = {
  setItem: async (key: string, value: string) => window.localStorage.setItem(key, value),
  getItem: async (key: string) => window.localStorage.getItem(key),
};

import {
    create,
} from 'zustand';

interface SettingsState {

  darkMode:
    boolean;

  language:
    'pt'
    | 'en'
    | 'es';

  largeText:
    boolean;

  setDarkMode:
    (
      value:
        boolean
    ) => void;

  setLanguage:
    (
      value:
        'pt'
        | 'en'
        | 'es'
    ) => void;

  setLargeText:
    (
      value:
        boolean
    ) => void;

  loadSettings:
    () => Promise<void>;
}

export const
useSettingsStore =
create<
  SettingsState
>(
  (
    set
  ) => ({

    /**
     * Padrão do app
     */
    darkMode:
      true,

    language:
      'pt',

    largeText:
      false,

    /**
     * Tema
     */
    setDarkMode:
      async (
        value
      ) => {

        await AsyncStorage.setItem(
          'darkMode',
          JSON.stringify(
            value
          )
        );

        set({
          darkMode:
            value,
        });
      },

    /**
     * Idioma
     */
    setLanguage:
      async (
        value
      ) => {

        await AsyncStorage.setItem(
          'language',
          value
        );

        set({
          language:
            value,
        });
      },

    /**
     * Texto grande
     */
    setLargeText:
      async (
        value
      ) => {

        await AsyncStorage.setItem(
          'largeText',
          JSON.stringify(
            value
          )
        );

        set({
          largeText:
            value,
        });
      },

    /**
     * Carregar
     */
    loadSettings:
      async () => {

        const dark =
          await AsyncStorage.getItem(
            'darkMode'
          );

        const language =
          await AsyncStorage.getItem(
            'language'
          );

        const large =
          await AsyncStorage.getItem(
            'largeText'
          );

        set({

          darkMode:
            dark !== null
              ? JSON.parse(
                  dark
                )
              : true,

          language:
            (
              language as
              any
            ) || 'pt',

          largeText:
            large !==
            null
              ? JSON.parse(
                  large
                )
              : false,
        });
      },
  })
);
