/* eslint-disable */
// @ts-nocheck
// Manually written to match main.mo backend

import { IDL } from '@icp-sdk/core/candid';

const Experience = IDL.Record({
  title: IDL.Text,
  company: IDL.Text,
  startDate: IDL.Text,
  endDate: IDL.Text,
  bullets: IDL.Vec(IDL.Text),
});

const Education = IDL.Record({
  degree: IDL.Text,
  school: IDL.Text,
  startDate: IDL.Text,
  endDate: IDL.Text,
});

const Project = IDL.Record({
  name: IDL.Text,
  description: IDL.Text,
  url: IDL.Text,
});

const CVProfile = IDL.Record({
  name: IDL.Text,
  email: IDL.Text,
  phone: IDL.Text,
  location: IDL.Text,
  summary: IDL.Text,
  linkedin: IDL.Text,
  github: IDL.Text,
  website: IDL.Text,
  experience: IDL.Vec(Experience),
  education: IDL.Vec(Education),
  skills: IDL.Vec(IDL.Text),
  projects: IDL.Vec(Project),
});

const OracleEntry = IDL.Record({
  question: IDL.Text,
  answer: IDL.Text,
  timestamp: IDL.Int,
});

const UserRole = IDL.Variant({
  admin: IDL.Null,
  user: IDL.Null,
  guest: IDL.Null,
});

export const idlService = IDL.Service({
  setApiKeys: IDL.Func([IDL.Text, IDL.Text], [], []),
  _initializeAccessControlWithSecret: IDL.Func([IDL.Text], [], []),
  getCallerUserRole: IDL.Func([], [UserRole], ['query']),
  assignCallerUserRole: IDL.Func([IDL.Principal, UserRole], [], []),
  isCallerAdmin: IDL.Func([], [IDL.Bool], ['query']),
  getCVProfile: IDL.Func([], [IDL.Opt(CVProfile)], ['query']),
  saveCVProfile: IDL.Func([CVProfile], [], []),
  isCVForgeUnlocked: IDL.Func([], [IDL.Bool], ['query']),
  enhanceCVText: IDL.Func([IDL.Text], [IDL.Text], []),
  createCVCheckout: IDL.Func([IDL.Text, IDL.Text], [IDL.Text], []),
  verifyCVPayment: IDL.Func([IDL.Text], [IDL.Bool], []),
  getRemainingQuestions: IDL.Func([], [IDL.Nat], ['query']),
  askOracle: IDL.Func([IDL.Text], [IDL.Text], []),
  getQuestionHistory: IDL.Func([], [IDL.Vec(OracleEntry)], ['query']),
});

export const idlInitArgs = [];

export const idlFactory = ({ IDL }) => {
  const Experience = IDL.Record({
    title: IDL.Text, company: IDL.Text, startDate: IDL.Text, endDate: IDL.Text, bullets: IDL.Vec(IDL.Text),
  });
  const Education = IDL.Record({
    degree: IDL.Text, school: IDL.Text, startDate: IDL.Text, endDate: IDL.Text,
  });
  const Project = IDL.Record({ name: IDL.Text, description: IDL.Text, url: IDL.Text });
  const CVProfile = IDL.Record({
    name: IDL.Text, email: IDL.Text, phone: IDL.Text, location: IDL.Text, summary: IDL.Text,
    linkedin: IDL.Text, github: IDL.Text, website: IDL.Text,
    experience: IDL.Vec(Experience), education: IDL.Vec(Education),
    skills: IDL.Vec(IDL.Text), projects: IDL.Vec(Project),
  });
  const OracleEntry = IDL.Record({ question: IDL.Text, answer: IDL.Text, timestamp: IDL.Int });
  const UserRole = IDL.Variant({ admin: IDL.Null, user: IDL.Null, guest: IDL.Null });
  return IDL.Service({
    setApiKeys: IDL.Func([IDL.Text, IDL.Text], [], []),
    _initializeAccessControlWithSecret: IDL.Func([IDL.Text], [], []),
    getCallerUserRole: IDL.Func([], [UserRole], ['query']),
    assignCallerUserRole: IDL.Func([IDL.Principal, UserRole], [], []),
    isCallerAdmin: IDL.Func([], [IDL.Bool], ['query']),
    getCVProfile: IDL.Func([], [IDL.Opt(CVProfile)], ['query']),
    saveCVProfile: IDL.Func([CVProfile], [], []),
    isCVForgeUnlocked: IDL.Func([], [IDL.Bool], ['query']),
    enhanceCVText: IDL.Func([IDL.Text], [IDL.Text], []),
    createCVCheckout: IDL.Func([IDL.Text, IDL.Text], [IDL.Text], []),
    verifyCVPayment: IDL.Func([IDL.Text], [IDL.Bool], []),
    getRemainingQuestions: IDL.Func([], [IDL.Nat], ['query']),
    askOracle: IDL.Func([IDL.Text], [IDL.Text], []),
    getQuestionHistory: IDL.Func([], [IDL.Vec(OracleEntry)], ['query']),
  });
};

export const init = ({ IDL }) => { return []; };
