# Keyboard Cursor Color Extension - Development Guide

## Overview

This VS Code extension automatically changes the cursor color based on your current keyboard layout. For example, when you switch from English (en-US) to Russian, the cursor changes from blue to red.

## Features

- **Cross-platform Support**: Works on macOS, Windows, and Linux
- **Automatic Detection**: Monitors keyboard layout changes every 2 seconds
- **Customizable Colors**: Configure different colors for each layout
- **Status Bar Indicator**: Shows current keyboard layout
- **Toggle Functionality**: Enable/disable with a single click

## How It Works

### Platform-Specific Detection

#### macOS
- Uses `defaults read ~/Library/Preferences/com.apple.HIToolbox.plist AppleCurrentKeyboardLayoutInputSourceID`
- Maps common layout IDs to standardized names

#### Windows
- Uses PowerShell: `Get-WinUserLanguageList | Select-Object -First 1 -ExpandProperty LanguageTag`
- Maps language tags to standardized names

#### Linux
- Uses `setxkbmap -query | grep layout | awk '{print $2}'`
- Maps layout codes to standardized names

### Color Management

The extension:
1. Stores the original cursor color when activated
2. Updates `workbench.colorCustomizations.editorCursor.foreground` based on current layout
3. Restores original color when disabled or reset

## Development Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Compile**:
   ```bash
   npm run compile
   ```

3. **Watch for Changes**:
   ```bash
   npm run watch
   ```

4. **Test**:
   ```bash
   npm run test
   ```

5. **Lint**:
   ```bash
   npm run lint
   ```

## Running in Development Mode

1. Open the extension folder in VS Code
2. Press `F5` to launch a new Extension Development Host
3. The extension will be loaded in the new window
4. Test by switching keyboard layouts

## Configuration

### Default Settings

```json
{
  "keyboardCursorColor.enabled": true,
  "keyboardCursorColor.layouts": {
    "en-US": "#007ACC",
    "ru": "#FF0000",
    "de": "#00FF00",
    "fr": "#0000FF"
  }
}
```

### Adding New Layouts

1. Add the layout mapping in the platform-specific detection methods
2. Add the color configuration in `package.json`
3. Update the default layouts in the extension code

## Architecture

### Main Components

1. **KeyboardCursorColorManager**: Core class handling all functionality
2. **Platform Detection**: Separate methods for each OS
3. **Configuration Management**: Handles VS Code settings
4. **Status Bar Integration**: Shows current layout status

### Key Methods

- `initialize()`: Sets up the extension
- `getCurrentKeyboardLayout()`: Detects current layout
- `updateCursorColor()`: Changes cursor color
- `startMonitoring()`: Begins layout monitoring
- `toggle()`: Enables/disables the extension

## Troubleshooting

### Common Issues

1. **Layout Not Detected**:
   - Check if platform-specific commands are available
   - Verify keyboard layouts are properly installed
   - Check console for error messages

2. **Color Not Changing**:
   - Verify the extension is enabled
   - Check VS Code color customization settings
   - Ensure layout mapping is correct

3. **Performance Issues**:
   - The extension checks every 2 seconds by default
   - Consider increasing the interval for better performance

### Debugging

1. **Enable Console Logging**:
   - Open Developer Tools in VS Code
   - Check the Console tab for error messages

2. **Test Platform Detection**:
   - Run the platform-specific commands manually
   - Verify they return expected results

3. **Check Configuration**:
   - Verify settings in VS Code
   - Check if color customizations are applied

## Building for Distribution

1. **Package Extension**:
   ```bash
   npm install -g vsce
   vsce package
   ```

2. **Install Locally**:
   - Install the generated `.vsix` file in VS Code

3. **Publish to Marketplace**:
   ```bash
   vsce publish
   ```

## Future Enhancements

- **Real-time Detection**: Use platform APIs for instant layout detection
- **Custom Themes**: Support for different color themes
- **Keyboard Shortcuts**: Add commands for manual layout switching
- **Advanced Mapping**: Support for more complex layout configurations
- **Performance Optimization**: Reduce polling frequency and improve efficiency

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details 