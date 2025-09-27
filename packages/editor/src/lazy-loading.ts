// Lazy loading utilities for Lexical features to minimize initial bundle size

export const lazyLoadRichText = (): Promise<any> => import('@lexical/rich-text');
export const lazyLoadList = (): Promise<any> => import('@lexical/list');
export const lazyLoadCode = (): Promise<any> => import('@lexical/code');
export const lazyLoadLink = (): Promise<any> => import('@lexical/link');
export const lazyLoadMarkdown = (): Promise<any> => import('@lexical/markdown');

// Feature flags to track what's been loaded
const loadedFeatures = new Set<string>();

export const loadFeature = async (featureName: string, loader: () => Promise<any>) => {
  if (loadedFeatures.has(featureName)) {
    return;
  }
  
  try {
    await loader();
    loadedFeatures.add(featureName);
    console.log(`✅ Loaded feature: ${featureName}`);
  } catch (error) {
    console.error(`❌ Failed to load feature: ${featureName}`, error);
  }
};

// Preload features on user interaction
export const preloadFeatures = () => {
  // Preload rich text on first focus
  if (!loadedFeatures.has('rich-text')) {
    loadFeature('rich-text', lazyLoadRichText);
  }
};

// Load features on demand
export const loadRichText = () => loadFeature('rich-text', lazyLoadRichText);
export const loadList = () => loadFeature('list', lazyLoadList);
export const loadCode = () => loadFeature('code', lazyLoadCode);
export const loadLink = () => loadFeature('link', lazyLoadLink);
export const loadMarkdown = () => loadFeature('markdown', lazyLoadMarkdown);

