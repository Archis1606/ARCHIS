/**
 * Land Parcel Data Model
 *
 * This structure is designed to be extensible and database-agnostic.
 * When the real backend is connected, this type should map directly
 * to the API response structure.
 *
 * All fields handle null/undefined gracefully - UI should display
 * "Not Available" for missing fields.
 */

export interface KhasraInfo {
  khasraNo?: string;
  khatauniNo?: string;
  mutationDate?: string;
  landClassification?: string;
}

export interface LocationInfo {
  state?: string;
  district?: string;
  tehsil?: string;
  village?: string;
  khasraNumber?: string;
  latitude?: number;
  longitude?: number;
  boundaryCoordinates?: Array<{ lat: number; lng: number }>;
}

export interface OwnershipInfo {
  ownerName?: string;
  fatherName?: string;
  coOwners?: string[];
  ownershipType?: 'Freehold' | 'Leasehold' | 'Government' | 'Inheritance' | 'Other';
  ownershipStatus?: 'Clear' | 'Encumbered' | 'Disputed' | 'Pending';
}

export interface LandDetails {
  landUseType?: string;
  landClassification?: string;
  recordedArea?: number;
  areaUnit?: string;
  gisSpatialArea?: number;
  calculatedArea?: number;
  marketValue?: number;
  valuePerUnitArea?: number;
  areaDiscrepancy?: number;
  areaDiscrepancyPercentage?: number;
}

export interface AnalysisInfo {
  status: 'Verified' | 'Needs Review' | 'Minor Discrepancy' | 'Conflict Detected';
  discrepancy: number;
  discrepancyPercentage: number;
  boundaryMatch: 'Match' | 'Mismatch' | 'Uncertain';
  confidenceScore: number;
  issuesDetected: string[];
  lastAnalysisDate?: string;
}

export interface LegalCase {
  caseId: string;
  courtAuthority?: string;
  caseType?: string;
  caseStatus: 'Active' | 'Closed' | 'Pending' | 'Dismissed';
  filingDate?: string;
  lastUpdated?: string;
  partiesInvolved?: string[];
  remarks?: string;
}

export interface LegalInfo {
  overallStatus: 'Pending' | 'Verified' | 'Under Review' | 'Conflict';
  activeCases: number;
  closedCases: number;
  cases: LegalCase[];
}

export interface SourceInfo {
  sourceType: 'Revenue Record' | 'Cadastral Record' | 'Survey Record' | 'GIS Data' | 'Registration Record' | 'Legal Record';
  sourceName?: string;
  documentName?: string;
  documentId?: string;
  recordDate?: string;
  ingestionDate?: string;
  sourceAuthority?: string;
  verificationStatus: 'Verified' | 'Pending' | 'Unverified';
}

export interface LandParcel {
  landPin: string;
  ownership: OwnershipInfo;
  location: LocationInfo;
  landDetails: LandDetails;
  analysis: AnalysisInfo;
  legal: LegalInfo;
  sources: SourceInfo[];
  history: Array<{
    event: string;
    date: string;
    type: string;
  }>;
  completeness: {
    totalFields: number;
    availableFields: number;
    missingFields: number;
    completenessPercentage: number;
    missingFieldNames: string[];
  };
}