# Keyboard Cursor Color Extension - Usage Guide

## Quick Start

1. **Install the Extension**:
   ```bash
   cd keyboard-cursor-color
   ./install.sh
   ```

2. **Run in Development Mode**:
   - Open the `keyboard-cursor-color` folder in VS Code
   - Press `F5` to launch Extension Development Host
   - The extension will automatically activate

3. **Test the Extension**:
   - Switch your keyboard layout (e.g., from English to Russian)
   - Watch the cursor color change automatically
   - Check the status bar for current layout indicator

## Features

### Automatic Color Changes

The extension automatically changes cursor color based on your keyboard layout:

- **English (en-US)**: Blue cursor (`#007ACC`)
- **Russian (ru)**: Red cursor (`#FF0000`)
- **German (de)**: Green cursor (`#00FF00`)
- **French (fr)**: Blue cursor (`#0000FF`)

### Status Bar Indicator

- Shows current keyboard layout in the status bar
- Click to toggle the extension on/off
- Displays "Disabled" when the extension is turned off

### Commands

- **Toggle Keyboard Cursor Color**: Enable/disable the extension
- **Reset Cursor Color**: Reset to default VS Code cursor color

## Configuration

### Customizing Colors

You can customize colors for different layouts in VS Code settings:

```json
{
  "keyboardCursorColor.enabled": true,
  "keyboardCursorColor.layouts": {
    "en-US": "#007ACC",
    "ru": "#FF0000",
    "de": "#00FF00",
    "fr": "#0000FF",
    "es": "#FFA500",
    "it": "#800080"
  }
}
```

### Adding New Layouts

1. **Add Layout Detection**:
   - Edit the platform-specific detection methods in `src/extension.ts`
   - Add mapping for your layout ID

2. **Add Color Configuration**:
   - Add the layout and color to the `layouts` object in settings
   - Update the default layouts in the extension code

## Platform Support

### macOS
- Detects keyboard layouts using `defaults read`
- Supports common layouts: US, Russian, German, French
- Automatically maps layout IDs to standardized names

### Windows
- Uses PowerShell to detect input methods
- Supports language tags: en-US, ru-RU, de-DE, fr-FR
- Maps language tags to standardized names

### Linux
- Uses `setxkbmap` to detect keyboard layout
- Supports layout codes: us, ru, de, fr
- Maps layout codes to standardized names

## Troubleshooting

### Extension Not Working

1. **Check if Enabled**:
   - Look at the status bar indicator
   - Click to toggle if needed

2. **Verify Layout Detection**:
   - Open Developer Tools (Help > Toggle Developer Tools)
   - Check Console for error messages
   - Test platform-specific commands manually

3. **Check Color Customizations**:
   - Open VS Code settings
   - Search for "workbench.colorCustomizations"
   - Verify cursor color is being set

### Layout Not Detected

1. **macOS**:
   ```bash
   defaults read ~/Library/Preferences/com.apple.HIToolbox.plist AppleCurrentKeyboardLayoutInputSourceID
   ```

2. **Windows**:
   ```powershell
   Get-WinUserLanguageList | Select-Object -First 1 -ExpandProperty LanguageTag
   ```

3. **Linux**:
   ```bash
   setxkbmap -query | grep layout | awk '{print $2}'
   ```

### Performance Issues

- The extension checks every 2 seconds by default
- If this causes performance issues, you can modify the interval in the code
- Consider disabling the extension if not needed

## Advanced Usage

### Manual Layout Testing

You can test the extension by manually triggering layout changes:

1. **macOS**: Use the Input Sources menu in the menu bar
2. **Windows**: Use the language bar in the taskbar
3. **Linux**: Use your desktop environment's input method switcher

### Custom Themes

The extension works with VS Code's color customization system:

```json
{
  "workbench.colorCustomizations": {
    "editorCursor.foreground": "#FF0000"
  }
}
```

### Integration with Other Extensions

The extension modifies the `editorCursor.foreground` setting, so it may interact with other extensions that also modify cursor colors. The extension stores the original cursor color and restores it when disabled.

## Development

### Building for Distribution

1. **Package the Extension**:
   ```bash
   npm install -g vsce
   vsce package
   ```

2. **Install Locally**:
   - Install the generated `.vsix` file in VS Code
   - Or publish to the VS Code Marketplace

### Contributing

1. Fork the repository
2. Make your changes
3. Test thoroughly on your platform
4. Submit a pull request

## Support

For issues or questions:
- Check the console for error messages
- Verify your platform is supported
- Test the platform-specific commands manually
- Consider filing an issue with detailed information about your setup

## License

MIT License - see LICENSE file for details 