export interface WorkExperience {
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  description: string;
  highlights?: string[];
}

export interface Education {
  degree: string;
  institution: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  date?: string;
  expiryDate?: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  professionalTitle: string;
  summary: string;
  skills: string[];
  languages?: string[];
  workExperience: WorkExperience[];
  education: Education[];
  certifications?: Certification[];
  positionIds: string[];
  cvFile: string;
  status: 'new' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
}
