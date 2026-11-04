type AlertButton = {
  text?: string;
  style?: 'default' | 'cancel' | 'destructive';
  onPress?: () => void | Promise<void>;
};

// O Alert do react-native-web é um no-op; aqui usamos os diálogos do navegador.
export const Alert = {
  alert(title: string, message?: string, buttons?: AlertButton[]) {
    const text = message ? `${title}\n\n${message}` : title;

    if (!buttons || buttons.length < 2) {
      window.alert(text);
      void buttons?.[0]?.onPress?.();
      return;
    }

    const cancelButton = buttons.find((button) => button.style === 'cancel');
    const confirmButton = buttons.find((button) => button !== cancelButton);

    if (window.confirm(text)) {
      void confirmButton?.onPress?.();
    } else {
      void cancelButton?.onPress?.();
    }
  },
};
