import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { Issue } from '../lib/analyzers/BaseAnalyzer';

/**
 * Provides help documentation for Paradise accessibility issues
 */
export class ParadiseHelpProvider {
  private docsPath: string;
  private extensionPath: string;

  constructor(extensionPath: string) {
    this.extensionPath = extensionPath;
    // Help docs are packaged with the extension
    this.docsPath = path.join(extensionPath, 'docs', 'issues');
  }

  /**
   * Show help for a specific issue type with optional fix context
   */
  async showHelp(issueType: string, issue?: Issue): Promise<void> {
    const helpFilePath = path.join(this.docsPath, `${issueType}.md`);

    // Check if help file exists
    if (!fs.existsSync(helpFilePath)) {
      vscode.window.showWarningMessage(
        `Help documentation for "${issueType}" is not yet available.`,
        'View All Help'
      ).then(selection => {
        if (selection === 'View All Help') {
          this.showHelpIndex();
        }
      });
      return;
    }

    // If we have issue context with a fix, show enhanced webview
    if (issue && issue.fix) {
      await this.showHelpWithFix(issueType, issue, helpFilePath);
    } else {
      // Otherwise show markdown preview
      const document = await vscode.workspace.openTextDocument(helpFilePath);
      await vscode.window.showTextDocument(document, {
        preview: true,
        viewColumn: vscode.ViewColumn.Beside
      });
      await vscode.commands.executeCommand('markdown.showPreview', vscode.Uri.file(helpFilePath));
    }
  }

  /**
   * Show help with fix code in a webview panel
   */
  private async showHelpWithFix(issueType: string, issue: Issue, helpFilePath: string): Promise<void> {
    const panel = vscode.window.createWebviewPanel(
      'paradiseHelp',
      `Paradise Help: ${issueType}`,
      vscode.ViewColumn.Beside,
      {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.file(this.extensionPath)]
      }
    );

    // Read the markdown content
    const markdownContent = fs.readFileSync(helpFilePath, 'utf-8');

    // Convert markdown to HTML (simple conversion)
    const htmlContent = this.markdownToHtml(markdownContent);

    // Build the full HTML with fix section
    panel.webview.html = this.getWebviewContent(htmlContent, issue);

    // Handle messages from webview
    panel.webview.onDidReceiveMessage(
      async message => {
        switch (message.command) {
          case 'copy':
            await vscode.env.clipboard.writeText(message.code);
            vscode.window.showInformationMessage('Fix code copied to clipboard!');
            break;
          case 'apply':
            await this.applyFix(issue);
            vscode.window.showInformationMessage('Fix applied!');
            panel.dispose();
            break;
        }
      }
    );
  }

  /**
   * Apply a fix to the document
   */
  private async applyFix(issue: Issue): Promise<void> {
    if (!issue.fix) return;

    const edit = new vscode.WorkspaceEdit();
    const targetUri = vscode.Uri.file(issue.fix.location.file);
    const fixLine = issue.fix.location.line - 1;
    const insertPosition = new vscode.Position(fixLine + 1, 0);
    const insertText = '\n' + issue.fix.code + '\n';

    edit.insert(targetUri, insertPosition, insertText);
    await vscode.workspace.applyEdit(edit);

    // Open the file and show the fix
    const document = await vscode.workspace.openTextDocument(targetUri);
    await vscode.window.showTextDocument(document);
  }

  /**
   * Convert markdown to HTML (simple conversion for basic markdown)
   */
  private markdownToHtml(markdown: string): string {
    let html = markdown
      // Headers
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      // Bold
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // Code blocks
      .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
      // Paragraphs
      .replace(/\n\n/g, '</p><p>')
      // List items
      .replace(/^- (.*)$/gm, '<li>$1</li>')
      // Wrap lists
      .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
      // Blockquotes
      .replace(/^> (.*)$/gm, '<blockquote>$1</blockquote>');

    return `<p>${html}</p>`;
  }

  /**
   * Get the HTML content for the webview
   */
  private getWebviewContent(markdownHtml: string, issue: Issue): string {
    const fix = issue.fix;
    if (!fix) return '';

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Paradise Help</title>
    <style>
        body {
            font-family: var(--vscode-font-family);
            font-size: var(--vscode-font-size);
            color: var(--vscode-foreground);
            background: var(--vscode-editor-background);
            padding: 20px;
            line-height: 1.6;
        }
        h1 {
            color: var(--vscode-textLink-foreground);
            border-bottom: 1px solid var(--vscode-panel-border);
            padding-bottom: 10px;
        }
        h2 {
            color: var(--vscode-textLink-activeForeground);
            margin-top: 30px;
        }
        h3 {
            color: var(--vscode-textPreformat-foreground);
            margin-top: 20px;
        }
        code {
            background: var(--vscode-textCodeBlock-background);
            padding: 2px 6px;
            border-radius: 3px;
            font-family: var(--vscode-editor-font-family);
        }
        pre {
            background: var(--vscode-textCodeBlock-background);
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
            border: 1px solid var(--vscode-panel-border);
        }
        pre code {
            background: none;
            padding: 0;
        }
        a {
            color: var(--vscode-textLink-foreground);
            text-decoration: none;
        }
        a:hover {
            color: var(--vscode-textLink-activeForeground);
            text-decoration: underline;
        }
        .fix-section {
            background: var(--vscode-editor-inactiveSelectionBackground);
            border: 2px solid var(--vscode-textLink-foreground);
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .fix-section h2 {
            margin-top: 0;
            color: var(--vscode-textLink-foreground);
        }
        .fix-description {
            margin-bottom: 15px;
            font-size: 1.1em;
            color: var(--vscode-foreground);
        }
        .fix-code {
            background: var(--vscode-textCodeBlock-background);
            color: var(--vscode-editor-foreground);
            padding: 15px;
            border-radius: 5px;
            font-family: var(--vscode-editor-font-family);
            font-size: 13px;
            margin: 15px 0;
            white-space: pre-wrap;
            border: 1px solid var(--vscode-panel-border);
        }
        .button-group {
            display: flex;
            gap: 10px;
            margin-top: 15px;
        }
        button {
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-family: var(--vscode-font-family);
            transition: background 0.2s;
        }
        button:hover {
            background: var(--vscode-button-hoverBackground);
        }
        button.secondary {
            background: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
        }
        button.secondary:hover {
            background: var(--vscode-button-secondaryHoverBackground);
        }
        .fix-location {
            font-size: 0.9em;
            color: var(--vscode-descriptionForeground);
            margin-top: 10px;
        }
        blockquote {
            border-left: 4px solid var(--vscode-textLink-foreground);
            margin: 15px 0;
            padding-left: 15px;
            color: var(--vscode-descriptionForeground);
        }
        ul {
            padding-left: 25px;
        }
        li {
            margin: 5px 0;
        }
        .help-content {
            color: var(--vscode-foreground);
        }
    </style>
</head>
<body>
    <div class="fix-section">
        <h2>🔧 Suggested Fix</h2>
        <div class="fix-description">${this.escapeHtml(fix.description)}</div>
        <div class="fix-code">${this.escapeHtml(fix.code)}</div>
        <div class="fix-location">
            📍 Will be applied at: <code>${this.escapeHtml(fix.location.file)}:${fix.location.line}</code>
        </div>
        <div class="button-group">
            <button onclick="applyFix()">✓ Apply Fix</button>
            <button class="secondary" onclick="copyFix()">📋 Copy to Clipboard</button>
        </div>
    </div>

    <hr style="border: 1px solid var(--vscode-panel-border); margin: 30px 0;">

    <div class="help-content">
        ${markdownHtml}
    </div>

    <script>
        const vscode = acquireVsCodeApi();

        function copyFix() {
            vscode.postMessage({
                command: 'copy',
                code: ${JSON.stringify(fix.code)}
            });
        }

        function applyFix() {
            vscode.postMessage({
                command: 'apply'
            });
        }
    </script>
</body>
</html>`;
  }

  /**
   * Escape HTML special characters
   */
  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Show the help index
   */
  async showHelpIndex(): Promise<void> {
    const indexPath = path.join(this.docsPath, 'README.md');

    if (!fs.existsSync(indexPath)) {
      vscode.window.showErrorMessage('Paradise help documentation not found.');
      return;
    }

    const document = await vscode.workspace.openTextDocument(indexPath);
    await vscode.window.showTextDocument(document, {
      preview: true,
      viewColumn: vscode.ViewColumn.Beside
    });

    await vscode.commands.executeCommand('markdown.showPreview', vscode.Uri.file(indexPath));
  }

  /**
   * Get inline help text for a tooltip (first paragraph of help file)
   */
  getInlineHelp(issueType: string): string | undefined {
    const helpFilePath = path.join(this.docsPath, `${issueType}.md`);

    if (!fs.existsSync(helpFilePath)) {
      return undefined;
    }

    try {
      const content = fs.readFileSync(helpFilePath, 'utf-8');

      // Extract the description section (after the header, before "Why This Matters")
      const descriptionMatch = content.match(/## Description\n\n([\s\S]*?)\n\n## Why This Matters/);

      if (descriptionMatch) {
        return descriptionMatch[1].trim();
      }

      // Fallback: get first paragraph after title
      const lines = content.split('\n');
      const paragraphs: string[] = [];
      let inParagraph = false;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Skip front matter and title
        if (line.startsWith('#') || line.startsWith('**')) {
          continue;
        }

        if (line.length > 0) {
          if (!inParagraph) {
            inParagraph = true;
          }
          paragraphs.push(line);
        } else if (inParagraph) {
          break; // End of first paragraph
        }
      }

      return paragraphs.join(' ');
    } catch (error) {
      console.error(`[HelpProvider] Error reading help file: ${helpFilePath}`, error);
      return undefined;
    }
  }
}
