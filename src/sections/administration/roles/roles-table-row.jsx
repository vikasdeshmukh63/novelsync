import Button from '@mui/material/Button';
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

import RolesQuickEditForm from './roles-quick-edit-form';

// ----------------------------------------------------------------------
const renderText = (value, fallbackText) => {
  if (value !== undefined && value !== null && value) {
    return value;
  }
  return fallbackText ? 'Not Available' : null;
};

export default function RolesTableRow({
  page,
  Status,
  rowsPerPage,
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  filters,
}) {
  const { name, desc, isActive } = row;

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
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{renderText(name, true)}</TableCell>
        {/* status  */}
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{renderText(desc, true)}</TableCell>
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
        <RolesQuickEditForm
          filters={filters}
          page={page}
          rowsPerPage={rowsPerPage}
          currentRole={row}
          Status={Status}
          type={CONSTANTS.EDIT}
          open={quickEdit.value}
          onClose={quickEdit.onFalse}
        />
      )}

      {/* menu  */}
      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
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
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              onDeleteRow();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}
