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
import { fetchRoles, deleteSingleRole } from 'src/redux/slices/roles';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import RoleModal from './role-modal';
import PermissionModal from './permission-modal';



// utility function to render text safely
const renderText = (value, na) => {
  if (value !== null && value !== undefined) {
    return value;
  }
  return na ? 'Not Available' : '';
};

// ----------------------------------------------------------------------

export default function RolesTableRow({
  row,
  STATUS_OPTIONS,
  selected,
  onSelectRow,
  status,
  page,
  rowsPerPage,
  setSelected
}) {
  const confirm = useBoolean();

  const quickEdit = useBoolean();

  const dispatch = useDispatch();

  const editPermissions = useBoolean();

  const popover = usePopover();

  const deleteRole = useBoolean();

  const {error} = useSelector((state)=>state.roles)

  const handleDeleteRole = async (id) => {
    await dispatch(deleteSingleRole(id));
    await dispatch(fetchRoles(page, rowsPerPage, status));
    deleteRole.onTrue();
  };
  
  useEffect(() => {
    if (!error && deleteRole.value) {
      toast.success('Deleted Successfully');
      setSelected([])
    }
    if (error && deleteRole.value) {
      toast.error('Something Went Wrong');
    }
    deleteRole.onFalse();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteRole.value, error]);


  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>
        {/* role name */}
        <TableCell>
          <Typography variant="body1" fontWeight={600} color="primary">
            {row?.name}
          </Typography>
        </TableCell>

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

        <MenuItem
          onClick={() => {
            editPermissions.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'warning.main' }}
        >
          <Iconify icon="fluent-mdl2:permissions-solid" />
          Manage Permissions
        </MenuItem>
      </CustomPopover>

      {quickEdit.value && (
        <RoleModal
          open={quickEdit.value}
          onClose={quickEdit.onFalse}
          type={CONSTANTS.EDIT}
          data={row}
          status={status}
          page={page}
          rowsPerPage={rowsPerPage}
        />
      )}

      {editPermissions.value && (
        <PermissionModal
          open={editPermissions.onTrue}
          onClose={editPermissions.onFalse}
          role={row}
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
              handleDeleteRole(row.id);
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}