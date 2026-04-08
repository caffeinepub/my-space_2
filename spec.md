# My Space

## Current State
- CV Space: Multi-step form with 6 templates, AI enhancement, PDF export, Stripe/JazzCash paywall, 2 free saves then PKR 500/save
- Learning Space (Oracle): Step-by-step AI Q&A with Gemini, Mermaid diagrams, 10 free Q/day, history
- Authentication: ICP Internet Identity, hovering login/signup modal
- Navigation: Dashboard, CV Space, Learning Space, Profile
- UI: Celestial Glassmorphism, Orbitron/Rajdhani fonts, animated starfield

## Requested Changes (Diff)

### Add
- **Auto job description by job title**: In CV experience form, when user types a job title, auto-suggest/populate a job description using AI (Gemini via backend `enhanceCVText`)
- **20 CV templates** (2 free, rest premium): Expand from 6 to 20 templates. Templates 1-2 are always free (Minimalist, Modern). Templates 3-20 require subscription/unlock. Show lock icon on premium templates in the selector.
- **Login gate on all services**: Any click on CV Space, Learning Space, Cover Letter, or Applications prompts login if not authenticated. No anonymous access to content.
- **Print only CV or Q&A**: Apply `@media print` CSS that hides everything except the printable content area (`#cv-preview` in CV Space, `#qa-print-area` in Learning Space). Print button triggers `window.print()`.
- **Cover Letter section**: New page at `/cover-letter`. Uses CV data + user-selected cover letter type (Formal, Creative, Internship, Academic, Tech, Sales) to generate a cover letter via AI. User can edit and print/export.
- **Applications section**: New page at `/applications`. Provides different job application tools: Resume Tailor, LinkedIn Summary, Cold Email Generator, Interview Prep Q&A, Salary Negotiation Letter, Reference Letter, Job Description Analyzer. Each tool is accessible with glassmorphic card UI.

### Modify
- **Navbar**: Add Cover Letter and Applications nav links (visible to authenticated users or always visible)
- **CV Templates component**: Expand to 20 templates, mark first 2 as free
- **CVForge page**: Add auto job-description suggestion on title change, lock premium templates behind subscription check
- **Oracle page**: Wrap Q&A history in `#qa-print-area` div for print targeting
- **App.tsx**: Add routes for `/cover-letter` and `/applications`

### Remove
- Nothing removed

## Implementation Plan
1. Update backend `main.mo` to add: `getCoverLetter(jobTitle, cvSummary, letterType)` endpoint using http-outcalls to Gemini; `getJobDescription(jobTitle)` endpoint for auto job description
2. Expand `CVTemplates.tsx` to 20 templates with free/premium flags
3. Update `CVForge.tsx`: auto-suggest job description on title blur, lock templates 3-20 behind `isUnlocked`
4. Create `CoverLetter.tsx` page: select letter type, generate via AI, show editable output, print button
5. Create `Applications.tsx` page: 7 tool cards each with glassmorphic design, clicking any opens a modal/panel for that tool
6. Update `Oracle.tsx`: wrap Q&A output in `#qa-print-area`
7. Add print CSS in `index.css` to show only `#cv-preview` or `#qa-print-area` when printing
8. Add login gates: any protected page checks `isAuthenticated`, if not redirects/shows modal
9. Update `Navbar.tsx` and `App.tsx` with new routes
