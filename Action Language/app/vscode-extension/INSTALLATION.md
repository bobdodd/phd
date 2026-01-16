# Installing Paradise VS Code Extension

## Installation

1. **Install the extension** in VS Code:
   ```bash
   code --install-extension actionlanguage-a11y-1.0.0.vsix
   ```

   Or manually:
   - Open VS Code
   - Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
   - Type "Install from VSIX"
   - Select the `actionlanguage-a11y-1.0.0.vsix` file

2. **Reload VS Code** to activate the extension

3. **Verify installation**:
   - Open Command Palette (`Cmd+Shift+P`)
   - Look for commands starting with "Paradise"
   - You should see:
     - Paradise: Analyze File Accessibility
     - Paradise: Analyze Workspace Accessibility
     - Paradise: Clear Diagnostics

## Testing the Extension

### Quick Test

1. Create a test file `test-accessibility.js`:
   ```javascript
   const button = document.getElementById('submit');
   button.addEventListener('click', () => {
     console.log('clicked');
   });
   ```

2. Open the file in VS Code
3. You should see a warning/error about the mouse-only click handler
4. The diagnostic should suggest adding a keyboard handler

### Expected Behavior

- **File Analysis**: Opens automatically when you open JS/TS/JSX/TSX/HTML files
- **Analysis Speed**: Should complete in <100ms (instant)
- **Status Bar**: "Paradise" indicator in bottom right
- **Diagnostics**: Issues appear as squiggly underlines with hover tooltips

### Configuration

Open VS Code Settings (`Cmd+,`) and search for "Paradise":

- `paradise.enable` - Enable/disable analysis (default: true)
- `paradise.analysisMode` - Set to "file", "smart", or "project" (default: "smart")
- `paradise.analyzeOnSave` - Run analysis on save (default: true)
- `paradise.analyzeOnType` - Run analysis as you type (default: false)

## Troubleshooting

### Extension not activating

1. Check VS Code Output panel (View → Output)
2. Select "Paradise" from the dropdown
3. Look for activation messages or errors

### No diagnostics appearing

1. Ensure the file type is supported (JS/TS/JSX/TSX/HTML/CSS)
2. Check that `paradise.enable` is set to `true` in settings
3. Try running "Paradise: Analyze File" command manually

### Performance issues

1. Set `paradise.analysisMode` to "file" for fastest analysis
2. Disable `paradise.analyzeOnType` if typing feels sluggish
3. Adjust `paradise.maxProjectFiles` to limit background analysis

## Development/Debugging

To debug the extension:

1. Open the extension folder in VS Code
2. Press F5 to launch Extension Development Host
3. Set breakpoints in `src-ts/` files
4. Test changes in the new VS Code window
