/* eslint-disable */
// @ts-nocheck

import { Actor, HttpAgent, type HttpAgentOptions, type ActorConfig, type Agent, type ActorSubclass } from "@icp-sdk/core/agent";
import type { Principal } from "@icp-sdk/core/principal";
import { idlFactory, type _SERVICE } from "./declarations/backend.did";

export interface Some<T> {
  __kind__: "Some";
  value: T;
}
export interface None {
  __kind__: "None";
}
export type Option<T> = Some<T> | None;

export class ExternalBlob {
  _blob?: Uint8Array<ArrayBuffer> | null;
  directURL: string;
  onProgress?: (percentage: number) => void = undefined;
  private constructor(directURL: string, blob: Uint8Array<ArrayBuffer> | null) {
    if (blob) { this._blob = blob; }
    this.directURL = directURL;
  }
  static fromURL(url: string): ExternalBlob {
    return new ExternalBlob(url, null);
  }
  static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob {
    const url = URL.createObjectURL(new Blob([new Uint8Array(blob)], { type: 'application/octet-stream' }));
    return new ExternalBlob(url, blob);
  }
  public async getBytes(): Promise<Uint8Array<ArrayBuffer>> {
    if (this._blob) return this._blob;
    const response = await fetch(this.directURL);
    const blob = await response.blob();
    this._blob = new Uint8Array(await blob.arrayBuffer());
    return this._blob;
  }
  public getDirectURL(): string { return this.directURL; }
  public withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob {
    this.onProgress = onProgress;
    return this;
  }
}

// Map [] | [T] (candid opt) to Option<T>
function fromCandidOpt<T>(opt: [] | [T]): Option<T> {
  if (opt.length === 0) return { __kind__: "None" };
  return { __kind__: "Some", value: opt[0] };
}

export interface backendInterface {
  setApiKeys(gemini: string, stripe: string): Promise<void>;
  _initializeAccessControlWithSecret(userSecret: string): Promise<void>;
  getCallerUserRole(): Promise<{ __kind__: 'admin' | 'user' | 'guest' }>;
  assignCallerUserRole(user: Principal, role: unknown): Promise<void>;
  isCallerAdmin(): Promise<boolean>;
  getCVProfile(): Promise<Option<unknown>>;
  saveCVProfile(profile: unknown): Promise<void>;
  isCVForgeUnlocked(): Promise<boolean>;
  enhanceCVText(rawText: string): Promise<string>;
  createCVCheckout(successUrl: string, cancelUrl: string): Promise<string>;
  verifyCVPayment(sessionId: string): Promise<boolean>;
  getRemainingQuestions(): Promise<bigint>;
  askOracle(question: string): Promise<string>;
  getQuestionHistory(): Promise<unknown[]>;
}

export class Backend implements backendInterface {
  constructor(
    private actor: ActorSubclass<_SERVICE>,
    private _uploadFile: (file: ExternalBlob) => Promise<Uint8Array>,
    private _downloadFile: (file: Uint8Array) => Promise<ExternalBlob>,
    private processError?: (error: unknown) => never
  ) {}

  private async call<T>(fn: () => Promise<T>): Promise<T> {
    try { return await fn(); }
    catch (e) { if (this.processError) return this.processError(e); throw e; }
  }

  setApiKeys(gemini: string, stripe: string) {
    return this.call(() => this.actor.setApiKeys(gemini, stripe));
  }
  _initializeAccessControlWithSecret(userSecret: string) {
    return this.call(() => this.actor._initializeAccessControlWithSecret(userSecret));
  }
  getCallerUserRole() {
    return this.call(async () => {
      const role = await this.actor.getCallerUserRole();
      // Candid variant: { admin: null } etc -> wrap into __kind__
      const key = Object.keys(role as object)[0];
      return { __kind__: key as 'admin' | 'user' | 'guest' };
    });
  }
  assignCallerUserRole(user: Principal, role: unknown) {
    return this.call(() => this.actor.assignCallerUserRole(user, role as any));
  }
  isCallerAdmin() {
    return this.call(() => this.actor.isCallerAdmin());
  }
  getCVProfile() {
    return this.call(async () => {
      const result = await this.actor.getCVProfile();
      return fromCandidOpt(result as [] | [unknown]);
    });
  }
  saveCVProfile(profile: unknown) {
    return this.call(() => this.actor.saveCVProfile(profile as any));
  }
  isCVForgeUnlocked() {
    return this.call(() => this.actor.isCVForgeUnlocked());
  }
  enhanceCVText(rawText: string) {
    return this.call(() => this.actor.enhanceCVText(rawText));
  }
  createCVCheckout(successUrl: string, cancelUrl: string) {
    return this.call(() => this.actor.createCVCheckout(successUrl, cancelUrl));
  }
  verifyCVPayment(sessionId: string) {
    return this.call(() => this.actor.verifyCVPayment(sessionId));
  }
  getRemainingQuestions() {
    return this.call(() => this.actor.getRemainingQuestions());
  }
  askOracle(question: string) {
    return this.call(() => this.actor.askOracle(question));
  }
  getQuestionHistory() {
    return this.call(async () => {
      const result = await this.actor.getQuestionHistory();
      return result as unknown[];
    });
  }
}

export interface CreateActorOptions {
  agent?: Agent;
  agentOptions?: HttpAgentOptions;
  actorOptions?: ActorConfig;
  processError?: (error: unknown) => never;
}

export function createActor(
  canisterId: string,
  _uploadFile: (file: ExternalBlob) => Promise<Uint8Array>,
  _downloadFile: (file: Uint8Array) => Promise<ExternalBlob>,
  options: CreateActorOptions = {}
): Backend {
  const agent = options.agent || HttpAgent.createSync({ ...options.agentOptions });
  if (options.agent && options.agentOptions) {
    console.warn("Detected both agent and agentOptions. Ignoring agentOptions.");
  }
  const actor = Actor.createActor<_SERVICE>(idlFactory, {
    agent,
    canisterId,
    ...options.actorOptions,
  });
  return new Backend(actor, _uploadFile, _downloadFile, options.processError);
}
