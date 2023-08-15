import FileLoad from './FileLoad';
import { AppContextProvider } from './AppContext';
import FileTable from './FileTable';
import GroupSelector from './GroupSelector';
import {
  Box,
  Container,
  Icon,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import Processing from './Processing';
import { MdOutlineExpandLess } from 'react-icons/md';

function App() {
  return (
    <AppContextProvider>
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
        }}
        style={{ padding: 0 }}
      >
        <Stack direction={'row'} justifyContent="space-between">
          <Typography variant="h2" sx={{ p: 3 }}>
            Python in the web
          </Typography>
          <Processing />
        </Stack>

        <FileLoad />

        <GroupSelector />
        <Box
          sx={{
            flexGrow: 1,
            minHeight: 0,
            overflow: 'auto',
          }}
        >
          <FileTable />
        </Box>
      </Container>
    </AppContextProvider>
  );
}

export default App;
