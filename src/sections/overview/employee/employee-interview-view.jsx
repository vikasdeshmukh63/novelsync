import { useState } from 'react';

import {
  Grid,
  Stack,
  Accordion,
  IconButton,
  Typography,
  LinearProgress,
  AccordionDetails,
  AccordionSummary,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

export const EmployeeInterviewView = () => {
  // by default it is true
  const [interviewExpand, setInterviewExpand] = useState({
    detailsExpand: true,
    interviewExpand: true,
  });

  // onchange
  const handleChangeExpand = (panel) => (event, isExpanded) => {
    setInterviewExpand({ ...interviewExpand, [panel]: isExpanded });
  };

  return (
    <>
      {/* details accordion */}
      <Accordion
        expanded={interviewExpand.detailsExpand}
        onChange={handleChangeExpand('detailsExpand')}
      >
        <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
          <Typography variant="subtitle1">Details</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <Typography variant="caption">Job Post/ Job Title</Typography>
            </Grid>
            <Grid item xs={9}>
              <Typography variant="body2">Senior Software Developer</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="caption">Skills</Typography>
            </Grid>
            <Grid item xs={9}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2">React JS</Typography>
                  <Typography variant="caption">Beginner</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">Javascript</Typography>
                  <Typography variant="caption">Beginner</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">React JS</Typography>
                  <Typography variant="caption">Beginner</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">Javascript</Typography>
                  <Typography variant="caption">Beginner</Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={3}>
              <Typography variant="caption">Interview Date</Typography>
            </Grid>
            <Grid item xs={9}>
              <Typography variant="body2">10/08/2024 10:00 AM</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="caption">Is Coding Interview</Typography>
            </Grid>
            <Grid item xs={9}>
              <Typography variant="body2">Yes</Typography>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      {/* evaluation accordion */}
      <Accordion
        expanded={interviewExpand.interviewExpand}
        onChange={handleChangeExpand('interviewExpand')}
      >
        <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
          <Typography variant="subtitle1">Evaluation</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={4}>
            {/* Scores */}
            <Stack>
              <Typography variant="subtitle2">Scores</Typography>
              <Grid container spacing={4} p={3}>
                <Grid item xs={6}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="overline">TOTAL SCORE</Typography>
                    <Typography variant="subtitle1">7.1</Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={71}
                    color="success"
                    style={{ height: 10, borderRadius: '20px', backgroundColor: '#E3F2FD' }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="overline">JOB FIT SCORE</Typography>
                    <Typography variant="subtitle1">7.1</Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={71}
                    color="success"
                    style={{ height: 10, borderRadius: '20px', backgroundColor: '#E3F2FD' }}
                  />
                </Grid>
              </Grid>
            </Stack>
            {/* skill score */}
            <Stack>
              <Typography variant="subtitle2">Scores By Skill</Typography>
              <Grid container spacing={6} p={3}>
                <Grid item xs={6}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="overline">REACT JS</Typography>
                    <Typography variant="subtitle1">7.1</Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={71}
                    color="success"
                    style={{ height: 10, borderRadius: '20px', backgroundColor: '#E3F2FD' }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="overline">JAVASCRIPT</Typography>
                    <Typography variant="subtitle1">7.1</Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={71}
                    color="success"
                    style={{ height: 10, borderRadius: '20px', backgroundColor: '#E3F2FD' }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="overline">ASP.NET</Typography>
                    <Typography variant="subtitle1">7.1</Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={71}
                    color="success"
                    style={{ height: 10, borderRadius: '20px', backgroundColor: '#E3F2FD' }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="overline">MYSQL</Typography>
                    <Typography variant="subtitle1">7.1</Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={71}
                    color="success"
                    style={{ height: 10, borderRadius: '20px', backgroundColor: '#E3F2FD' }}
                  />
                </Grid>
              </Grid>
            </Stack>
            {/* Feedback */}
            <Stack spacing={2}>
              <Typography variant="subtitle2">Feedback</Typography>
              <Typography variant="caption">
                The candidate&apos;s responses are disjointed and lack clarity. They seem to have
                some understanding of the topics but struggle to articulate their knowledge
                coherently. For JavaScript, they mentioned re initialization with &apos;let&apos;
                and immutability with &apos;const&apos;, but the explanation was incomplete and
                lacked examples. Their understanding of asynchronous operations is vague,
                referencing promises and callbacks without clear comparison or examples. The mention
                of closures shows a basic understanding but again lacks a clear practical example.
                For React.js, the candidate touched on state management and lifecycle methods but
                failed to provide a comprehensive comparison or detailed explanation of hooks. The
                discussion on the Virtual DOM and performance optimization was superficial,
                mentioning lazy loading and React.memo without depth or context. Overall, the
                candidate needs to improve their ability to communicate technical knowledge
                effectively.
              </Typography>
            </Stack>
            {/* events */}
            <Stack>
              <Typography variant="subtitle2">Events</Typography>
              <Grid container spacing={2} p={4}>
                <Grid item xs={6}>
                  <Grid container alignItems="center">
                    <Grid item xs={8}>
                      <Typography variant="subtitle2">Video obstruction</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Stack direction="row" alignItems="center" justifyContent="center">
                        <Typography variant="subtitle2">8</Typography>
                        <IconButton>
                          <Iconify icon="material-symbols:info" />
                        </IconButton>
                      </Stack>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={6}>
                  <Grid container alignItems="center">
                    <Grid item xs={8}>
                      <Typography variant="subtitle2">Video obstruction</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Stack direction="row" alignItems="center" justifyContent="center">
                        <Typography variant="subtitle2">8</Typography>
                        <IconButton>
                          <Iconify icon="material-symbols:info" />
                        </IconButton>
                      </Stack>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={6}>
                  <Grid container alignItems="center">
                    <Grid item xs={8}>
                      <Typography variant="subtitle2">Disable full screen</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Stack direction="row" alignItems="center" justifyContent="center">
                        <Typography variant="subtitle2">8</Typography>
                        <IconButton>
                          <Iconify icon="material-symbols:info" />
                        </IconButton>
                      </Stack>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Stack>
          </Stack>
        </AccordionDetails>
      </Accordion>
    </>
  );
};
