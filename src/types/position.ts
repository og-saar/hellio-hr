export interface Position {
  id: string;
  title: string;
  company: string;
  contactName?: string;
  contactEmail?: string;
  status: 'open' | 'closed' | 'on-hold';
  postedDate: string;
  timeline?: string;
  workArrangement: 'remote' | 'hybrid' | 'onsite';
  salaryRange?: string;
  summary: string;
  mustHave: string[];
  niceToHave: string[];
  responsibilities: string[];
  techStack: string[];
  candidateIds: string[];
  sourceFile?: string;
}
