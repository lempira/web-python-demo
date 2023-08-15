import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ProcessedData } from './AppContext';
import {
  Box,
  Collapse,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Fragment, useRef } from 'react';
import { useVirtual } from '@tanstack/react-virtual';
import { MdOutlineExpandLess } from 'react-icons/md';
import DataTable from './DataTable';

const columnHelper = createColumnHelper<unknown>();

interface GroupedDataTableProps {
  data: ProcessedData['content'];
  columns: ProcessedData['columns'];
}

const columns = [
  {
    id: 'collapseBtn',
    header: '',
    size: 50,
    cell: (info) => {
      const { row } = info;

      return (
        <IconButton
          onClick={row.getToggleSelectedHandler()}
          sx={{ outline: 'none !important' }}
        >
          <MdOutlineExpandLess
            style={{
              transform: row.getIsSelected()
                ? 'rotate(180deg)'
                : 'rotate(90deg)',
              transitionProperty: 'transform',
              transitionDuration: '0.3s',
            }}
          />
        </IconButton>
      );
    },
  },
  columnHelper.accessor('groupName', {
    header: 'Group Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('count', {
    header: 'Count',
    cell: (info) => info.getValue(),
  }),
];

const GroupedDataTable = ({
  data,
  columns: nestedTableColumns,
}: GroupedDataTableProps) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const { rows } = table.getRowModel();
  const rowVirtualizer = useVirtual({
    parentRef: tableContainerRef,
    size: rows.length,
    // overscan: 10,
  });
  const { virtualItems: virtualRows, totalSize } = rowVirtualizer;

  const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0)
      : 0;

  return (
    <TableContainer ref={tableContainerRef} sx={{ height: '100%' }}>
      <Table stickyHeader style={{ width: '100%' }}>
        <TableHead>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableCell
                  key={header.id}
                  style={{
                    width: header.getSize(),
                    // minWidth: `${header.getSize()}px`,
                    // maxWidth: `${header.getSize()}px`,
                  }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {paddingTop > 0 && (
            <TableRow>
              <TableCell style={{ height: `${paddingTop}px` }} />
            </TableRow>
          )}
          {virtualRows.map((virtualRow) => {
            const row = rows[virtualRow.index];
            // {table.getRowModel().rows.map((row) => {
            return (
              <Fragment key={row.id}>
                <TableRow>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <TableCell
                        key={cell.id}
                        style={{
                          width: cell.column.getSize(),
                          // width: `${cell.column.getSize()}px`,
                          // minWidth: `${cell.column.getSize()}px`,
                          // maxWidth: `${cell.column.getSize()}px`,
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
                <TableRow>
                  <TableCell colSpan={columns.length} sx={{ p: 0 }}>
                    {row.getIsSelected() && (
                      <Collapse in={row.getIsSelected()}>
                        <Box sx={{ p: 5 }}>
                          <Paper elevation={2}>
                            <DataTable
                              data={row.original.group}
                              columns={nestedTableColumns}
                            />
                          </Paper>
                        </Box>
                      </Collapse>
                    )}
                  </TableCell>
                </TableRow>
              </Fragment>
            );
          })}
          {paddingBottom > 0 && (
            <TableRow>
              <TableCell style={{ height: `${paddingBottom}px` }} />
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default GroupedDataTable;
