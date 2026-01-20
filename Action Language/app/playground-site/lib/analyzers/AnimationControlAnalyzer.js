"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimationControlAnalyzer = void 0;
const BaseAnalyzer_1 = require("./BaseAnalyzer");
class AnimationControlAnalyzer extends BaseAnalyzer_1.BaseAnalyzer {
    constructor() {
        super(...arguments);
        this.name = 'AnimationControlAnalyzer';
        this.description = 'Detects animations and auto-playing media without proper user controls';
    }
    analyze(context) {
        const issues = [];
        if (this.supportsDocumentModel(context) && context.documentModel) {
            const elements = context.documentModel.getAllElements();
            for (const element of elements) {
                if (element.tagName.toLowerCase() === 'video' || element.tagName.toLowerCase() === 'audio') {
                    this.checkAutoPlayMedia(element, context, issues);
                }
                this.checkAnimatedElement(element, context, issues);
            }
        }
        if (context.actionLanguageModel) {
            this.checkJavaScriptAnimations(context, issues);
        }
        return issues;
    }
    checkAutoPlayMedia(element, context, issues) {
        const hasAutoplay = 'autoplay' in element.attributes || element.attributes.autoplay !== undefined;
        if (!hasAutoplay)
            return;
        const hasControls = 'controls' in element.attributes || element.attributes.controls !== undefined;
        const duration = element.attributes.duration;
        const loop = 'loop' in element.attributes || element.attributes.loop !== undefined;
        const muted = 'muted' in element.attributes || element.attributes.muted !== undefined;
        if (element.tagName.toLowerCase() === 'audio' && !muted) {
            if (!hasControls) {
                issues.push(this.createIssue('auto-play-audio-no-controls', 'error', 'Auto-playing audio must have controls to pause/stop. Users need to control audio, especially those using screen readers.', element.location, ['2.2.2', '1.4.2'], context, {
                    elementContext: context.documentModel?.getElementContext(element),
                    fix: {
                        description: 'Add controls attribute to audio element',
                        code: this.addControlsToElement(element),
                        location: element.location
                    }
                }));
            }
        }
        if (element.tagName.toLowerCase() === 'video') {
            if (!muted && !hasControls) {
                issues.push(this.createIssue('auto-play-video-no-controls', 'error', 'Auto-playing video with audio must have controls. Users must be able to pause or stop moving content.', element.location, ['2.2.2'], context, {
                    elementContext: context.documentModel?.getElementContext(element),
                    fix: {
                        description: 'Add controls attribute or mute the video',
                        code: this.addControlsToElement(element),
                        location: element.location
                    }
                }));
            }
            if (muted && (loop || !duration)) {
                if (!hasControls) {
                    issues.push(this.createIssue('looping-video-no-controls', 'warning', 'Looping or long-duration video should have controls to allow users to pause or stop the animation.', element.location, ['2.2.2'], context, {
                        elementContext: context.documentModel?.getElementContext(element),
                        fix: {
                            description: 'Add controls attribute',
                            code: this.addControlsToElement(element),
                            location: element.location
                        }
                    }));
                }
            }
        }
    }
    checkAnimatedElement(element, context, issues) {
        if (!context.documentModel)
            return;
        const elementContext = context.documentModel.getElementContext(element);
        if (!elementContext || !elementContext.cssRules)
            return;
        const hasAnimation = elementContext.cssRules.some((rule) => rule.properties && rule.properties.some((prop) => prop.name === 'animation' ||
            prop.name === 'animation-name' ||
            prop.name.startsWith('animation-')));
        const hasTransition = elementContext.cssRules.some((rule) => rule.properties && rule.properties.some((prop) => prop.name === 'transition' ||
            prop.name.startsWith('transition-')));
        const hasTransform = elementContext.cssRules.some((rule) => rule.properties && rule.properties.some((prop) => prop.name === 'transform' &&
            (prop.value.includes('translate') || prop.value.includes('rotate') || prop.value.includes('scale'))));
        if (hasAnimation || (hasTransition && hasTransform)) {
            const hasReducedMotion = this.checkReducedMotionInDocument(context);
            if (!hasReducedMotion) {
                issues.push(this.createIssue('animation-no-reduced-motion', 'warning', `Element <${element.tagName}> has CSS animations but no prefers-reduced-motion media query. Users with vestibular disorders need the ability to disable animations.`, element.location, ['2.3.3'], context, {
                    elementContext
                }));
            }
        }
    }
    checkJavaScriptAnimations(context, issues) {
        if (!context.actionLanguageModel)
            return;
        const handlers = context.actionLanguageModel.getAllEventHandlers();
        for (const handler of handlers) {
            const code = this.getHandlerCode(handler);
            if (code.includes('requestAnimationFrame')) {
                const hasReducedMotionCheck = code.includes('prefers-reduced-motion') ||
                    code.includes('matchMedia') ||
                    code.includes('reducedMotion');
                if (!hasReducedMotionCheck) {
                    issues.push(this.createIssue('raf-no-reduced-motion', 'info', 'requestAnimationFrame used without checking prefers-reduced-motion. Consider respecting user motion preferences.', handler.location, ['2.3.3'], context));
                }
            }
            if (code.includes('setInterval')) {
                const isLikelyAnimation = code.includes('.style.') ||
                    code.includes('transform') ||
                    code.includes('translate') ||
                    code.includes('rotate') ||
                    code.includes('scrollTo') ||
                    code.includes('scrollBy');
                if (isLikelyAnimation) {
                    const hasPauseControl = code.includes('clearInterval') ||
                        code.includes('pause') ||
                        code.includes('stop');
                    if (!hasPauseControl) {
                        issues.push(this.createIssue('setinterval-animation-no-controls', 'warning', 'setInterval used for animation without apparent pause/stop controls. Users must be able to pause moving content.', handler.location, ['2.2.2'], context));
                    }
                }
            }
            if (code.includes('scroll') && (code.includes('transform') || code.includes('translate'))) {
                const hasReducedMotionCheck = code.includes('prefers-reduced-motion') ||
                    code.includes('matchMedia');
                if (!hasReducedMotionCheck) {
                    issues.push(this.createIssue('parallax-no-reduced-motion', 'info', 'Parallax scrolling effect detected without prefers-reduced-motion support. Parallax can cause motion sickness for some users.', handler.location, ['2.3.3'], context));
                }
            }
        }
    }
    checkReducedMotionInDocument(context) {
        if (!context.documentModel)
            return false;
        const allElements = context.documentModel.getAllElements();
        for (const element of allElements) {
            const elementContext = context.documentModel.getElementContext(element);
            if (!elementContext || !elementContext.cssRules)
                continue;
            const hasReducedMotion = elementContext.cssRules.some((rule) => rule.selector && (rule.selector.includes('prefers-reduced-motion') ||
                rule.selector.includes('@media') && rule.selector.includes('reduce')));
            if (hasReducedMotion)
                return true;
        }
        return false;
    }
    getHandlerCode(handler) {
        if (typeof handler.handler === 'string') {
            return handler.handler;
        }
        if (handler.handler?.code) {
            return handler.handler.code;
        }
        return '';
    }
    addControlsToElement(element) {
        const attrs = { ...element.attributes, controls: '' };
        const attrString = Object.entries(attrs)
            .map(([key, value]) => value === '' ? key : `${key}="${value}"`)
            .join(' ');
        return `<${element.tagName} ${attrString}>`;
    }
}
exports.AnimationControlAnalyzer = AnimationControlAnalyzer;
