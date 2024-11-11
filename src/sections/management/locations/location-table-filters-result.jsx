import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function LocationTableFiltersResult({
  filters,
  onFilters,
  onResetFilters,
  results,
  handleClearAutoComplete,
  setSelectedCompany,
  ...other
}) {
  // function to clear the status filter
  const handleRemoveStatus = useCallback(() => {
    onFilters('status', 'all');
  }, [onFilters]);

  // function to remove the search filter
  const handleRemoveQuery = useCallback(() => {
    onFilters('name', '');
  }, [onFilters]);

  const handleRemoveOrg = useCallback(() => {
    setSelectedCompany(null);
    onFilters('org', '');
  }, [onFilters, setSelectedCompany]);

  return (
    <Stack spacing={1.5} {...other}>
      <Box sx={{ typography: 'body2' }}>
        <strong>{results}</strong>
        <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
          results found
        </Box>
      </Box>

      <Stack flexGrow={1} spacing={1} direction="row" flexWrap="wrap" alignItems="center">
        {filters.status !== 'all' && (
          <Block label="Status:">
            <Chip size="small" label={filters.status} onDelete={handleRemoveStatus} />
          </Block>
        )}
        {/* clear button for the search by org filter */}
        {filters.org !== '' && (
          <Block label="Organization:">
            <Chip size="small" label={filters.org} onDelete={handleRemoveOrg} />
          </Block>
        )}
        {/* clear button for filter  */}
        {filters.name !== '' && (
          <Block label="Keyword:">
            <Chip size="small" label={filters.name} onDelete={handleRemoveQuery} />
          </Block>
        )}

        {/* button to clear all the filters  */}
        <Button
          color="error"
          onClick={() => {
            handleClearAutoComplete();
            onResetFilters();
          }}
          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
        >
          Clear
        </Button>
      </Stack>
    </Stack>
  );
}

// ----------------------------------------------------------------------

function Block({ label, children, sx, ...other }) {
  return (
    <Stack
      component={Paper}
      variant="outlined"
      spacing={1}
      direction="row"
      sx={{
        p: 1,
        borderRadius: 1,
        overflow: 'hidden',
        borderStyle: 'dashed',
        ...sx,
      }}
      {...other}
    >
      <Box component="span" sx={{ typography: 'subtitle2' }}>
        {label}
      </Box>

      <Stack spacing={1} direction="row" flexWrap="wrap">
        {children}
      </Stack>
    </Stack>
  );
}
