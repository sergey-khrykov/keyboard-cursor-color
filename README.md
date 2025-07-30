# Keyboard Cursor Color Extension

This VS Code extension automatically changes the cursor color based on your current keyboard layout. Now you can see which layout is active before you start typing. No more erase-and-type-again!

## Features

- **Automatic Layout Detection**: Detects keyboard layout changes on macOS, Windows, and Linux
- **Customizable Colors**: Configure different colors for each keyboard layout
- **Status Bar Indicator**: Shows current keyboard layout in the status bar
- **Toggle Functionality**: Enable/disable the extension with a single click
- **Reset Option**: Reset cursor color to default

## Installation

1. Clone this repository
2. Run `npm install` in the extension directory
3. Press `F5` in VS Code to run the extension in development mode
4. Or package the extension with `vsce package` and install the `.vsix` file

## Configuration

You can customize the cursor colors for different keyboard layouts in VS Code settings:

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

## Supported Platforms

- **macOS**: Uses `defaults read` to detect keyboard layout
- **Windows**: Uses PowerShell to detect input method
- **Linux**: Uses `setxkbmap` to detect keyboard layout

## Commands

- `Keyboard Cursor Color: Toggle` - Enable/disable the extension
- `Keyboard Cursor Color: Reset` - Reset cursor color to default

## Development

1. Install dependencies: `npm install`
2. Compile: `npm run compile`
3. Watch for changes: `npm run watch`
4. Test: `npm run test`

## How it Works

The extension:
1. Detects the current keyboard layout using platform-specific commands
2. Maps the layout to a predefined color
3. Updates VS Code's cursor color through the `workbench.colorCustomizations` setting
4. Monitors for layout changes at a configurable interval (default: 250 ms)
5. Shows the current layout in the status bar

## Troubleshooting

- If the extension doesn't detect layout changes, check that the platform-specific commands are available
- For macOS, ensure you have the necessary keyboard layouts installed
- For Windows, the extension requires PowerShell access
- For Linux, ensure `setxkbmap` is installed

## License

MIT 