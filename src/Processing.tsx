import { CircularProgress, Stack, Typography } from '@mui/material';
import { useAppContext } from './AppContext';

const Processing = () => {
  const { runningWorker } = useAppContext();
  return (
    <>
      {runningWorker && (
        <Stack direction="row" alignItems="center" spacing={3} sx={{ mr: 3 }}>
          <CircularProgress sx={{ p: 1 }} />
          <Typography fontWeight={200} fontStyle="italic" fontSize="1.3rem">
            Processing with Python...
          </Typography>
        </Stack>
      )}
    </>
  );
};

export default Processing;
