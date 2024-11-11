export const CONSTANTS = {
  CREATE: 'CREATE',
  EDIT: 'EDIT',
};

export const candidateData = {
  analysis_id: '1',
  candidate_info: {
    name: 'Sathish Kumar',
    id: '123',
  },
  skill_gap_analysis: [
    {
      skill_name: 'AWS Architecture',
      required_proficiency_level: 9,
      assessed_proficiency_level: 8,
      gap: 1,
      evidence: 'The candidate has experience with AWS services like Lambda, DynamoDB, and S3.',
      notes:
        'Shows a solid understanding of serverless architecture and basic AWS services, but no mention of high-level architecture design.',
    },
    {
      skill_name: 'Application Deployment & Migration',
      required_proficiency_level: 9,
      assessed_proficiency_level: 6,
      gap: 3,
      evidence: 'Candidate mentioned using CloudFormation and Amplify for deployment.',
      notes:
        'Basic deployment skills demonstrated, but lacks evidence of complex migration or deployment strategies.',
    },
    {
      skill_name: 'Linux/Unix Administration',
      required_proficiency_level: 8,
      assessed_proficiency_level: 4,
      gap: 4,
      evidence: 'No specific mention of Linux/Unix experience in the transcript.',
      notes:
        'A significant skill gap; would benefit from additional training in Linux administration.',
    },
    {
      skill_name: 'Containerization (Docker/Kubernetes)',
      required_proficiency_level: 8,
      assessed_proficiency_level: 3,
      gap: 5,
      evidence: 'No mention of Docker or Kubernetes in the transcript.',
      notes:
        'Needs training in Docker and Kubernetes to meet requirements for large-scale cloud environments.',
    },
    {
      skill_name: 'Collaboration with Cross-Functional Teams',
      required_proficiency_level: 7,
      assessed_proficiency_level: 7,
      gap: 0,
      evidence: 'The candidate referenced working with frontend and backend teams.',
      notes: 'Demonstrates collaborative skills; meets the requirements for team collaboration.',
    },
    {
      skill_name: 'Web Services (API, REST, RPC)',
      required_proficiency_level: 8,
      assessed_proficiency_level: 6,
      gap: 2,
      evidence: 'Candidate mentioned working with APIs but did not discuss REST or RPC.',
      notes: 'Proficient in API usage but may lack exposure to REST and RPC.',
    },
  ],
  overall_summary: {
    average_gap: 2.5,
    critical_gaps: [
      {
        skill_name: 'Containerization (Docker/Kubernetes)',
        gap: 5,
        scale: 'out of 10',
      },
      {
        skill_name: 'Linux/Unix Administration',
        gap: 4,
        scale: 'out of 10',
      },
    ],
    recommendations: {
      fit_for_position: false,
      training_suggestions: [
        {
          training_name: 'AWS Advanced Architecting',
          targeted_skill: 'AWS Architecture',
          training_provider: 'AWS Training',
          estimated_duration_hours: 20,
        },
        {
          training_name: 'Linux Administration for Cloud Engineers',
          targeted_skill: 'Linux/Unix Administration',
          training_provider: 'Udemy',
          estimated_duration_hours: 15,
        },
        {
          training_name: 'Docker & Kubernetes for Cloud Professionals',
          targeted_skill: 'Containerization',
          training_provider: 'Coursera',
          estimated_duration_hours: 18,
        },
      ],
      additional_comments:
        'The candidate demonstrates a strong foundation in basic AWS services but lacks critical experience in containerization and Linux administration, which are necessary for the Senior AWS Developer role.',
    },
  },
};
