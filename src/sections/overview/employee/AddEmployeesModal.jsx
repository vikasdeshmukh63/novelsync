// mui imports
import { useDispatch } from 'react-redux';

import { Dialog, DialogTitle, DialogContent } from '@mui/material';

import { setManuallyInvitedData } from 'src/redux/slices/invites';

import AddEmployeesTabs from 'src/components/AddEmployeesTabs/AddEmployeesTabs';

const AddEmployeesModal = ({ modalState }) => {
  const dispatch = useDispatch();
  // function to handle close modal
  const handleCloseModal = () => {
    modalState.onFalse();
    dispatch(setManuallyInvitedData([]));
  };

  return (
    <Dialog
      open={modalState.value}
      onClose={handleCloseModal}
      PaperProps={{ sx: { borderRadius: '0px' } }}
    >
      <DialogTitle id="alert-dialog-title">Add Employees</DialogTitle>

      <DialogContent>
        <AddEmployeesTabs handleCloseModal={handleCloseModal} />
      </DialogContent>
    </Dialog>
  );
};

export default AddEmployeesModal;
