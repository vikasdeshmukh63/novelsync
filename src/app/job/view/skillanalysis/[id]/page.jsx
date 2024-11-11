import { CandidateSkillAnalysisView } from 'src/sections/candidate-skill-analysis/view';

export const metadata = { title: 'Candidate Skill Analysis | NovelHire' };

export default function CandidateSkillAnalysisPage({ params }) {
  const { id } = params;

  return <CandidateSkillAnalysisView id={id} />;
}
