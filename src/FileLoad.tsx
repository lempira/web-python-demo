import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_PROCESS_DATA, useAppContext } from './AppContext';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { MdOutlineClose } from 'react-icons/md';

const dropzoneStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
  borderWidth: '2px',
  borderRadius: '2px',
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#aaaaaa',
  outline: 'none',
  transition: 'border .24s ease-in-out',
  // height: '75px',
  // m: 2,
  p: 4,
};

const FileLoad = () => {
  const {
    pythonWorker,
    setRawFileContent,
    setRunningWorker,
    setProcessedContent,
  } = useAppContext();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log({ acceptedFiles });
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  }, []);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
  });

  useEffect(() => {
    if (selectedFile) {
      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        const fileText = event.target?.result as string;
        setRawFileContent(fileText);
        setRunningWorker(true);
        pythonWorker.postMessage({
          action: 'addFile',
          data: { fileStr: fileText },
        });
      };
      fileReader.readAsText(selectedFile);
    } else {
      setRawFileContent('');
      setProcessedContent(DEFAULT_PROCESS_DATA);
    }
  }, [selectedFile]);

  return (
    <Box sx={dropzoneStyle} {...getRootProps()}>
      <input {...getInputProps()} />
      <Typography variant="h5">
        Drag 'n' drop some files here, or click to select files
      </Typography>
      {selectedFile && (
        <Stack
          direction="row"
          spacing={4}
          alignItems="center"
          sx={{
            backgroundColor: 'white',
            border: '1px solid #ccc',
            py: 1,
            px: 3,
            mt: 2,
            borderRadius: '5px',
          }}
        >
          <Typography variant="h6">{selectedFile.name}</Typography>
          <IconButton
            onClick={(event) => {
              event.stopPropagation();
              setSelectedFile(null);
            }}
          >
            <MdOutlineClose />
          </IconButton>
        </Stack>
      )}
    </Box>
  );
};

export default FileLoad;
