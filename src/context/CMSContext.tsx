import React, { createContext, useContext, useEffect, useState } from 'react';
import { CMSData, DEFAULT_CMS_DATA, getCMSData, saveCMSData, saveCMSSection, subscribeCMSData } from '../utils';

interface CMSContextType {
  cmsData: CMSData;
  loading: boolean;
  error: string | null;
  saveCMS: (updated: Partial<CMSData>) => Promise<void>;
  saveSection: <K extends keyof CMSData>(section: K, value: CMSData[K]) => Promise<void>;
  refreshCMS: () => Promise<void>;
}

const CMSContext = createContext<CMSContextType>({
  cmsData: DEFAULT_CMS_DATA,
  loading: true,
  error: null,
  saveCMS: async () => {},
  saveSection: async () => {},
  refreshCMS: async () => {},
});

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cmsData, setCmsData] = useState<CMSData>(DEFAULT_CMS_DATA);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    // Set up real-time listener from Firestore cms/main
    const unsubscribe = subscribeCMSData(
      (data) => {
        if (isMounted) {
          setCmsData(data);
          setLoading(false);
          setError(null);
        }
      },
      (err) => {
        if (isMounted) {
          console.error('[CMSProvider] Firestore error:', err);
          setError(err.message || 'Failed to connect to Firestore CMS');
          setLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const saveCMS = async (updated: Partial<CMSData>): Promise<void> => {
    // Save to Firestore. Throws on error - no silent fallback.
    await saveCMSData(updated);
    setCmsData((prev) => ({ ...prev, ...updated }));
  };

  const saveSection = async <K extends keyof CMSData>(section: K, value: CMSData[K]): Promise<void> => {
    // Save section to Firestore. Throws on error.
    await saveCMSSection(section, value);
    setCmsData((prev) => ({ ...prev, [section]: value }));
  };

  const refreshCMS = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const freshData = await getCMSData();
      setCmsData(freshData);
    } catch (err: any) {
      setError(err?.message || 'Failed to reload CMS data from Firestore');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <CMSContext.Provider
      value={{
        cmsData,
        loading,
        error,
        saveCMS,
        saveSection,
        refreshCMS,
      }}
    >
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => useContext(CMSContext);
