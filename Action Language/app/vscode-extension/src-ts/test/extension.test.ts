/**
 * Extension activation and basic functionality tests
 */

import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';

suite('Paradise Extension Test Suite', () => {
  vscode.window.showInformationMessage('Starting Paradise extension tests');

  test('Extension should be present', () => {
    assert.ok(vscode.extensions.getExtension('actionlanguage.actionlanguage-a11y'));
  });

  test('Extension should activate', async () => {
    const ext = vscode.extensions.getExtension('actionlanguage.actionlanguage-a11y');
    assert.ok(ext);
    await ext!.activate();
    assert.strictEqual(ext!.isActive, true);
  });

  test('Commands should be registered', async () => {
    const commands = await vscode.commands.getCommands(true);
    assert.ok(commands.includes('paradise.analyzeFile'));
    assert.ok(commands.includes('paradise.analyzeWorkspace'));
    assert.ok(commands.includes('paradise.clearDiagnostics'));
  });

  test('Configuration should have default values', () => {
    const config = vscode.workspace.getConfiguration('paradise');
    assert.strictEqual(config.get('enable'), true);
    assert.strictEqual(config.get('analysisMode'), 'smart');
    assert.strictEqual(config.get('enableBackgroundAnalysis'), true);
    assert.strictEqual(config.get('analyzeOnSave'), true);
    assert.strictEqual(config.get('analyzeOnType'), false);
  });
});

suite('Analysis Tests', () => {
  test('Should analyze file with mouse-only click handler', async () => {
    // Create a test document with a mouse-only click handler
    const content = `
      const button = document.getElementById('submit');
      button.addEventListener('click', () => {
        console.log('clicked');
      });
    `;

    const doc = await vscode.workspace.openTextDocument({
      content,
      language: 'javascript'
    });

    // Wait for analysis (give it 2 seconds)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Get diagnostics
    const diagnostics = vscode.languages.getDiagnostics(doc.uri);

    // Should have at least one diagnostic (mouse-only click)
    assert.ok(diagnostics.length > 0, 'Should detect mouse-only click handler');

    // Check if it's the right type
    const mouseOnlyIssue = diagnostics.find(d =>
      d.message.includes('click') || d.message.includes('keyboard')
    );
    assert.ok(mouseOnlyIssue, 'Should have mouse-only or keyboard-related diagnostic');
  });

  test('Should not flag false positive for keyboard handler in same file', async () => {
    // Create a test document with both click and keyboard handlers
    const content = `
      const button = document.getElementById('submit');
      button.addEventListener('click', () => {
        console.log('clicked');
      });
      button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          console.log('keyboard activated');
        }
      });
    `;

    const doc = await vscode.workspace.openTextDocument({
      content,
      language: 'javascript'
    });

    // Wait for analysis
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Get diagnostics
    const diagnostics = vscode.languages.getDiagnostics(doc.uri);

    // Should NOT have mouse-only click diagnostic (both handlers present)
    const mouseOnlyIssue = diagnostics.find(d =>
      d.message.includes('mouse-only') || d.code === 'mouse-only-click'
    );
    assert.strictEqual(mouseOnlyIssue, undefined, 'Should not flag false positive when keyboard handler exists');
  });

  test('Should clear diagnostics on command', async () => {
    // Create a test document
    const content = `
      const button = document.getElementById('submit');
      button.addEventListener('click', () => {});
    `;

    const doc = await vscode.workspace.openTextDocument({
      content,
      language: 'javascript'
    });

    // Wait for analysis
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Execute clear command
    await vscode.commands.executeCommand('paradise.clearDiagnostics');

    // Get diagnostics
    const diagnostics = vscode.languages.getDiagnostics(doc.uri);

    // Should be empty
    assert.strictEqual(diagnostics.length, 0, 'Diagnostics should be cleared');
  });
});

suite('Performance Tests', () => {
  test('File analysis should complete in <500ms', async () => {
    // Create a test document
    const content = `
      const button = document.getElementById('submit');
      button.addEventListener('click', () => {
        console.log('clicked');
      });
    `;

    const doc = await vscode.workspace.openTextDocument({
      content,
      language: 'javascript'
    });

    // Measure analysis time
    const startTime = Date.now();

    // Trigger analysis
    await vscode.commands.executeCommand('paradise.analyzeFile');

    const duration = Date.now() - startTime;

    // Should be fast (target <100ms, allow up to 500ms for safety)
    assert.ok(duration < 500, `Analysis took ${duration}ms, should be <500ms`);
  });
});
