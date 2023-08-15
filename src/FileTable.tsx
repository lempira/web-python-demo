import { useAppContext } from './AppContext';

import DataTable from './DataTable';
import GroupedDataTable from './GroupedDataTable';

const FileTable = () => {
  const { processedContent } = useAppContext();

  return (
    <>
      {processedContent.type === 'single' ? (
        <DataTable
          data={processedContent.content}
          columns={processedContent.columns}
        />
      ) : (
        <GroupedDataTable
          data={processedContent.content}
          columns={processedContent.columns}
        />
      )}
    </>
  );
};

export default FileTable;
