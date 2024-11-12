import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, forwardRef } from 'react';

import {
  Box,
  Card,
  Grid,
  Paper,
  Slide,
  Stack,
  Table,
  Button,
  Dialog,
  Divider,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  TableContainer,
  CircularProgress,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { fetchPermissions } from 'src/redux/slices/permissions';
import { setRolePermissionsForRole, fetchRolePermissionsForRole } from 'src/redux/slices/roles';

import { Iconify } from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';
import { TableNoData } from 'src/components/table';

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const PermissionModal = ({ open, onClose, role }) => {
  const dispatch = useDispatch();

  const submit = useBoolean();

  const { permissions } = useSelector((state) => state.permissions);
  const { rolePermissions, error } = useSelector((state) => state.roles);
  const [updatedPermissions, setUpdatedPermissions] = useState([]);

  useEffect(() => {
    if (open && role?.id) {
      dispatch(fetchPermissions(0, 1000, true));
      dispatch(fetchRolePermissionsForRole(role?.id));
    }
  }, [dispatch, open, role?.id]);

  useEffect(() => {
    if (permissions.length > 0) {
      const mergedPermissions = permissions.map((permission) => {
        const rolePermission =
          rolePermissions.length > 0
            ? rolePermissions?.find((rp) => rp.permission_id === permission.id)
            : false;

        return { ...permission, granted: rolePermission ? rolePermission.granted : 0 };
      });
      setUpdatedPermissions(mergedPermissions);
    }
  }, [permissions, rolePermissions]);

  const handleCheckboxChange = (permissionId) => {
    setUpdatedPermissions((prevState) =>
      prevState.map((perm) =>
        perm.id === permissionId ? { ...perm, granted: perm.granted === 1 ? 0 : 1 } : perm
      )
    );
  };

  const handleSave = async () => {
    const result = updatedPermissions.map((perm) => ({
      role_id: role.id,
      permission_id: perm.id,
      granted: perm.granted ? 1 : 0,
    }));
    await dispatch(setRolePermissionsForRole(result, role?.id));
    submit.onTrue();
  };

  useEffect(() => {
    if (error && submit.value) {
      toast.error('Something Went Wrong');
    }
    if (!error && submit.value) {
      toast.success('Permissions Updated Successfully');
      onClose();
    }
    submit.onFalse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, submit, submit.value]);

  useEffect(() => {
    if (!open) {
      setUpdatedPermissions([]);
    }
  }, [open]);

  return (
    <div>
      <Dialog
        open={open}
        onClose={onClose}
        TransitionComponent={Transition}
        PaperProps={{ sx: { borderRadius: 1, width: '100%', maxWidth: 500 } }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6">Edit Role Permissions</Typography>
          <Typography variant="caption">Title,short description,image...</Typography>
        </Box>
        <Divider />

        <Grid container spacing={3} sx={{ p: 2 }}>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" fontWeight={600}>
              Role Name
            </Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography variant="body2" fontWeight={600}>
              {role?.name}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" fontWeight={600}>
              Select Permissions
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Card>
              {permissions.length === 0 ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignContent: 'flex' }}>
                  <TableNoData notFound />
                </Box>
              ) : (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Permission</TableCell>
                        <TableCell>grants</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {updatedPermissions?.map((permission) => (
                        <TableRow key={permission?.id}>
                          <TableCell>{permission?.name}</TableCell>
                          <TableCell>
                            <Checkbox
                              type="checkbox"
                              color="success"
                              checked={permission?.granted}
                              onChange={() => handleCheckboxChange(permission?.id)}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Card>
          </Grid>
        </Grid>

        <Stack direction="row" gap={2} justifyContent="flex-end" p={2}>
          <Button variant="outlined" onClick={onClose} color="error">
            Cancel
          </Button>
          <Button
            startIcon={<Iconify icon="bxs:file" />}
            variant="contained"
            color="success"
            onClick={handleSave}
          >
            Save
          </Button>
        </Stack>
      </Dialog>
    </div>
  );
};

export default PermissionModal;