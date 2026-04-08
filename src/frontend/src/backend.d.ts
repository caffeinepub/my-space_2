import type { Principal } from "@icp-sdk/core/principal";

export interface Some<T> {
  __kind__: "Some";
  value: T;
}
export interface None {
  __kind__: "None";
}
export type Option<T> = Some<T> | None;

export interface Experience {
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

export interface Education {
  degree: string;
  school: string;
  startDate: string;
  endDate: string;
}

export interface Project {
  name: string;
  description: string;
  url: string;
}

export interface CVProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  linkedin: string;
  github: string;
  website: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  projects: Project[];
}

export interface OracleEntry {
  question: string;
  answer: string;
  timestamp: bigint;
}

export type UserRole =
  | { __kind__: "admin" }
  | { __kind__: "user" }
  | { __kind__: "guest" };

export interface backendInterface {
  // Admin
  setApiKeys(gemini: string, stripe: string): Promise<void>;

  // Authorization
  _initializeAccessControlWithSecret(userSecret: string): Promise<void>;
  getCallerUserRole(): Promise<UserRole>;
  assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
  isCallerAdmin(): Promise<boolean>;

  // CV Forge
  getCVProfile(): Promise<Option<CVProfile>>;
  saveCVProfile(profile: CVProfile): Promise<void>;
  isCVForgeUnlocked(): Promise<boolean>;
  enhanceCVText(rawText: string): Promise<string>;
  createCVCheckout(successUrl: string, cancelUrl: string): Promise<string>;
  verifyCVPayment(sessionId: string): Promise<boolean>;

  // AI Tools
  getJobDescription(jobTitle: string): Promise<string>;
  getCoverLetter(jobTitle: string, userSummary: string, letterType: string): Promise<string>;
  getApplicationTool(toolName: string, inputData: string): Promise<string>;

  // The Oracle
  getRemainingQuestions(): Promise<bigint>;
  askOracle(question: string): Promise<string>;
  getQuestionHistory(): Promise<OracleEntry[]>;
}
