/**
 * MockWindow - Simulates the browser Window for accessibility analysis
 *
 * Provides:
 * - Timer functions (setTimeout, setInterval) with tracking
 * - Event handling at window level
 * - Location, navigator simulation
 * - Alert/confirm/prompt tracking
 */

const MockDocument = require('./MockDocument');

class MockWindow {
  constructor() {
    // Create associated document
    this.document = new MockDocument();

    // Timer tracking
    this._timers = new Map();
    this._timerIdCounter = 0;
    this._intervals = new Map();

    // Event listeners
    this._eventListeners = new Map();

    // Interaction tracking
    this._interactions = [];

    // Pending timer callbacks (for manual execution)
    this._pendingTimers = [];

    // Location simulation
    this.location = {
      href: 'http://localhost/',
      protocol: 'http:',
      host: 'localhost',
      hostname: 'localhost',
      port: '',
      pathname: '/',
      search: '',
      hash: '',
      origin: 'http://localhost',
      reload: () => this._trackInteraction('location.reload'),
      assign: (url) => this._trackInteraction('location.assign', { url }),
      replace: (url) => this._trackInteraction('location.replace', { url })
    };

    // Navigator simulation
    this.navigator = {
      userAgent: 'MockBrowser/1.0',
      language: 'en-US',
      languages: ['en-US', 'en'],
      platform: 'MockPlatform',
      cookieEnabled: true,
      onLine: true
    };

    // Screen simulation
    this.screen = {
      width: 1920,
      height: 1080,
      availWidth: 1920,
      availHeight: 1040,
      colorDepth: 24,
      pixelDepth: 24
    };

    // Window dimensions
    this.innerWidth = 1920;
    this.innerHeight = 1080;
    this.outerWidth = 1920;
    this.outerHeight = 1120;
    this.scrollX = 0;
    this.scrollY = 0;
    this.pageXOffset = 0;
    this.pageYOffset = 0;

    // Self reference
    this.window = this;
    this.self = this;
    this.parent = this;
    this.top = this;
  }

  // === Timer Functions ===

  setTimeout(callback, delay = 0, ...args) {
    const id = ++this._timerIdCounter;

    const timerInfo = {
      id,
      type: 'timeout',
      callback,
      delay,
      args,
      createdAt: Date.now(),
      scheduledFor: Date.now() + delay,
      executed: false,
      cancelled: false
    };

    this._timers.set(id, timerInfo);

    this._trackInteraction('setTimeout', {
      id,
      delay,
      hasCallback: typeof callback === 'function'
    });

    // Add to pending for manual execution
    this._pendingTimers.push(timerInfo);

    return id;
  }

  clearTimeout(id) {
    const timer = this._timers.get(id);
    if (timer) {
      timer.cancelled = true;
      this._trackInteraction('clearTimeout', { id, delay: timer.delay });
    }
  }

  setInterval(callback, delay = 0, ...args) {
    const id = ++this._timerIdCounter;

    const intervalInfo = {
      id,
      type: 'interval',
      callback,
      delay,
      args,
      createdAt: Date.now(),
      executionCount: 0,
      cancelled: false
    };

    this._intervals.set(id, intervalInfo);
    this._timers.set(id, intervalInfo);

    this._trackInteraction('setInterval', {
      id,
      delay,
      hasCallback: typeof callback === 'function'
    });

    return id;
  }

  clearInterval(id) {
    const interval = this._intervals.get(id);
    if (interval) {
      interval.cancelled = true;
      this._intervals.delete(id);
      this._trackInteraction('clearInterval', {
        id,
        delay: interval.delay,
        executionCount: interval.executionCount
      });
    }
  }

  /**
   * Manually execute pending timers (for testing)
   * @param {number} [upToTime] - Execute timers scheduled up to this time
   */
  executeTimers(upToTime = Infinity) {
    const now = Date.now();
    const executeTime = upToTime === Infinity ? now + 1000000 : upToTime;

    for (const timer of this._pendingTimers) {
      if (!timer.cancelled && !timer.executed && timer.scheduledFor <= executeTime) {
        if (typeof timer.callback === 'function') {
          timer.callback(...timer.args);
        }
        timer.executed = true;
      }
    }

    // Clean up executed timers
    this._pendingTimers = this._pendingTimers.filter(t => !t.executed && !t.cancelled);
  }

  /**
   * Execute a specific interval once (for testing)
   * @param {number} id - Interval ID
   */
  tickInterval(id) {
    const interval = this._intervals.get(id);
    if (interval && !interval.cancelled) {
      if (typeof interval.callback === 'function') {
        interval.callback(...interval.args);
      }
      interval.executionCount++;
    }
  }

  // === Animation Frame ===

  requestAnimationFrame(callback) {
    const id = ++this._timerIdCounter;

    this._trackInteraction('requestAnimationFrame', { id });

    // Simulate ~60fps
    this._timers.set(id, {
      id,
      type: 'animationFrame',
      callback,
      scheduledFor: Date.now() + 16
    });

    return id;
  }

  cancelAnimationFrame(id) {
    const timer = this._timers.get(id);
    if (timer && timer.type === 'animationFrame') {
      timer.cancelled = true;
      this._trackInteraction('cancelAnimationFrame', { id });
    }
  }

  // === Event Methods ===

  addEventListener(type, listener, options = {}) {
    if (!this._eventListeners.has(type)) {
      this._eventListeners.set(type, []);
    }

    this._eventListeners.get(type).push({
      listener,
      options: typeof options === 'boolean' ? { capture: options } : options,
      timestamp: Date.now()
    });

    this._trackInteraction('window.addEventListener', { type });
  }

  removeEventListener(type, listener) {
    if (!this._eventListeners.has(type)) return;

    const listeners = this._eventListeners.get(type);
    const index = listeners.findIndex(l => l.listener === listener);

    if (index > -1) {
      listeners.splice(index, 1);
      this._trackInteraction('window.removeEventListener', { type });
    }
  }

  dispatchEvent(event) {
    const type = event.type || event;
    const listeners = this._eventListeners.get(type) || [];

    this._trackInteraction('window.dispatchEvent', { type });

    for (const { listener } of listeners) {
      if (typeof listener === 'function') {
        listener.call(this, event);
      }
    }

    return true;
  }

  // === Dialog Methods ===

  alert(message) {
    this._trackInteraction('alert', { message });
    // In simulation, just track it
  }

  confirm(message) {
    this._trackInteraction('confirm', { message });
    // Return true by default in simulation
    return true;
  }

  prompt(message, defaultValue) {
    this._trackInteraction('prompt', { message, defaultValue });
    // Return default value in simulation
    return defaultValue || '';
  }

  // === Scroll Methods ===

  scrollTo(x, y) {
    if (typeof x === 'object') {
      this.scrollX = x.left || 0;
      this.scrollY = x.top || 0;
    } else {
      this.scrollX = x || 0;
      this.scrollY = y || 0;
    }
    this.pageXOffset = this.scrollX;
    this.pageYOffset = this.scrollY;

    this._trackInteraction('scrollTo', { x: this.scrollX, y: this.scrollY });
  }

  scrollBy(x, y) {
    if (typeof x === 'object') {
      this.scrollX += x.left || 0;
      this.scrollY += x.top || 0;
    } else {
      this.scrollX += x || 0;
      this.scrollY += y || 0;
    }
    this.pageXOffset = this.scrollX;
    this.pageYOffset = this.scrollY;

    this._trackInteraction('scrollBy', { x: this.scrollX, y: this.scrollY });
  }

  // === Window Methods ===

  open(url, target, features) {
    this._trackInteraction('window.open', { url, target, features });
    return null; // Don't actually open
  }

  close() {
    this._trackInteraction('window.close');
  }

  focus() {
    this._trackInteraction('window.focus');
  }

  blur() {
    this._trackInteraction('window.blur');
  }

  print() {
    this._trackInteraction('window.print');
  }

  // === Storage Simulation ===

  get localStorage() {
    if (!this._localStorage) {
      this._localStorage = this._createStorage('localStorage');
    }
    return this._localStorage;
  }

  get sessionStorage() {
    if (!this._sessionStorage) {
      this._sessionStorage = this._createStorage('sessionStorage');
    }
    return this._sessionStorage;
  }

  _createStorage(name) {
    const data = new Map();
    const window = this;

    return {
      getItem(key) {
        window._trackInteraction(`${name}.getItem`, { key });
        return data.get(key) || null;
      },
      setItem(key, value) {
        window._trackInteraction(`${name}.setItem`, { key, value: String(value).slice(0, 50) });
        data.set(key, String(value));
      },
      removeItem(key) {
        window._trackInteraction(`${name}.removeItem`, { key });
        data.delete(key);
      },
      clear() {
        window._trackInteraction(`${name}.clear`);
        data.clear();
      },
      get length() {
        return data.size;
      },
      key(index) {
        return Array.from(data.keys())[index] || null;
      }
    };
  }

  // === Utility Methods ===

  getComputedStyle(element) {
    // Return the element's style object
    return element.style || {};
  }

  matchMedia(query) {
    this._trackInteraction('matchMedia', { query });
    return {
      matches: false,
      media: query,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {}
    };
  }

  // === Interaction Tracking ===

  _trackInteraction(type, details = {}) {
    this._interactions.push({
      type,
      details,
      timestamp: Date.now()
    });
  }

  /**
   * Get all window-level interactions
   * @returns {Array}
   */
  getInteractions() {
    return [...this._interactions];
  }

  /**
   * Get all interactions including document and elements
   * @returns {Array}
   */
  getAllInteractions() {
    const all = [...this._interactions];
    all.push(...this.document.getAllInteractions());
    return all.sort((a, b) => a.timestamp - b.timestamp);
  }

  /**
   * Clear all tracked interactions
   */
  clearInteractions() {
    this._interactions = [];
    this.document.clearInteractions();
  }

  /**
   * Get timer analysis
   * @returns {Object}
   */
  getTimerAnalysis() {
    const timeouts = [];
    const intervals = [];

    for (const [id, timer] of this._timers) {
      if (timer.type === 'timeout') {
        timeouts.push({
          id,
          delay: timer.delay,
          executed: timer.executed,
          cancelled: timer.cancelled
        });
      } else if (timer.type === 'interval') {
        intervals.push({
          id,
          delay: timer.delay,
          executionCount: timer.executionCount,
          cancelled: timer.cancelled
        });
      }
    }

    return {
      timeouts,
      intervals,
      shortTimeouts: timeouts.filter(t => t.delay < 5000 && !t.cancelled),
      longIntervals: intervals.filter(i => i.delay > 60000 && !i.cancelled)
    };
  }

  toString() {
    return '[MockWindow]';
  }
}

module.exports = MockWindow;
