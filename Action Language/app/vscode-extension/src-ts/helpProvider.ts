import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Provides help documentation for Paradise accessibility issues
 */
export class ParadiseHelpProvider {
  private docsPath: string;

  constructor(extensionPath: string) {
    // Help docs are packaged with the extension
    this.docsPath = path.join(extensionPath, 'docs', 'issues');
  }

  /**
   * Show help for a specific issue type
   */
  async showHelp(issueType: string): Promise<void> {
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

    // Open the markdown file in VS Code
    const document = await vscode.workspace.openTextDocument(helpFilePath);
    await vscode.window.showTextDocument(document, {
      preview: true,
      viewColumn: vscode.ViewColumn.Beside
    });

    // Optionally, show it as markdown preview
    await vscode.commands.executeCommand('markdown.showPreview', vscode.Uri.file(helpFilePath));
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
