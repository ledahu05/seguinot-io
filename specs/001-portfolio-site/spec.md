# Feature Specification: seguinot-io Portfolio Website

**Feature Branch**: `001-portfolio-site`
**Project Name**: `seguinot-io`
**Created**: 2025-12-03
**Status**: Draft
**Input**: User description: "Senior Frontend Developer portfolio website demonstrating high-end engineering skills"

## Data Sources

The portfolio content is sourced from existing data files:

- **Structured Data**: `data/formatted_seguinot_cv_portfolio.json` - Contains profile, skills, projects array, education, and languages in machine-readable format
- **Detailed Content**: `data/formatted_seguinot_cv.md` - Contains comprehensive experience descriptions with full highlight lists
- **Project Screenshots**: `data/images/` - Contains 28 screenshots across 10 projects for visual showcase

### Available Project Screenshots

| Project | Screenshots |
|---------|-------------|
| IRIS Platform | iris-landing-page.png, iris-content-type.png, iris-flows.png, iris-image.png, iris-quote.png, iris-usecase.png |
| Memory Platform | memory-landing-page.png, memory-create-ref.png, memory-create-ref-from-iris.png, memory-view-ref.png |
| Clickn Collect | clickncollect-storefront-home.png, clickncollect-catalog.png, clickncollect-adminui-product.png |
| Blueplan | blueplan-4.png, blueplan-5.png, blueplan-6.png |
| Syment | syment-1.png, syment-2.png, syment-3.png, syment-4.png |
| Moona | moona-1.png, moona-2.png, moona-3.png |
| Lalilo | lalilo-1.png, lalilo-2.png |
| RenovationMan | renovationman-1.png |

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Portfolio Landing (Priority: P1)

A visitor arrives at the portfolio website and immediately sees a professional hero section that communicates Christophe's expertise as a Senior Frontend Developer. The visitor can quickly understand the value proposition and navigate to relevant sections.

**Why this priority**: First impressions are critical. The hero section is the primary conversion point where visitors decide whether to explore further or leave.

**Independent Test**: Can be fully tested by loading the homepage and verifying the hero content displays correctly with working CTA buttons. Delivers immediate value as a functional landing page.

**Acceptance Scenarios**:

1. **Given** a visitor lands on the homepage, **When** the page loads, **Then** they see the headline "Christophe Seguinot: Senior Frontend Developer" and the subhead describing enterprise-scale React/TypeScript expertise serving 8,500+ users.
2. **Given** a visitor is viewing the hero section, **When** they click "View Projects", **Then** they are scrolled or navigated to the project showcase section.
3. **Given** a visitor is viewing the hero section, **When** they click "Contact", **Then** they are scrolled or navigated to the contact section.

---

### User Story 2 - Browse Experience Timeline (Priority: P2)

A potential employer or client wants to understand Christophe's career progression. They interact with an experience timeline that displays roles chronologically with key highlights for each position, enriched with project screenshots where available.

**Why this priority**: Employment history is essential context that validates expertise claims. After the hero hooks interest, visitors need to verify credibility.

**Independent Test**: Can be tested by viewing the timeline component and verifying all career entries display with correct company names, roles, achievements, and associated screenshots.

**Acceptance Scenarios**:

1. **Given** a visitor views the experience timeline, **When** the timeline loads, **Then** they see career entries for all 12 projects from the data source (Memory Platform, IRIS Platform, Clickn Collect, Rounded, Blueplan, Syment, Obat, Moona, Lalilo, RenovationMan, Websenso, Bull/Capgemini).
2. **Given** a visitor views the Egis Memory Platform entry, **When** they read the details, **Then** they see key highlights including "Led MVP delivery", "ReferenceTable system (~2,000 lines)", and "13+ filter types", along with memory platform screenshots.
3. **Given** a visitor views the Egis IRIS Platform entry, **When** they read the details, **Then** they see key highlights including "Built enterprise AI platform for 8,500+ users" and "Solved complex LLM citation matching", along with IRIS platform screenshots.
4. **Given** a visitor views a project entry with screenshots, **When** they interact with the screenshots, **Then** they can view them in a larger format (lightbox or modal).

---

### User Story 3 - Explore Tech Stack (Priority: P2)

A technical evaluator (CTO, Tech Lead) wants to quickly assess Christophe's technology expertise. They view a grid layout that categorizes skills by domain, sourced from the structured CV data.

**Why this priority**: Technical credibility is crucial for senior frontend developer roles. Equal priority to timeline as both establish credibility.

**Independent Test**: Can be tested by viewing the tech stack grid and verifying all categories display with their respective technologies from the JSON data.

**Acceptance Scenarios**:

1. **Given** a visitor views the tech stack section, **When** the grid loads, **Then** they see a "Languages" category containing JavaScript, TypeScript, Python, HTML5, CSS3.
2. **Given** a visitor views the tech stack section, **When** the grid loads, **Then** they see a "Frontend" category containing React 19, Next.js, Redux Toolkit, RTK Query, TanStack, React Aria Components, and other items from the skills.Frontend array.
3. **Given** a visitor views the tech stack section, **When** the grid loads, **Then** they see a "Testing" category containing Vitest, Jest, React Testing Library, Cypress, pytest, TDD, >90% coverage targets.
4. **Given** a visitor views the tech stack section, **When** the grid loads, **Then** they see additional categories: Styling, Tools, Cloud & Infrastructure, Methodologies.

---

### User Story 4 - Review Project Case Studies with Screenshots (Priority: P3)

A potential client or employer wants to understand specific project outcomes. They view detailed case study cards that explain challenges faced, solutions implemented, technologies used, and include visual screenshots of the actual work.

**Why this priority**: Deep-dive content for serious prospects who are past initial assessment. Valuable but not required for first impression.

**Independent Test**: Can be tested by viewing case study cards and verifying each contains Challenge, Solution, Tech Stack sections, and relevant screenshots.

**Acceptance Scenarios**:

1. **Given** a visitor views the project showcase, **When** they see the Memory Platform card, **Then** they see Challenge, Solution, Tech Stack sections plus screenshots (memory-landing-page.png, memory-create-ref.png, memory-view-ref.png).
2. **Given** a visitor views the project showcase, **When** they see the IRIS Platform card, **Then** they see Challenge, Solution, Tech Stack sections plus screenshots (iris-landing-page.png, iris-flows.png, iris-quote.png, etc.).
3. **Given** a visitor views any case study card with multiple screenshots, **When** they interact with the images, **Then** they can browse through all available screenshots for that project.
4. **Given** a visitor views a project from the extended portfolio (Clickn Collect, Blueplan, Syment, Moona, etc.), **When** the card loads, **Then** they see the project screenshots alongside the highlights from the data source.

---

### User Story 5 - Contact and Connect (Priority: P3)

A visitor wants to reach out to Christophe. They find contact information and social links in a dedicated section.

**Why this priority**: Essential for conversions but dependent on visitor being convinced by prior content.

**Independent Test**: Can be tested by viewing contact section and verifying all contact methods are visible and functional.

**Acceptance Scenarios**:

1. **Given** a visitor views the contact section, **When** the section loads, **Then** they see location "Chorges, France".
2. **Given** a visitor views the contact section, **When** they see social links, **Then** they find LinkedIn link (https://linkedin.com/in/christophe-seguinot) and email (christophe.seguinot@gmail.com).
3. **Given** a visitor clicks the email link, **When** the action triggers, **Then** their email client opens with the address pre-filled.
4. **Given** a visitor views the contact section, **When** they see the phone number, **Then** they can click to initiate a call (+33 6 26 33 07 10).

---

### User Story 6 - Toggle Dark/Light Mode (Priority: P4)

A visitor prefers a different color scheme. They toggle between Dark and Light mode, with Dark mode as the default "Future-Tech" aesthetic.

**Why this priority**: Nice-to-have accessibility feature. Core content is usable without it.

**Independent Test**: Can be tested by clicking the theme toggle and verifying colors change appropriately.

**Acceptance Scenarios**:

1. **Given** a visitor loads the site for the first time, **When** the page renders, **Then** Dark mode is active by default.
2. **Given** a visitor is viewing in Dark mode, **When** they click the theme toggle, **Then** the site switches to Light mode with appropriate color changes.
3. **Given** a visitor has toggled to Light mode, **When** they click the theme toggle again, **Then** the site returns to Dark mode.

---

### Edge Cases

- What happens when the JSON data file is missing or malformed?
  - System displays graceful error state with message "Unable to load content"
- What happens when a project screenshot file is missing?
  - System displays placeholder image or hides the image slot gracefully
- What happens when a visitor accesses the site on a very narrow screen (< 320px)?
  - Content remains readable with horizontal scrolling prevented
- What happens when a visitor disables JavaScript?
  - Core content (hero, text content) remains visible via server-side rendering
- How does the system handle broken social links?
  - Links open in new tabs; if destination is unavailable, browser handles the error

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a hero section with headline, subhead (from profile.summary), and two CTA buttons ("View Projects", "Contact")
- **FR-002**: System MUST load structured content from `data/formatted_seguinot_cv_portfolio.json` for profile, skills, projects, education, and languages
- **FR-003**: System MUST display an interactive timeline showing all 12 projects from the data source chronologically
- **FR-004**: System MUST display a tech stack grid with all 7 skill categories from the JSON data: Languages, Frontend, Testing, Styling, Tools, Cloud & Infrastructure, Methodologies
- **FR-005**: System MUST display project case study cards for projects that have screenshots available, with Challenge, Solution, and Tech Stack sections
- **FR-006**: System MUST display project screenshots from `data/images/` directory, associated with the correct project entries
- **FR-007**: System MUST display contact information from profile.contact: location, LinkedIn, email, and phone
- **FR-008**: System MUST provide a Dark/Light mode toggle with Dark mode as default
- **FR-009**: System MUST persist theme preference across page visits (stored in browser)
- **FR-010**: System MUST be fully responsive following mobile-first design principles
- **FR-011**: System MUST render core content on the server for initial page load
- **FR-012**: System MUST optimize and lazy-load project screenshots for performance
- **FR-013**: System MUST provide image viewing capability (lightbox/modal) for project screenshots

### Key Entities

- **CV Data**: Complete portfolio content sourced from `formatted_seguinot_cv_portfolio.json` including profile, skills, projects, education, languages.
- **Profile**: Name, title, location, summary, and contact information (email, phone, LinkedIn, GitHub, portfolio).
- **Project Entry**: Title, role, company, location, period (start/end), highlights array, and technologies array.
- **Skill Category**: Category name (Languages, Frontend, Testing, Styling, Tools, Cloud & Infrastructure, Methodologies) and array of skill items.
- **Project Screenshot**: Image file associated with a project, stored in `data/images/` with project-prefixed naming convention.
- **Education Entry**: Degree, institution, period, and honors.
- **Language Entry**: Language name and proficiency level.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Site loads initial content (hero section visible) in under 2 seconds on standard 4G connection
- **SC-002**: All interactive elements (timeline, CTA buttons, theme toggle, image lightbox) respond to user input within 100ms
- **SC-003**: Site is fully usable on screens from 320px to 2560px width without horizontal scrolling
- **SC-004**: 100% of content updates can be made by editing the JSON data file without code changes
- **SC-005**: Theme preference persists correctly across browser sessions 100% of the time
- **SC-006**: All CTA buttons and navigation links successfully reach their intended destinations
- **SC-007**: Site achieves WCAG 2.1 AA compliance for color contrast and keyboard navigation
- **SC-008**: Visitors can navigate from hero to any section in under 3 clicks
- **SC-009**: All 28 project screenshots load and display correctly associated with their respective projects
- **SC-010**: All 12 projects from the data source are displayed in the timeline

## Assumptions

- Single-page application with smooth scrolling between sections (not multi-page routing)
- No authentication or user accounts required (public portfolio)
- No backend API required; JSON file and images loaded at build time or server-side
- Project screenshots are already optimized for web (will be converted to WebP/AVIF during build)
- The mapping between screenshots and projects follows the filename prefix convention (e.g., "iris-*.png" belongs to IRIS Platform)
- Challenge and Solution content for case studies will be derived from the highlights array in the project data
- Timeline orientation (vertical vs horizontal) is a design decision deferred to implementation
- "Bento box style" for tech stack grid implies an asymmetric, visually interesting grid layout
- GitHub repository will be named `seguinot-io` (domain: seguinot-io.vercel.app)
