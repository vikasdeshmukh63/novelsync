import { Icon } from '@iconify/react';
import { Box, Card, Grid, IconButton, Stack, Typography } from '@mui/material';

const renderText = (data, fallBackText) => {
  if (data !== undefined && data !== null) {
    return data;
  }
  return fallBackText ? 'Not available' : '';
};
export const EmployeeDetailsView = ({ currentEmployee }) => (
  <Stack spacing={2}>
    <Card sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1">Personal</Typography>
          <IconButton>
            <Icon icon="fluent:edit-12-filled" />
          </IconButton>
        </Stack>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Typography variant="caption">Full Name</Typography>
          </Grid>
          <Grid item xs={3}>
            <Stack>
              <Typography variant="caption">First</Typography>
              <Typography variant="subtitle2">{renderText(currentEmployee?.first_name)}</Typography>
            </Stack>
          </Grid>
          <Grid item xs={3}>
            <Stack>
              <Typography variant="caption">Middle</Typography>
              <Typography variant="subtitle2">
                {renderText(currentEmployee?.middle_name)}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={3}>
            <Stack>
              <Typography variant="caption">Last</Typography>
              <Typography variant="subtitle2">{renderText(currentEmployee?.last_name)}</Typography>
            </Stack>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="caption">Email</Typography>
          </Grid>
          <Grid item xs={9}>
            <Typography variant="subtitle2">{renderText(currentEmployee?.email_id)}</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="caption">Mobile No</Typography>
          </Grid>
          <Grid item xs={9}>
            <Typography variant="subtitle2">{`${renderText(
              currentEmployee?.mobile_code,
              true
            )} ${renderText(currentEmployee?.mobile_no)}`}</Typography>
          </Grid>
        </Grid>
      </Stack>
    </Card>
    <Card sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1">Professional</Typography>
          <IconButton>
            <Icon icon="fluent:edit-12-filled" />
          </IconButton>
        </Stack>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Typography variant="caption">Current Job Role</Typography>
          </Grid>
          <Grid item xs={9}>
            <Typography variant="subtitle2">
              {renderText(currentEmployee?.customers_extras[0]?._job_title_id?.name, true)}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="caption">Manager</Typography>
          </Grid>
          <Grid item xs={9}>
            <Typography variant="subtitle2">Kishore Krishna</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="caption">Department</Typography>
          </Grid>
          <Grid item xs={9}>
            <Typography variant="subtitle2">Software R & D</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="caption">Resume/CV</Typography>
          </Grid>
          <Grid item xs={9}>
            <Typography variant="subtitle2" color="primary">
              {renderText(currentEmployee?.customers_extras[0]?._fu_cv_id?.filename, true)}
            </Typography>
          </Grid>
        </Grid>
      </Stack>
    </Card>
  </Stack>
);
