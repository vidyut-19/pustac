// Lazy loading plugin for advanced Lexical features
import { useEffect, useState } from 'preact/hooks';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { loadFeature } from '../lazy-loading';

interface LazyFeature {
  name: string;
  loader: () => Promise<any>;
  loaded: boolean;
  loading: boolean;
}

export function LazyLoadingPlugin() {
  const [editor] = useLexicalComposerContext();
  const [features, setFeatures] = useState<LazyFeature[]>([
    { name: 'rich-text', loader: () => import('@lexical/rich-text'), loaded: false, loading: false },
    { name: 'list', loader: () => import('@lexical/list'), loaded: false, loading: false },
    { name: 'code', loader: () => import('@lexical/code'), loaded: false, loading: false },
    { name: 'link', loader: () => import('@lexical/link'), loaded: false, loading: false },
    { name: 'markdown', loader: () => import('@lexical/markdown'), loaded: false, loading: false },
  ]);

  const loadFeatureOnDemand = async (featureName: string) => {
    const feature = features.find(f => f.name === featureName);
    if (!feature || feature.loaded || feature.loading) return;

    setFeatures(prev => prev.map(f => 
      f.name === featureName ? { ...f, loading: true } : f
    ));

    try {
      await loadFeature(featureName, feature.loader);
      setFeatures(prev => prev.map(f => 
        f.name === featureName ? { ...f, loaded: true, loading: false } : f
      ));
      console.log(`✅ Lazy loaded feature: ${featureName}`);
    } catch (error) {
      console.error(`❌ Failed to lazy load feature: ${featureName}`, error);
      setFeatures(prev => prev.map(f => 
        f.name === featureName ? { ...f, loading: false } : f
      ));
    }
  };

  useEffect(() => {
    // Preload rich-text on first focus
    const removeFocusListener = editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        // This will be called when editor state changes
        // We can use this to detect when to load features
      });
    });

    return () => {
      removeFocusListener();
    };
  }, [editor]);

  // Expose loadFeatureOnDemand for external use
  useEffect(() => {
    (window as any).loadPustacFeature = loadFeatureOnDemand;
    return () => {
      delete (window as any).loadPustacFeature;
    };
  }, [loadFeatureOnDemand]);

  return null;
}

// Hook to use lazy loading features
export function useLazyFeature(featureName: string) {
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadFeature = async () => {
    if (loaded || loading) return;
    
    setLoading(true);
    try {
      const loadPustacFeature = (window as any).loadPustacFeature;
      if (loadPustacFeature) {
        await loadPustacFeature(featureName);
        setLoaded(true);
      }
    } catch (error) {
      console.error(`Failed to load feature: ${featureName}`, error);
    } finally {
      setLoading(false);
    }
  };

  return { loaded, loading, loadFeature };
}
