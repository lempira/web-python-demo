import {
  Button,
  Chip,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
} from '@mui/material';
import { useAppContext } from './AppContext';
import { useState } from 'react';

const GroupSelector = () => {
  const {
    groups,
    setGroups,
    processedContent,
    pythonWorker,
    rawFileContent,
    setRunningWorker,
  } = useAppContext();
  const [selectedColumn, setSelectedColumn] = useState<string>('');

  const handleChange = (event: SelectChangeEvent<string>) => {
    setSelectedColumn(event.target.value as string);
  };

  const handleAdd = () => {
    const newGroups = [...groups, selectedColumn];
    setRunningWorker(true);
    setGroups(newGroups);
    pythonWorker.postMessage({
      action: 'groupData',
      data: { fileStr: rawFileContent, groups: newGroups },
    });
    setSelectedColumn('');
  };

  const handleDelete = (groupName: string) => {
    const newGroups = groups.filter((group) => group !== groupName);
    setGroups(newGroups);
    setRunningWorker(true);
    pythonWorker.postMessage({
      action: 'groupData',
      data: { fileStr: rawFileContent, groups: newGroups },
    });
  };
  if (rawFileContent.length === 0) {
    return null;
  }

  return (
    <Grid container spacing={2} p={2}>
      <Grid item xs={4}>
        <Stack direction={'row'} spacing={2}>
          <FormControl fullWidth>
            <InputLabel id="csv-column-select-label">Columns</InputLabel>
            <Select
              labelId="csv-column-select-label"
              id="csv-column-select"
              value={selectedColumn}
              label="Age"
              onChange={handleChange}
            >
              {processedContent.columns
                .filter((col) => !groups.includes(col))
                .map((group) => (
                  <MenuItem key={group} value={group}>
                    {group}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <Button variant="contained" onClick={handleAdd}>
            Add
          </Button>
          <Divider orientation="vertical" flexItem />
        </Stack>
      </Grid>
      <Grid item xs={8}>
        <Stack
          direction={'row'}
          spacing={2}
          alignItems="center"
          sx={{ height: '100%' }}
        >
          {groups.map((group) => (
            <Chip
              key={group}
              label={group}
              onDelete={() => handleDelete(group)}
            />
          ))}
        </Stack>
      </Grid>
    </Grid>
  );
};

export default GroupSelector;
