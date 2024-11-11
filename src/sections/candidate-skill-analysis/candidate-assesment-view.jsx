import { useState } from 'react';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  Grid,
  List,
  ListItem,
  Stack,
  Typography,
} from '@mui/material';

import { renderText } from 'src/utils/helperFunctions';

import { candidateData } from 'src/constants';

import { ReactRadialChart } from 'src/components/chart/radial-chart';
import EmptyContent from 'src/components/empty-content';
import { Iconify } from 'src/components/iconify';

// default values
const defaultValues = {
  expandDetails: true,
  expandSkillAnalysis: true,
  expandSoftSkill: true,
  expandRecommendation: true,
};

// function to set color according to the value
const statusColorFinder = (value) => {
  if (value >= 0 && value < 40) {
    return 'error';
  }
  if (value >= 4 && value < 80) {
    return 'warning';
  }
  if (value >= 8 && value <= 100) {
    return 'success';
  }
  return 'primary';
};

// styles fro the default styles
const styles = {
  style: {
    fontSize: '14px',
  },
  varient: 'h6',
  fontWeight: 600,
};

// returning a coding text
function renderCodingEvaluationText(res) {
  switch (res) {
    case 1:
      return 'Yes';
    case 0:
      return 'No';
    default:
      return 'Not Available';
  }
}

// function to find candidate fit for job
function renderFitForPosition(res) {
  return res ? 'Fit' : 'Not Fit';
}

export const CandidateAssesmentView = ({ id, isIdChanged }) => {
  const [expandAccordion, setExpandAccordion] = useState(defaultValues);

  // controlled change accordion
  const handleChangeAccordion = (panel) => (_, isExpanded) => {
    setExpandAccordion((prev) => ({
      ...prev,
      [panel]: isExpanded,
    }));
  };

  return (
    <>
      {/* details accordion */}
      <Accordion
        expanded={expandAccordion.expandDetails}
        onChange={handleChangeAccordion('expandDetails')}
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
              <Typography variant="body2">{` ${renderText('Senior AWS Developer')}`}</Typography>
            </Grid>

            <Grid item xs={3}>
              <Typography variant="caption">Interview Date</Typography>
            </Grid>
            <Grid item xs={9}>
              <Typography variant="body2">
                10/08/2024 10:00 AM
                {/* {candidateInterviewData?.iv_date &&
                  DateFormat(candidateInterviewData?.iv_date, 'dd/MM/yyyy hh:mm a')} */}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="caption">Is Coding Interview</Typography>
            </Grid>
            <Grid item xs={9}>
              <Typography variant="body2">{renderCodingEvaluationText(1)}</Typography>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      {/* skill analysis accordion */}
      <Accordion
        expanded={expandAccordion.expandSkillAnalysis}
        onChange={handleChangeAccordion('expandSkillAnalysis')}
      >
        <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
          <Typography variant="subtitle1">Skill Analysis</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={4}>
            {/* Summary */}
            <Stack>
              <Typography variant="subtitle2">Summary</Typography>
              <Box
                display="grid"
                p={2}
                sx={{
                  gridTemplateColumns: {
                    md: 'repeat(2,1fr)',
                  },
                }}
              >
                <Stack
                  direction="row"
                  justifyContent={{ xs: 'space-between', md: 'start' }}
                  spacing={1}
                  alignItems="center"
                >
                  <Box width="40%">
                    <Typography variant="overline">Average Gap</Typography>
                  </Box>
                  <Box width="50%">
                    <ReactRadialChart
                      series={[Number(candidateData?.overall_summary?.average_gap) * 10 || 0]}
                      height={230}
                      size="55%"
                      color={statusColorFinder(candidateData.overall_summary.average_gap * 10)}
                    />
                  </Box>
                </Stack>

                <Stack
                  direction="row"
                  justifyContent={{ xs: 'space-between', md: 'start' }}
                  spacing={3}
                  alignItems="center"
                >
                  <Typography variant="overline">Position FItness</Typography>
                  <Typography
                    color={
                      candidateData?.overall_summary?.recommendations?.fit_for_position
                        ? 'success.dark'
                        : 'warning.dark'
                    }
                  >
                    {renderFitForPosition(
                      candidateData?.overall_summary?.recommendations?.fit_for_position
                    )}
                  </Typography>
                </Stack>
              </Box>
              {/* critical gaps */}

              <Grid container p={2} spacing={1} alignItems="center">
                <Grid item xs={3}>
                  <Typography variant="overline">critical gaps</Typography>
                </Grid>
                <Grid item xs={9}>
                  <List
                    sx={{
                      listStyleType: 'disc',
                      p: 0,
                      '& .MuiListItem-root': {
                        display: 'list-item',
                      },
                    }}
                  >
                    {candidateData?.overall_summary?.critical_gaps.map((data, index) => (
                      <ListItem key={index} sx={{ p: 0 }}>
                        <Typography variant="overline">{data.skill_name}</Typography>
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Grid>
            </Stack>

            {/* skills accordion */}
            <Accordion
              expanded={expandAccordion.expandSoftSkill}
              onChange={handleChangeAccordion('expandSoftSkill')}
            >
              <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
                <Typography variant="subtitle1">Analysis By Skill</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack position="relative">
                  <Grid container spacing={1} p={3}>
                    {candidateData?.skill_gap_analysis ? (
                      candidateData?.skill_gap_analysis?.map((skill, index) => (
                        <Grid key={index} item md={12} xs={12}>
                          <Grid container sx={{ placeItems: 'center' }}>
                            <Grid item xs={6}>
                              <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                              >
                                <Box width="40%">
                                  <Typography variant="overline">{skill?.skill_name}</Typography>
                                </Box>
                                <Box width="50%">
                                  <ReactRadialChart
                                    series={[
                                      skill
                                        ? (
                                            (skill.assessed_proficiency_level /
                                              skill.required_proficiency_level) *
                                            100
                                          ).toFixed(1)
                                        : 0,
                                    ]}
                                    symbol=""
                                    fontSize="1.1rem"
                                    color={statusColorFinder(
                                      (skill.assessed_proficiency_level /
                                        skill.required_proficiency_level) *
                                        100
                                    )}
                                    height={160}
                                    size="55%"
                                  />
                                </Box>
                              </Stack>
                            </Grid>
                            <Grid item xs={6}>
                              <Stack direction="row" spacing={4} alignItems="center">
                                <Typography variant="overline">Notes</Typography>
                                <Typography
                                  color="text.primary"
                                  variant="body2"
                                  fontWeight={500}
                                  sx={{ textTransform: 'uppercase' }}
                                >
                                  {skill.notes}
                                </Typography>
                              </Stack>
                            </Grid>
                          </Grid>
                        </Grid>
                      ))
                    ) : (
                      <EmptyContent filled title="No  Skills Found" />
                    )}
                  </Grid>
                </Stack>
              </AccordionDetails>
            </Accordion>
            {/* recommendations accordion */}
            <Accordion
              expanded={expandAccordion.expandRecommendation}
              onChange={handleChangeAccordion('expandRecommendation')}
            >
              <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
                <Stack direction="row" spacing={3} alignItems="center">
                  <Typography variant="subtitle1">Recommendations</Typography>
                  <Typography
                    variant="body1"
                    color={
                      candidateData?.overall_summary?.recommendations?.fit_for_position
                        ? 'success.dark'
                        : 'warning.dark'
                    }
                  >
                    {renderFitForPosition(
                      candidateData?.overall_summary?.recommendations?.fit_for_position
                    )}
                  </Typography>
                </Stack>
              </AccordionSummary>
              <AccordionDetails>
                <Stack position="relative" p={2}>
                  <Typography variant="subtitle2">Training Recommendations</Typography>

                  <Grid container spacing={2} py={3} px={5}>
                    {candidateData?.overall_summary?.recommendations?.training_suggestions ? (
                      candidateData?.overall_summary?.recommendations?.training_suggestions?.map(
                        (suggestion, index) => (
                          <Grid key={index} item md={12} xs={12}>
                            <Grid container spacing={1}>
                              <Grid item xs={6}>
                                <Stack spacing={4}>
                                  <Stack direction="row" spacing={2} alignItems="center">
                                    <Typography variant="overline">Training</Typography>
                                    <Typography
                                      color="text.primary"
                                      variant="body2"
                                      fontWeight={500}
                                      sx={{ textTransform: 'uppercase' }}
                                    >
                                      {suggestion.training_name}
                                    </Typography>
                                  </Stack>
                                  <Stack direction="row" spacing={2} alignItems="center">
                                    <Typography variant="overline">Provider</Typography>
                                    <Typography
                                      color="text.primary"
                                      variant="body2"
                                      fontWeight={500}
                                      sx={{ textTransform: 'uppercase' }}
                                    >
                                      {suggestion.training_provider}
                                    </Typography>
                                  </Stack>
                                </Stack>
                              </Grid>
                              <Grid item xs={6}>
                                <Stack spacing={4}>
                                  <Stack direction="row" spacing={2} alignItems="center">
                                    <Typography variant="overline">Targeted Skill</Typography>
                                    <Typography
                                      color="text.primary"
                                      variant="body2"
                                      fontWeight={500}
                                      sx={{ textTransform: 'uppercase' }}
                                    >
                                      {suggestion.targeted_skill}
                                    </Typography>
                                  </Stack>
                                  <Stack direction="row" spacing={2} alignItems="center">
                                    <Typography variant="overline">Est. Hours</Typography>
                                    <Typography
                                      color="text.primary"
                                      variant="body2"
                                      fontWeight={500}
                                      sx={{ textTransform: 'uppercase' }}
                                    >
                                      {suggestion.estimated_duration_hours}
                                    </Typography>
                                  </Stack>
                                </Stack>
                              </Grid>
                            </Grid>
                            <Divider sx={{ mt: 2 }} />
                          </Grid>
                        )
                      )
                    ) : (
                      <EmptyContent filled title="No Soft Skills Found" />
                    )}
                  </Grid>
                </Stack>
              </AccordionDetails>
            </Accordion>
            {/* Additional Feedback */}
            <Stack spacing={2}>
              <Typography variant="subtitle2">Additional Feedback</Typography>
              <Typography variant="caption">
                {renderText(
                  candidateData?.overall_summary?.recommendations?.additional_comments,
                  true
                )}
              </Typography>
            </Stack>
          </Stack>
        </AccordionDetails>
      </Accordion>
    </>
  );
};
