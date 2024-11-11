import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';

import { CONSTANTS } from 'src/constants';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover, usePopover } from 'src/components/custom-popover';

import LocationQuickEditForm from './location-quick-edit-form';
import { renderText } from 'src/utils/helperFunctions';

// ----------------------------------------------------------------------

export default function LocationsTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  page,
  rowsPerPage,
  Status,
  filters,
  selectedCompany,
}) {
  const {
    name,
    id_str,
    isActive,
    createdAt,
    house,
    street,
    ishq,
    city,
    state,
    country_id,
    zipcode,
    _company_id,
  } = row;

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

        {/* address  */}
        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <ListItemText
            primary={`${renderText(house)} ${renderText(street)} ${renderText(city)} ${renderText(
              state
            )} ${renderText(country_id)} ${renderText(zipcode)}`}
            primaryTypographyProps={{ typography: 'body2' }}
          />
        </TableCell>

        {/* name  */}
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{renderText(name, true)}</TableCell>

        {/* company  */}
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{renderText(_company_id?.name, true)}</TableCell>

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
      <LocationQuickEditForm
        currentLocation={row}
        open={quickEdit.value}
        onClose={quickEdit.onFalse}
        type={CONSTANTS.EDIT}
        page={page}
        rowsPerPage={rowsPerPage}
        Status={Status}
        filters={filters}
        selectedCompany={selectedCompany}
      />

      {/* menu  */}
      <CustomPopover
        open={popover.open}
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
              onDeleteRow(id_str);
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
