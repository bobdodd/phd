import { types as t } from './BabelParser';
import { ActionLanguageNode } from '../models/ActionLanguageModel';
import { SourceLocation } from '../models/BaseModel';
export interface HookUsage {
    hookName: string;
    variableName: string | null;
    arguments: any[];
    location: SourceLocation;
}
export interface RefUsage {
    refName: string;
    type: 'creation' | 'prop' | 'current' | 'forwarded' | 'imperative';
    location: SourceLocation;
    metadata?: {
        componentName?: string;
        exposedMethods?: string[];
    };
}
export interface SyntheticEventUsage {
    eventParamName: string;
    methodsCalled: string[];
    propertiesAccessed: string[];
    location: SourceLocation;
    accessibilityConcerns: string[];
}
export interface PortalUsage {
    children: any;
    container: string | null;
    location: SourceLocation;
    accessibilityConcerns: string[];
}
export interface ContextUsage {
    contextName: string;
    type: 'provider' | 'consumer' | 'useContext';
    location: SourceLocation;
    metadata?: {
        providedValue?: any;
        accessedProperties?: string[];
        isAccessibilityRelated?: boolean;
    };
}
export declare class ReactPatternDetector {
    private hooks;
    private refs;
    private focusManagement;
    private syntheticEvents;
    private portals;
    private contexts;
    analyze(ast: t.File, sourceFile: string): void;
    private detectHook;
    private detectRefFocusManagement;
    private detectRefProp;
    private detectSyntheticEventUsage;
    private detectPortal;
    private detectForwardRef;
    private detectUseImperativeHandle;
    private detectContext;
    private detectContextProvider;
    private isAccessibilityRelatedContext;
    getHooks(): HookUsage[];
    getRefs(): RefUsage[];
    getForwardedRefs(): RefUsage[];
    getImperativeRefs(): RefUsage[];
    usesRefForwarding(): boolean;
    usesImperativeHandle(): boolean;
    getFocusManagement(): ActionLanguageNode[];
    hasHook(hookName: string): boolean;
    getStateHooks(): HookUsage[];
    getRefHooks(): HookUsage[];
    getEffectHooks(): HookUsage[];
    getCallbackHooks(): HookUsage[];
    getMemoHooks(): HookUsage[];
    getCustomHooks(): HookUsage[];
    hasAccessibilityHooks(): boolean;
    getSyntheticEvents(): SyntheticEventUsage[];
    getProblematicSyntheticEvents(): SyntheticEventUsage[];
    usesStopPropagation(): boolean;
    getPortals(): PortalUsage[];
    usesPortals(): boolean;
    getProblematicPortals(): PortalUsage[];
    getContexts(): ContextUsage[];
    getContextProviders(): ContextUsage[];
    getContextConsumers(): ContextUsage[];
    getAccessibilityContexts(): ContextUsage[];
    usesContext(): boolean;
    usesAccessibilityContext(): boolean;
    private extractLocation;
    private generateId;
}
export declare function analyzeReactComponent(source: string, sourceFile: string): {
    hooks: HookUsage[];
    refs: RefUsage[];
    focusManagement: ActionLanguageNode[];
    syntheticEvents: SyntheticEventUsage[];
    portals: PortalUsage[];
    contexts: ContextUsage[];
};
