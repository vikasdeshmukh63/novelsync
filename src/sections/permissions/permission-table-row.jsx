import { toast } from 'sonner';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Button, Checkbox, IconButton, Typography } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { finderFunction } from 'src/utils/helperFunctions';

import { CONSTANTS } from 'src/constants';
import { fetchPermissions, deleteSinglePermission } from 'src/redux/slices/permissions';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import PermissionTableModal from './permission-table-modal';

// utility function to render text safely
const renderText = (value, na) => {
  if (value !== null && value !== undefined) {
    return value;
  }
  return na ? 'Not Available' : '';
};

// ----------------------------------------------------------------------

export default function PermissionsTableRow({
  row,
  STATUS_OPTIONS,
  selected,
  onSelectRow,
  status,
  page,
  rowsPerPage,
}) {
  const confirm = useBoolean();

  const quickEdit = useBoolean();

  const dispatch = useDispatch();

  const popover = usePopover();

  const deletePermission = useBoolean();

  const { error } = useSelector((state) => state.permissions);

  const handleDeletePermission = async (id) => {
    await dispatch(deleteSinglePermission(id));
    await dispatch(fetchPermissions(page, rowsPerPage, status));
    deletePermission.onTrue();
  };

  useEffect(() => {
    if (!error && deletePermission.value) {
      toast.success('Deleted Successfully');
    }
    if (error && deletePermission.value) {
      toast.error('Something Went Wrong');
    }
    deletePermission.onFalse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deletePermission.value, error]);

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>
        {/* role name */}
        <TableCell>
          <Typography>{row?.name}</Typography>
        </TableCell>

        {/* code  */}
        <TableCell>{renderText(row?.code, true)}</TableCell>

        {/* description  */}
        <TableCell>{renderText(row?.description, true)}</TableCell>

        {/* status  */}
        <TableCell>
          <Label
            variant="soft"
            color={
              (row.isActive === true && 'success') ||
              (row.isActive === false && 'error') ||
              'default'
            }
          >
            {finderFunction('statusValue', row.isActive, STATUS_OPTIONS)?.label}
          </Label>
        </TableCell>

        <TableCell>
          <IconButton onClick={popover.onOpen}>
            <Iconify icon="solar:menu-dots-bold" />
          </IconButton>
        </TableCell>
      </TableRow>

      {/* menu  */}
      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 'auto' }}
      >
        {console.log(confirm.value)}
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

      {quickEdit.value && (
        <PermissionTableModal
          open={quickEdit.value}
          onClose={quickEdit.onFalse}
          type={CONSTANTS.EDIT}
          data={row}
          status={status}
          page={page}
          rowsPerPage={rowsPerPage}
        />
      )}

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={<>Are you sure want to delete item?</>}
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              confirm.onFalse();
              handleDeletePermission(row.id);
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}