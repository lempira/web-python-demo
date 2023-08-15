import { PropsWithChildren, createContext, useContext, useState } from 'react';

interface PythonWorkerMessage {
  action: string;
  error: string;
  results: string;
}

export interface ProcessedData {
  type: 'single' | 'grouped';
  content: unknown[];
  columns: string[];
}

export const DEFAULT_PROCESS_DATA: ProcessedData = {
  type: 'single',
  content: [],
  columns: [],
};

interface AppContextInterface {
  groups: string[];
  setGroups: React.Dispatch<React.SetStateAction<string[]>>;
  rawFileContent: string;
  setRawFileContent: React.Dispatch<React.SetStateAction<string>>;
  runningWorker: boolean;
  setRunningWorker: React.Dispatch<React.SetStateAction<boolean>>;
  processedContent: ProcessedData;
  setProcessedContent: React.Dispatch<React.SetStateAction<ProcessedData>>;
  pythonWorker: Worker;
}

const AppContext = createContext<AppContextInterface>(
  {} as AppContextInterface
);
const useAppContext = () => useContext(AppContext);
const pythonWorker = new Worker('webworker.js');

const AppContextProvider = ({ children }: PropsWithChildren) => {
  const [groups, setGroups] = useState<string[]>([]);
  const [rawFileContent, setRawFileContent] = useState<string>('');
  const [runningWorker, setRunningWorker] = useState(false);
  const [processedContent, setProcessedContent] =
    useState<ProcessedData>(DEFAULT_PROCESS_DATA);

  pythonWorker.onmessage = (event: MessageEvent<PythonWorkerMessage>) => {
    const { action, error, results } = event.data;
    if (error) {
      console.error(`error from worker`, { action, error });
      setRunningWorker(false);
      return;
    }

    const parsedResults: ProcessedData = JSON.parse(results);
    setProcessedContent(parsedResults);
    setRunningWorker(false);
  };

  return (
    <AppContext.Provider
      value={{
        groups,
        setGroups,
        rawFileContent,
        setRawFileContent,
        runningWorker,
        processedContent,
        setRunningWorker,
        setProcessedContent,
        pythonWorker,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContextProvider, useAppContext };
