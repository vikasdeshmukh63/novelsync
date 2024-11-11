import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks/use-boolean';

import { CONSTANTS } from 'src/constants';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover, usePopover } from 'src/components/custom-popover';

import IndustryQuickEditForm from './industries-quick-edit-form';

// ----------------------------------------------------------------------
const renderText = (value, fallbackText) => {
  if (value !== undefined && value !== null) {
    return value;
  }
  return fallbackText ? 'Not Available' : null;
};
export default function IndustryTableRow({
  page,
  rowsPerPage,
  filters,
  Status,
  row,
  selected,
  onSelectRow,
  onDeleteRow,
}) {
  const { name, isActive, description } = row;

  // custom hooks
  const confirm = useBoolean();
  const quickEdit = useBoolean();
  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        {/* checkbox  */}
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>
        {/* name  */}
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{renderText(name)}</TableCell>
        {/* description */}
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{renderText(description)}</TableCell>
        {/* status  */}
        <TableCell>
          <Label
            variant="soft"
            color={(isActive === true && 'success') || (isActive === false && 'error') || 'default'}
          >
            {isActive ? 'Active' : 'Inactive'}
          </Label>
        </TableCell>
        {/* actions  */}
        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <Tooltip title="Quick Edit" placement="top" arrow>
            <IconButton color={quickEdit.value ? 'inherit' : 'default'} onClick={quickEdit.onTrue}>
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Tooltip>

          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>
      {/* edit form  */}
      {quickEdit.value && (
        <IndustryQuickEditForm
          page={page}
          rowsPerPage={rowsPerPage}
          Status={Status}
          filters={filters}
          type={CONSTANTS.EDIT}
          currentIndustry={row}
          open={quickEdit.value}
          onClose={quickEdit.onFalse}
        />
      )}
      {/* menu  */}
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        anchorEl={popover.anchorEl}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>

        <MenuItem
          onClick={() => {
            quickEdit.onTrue();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>
      </CustomPopover>
      {/* confirmation dialog modal  */}
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
