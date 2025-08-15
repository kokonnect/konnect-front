import { Alert, Platform } from 'react-native';

interface AlertButton {
  text?: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

// Removed unused interface

export const showAlert = (
  title: string,
  message?: string,
  buttons?: AlertButton[],
  options?: any
) => {
  // On web, don't show alerts - just log to console or handle silently
  if (Platform.OS === 'web') {
    console.log(`[Alert] ${title}: ${message}`);
    
    // If there are buttons with onPress handlers, execute the first non-cancel button
    if (buttons && buttons.length > 0) {
      const primaryButton = buttons.find(b => b.style !== 'cancel') || buttons[0];
      if (primaryButton?.onPress) {
        primaryButton.onPress();
      }
    }
    return;
  }
  
  // On mobile platforms, show the native alert
  Alert.alert(title, message, buttons, options);
};

export const showPrompt = (
  title: string,
  message?: string,
  callbackOrButtons?: ((text: string) => void) | AlertButton[],
  type?: 'default' | 'plain-text' | 'secure-text' | 'login-password',
  defaultValue?: string,
  keyboardType?: string
) => {
  // On web, use a simple implementation or skip
  if (Platform.OS === 'web') {
    console.log(`[Prompt] ${title}: ${message}`);
    
    // If it's a callback function, call it with default value
    if (typeof callbackOrButtons === 'function') {
      callbackOrButtons(defaultValue || '');
    }
    return;
  }
  
  // On iOS, use the native prompt
  if (Platform.OS === 'ios') {
    Alert.prompt(
      title,
      message,
      callbackOrButtons as any,
      type,
      defaultValue,
      keyboardType
    );
  } else {
    // Android doesn't support Alert.prompt, show a regular alert
    Alert.alert(title, message, callbackOrButtons as AlertButton[]);
  }
};