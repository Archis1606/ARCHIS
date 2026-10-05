# ARCHIS Project Documentation

## Project Overview

**Project Name:** ARCHIS  
**Type:** Land Record Intelligence Platform (Prototype)  
**Primary Focus:** Land record analysis, consolidation, and spatial intelligence  
**Status:** Active development - prototype prototype with mock data  

---

## 📁 Project Structure Overview

### Root Directory (`SIH26103 - ARCHIS/`)
- `.git/` - Git repository for version control
- `.gitignore` - Git ignore rules
- `index.html` - Root HTML entry point
- `package.json` - Project dependencies and scripts
- `package-lock.json` - Dependency lock file
- `postcss.config.js` - PostCSS configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `vite.config.js` - Vite build configuration
- `shortlisted ps.pdf` - Presentation file (not part of codebase)
- `shortlisted ps.pptx` - PowerPoint presentation
- `server/` - Node.js/Express backend server
- `public/` - Static assets (images, SVGs)
- `src/` - Frontend source code (React + Tailwind + Vite)

### `src/` Directory Structure
- `src/components/` - React components organized by function
- `src/hooks/` - Custom React hooks
- `src/utils/` - Utility functions (formatters, calculators)
- `src/types/` - TypeScript type definitions (for development only)
- `src/components/LandParcelDetails/` - Land details page components

### `server/` Directory Structure
- `server/index.js` - Main Express server file
- `server/.env` - Environment variables (MongoDB connection, JWT secret)
- `server/package.json` - Backend dependencies
- `server/.env.example` - Template for environment variables

### `public/` Directory Structure
- `public/map.svg` - ARCHIS SVG logo
- `public/images/` - Contains `bg.jpeg` (land parcel image used as hero background)

### `resources/` Directory (Original Project Templates)
- `resources/templates/template.png` - Template reference image
- `resources/map.svg` - Original SVG logo (copied to public/)
- `resources/images/bg.jpeg` - Land parcel image (copied to public/images/)

## 🏗️ Component Architecture

### Core Dashboard Components
- **Navbar.jsx** - Fixed sidebar with navigation (Dashboard, Document Verification, Today's Work, Anomalies), Citizen Portal and Official Login buttons, responsive hamburger menu for mobile
- **Hero.jsx** - Full-screen hero section with land background image, cinematic dark overlay gradients, eyebrow text "AI-POWERED LAND INTELLIGENCE", main heading, paragraph, and CTA buttons
- **IntroSection.jsx** - "The ARCHIS Approach" section explaining land record distribution and ARCHIS purpose
- **ProcessSection.jsx** - Visual three-step process: LAND DOCUMENTS → RECORD CONSOLIDATION → SPATIAL INTELLIGENCE
- **HowItWorks.jsx** - Three conceptual steps: CONSOLIDATE, HARMONIZE, CONNECT with numbers and descriptions
- **FinalCTA.jsx** - Final cinematic section with heading and CTA button
- **Footer.jsx** - Minimal footer with brand name, description, and navigation links

### Land Parcel Details Components (New Additions)
- **LandParcelDetailsPage.jsx** - Main page container with routing (`/land/:landPin`)
- **Header.jsx** - Header with breadcrumb, land PIN display, status badges, tab navigation
- **LandIdentityOwnership.jsx** - Land PIN, owner name, father's name, co-owners, ownership type/status, state/district/tehsil/village, Khasra number
- **LandParcelInformation.jsx** - Land use type, recorded area, GIS spatial area, market value, land classification, area unit, discrepancy info
- **ArchesAnalysis.jsx** - Analysis status, recorded/gis area, discrepancy, percentage, boundary match, confidence score, issues detected
- **LegalStatus.jsx** - Overall legal status, active/closed cases, case details, parties involved, remarks
- **RecordSourcesDocuments.jsx** - Source types, document IDs, record/ingestion dates, authorities, verification status
- **DataCompleteness.jsx** - Total/available/missing fields, completeness percentage, missing field list, visual progress bar
- **GeospatialView.jsx** - Map visualization with boundary coordinates, center coordinates, layer controls, fullscreen option
- **AreaMeasurementTool.jsx** - Measurement tool with recorded/GIS/difference display, measurement history, quick actions
- **LandHistoryTimeline.jsx** - Chronological events (record created, ownership change, mutation, survey, GIS update, legal case, verification, analysis)

### `services/` Directory
- `landParcelService.js` - Mock data service with 5 sample land parcels (ULPIN-based), search functionality, getLandParcelByPin API

### `utils/` Directory
- `formatters.ts` - Currency, area, percentage, date formatting utilities
- `completenessCalculator.ts` - Dynamic completeness calculation from parcel data

### `types/` Directory
- `landParcel.ts` - TypeScript interfaces for LandParcel, OwnershipInfo, LocationInfo, LandDetails, AnalysisInfo, LegalCase, LegalInfo, SourceInfo

## 🗂️ Data Model Structure

### LandParcel Interface
```typescript
landParcel: {
  landPin: string,                          // Unique Land Parcel Identification Number
  ownership: {
    ownerName: string,
    fatherName: string,
    coOwners: string[],
    ownershipType: 'Freehold' | 'Leasehold' | 'Government' | 'Inheritance' | 'Other',
    ownershipStatus: 'Clear' | 'Encumbered' | 'Disputed' | 'Pending'
  },
  location: {
    state: string,
    district: string,
    tehsil: string,
    village: string,
    khasraNumber: string,
    latitude: number,
    longitude: number,
    boundaryCoordinates: Array<{lat: number, lng: number}>
  },
  landDetails: {
    landUseType: string,
    landClassification: string,
    recordedArea: number,
    areaUnit: string,
    gisSpatialArea: number,
    calculatedArea: number,
    marketValue: number,
    valuePerUnitArea: number,
    areaDiscrepancy: number,
    areaDiscrepancyPercentage: number
  },
  analysis: {
    status: 'Verified' | 'Needs Review' | 'Minor Discrepancy' | 'Conflict Detected',
    discrepancy: number,
    discrepancyPercentage: number,
    boundaryMatch: 'Match' | 'Mismatch' | 'Uncertain',
    confidenceScore: number,
    issuesDetected: string[],
    lastAnalysisDate: string
  },
  legal: {
    overallStatus: 'Pending' | 'Verified' | 'Under Review' | 'Conflict',
    activeCases: number,
    closedCases: number,
    cases: [
      {
        caseId: string,
        courtAuthority: string,
        caseType: string,
        caseStatus: 'Active' | 'Closed' | 'Pending' | 'Dismissed',
        filingDate: string,
        lastUpdated: string,
        partiesInvolved: string[],
        remarks: string
      }
    ],
    documents: [
      {
        sourceType: 'Revenue Record' | 'Cadastral Record' | 'Survey Record' | 'GIS Data' | 'Registration Record' | 'Legal Record',
        sourceName: string,
        documentName: string,
        documentId: string,
        recordDate: string,
        ingestionDate: string,
        sourceAuthority: string,
        verificationStatus: 'Verified' | 'Pending' | 'Unverified'
      }
    ],
    history: [
      {
        event: string,
        date: string,
        type: string
      }
    ],
    completeness: {
      totalFields: number,
      availableFields: number,
      missingFields: number,
      completenessPercentage: number,
      missingFieldNames: string[]
    }
  }
```

## 🔌 API Endpoints (Mock Service)

### Backend Server (`server/index.js`)
- **Port:** 5000
- **Dependencies:** express, cors, bcryptjs, jwt

### API Endpoints:
1. **`POST /api/login`** - Authentication (loginId + password → JWT token)
   - Default credentials: `admin` / `admin123`

2. **`GET /api/land-records/search?q=:query`** - Search land records by:
   - ULPIN, parcel ID, owner name, district, land use type

3. **`GET /api/land-records/:ulpin`** - Get full land parcel by ULPIN

4. **`POST /api/admin/add-user`** - Add new official user
   - Generates: loginId (first 3 letters of name + last 4 digits of phone), hashed password

5. **`GET /admin`** - Returns HTML form for adding users

6. **API Endpoints for Dashboard Data:**
   - `GET /api/dashboard/stats` - Dashboard statistics
   - `GET /api/dashboard/anomalies-by-state` - Chart data
   - `GET /api/document-types` - List of document types
   - `GET /api/cases/today` - Today's work cases
   - `GET /api/anomalies` - Anomaly list
   - `GET /api/anomalies/:id` - Specific anomaly detail
   - `GET /api/anomalies/:id/status` - Update anomaly status

7. **`GET /admin`** - HTML form for adding users

### Mock Data Structure
- **5 sample land parcels** with ULPINs: PB-LDH-2026-984124, HR-GGM-2026-441209, UP-LKO-2026-118942, RJ-JPR-2026-773410, MH-MUM-2026-905183
- **5 sample cases** for Today's Work
- **12 sample anomalies** with various types and severities
- **20+ document types** for the document selection
- **Completeness data** calculated dynamically from field presence

### API Response Structure Examples:

**Land Parcel by ULPIN:**
```json
{
  "landPin": "PB-LDH-2026-984124",
  "ownership": { ... },
  "location": { ... },
  "landDetails": { ... },
  "analysis": { ... },
  "legal": { ... },
  "sources": [ ... ],
  "history": [ ... ],
  "completeness": { ... }
}
```

**Dashboard Stats:**
```json
{
  "totalLandRecords": 128450,
  "recordsAnalyzed": 94218,
  "anomaliesDetected": 3842,
  "casesResolved": 2716
}
```

### Data Flow
```
Frontend → API → Mock Data → Visualization
```
Later: Frontend → API → Real Database → Visualization

## 🎨 Visual Design System

### Color palette:
- **Primary:** Emerald/Teal (`#10B981`) - accent color
- **Background:** `#0a0a0a` (nearly black)
- **Text:** `#ffffff` (white) / `#zinc-400` (medium gray) / `#zinc-500` (darker gray)
- **Status colors:** 
  - Green: Verified, success conditions
  - Yellow/Orange: Needs review, minor discrepancy
  - Red: Conflict, errors, missing data
  - Blue: Pending, pending review

### Design Language:
- **Glassmorphism:** Frosted glass effect with `backdrop-blur-xl`
- **Border radius:** `rounded-2xl` to `rounded-3xl` (large rounded corners)
- **Shadows:** `shadow-xl` to `shadow-2xl` (subtle, not dramatic)
- **Transparency:** `bg-zinc-900/40` (40% opacity black)
- **Border:** `border-white/5` (very thin white border)
- **Rounded corners:** `rounded-2xl` to `rounded-3xl` (large, consistent)
- **Spacing:** Consistent `p-6`, `p-4`, `px-6` etc. throughout

### Responsive Behavior:
- **Desktop:** Persistent sidebar (`w-64`/`w-72`/ `w-80`), large content area
- **Tablet:** Collapsible sidebar, adjusted padding
- **Mobile:** Hamburger menu, full-width components, stacked layout
- **Geospatial view:** Adapts from full width to constrained sizes

## 🔧 Development & API Integration

### Current State (Prototype):
- **Mock data** stored in `server/index.js` (in-memory arrays)
- **No database connection** (would use MongoDB Atlas later)
- **Mock data** provides realistic but fake land record information
- **All components** work with mock data and are structured for easy replacement

### To Connect Real Database:
1. **Modify `server/index.js`** - Replace mock data with MongoDB queries
2. **Update `landParcelService.ts`** - Change `getLandParcelByPin()` to call API
3. **Update ` DashboardOverview.jsx`** - Fetch stats from API instead of mock
4. **Update individual components** - Each component reads from the API, not hardcoded data
5. **No UI rebuild needed** - Components are designed to be data-driven

### API Integration Example:
```javascript
// Before (mock):
const data = getLandParcelByPin(landPin);

// After (real API):
const response = await fetch(`/api/land-parcels/${landPin}`);
const data = await response.json();
```

## 📋 Development Workflow

### Local Development:
1. `cd SIH26103 - ARCHIS && npm run dev` - Frontend dev server (`http://localhost:5173/`)
2. `cd SIH26103 - ARCHIS/server && node index.js` - Backend server (`http://localhost:5000/`)
3. Visit `http://localhost:5173/` to see the landing page
4. Click "Official Login" → `admin` / `admin123` → dashboard

### Adding New Features:
1. Add TypeScript type to `src/types/landParcel.ts`
2. Add mock data to `server/index.js`
3. Create component in `src/components/LandParcelDetails/`
4. Add route in `src/App.jsx` (`/land/:landPin`)
5. Add navigation in Navbar.jsx
6. Test with mock data, then replace with API calls

### Testing:
- All components designed to work with mock data first
- Each component has loading, error, and success states
- Responsive breakpoints at `lg:` (lg = lg = 1024px)
- Accessibility: focus states, ARIA labels, keyboard navigation

## 📝 Documentation Standards

### Code Comments:
- All utility functions have JSDoc-style comments
- Component props are documented in-code
- API endpoints documented in server `index.js` comments
- Data model types have inline comments

### Naming Conventions:
- **Components:** PascalCase (`LandParcelDetailsPage`, `Header`)
- **Hooks:** camelCase with `use` prefix (`useScrollReveal`)
- **Utilities:** camelCase (`formatArea`, `calculateCompleteness`)
- **Types:** PascalCase interfaces in `types/`
- **Utility functions:** camelCase (`formatArea`, `formatDate`)

### File Organization:
- **Logical grouping** by feature, not by file type
- **Reusable components** in `src/components/LandParcelDetails/`
- **Utilities** in `src/utils/`
- **Types** in `src/types/`
- **Services** in `src/services/`

## 📋 Todo / Next Steps

### Completed:
- [x] Project scaffolding with Vite + React + Tailwind
- [x] Dashboard with navigation and stats
- [x] Official login/authentication flow
- [x] Land Parcel Details page structure
- [x] ULPIN-based search and lookup
- [x] Mock data with 5 sample parcels
- [x] Data completeness calculation
- [x] Geospatial view (simulated)
- [Area measurement tool]
- [x] Legal cases and documents
- [x] History timeline
- [x] Responsive design (desktop/mobile)
- [x] Mock backend API with 11 endpoints
- [x] JWT authentication
- [x] Comprehensive documentation

### Pending:
- [ ] Connect real MongoDB database
- [ ] Implement actual AI/OCR analysis
- [ ] Connect real GIS/GIS data
- [ ] Connect real legal case records
- [ ] Connect real document management
- [ ] User authentication system ( beyond `admin`/`admin123` )
- [ ] Deploy to production

---
**Last Updated:** 2026-10-04  
**Project Status:** Prototype with mock data - ready for database integration  
**Primary Contact:** Archis Agnihotri (project maintainer)  
**Repository:** Git repository at `C:\Users\Archis Agnihotri\Desktop\SIH26103 - ARCHIS\`