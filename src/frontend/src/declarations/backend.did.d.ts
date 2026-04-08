/* eslint-disable */
// @ts-nocheck
// Manually updated to match main.mo backend

import type { ActorMethod } from '@icp-sdk/core/agent';
import type { IDL } from '@icp-sdk/core/candid';
import type { Principal } from '@icp-sdk/core/principal';

export interface Experience {
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  bullets: Array<string>;
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
  experience: Array<Experience>;
  education: Array<Education>;
  skills: Array<string>;
  projects: Array<Project>;
}
export interface OracleEntry {
  question: string;
  answer: string;
  timestamp: bigint;
}
export type UserRole = { admin: null } | { user: null } | { guest: null };

export interface _SERVICE {
  setApiKeys: ActorMethod<[string, string], undefined>;
  _initializeAccessControlWithSecret: ActorMethod<[string], undefined>;
  getCallerUserRole: ActorMethod<[], UserRole>;
  assignCallerUserRole: ActorMethod<[Principal, UserRole], undefined>;
  isCallerAdmin: ActorMethod<[], boolean>;
  getCVProfile: ActorMethod<[], [] | [CVProfile]>;
  saveCVProfile: ActorMethod<[CVProfile], undefined>;
  isCVForgeUnlocked: ActorMethod<[], boolean>;
  enhanceCVText: ActorMethod<[string], string>;
  createCVCheckout: ActorMethod<[string, string], string>;
  verifyCVPayment: ActorMethod<[string], boolean>;
  getRemainingQuestions: ActorMethod<[], bigint>;
  askOracle: ActorMethod<[string], string>;
  getQuestionHistory: ActorMethod<[], Array<OracleEntry>>;
}
export declare const idlService: IDL.ServiceClass;
export declare const idlInitArgs: IDL.Type[];
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
