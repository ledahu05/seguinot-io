# How-To: Post-Deployment SEO Validation

**Feature**: SEO Optimization for All Pages
**Purpose**: Step-by-step guide for validating SEO implementation after deployment

---

## T006: Create Default OG Image

### Image Generation Prompt

Use this prompt with an AI image generator (Midjourney, DALL-E, Ideogram, etc.) or provide to a designer:

```
Create a professional Open Graph social sharing image for a software developer portfolio.

Specifications:
- Dimensions: 1200 x 630 pixels (1.91:1 aspect ratio)
- Style: Clean, minimal, modern Swiss design aesthetic
- Background: Dark gradient (slate-900 to slate-800, similar to #0f172a to #1e293b)

Content to include:
- Name: "Christophe Seguinot" (prominent, large typography)
- Title: "Senior Frontend Developer" (smaller, below name)
- Subtle tech-related visual elements (code brackets, geometric shapes)
- High contrast for readability on social platforms

Color palette:
- Primary text: White (#ffffff)
- Accent: Blue/cyan tones (#3b82f6 or #06b6d4)
- Background: Dark slate gradient

Typography:
- Clean sans-serif font (Inter, Geist, or similar)
- Strong hierarchy between name and title

Safe zone: Keep all important content within the center 1100x580px area to account for platform cropping.

Do NOT include: photos, avatars, logos, or busy patterns.
```

### Manual Creation Alternative

If creating manually in Figma/Canva:
1. Create canvas: 1200 x 630px
2. Background: Linear gradient from `#0f172a` to `#1e293b`
3. Add name text: "Christophe Seguinot" - 72px, white, bold
4. Add title: "Senior Frontend Developer" - 32px, `#94a3b8`, regular weight
5. Optional: Add subtle code bracket decorations `{ }` in accent color
6. Export as PNG, optimize to < 1MB

### Save Location

Save the final image to:
```
data/images/og/default.png
```

---

## T028-T032: Validate JSON-LD Schemas

### Step 1: Access Google Rich Results Test

Go to: https://search.google.com/test/rich-results

### Step 2: Test Each Page Type

#### Homepage (Person + WebSite Schema)

1. Enter URL: `https://seguinot.io/`
2. Click "TEST URL"
3. Wait for results
4. **Expected**:
   - Person schema detected
   - WebSite schema detected
   - No errors (warnings acceptable)
5. **Verify fields**:
   - Person: name, jobTitle, url, sameAs, knowsAbout
   - WebSite: name, url, description

#### Blog Listing (CollectionPage Schema)

1. Enter URL: `https://seguinot.io/blog`
2. Click "TEST URL"
3. **Expected**:
   - CollectionPage schema detected
   - ItemList with blog posts
   - No errors

#### Blog Article (Article Schema)

1. Enter URL: `https://seguinot.io/blog/building-the-blog-feature`
2. Click "TEST URL"
3. **Expected**:
   - Article schema detected
   - No errors
4. **Verify fields**:
   - headline, description, datePublished
   - author (Person), publisher (Person)
   - mainEntityOfPage

#### Quarto Game Hub (SoftwareApplication Schema)

1. Enter URL: `https://seguinot.io/games/quarto`
2. Click "TEST URL"
3. **Expected**:
   - SoftwareApplication schema detected
   - No errors
4. **Verify fields**:
   - name: "Quarto"
   - applicationCategory: "GameApplication"
   - offers (free)

### Step 3: Document Results

Create a results table:

| Page | Schema Type | Status | Errors | Warnings |
|------|-------------|--------|--------|----------|
| Homepage | Person + WebSite | | | |
| Blog Listing | CollectionPage | | | |
| Blog Article | Article | | | |
| Quarto Hub | SoftwareApplication | | | |

### Step 4: Fix Errors (T032)

If errors are found:
1. Note the specific error message
2. Check the corresponding schema generator in `app/lib/seo/structured-data.ts`
3. Fix the schema according to Schema.org requirements
4. Rebuild and redeploy
5. Re-test

---

## T037-T040: Lighthouse SEO Audits

### Step 1: Install Lighthouse (if not installed)

```bash
npm install -g lighthouse
```

### Step 2: Run Audits for Each Public Page

#### Option A: Command Line

```bash
# Create reports directory
mkdir -p reports/seo

# Homepage
lighthouse https://seguinot.io --only-categories=seo --output=html --output-path=./reports/seo/home.html

# Blog listing
lighthouse https://seguinot.io/blog --only-categories=seo --output=html --output-path=./reports/seo/blog.html

# Blog article
lighthouse https://seguinot.io/blog/building-the-blog-feature --only-categories=seo --output=html --output-path=./reports/seo/article.html

# Quarto hub
lighthouse https://seguinot.io/games/quarto --only-categories=seo --output=html --output-path=./reports/seo/quarto.html

# Quarto rules
lighthouse https://seguinot.io/games/quarto/rules --only-categories=seo --output=html --output-path=./reports/seo/rules.html
```

#### Option B: Chrome DevTools

1. Open Chrome DevTools (F12)
2. Go to "Lighthouse" tab
3. Select only "SEO" category
4. Select "Mobile" device
5. Click "Analyze page load"
6. Screenshot or save the report

### Step 3: Document Scores

| Page | SEO Score | Pass/Fail |
|------|-----------|-----------|
| Homepage (`/`) | /100 | |
| Blog Listing (`/blog`) | /100 | |
| Blog Article (`/blog/*`) | /100 | |
| Quarto Hub (`/games/quarto`) | /100 | |
| Quarto Rules (`/games/quarto/rules`) | /100 | |

**Target**: All pages should score 90+ to pass.

### Step 4: Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| Missing meta description | Check `generatePageMeta()` is called with description |
| Title too long | Truncate to 60 characters |
| Missing viewport tag | Already in `__root.tsx` |
| Links not crawlable | Ensure `<Link>` components render as `<a>` tags |
| Tap targets too small | CSS issue - increase button/link padding |
| Document doesn't have `<title>` | Check head() function returns title |

---

## T038-T039: Semantic HTML Validation

### Verify Heading Hierarchy

Open browser console on each page and run:

```javascript
// Check heading hierarchy
const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
console.log('Heading hierarchy:');
headings.forEach(h => console.log(`${h.tagName}: ${h.textContent.substring(0, 50)}`));

// Count h1 tags (should be exactly 1)
const h1Count = document.querySelectorAll('h1').length;
console.log(`\nH1 count: ${h1Count} (should be 1)`);
```

### Verify Image Alt Text

```javascript
// Check images for alt text
const images = document.querySelectorAll('img');
console.log('Image alt text audit:');
images.forEach(img => {
  const src = img.src.split('/').pop();
  const alt = img.alt || '❌ MISSING';
  console.log(`${src}: ${alt}`);
});
```

---

## T040: Complete Quickstart Validation Checklist

After all validation steps, update the checklist in `specs/009-seo-optimization/quickstart.md`:

1. Go through each checkbox
2. Mark completed items with `[x]`
3. Note any issues found
4. Document final validation date

---

## Social Preview Testing

### Facebook/LinkedIn (Open Graph)

1. Go to: https://developers.facebook.com/tools/debug/
2. Enter each page URL
3. Click "Debug" then "Scrape Again"
4. Verify:
   - Title displays correctly
   - Description displays correctly
   - Image loads (1200x630)
   - No warnings

### Twitter Cards

1. Go to: https://cards-dev.twitter.com/validator
2. Enter each page URL
3. Verify:
   - Card type: Summary Large Image
   - Title, description, image render correctly

---

## Validation Complete Checklist

- [ ] Default OG image created and deployed
- [ ] All JSON-LD schemas pass Rich Results Test
- [ ] All pages score 90+ on Lighthouse SEO
- [ ] Each page has exactly one h1
- [ ] All images have descriptive alt text
- [ ] Social previews work on Facebook, Twitter, LinkedIn
- [ ] quickstart.md checklist completed

**Date Validated**: _______________
**Validated By**: _______________
