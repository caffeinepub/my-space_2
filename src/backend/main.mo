import AccessControl "./authorization/access-control";
import MixinAuthorization "./authorization/MixinAuthorization";
import OutCall "./http-outcalls/outcall";
import Stripe "./stripe/stripe";
import Principal "mo:core/Principal";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";

actor {

  // ─── Types ────────────────────────────────────────────────────────────────

  type Experience = {
    title : Text;
    company : Text;
    startDate : Text;
    endDate : Text;
    bullets : [Text];
  };

  type Education = {
    degree : Text;
    school : Text;
    startDate : Text;
    endDate : Text;
  };

  type Project = {
    name : Text;
    description : Text;
    url : Text;
  };

  type CVProfile = {
    name : Text;
    email : Text;
    phone : Text;
    location : Text;
    summary : Text;
    linkedin : Text;
    github : Text;
    website : Text;
    experience : [Experience];
    education : [Education];
    skills : [Text];
    projects : [Project];
  };

  type OracleEntry = {
    question : Text;
    answer : Text;
    timestamp : Int;
  };

  type DailyCount = {
    count : Nat;
    day : Text;
  };

  // ─── State ────────────────────────────────────────────────────────────────

  let accessControlState = AccessControl.initState();

  var geminiApiKey : Text = "";
  var stripeSecretKey : Text = "";

  let cvProfiles = Map.empty<Principal, CVProfile>();
  let cvUnlockedMap = Map.empty<Principal, Bool>();
  let dailyCounts = Map.empty<Principal, DailyCount>();
  let questionHistoryMap = Map.empty<Principal, [OracleEntry]>();

  // ─── Helpers ──────────────────────────────────────────────────────────────

  func todayKey() : Text {
    let secs = Time.now() / 1_000_000_000;
    let days = secs / 86400;
    days.toText();
  };

  func getCount(caller : Principal) : Nat {
    switch (dailyCounts.get(caller)) {
      case null { 0 };
      case (?dc) {
        if (dc.day == todayKey()) { dc.count } else { 0 };
      };
    };
  };

  func isCVUnlocked(caller : Principal) : Bool {
    switch (cvUnlockedMap.get(caller)) {
      case null { false };
      case (?v) { v };
    };
  };

  func stripeConfig() : Stripe.StripeConfiguration {
    { secretKey = stripeSecretKey; allowedCountries = ["US", "GB", "PK"] };
  };

  func callGemini(prompt : Text) : async Text {
    let escapedPrompt = prompt;
    let body = "{\"contents\":[{\"parts\":[{\"text\":\"" # escapedPrompt # "\"}]}]}";
    let url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" # geminiApiKey;
    let headers : [OutCall.Header] = [{ name = "Content-Type"; value = "application/json" }];
    await OutCall.httpPostRequest(url, headers, body, transform);
  };

  // ─── Transform (required for HTTP outcalls consensus) ─────────────────────

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // ─── Authorization (mixin) ────────────────────────────────────────────────

  include MixinAuthorization(accessControlState);

  // ─── Admin ────────────────────────────────────────────────────────────────

  public shared ({ caller }) func setApiKeys(gemini : Text, stripe : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized");
    };
    geminiApiKey := gemini;
    stripeSecretKey := stripe;
  };

  // ─── CV Forge ────────────────────────────────────────────────────────────

  public query ({ caller }) func getCVProfile() : async ?CVProfile {
    cvProfiles.get(caller);
  };

  public shared ({ caller }) func saveCVProfile(profile : CVProfile) : async () {
    cvProfiles.add(caller, profile);
  };

  public query ({ caller }) func isCVForgeUnlocked() : async Bool {
    isCVUnlocked(caller);
  };

  public shared ({ caller }) func enhanceCVText(rawText : Text) : async Text {
    if (not isCVUnlocked(caller)) {
      Runtime.trap("CV Space is locked. Please purchase access.");
    };
    let prompt = "You are a professional resume writer. Rewrite the following CV bullet points into polished, impact-driven, professional language. Use strong action verbs. Output ONLY the enhanced text, no commentary:\n\n" # rawText;
    await callGemini(prompt);
  };

  public shared ({ caller }) func getJobDescription(jobTitle : Text) : async Text {
    ignore caller;
    let prompt = "You are a professional resume writer. For the job title: \"" # jobTitle # "\", provide 2-3 concise, professional bullet points describing typical key responsibilities and achievements for this role. These will be used as suggestions for a resume. Output ONLY the bullet points, one per line, starting with a dash. No explanations or extra text.";
    await callGemini(prompt);
  };

  public shared ({ caller }) func getCoverLetter(jobTitle : Text, userSummary : Text, letterType : Text) : async Text {
    ignore caller;
    let styleNote = if (letterType == "Creative") {
      "Use a creative, engaging, and personable tone."
    } else if (letterType == "Internship") {
      "Write as a student or recent graduate seeking an internship opportunity. Emphasize eagerness to learn."
    } else if (letterType == "Academic") {
      "Use formal academic language suitable for academic or research positions."
    } else if (letterType == "Tech") {
      "Use a modern, concise, tech-savvy tone highlighting technical skills."
    } else if (letterType == "Sales") {
      "Use a persuasive, results-driven tone highlighting achievements and impact."
    } else {
      "Use a professional, formal tone."
    };
    let prompt = "Write a compelling cover letter for a " # jobTitle # " position. " # styleNote # " The applicant's background: " # userSummary # ". Structure: greeting, opening hook, 2-3 paragraphs on skills and fit, closing call to action, professional sign-off. Output ONLY the cover letter text, no extra commentary.";
    await callGemini(prompt);
  };

  public shared ({ caller }) func getApplicationTool(toolName : Text, inputData : Text) : async Text {
    ignore caller;
    let prompt = if (toolName == "linkedin_summary") {
      "Write a compelling LinkedIn About section (3-4 paragraphs) based on this background: " # inputData # ". Make it professional, first-person, and engaging. Output ONLY the LinkedIn summary text."
    } else if (toolName == "cold_email") {
      "Write a professional cold outreach email for a job opportunity based on: " # inputData # ". Keep it concise (under 200 words), personalized, with a clear ask. Output ONLY the email text."
    } else if (toolName == "interview_prep") {
      "Generate 8 likely interview questions with model answers for this role/background: " # inputData # ". Format as numbered Q&A pairs. Output ONLY the Q&A."
    } else if (toolName == "salary_negotiation") {
      "Write a professional salary negotiation email based on: " # inputData # ". Be confident but respectful. Output ONLY the email text."
    } else if (toolName == "reference_letter") {
      "Write a professional reference letter based on: " # inputData # ". Include specific accomplishments and strong endorsement. Output ONLY the letter."
    } else if (toolName == "job_analyzer") {
      "Analyze this job description and extract: key required skills, nice-to-have skills, cultural signals, and red flags. Input: " # inputData # ". Format as clear sections. Output ONLY the analysis."
    } else {
      "Tailor this resume/profile to better match the job description. Profile and job: " # inputData # ". List specific improvements to make. Output ONLY the tailoring suggestions."
    };
    await callGemini(prompt);
  };

  public shared ({ caller }) func createCVCheckout(successUrl : Text, cancelUrl : Text) : async Text {
    let item : Stripe.ShoppingItem = {
      currency = "usd";
      productName = "My Space CV Space";
      productDescription = "Unlock premium CV templates and AI text enhancement";
      priceInCents = 1000;
      quantity = 1;
    };
    await Stripe.createCheckoutSession(stripeConfig(), caller, [item], successUrl, cancelUrl, transform);
  };

  public shared ({ caller }) func verifyCVPayment(sessionId : Text) : async Bool {
    let status = await Stripe.getSessionStatus(stripeConfig(), sessionId, transform);
    switch (status) {
      case (#completed { userPrincipal = ?uid; response = _ }) {
        let p = Principal.fromText(uid);
        cvUnlockedMap.add(p, true);
        cvUnlockedMap.add(caller, true);
        true;
      };
      case (#completed { userPrincipal = null; response = _ }) {
        cvUnlockedMap.add(caller, true);
        true;
      };
      case (#failed _) { false };
    };
  };

  // ─── The Oracle ──────────────────────────────────────────────────────────

  public query ({ caller }) func getRemainingQuestions() : async Nat {
    let used = getCount(caller);
    if (used >= 10) { 0 } else { 10 - used };
  };

  public shared ({ caller }) func askOracle(question : Text) : async Text {
    let used = getCount(caller);
    if (used >= 10) {
      Runtime.trap("Daily limit reached. You have used your 10 free questions for today.");
    };
    dailyCounts.add(caller, { count = used + 1; day = todayKey() });

    let prompt = "You are an expert academic tutor. Break down the following question into clear numbered steps. Use this structure where applicable: 1-Given, 2-Formula, 3-Substitution, 4-Calculation, 5-Result. For visual subjects (physics, geometry, biology, math), include a Mermaid.js diagram in a ```mermaid code block after the steps. Be concise and educational.\n\nQuestion: " # question;
    let body = "{\"contents\":[{\"parts\":[{\"text\":\"" # prompt # "\"}]}]}";
    let url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" # geminiApiKey;
    let headers : [OutCall.Header] = [{ name = "Content-Type"; value = "application/json" }];
    let response = await OutCall.httpPostRequest(url, headers, body, transform);

    let entry : OracleEntry = { question; answer = response; timestamp = Time.now() };
    let existing = switch (questionHistoryMap.get(caller)) {
      case null { [] };
      case (?h) { h };
    };
    let trimmed : [OracleEntry] = if (existing.size() >= 20) {
      existing.sliceToArray(0, 19);
    } else { existing };
    questionHistoryMap.add(caller, [entry].concat(trimmed));

    response;
  };

  public query ({ caller }) func getQuestionHistory() : async [OracleEntry] {
    switch (questionHistoryMap.get(caller)) {
      case null { [] };
      case (?h) { h };
    };
  };

};
