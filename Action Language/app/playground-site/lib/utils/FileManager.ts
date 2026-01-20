/**
 * File Manager for Paradise Playground
 * Save and load HTML/CSS/JS files for training and testing
 */

export interface PlaygroundFiles {
  html: string;
  css: string;
  js: string;
  metadata?: {
    title?: string;
    description?: string;
    author?: string;
    created?: number;
    modified?: number;
  };
}

export class FileManager {
  /**
   * Save files to local storage
   */
  static saveToLocalStorage(key: string, files: PlaygroundFiles): void {
    try {
      const data = {
        ...files,
        metadata: {
          ...files.metadata,
          modified: Date.now()
        }
      };
      localStorage.setItem(key, JSON.stringify(data));
      console.log('Files saved to local storage:', key);
    } catch (error) {
      console.error('Failed to save files to local storage:', error);
      throw new Error('Failed to save files. Storage may be full.');
    }
  }

  /**
   * Load files from local storage
   */
  static loadFromLocalStorage(key: string): PlaygroundFiles | null {
    try {
      const data = localStorage.getItem(key);
      if (!data) return null;
      return JSON.parse(data);
    } catch (error) {
      console.error('Failed to load files from local storage:', error);
      return null;
    }
  }

  /**
   * Get all saved projects from local storage
   */
  static getSavedProjects(): { key: string; metadata?: PlaygroundFiles['metadata'] }[] {
    const projects: { key: string; metadata?: PlaygroundFiles['metadata'] }[] = [];

    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('playground-')) {
          const data = FileManager.loadFromLocalStorage(key);
          if (data) {
            projects.push({ key, metadata: data.metadata });
          }
        }
      }
    } catch (error) {
      console.error('Failed to get saved projects:', error);
    }

    return projects.sort((a, b) => {
      const aTime = a.metadata?.modified || 0;
      const bTime = b.metadata?.modified || 0;
      return bTime - aTime; // Most recent first
    });
  }

  /**
   * Delete project from local storage
   */
  static deleteFromLocalStorage(key: string): void {
    try {
      localStorage.removeItem(key);
      console.log('Project deleted:', key);
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  }

  /**
   * Export files as JSON
   */
  static exportAsJSON(files: PlaygroundFiles): string {
    return JSON.stringify(files, null, 2);
  }

  /**
   * Import files from JSON
   */
  static importFromJSON(json: string): PlaygroundFiles {
    return JSON.parse(json);
  }

  /**
   * Export files as complete HTML document
   */
  static exportAsCompleteHTML(files: PlaygroundFiles): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${files.metadata?.title || 'Paradise Playground Export'}</title>
  <style>
${files.css}
  </style>
</head>
<body>
${files.html}

  <script>
${files.js}
  </script>
</body>
</html>`;
  }

  /**
   * Download file to user's computer
   */
  static downloadFile(content: string, filename: string, mimeType: string = 'text/plain'): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Download playground files as separate files
   */
  static downloadProject(files: PlaygroundFiles, baseName?: string): void {
    const name = baseName || files.metadata?.title || 'playground';
    const safeName = name.replace(/[^a-z0-9_-]/gi, '-').toLowerCase();
    const timestamp = new Date().toISOString().split('T')[0];
    const fileName = `${safeName}-${timestamp}`;

    // Download individual files
    this.downloadFile(files.html, `${fileName}.html`, 'text/html');
    this.downloadFile(files.css, `${fileName}.css`, 'text/css');
    this.downloadFile(files.js, `${fileName}.js`, 'text/javascript');

    // Download JSON package
    this.downloadFile(
      this.exportAsJSON(files),
      `${fileName}-package.json`,
      'application/json'
    );

    // Download complete HTML
    this.downloadFile(
      this.exportAsCompleteHTML(files),
      `${fileName}-complete.html`,
      'text/html'
    );

    console.log('Project files downloaded:', fileName);
  }

  /**
   * Read file from input element
   */
  static readFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result;
        if (typeof content === 'string') {
          resolve(content);
        } else {
          reject(new Error('Failed to read file as text'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  /**
   * Generate unique project key
   */
  static generateProjectKey(title?: string): string {
    const safeName = title
      ? title.replace(/[^a-z0-9_-]/gi, '-').toLowerCase()
      : 'untitled';
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 5);
    return `playground-${safeName}-${timestamp}-${random}`;
  }
}
