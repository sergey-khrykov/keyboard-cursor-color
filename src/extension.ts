import * as vscode from 'vscode';
import * as os from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface KeyboardLayout {
  [key: string]: string;
}

class KeyboardCursorColorManager {
  public registerWindowFocusListener(context: vscode.ExtensionContext) {
    context.subscriptions.push(
      vscode.window.onDidChangeWindowState(async (windowState) => {
        if (this.isEnabled && windowState.focused) {
          await this.updateCursorColor();
        }
      })
    );
  }
  private originalCursorColor: string | undefined;
  private isEnabled: boolean = true;
  private layouts: KeyboardLayout = {};
  private statusBarItem: vscode.StatusBarItem;
  private monitoringInterval: any;
  private monitoringIntervalMs: number = 250;

  constructor() {
    this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    this.statusBarItem.command = 'keyboardCursorColor.toggle';
    this.statusBarItem.tooltip = 'Click to toggle keyboard cursor color';
    this.statusBarItem.show();
  }

  async initialize(): Promise<void> {
    try {
      // Store original cursor color
      const config = vscode.workspace.getConfiguration('workbench.colorCustomizations');
      this.originalCursorColor = config.get('editorCursor.foreground');

      // Load configuration
      const extensionConfig = vscode.workspace.getConfiguration('keyboardCursorColor');
      this.isEnabled = extensionConfig.get('enabled', true);
      this.layouts = extensionConfig.get('layouts', {
        'en-US': '#007ACC',
        'ru': '#FF0000',
        'de': '#00FF00',
        'fr': '#0000FF'
      });
      this.monitoringIntervalMs = extensionConfig.get('monitoringIntervalMs', 250);

      if (this.isEnabled) {
        await this.updateCursorColor();
        this.startMonitoring();
      }

      this.updateStatusBar();
    } catch (error) {
      console.error('Error initializing keyboard cursor color manager:', error);
    }
  }

  private async getCurrentKeyboardLayout(): Promise<string> {
    const platform = os.platform();
    
    try {
      switch (platform) {
        case 'darwin': // macOS
          return await this.getMacKeyboardLayout();
        case 'win32': // Windows
          return await this.getWindowsKeyboardLayout();
        case 'linux': // Linux
          return await this.getLinuxKeyboardLayout();
        default:
          return 'en-US';
      }
    } catch (error) {
      console.error('Error getting keyboard layout:', error);
      return 'en-US';
    }
  }

  private async getMacKeyboardLayout(): Promise<string> {
    try {
      const { stdout } = await execAsync('defaults read ~/Library/Preferences/com.apple.HIToolbox.plist AppleCurrentKeyboardLayoutInputSourceID');
      const layout = stdout.trim();
      console.log(`[KeyboardCursorColor] getMacKeyboardLayout raw: '${layout}'`);
      // Map common macOS layout IDs to our format
      const layoutMap: { [key: string]: string } = {
        'com.apple.keylayout.US': 'en-US',
        'com.apple.keylayout.Russian': 'ru',
        'com.apple.keylayout.German': 'de',
        'com.apple.keylayout.French': 'fr',
        'com.apple.keylayout.RussianWin': 'ru',
        'com.apple.keylayout.German-QWERTY': 'de',
        'com.apple.keylayout.French-PC': 'fr'
      };
      const mapped = layoutMap[layout] || layout;
      console.log(`[KeyboardCursorColor] getMacKeyboardLayout mapped: '${mapped}'`);
      return mapped;
    } catch (error) {
      console.error('Error getting macOS keyboard layout:', error);
      return 'en-US';
    }
  }

  private async getWindowsKeyboardLayout(): Promise<string> {
    try {
      // Try a simpler approach for Windows
      const { stdout } = await execAsync('powershell -Command "Get-WinUserLanguageList | Select-Object -First 1 -ExpandProperty LanguageTag"');
      const layout = stdout.trim();
      
      // Map Windows language tags to our format
      const layoutMap: { [key: string]: string } = {
        'en-US': 'en-US',
        'ru-RU': 'ru',
        'de-DE': 'de',
        'fr-FR': 'fr'
      };

      return layoutMap[layout] || layout;
    } catch (error) {
      console.error('Error getting Windows keyboard layout:', error);
      return 'en-US';
    }
  }

  private async getLinuxKeyboardLayout(): Promise<string> {
    try {
      const { stdout } = await execAsync('setxkbmap -query | grep layout | awk \'{print $2}\'');
      const layout = stdout.trim();
      
      // Map Linux layout codes to our format
      const layoutMap: { [key: string]: string } = {
        'us': 'en-US',
        'ru': 'ru',
        'de': 'de',
        'fr': 'fr'
      };

      return layoutMap[layout] || layout;
    } catch (error) {
      console.error('Error getting Linux keyboard layout:', error);
      return 'en-US';
    }
  }

  private async updateCursorColor(): Promise<void> {
    if (!this.isEnabled) {
      return;
    }

    try {
      const currentLayout = await this.getCurrentKeyboardLayout();
      const color = this.layouts[currentLayout] || this.layouts['en-US'] || '#007ACC';

      console.log(`[KeyboardCursorColor] Detected layout: ${currentLayout}, color: ${color}`);

      // Read the entire color customizations object
      const config = vscode.workspace.getConfiguration();
      const colorCustomizations = config.get<any>('workbench.colorCustomizations') || {};
      colorCustomizations['editorCursor.foreground'] = color;
      await config.update('workbench.colorCustomizations', colorCustomizations, vscode.ConfigurationTarget.Global);

      this.updateStatusBar(currentLayout);
    } catch (error) {
      console.error('Error updating cursor color:', error);
    }
  }

  private updateStatusBar(layout?: string): void {
    try {
      if (this.isEnabled) {
        this.statusBarItem.text = `$(keyboard) ${layout || 'Unknown'}`;
        this.statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.prominentBackground');
      } else {
        this.statusBarItem.text = `$(keyboard) Disabled`;
        this.statusBarItem.backgroundColor = undefined;
      }
    } catch (error) {
      console.error('Error updating status bar:', error);
    }
  }

  private startMonitoring(): void {
    // Stop any existing monitoring
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }

    // Check for layout changes at the configured interval
    this.monitoringInterval = setInterval(async () => {
      if (this.isEnabled) {
        await this.updateCursorColor();
      }
    }, this.monitoringIntervalMs);

    // Also monitor VS Code configuration changes
    vscode.workspace.onDidChangeConfiguration(async (event: vscode.ConfigurationChangeEvent) => {
      if (event.affectsConfiguration('keyboardCursorColor')) {
        const extensionConfig = vscode.workspace.getConfiguration('keyboardCursorColor');
        this.isEnabled = extensionConfig.get('enabled', true);
        this.layouts = extensionConfig.get('layouts', this.layouts);
        this.monitoringIntervalMs = extensionConfig.get('monitoringIntervalMs', 250);

        if (this.isEnabled) {
          await this.updateCursorColor();
          this.startMonitoring();
        } else {
          await this.resetCursorColor();
          if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = undefined;
          }
        }

        this.updateStatusBar();
      }
    });
  }

  async resetCursorColor(): Promise<void> {
    try {
      const config = vscode.workspace.getConfiguration();
      const colorCustomizations = config.get<any>('workbench.colorCustomizations') || {};
      if (this.originalCursorColor !== undefined) {
        colorCustomizations['editorCursor.foreground'] = this.originalCursorColor;
      } else {
        delete colorCustomizations['editorCursor.foreground'];
      }
      await config.update('workbench.colorCustomizations', colorCustomizations, vscode.ConfigurationTarget.Global);
    } catch (error) {
      console.error('Error resetting cursor color:', error);
    }
  }

  async toggle(): Promise<void> {
    try {
      this.isEnabled = !this.isEnabled;
      
      if (this.isEnabled) {
        await this.updateCursorColor();
        this.startMonitoring();
        vscode.window.showInformationMessage('Keyboard cursor color enabled');
      } else {
        await this.resetCursorColor();
        if (this.monitoringInterval) {
          clearInterval(this.monitoringInterval);
          this.monitoringInterval = undefined;
        }
        vscode.window.showInformationMessage('Keyboard cursor color disabled');
      }
      
      this.updateStatusBar();
    } catch (error) {
      console.error('Error toggling keyboard cursor color:', error);
    }
  }

  dispose(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
    this.statusBarItem.dispose();
  }
}

let manager: KeyboardCursorColorManager;

export function activate(context: vscode.ExtensionContext): void {
  console.log('Keyboard Cursor Color extension is now active!');

  manager = new KeyboardCursorColorManager();
  
  // Initialize the manager
  manager.initialize().catch(console.error);

  // Listen for window focus changes
  manager.registerWindowFocusListener(context);

  // Register commands
  const toggleCommand = vscode.commands.registerCommand('keyboardCursorColor.toggle', async () => {
    await manager.toggle();
  });

  const resetCommand = vscode.commands.registerCommand('keyboardCursorColor.reset', async () => {
    await manager.resetCursorColor();
    vscode.window.showInformationMessage('Cursor color reset to default');
  });

  context.subscriptions.push(toggleCommand, resetCommand);
}

export function deactivate(): void {
  if (manager) {
    manager.dispose();
  }
} 