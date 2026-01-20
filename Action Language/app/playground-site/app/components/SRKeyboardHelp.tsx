'use client';

interface KeyboardShortcut {
  key: string;
  description: string;
  category: 'navigation' | 'element-type' | 'action' | 'mode';
}

const KEYBOARD_SHORTCUTS: KeyboardShortcut[] = [
  // Navigation
  { key: '↓ Arrow Down', description: 'Next element', category: 'navigation' },
  { key: '↑ Arrow Up', description: 'Previous element', category: 'navigation' },

  // Element type navigation
  { key: 'H', description: 'Next heading', category: 'element-type' },
  { key: 'Shift+H', description: 'Previous heading', category: 'element-type' },
  { key: 'K', description: 'Next link', category: 'element-type' },
  { key: 'Shift+K', description: 'Previous link', category: 'element-type' },
  { key: 'B', description: 'Next button', category: 'element-type' },
  { key: 'Shift+B', description: 'Previous button', category: 'element-type' },
  { key: 'D', description: 'Next landmark', category: 'element-type' },
  { key: 'F', description: 'Next form control', category: 'element-type' },
  { key: 'T', description: 'Next table', category: 'element-type' },
  { key: 'Shift+T', description: 'Previous table', category: 'element-type' },
  { key: 'L', description: 'Next list', category: 'element-type' },
  { key: 'Shift+L', description: 'Previous list', category: 'element-type' },
  { key: 'G', description: 'Next graphic', category: 'element-type' },
  { key: 'Shift+G', description: 'Previous graphic', category: 'element-type' },

  // Actions
  { key: 'Enter', description: 'Activate element', category: 'action' },

  // Mode
  { key: 'Tab', description: 'Toggle Browse/Focus mode', category: 'mode' },
  { key: 'Esc', description: 'Close screen reader', category: 'action' },
];

const CATEGORY_LABELS = {
  navigation: 'Basic Navigation',
  'element-type': 'Element Type Navigation',
  action: 'Actions',
  mode: 'Mode Control',
};

export default function SRKeyboardHelp() {
  const categories = ['navigation', 'element-type', 'action', 'mode'] as const;

  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg text-sm">
      <h3 className="text-base font-semibold mb-3 border-b border-gray-600 pb-2">
        Keyboard Shortcuts
      </h3>

      <div className="space-y-4">
        {categories.map(category => {
          const shortcuts = KEYBOARD_SHORTCUTS.filter(s => s.category === category);
          if (shortcuts.length === 0) return null;

          return (
            <div key={category}>
              <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">
                {CATEGORY_LABELS[category]}
              </h4>
              <div className="space-y-1.5">
                {shortcuts.map((shortcut, index) => (
                  <div key={index} className="flex justify-between items-start gap-3">
                    <kbd className="inline-block px-2 py-0.5 text-xs font-mono bg-gray-700 rounded border border-gray-600 whitespace-nowrap">
                      {shortcut.key}
                    </kbd>
                    <span className="text-xs text-gray-300 flex-1 text-right">
                      {shortcut.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-600">
        <p className="text-xs text-gray-400">
          <strong>Browse Mode:</strong> Navigate all content element by element
        </p>
        <p className="text-xs text-gray-400 mt-1">
          <strong>Focus Mode:</strong> Navigate only focusable elements (Tab order)
        </p>
      </div>
    </div>
  );
}
