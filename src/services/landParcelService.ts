/**
 * Land Parcel Service Layer
 *
 * This service layer abstracts the data source.
 * Currently returns mock data.
 * When the real database is connected, replace the mock data fetch
 * with API calls without changing the UI components.
 */

import { LandParcel } from '../types/landParcel';

// Mock land parcels database
const mockLandParcels: Record<string, LandParcel> = {
  // Sample parcel 1 - PB-LDH-2026-984124
  'PB-LDH-2026-984124': {
    landPin: 'PB-LDH-2026-984124',
    ownership: {
      ownerName: 'Gurpreet Singh',
      fatherName: 'Harbhajan Singh',
      coOwners: ['Kamaljeet Kaur'],
      ownershipType: 'Freehold',
      ownershipStatus: 'Clear'
    },
    location: {
      state: 'Punjab',
      district: 'Ludhiana',
      tehsil: 'Ludhiana West',
      village: 'Gill',
      khasraNumber: '142//5/2',
      latitude: 30.8654,
      longitude: 75.8569,
      boundaryCoordinates: [
        { lat: 30.86, lng: 75.85 },
        { lat: 30.87, lng: 75.85 },
        { lat: 30.87, lng: 75.86 },
        { lat: 30.86, lng: 75.86 }
      ]
    },
    landDetails: {
      landUseType: 'Agricultural (Irrigated)',
      landClassification: 'Prime Agricultural',
      recordedArea: 4.82,
      areaUnit: 'Acres',
      gisSpatialArea: 4.31,
      calculatedArea: 4.31,
      marketValue: 14500000,
      valuePerUnitArea: 3008298,
      areaDiscrepancy: 0.51,
      areaDiscrepancyPercentage: 10.58
    },
    analysis: {
      status: 'Needs Review',
      discrepancy: 0.51,
      discrepancyPercentage: 10.58,
      boundaryMatch: 'Mismatch',
      confidenceScore: 65,
      issuesDetected: [
        'Area discrepancy between recorded and GIS data',
        'Potential boundary encroachment'
      ],
      lastAnalysisDate: '2024-03-15'
    },
    legal: {
      overallStatus: 'Under Review',
      activeCases: 2,
      closedCases: 5,
      cases: [
        {
          caseId: 'LC-2023-045',
          courtAuthority: 'Punjab and Haryana High Court',
          caseType: 'Ownership Dispute',
          caseStatus: 'Pending',
          filingDate: '2023-03-15',
          lastUpdated: '2024-10-01',
          partiesInvolved: ['Gurpreet Singh', 'Neighbouring Landowner'],
          remarks: 'Dispute over land boundary'
        }
      ]
    },
    sources: [
      {
        sourceType: 'Revenue Record',
        sourceName: 'Punjab Land Records Portal',
        documentName: 'Jamabandi',
        documentId: 'JR-2023-045',
        recordDate: '2023-06-15',
        ingestionDate: '2023-06-20',
        sourceAuthority: 'Punjab Land Records Department',
        verificationStatus: 'Verified'
      },
      {
        sourceType: 'GIS Data',
        sourceName: 'State Land Information System',
        documentName: 'Spatial Survey',
        documentId: 'SPL-2023-88',
        recordDate: '2023-07-01',
        ingestionDate: '2023-07-10',
        sourceAuthority: 'Land Records Department',
        verificationStatus: 'Verified'
      }
    ],
    history: [
      {
        event: 'Record Created',
        date: '2023-01-15',
        type: 'Initial Survey'
      },
      {
        event: 'Ownership Change',
        date: '2023-06-20',
        type: 'Sale Deed'
      },
      {
        event: 'Mutation',
        date: '2023-07-10',
        type: 'Land Transfer'
      },
      {
        event: 'GIS Update',
        date: '2024-01-15',
        type: 'Spatial Realignment'
      }
    ],
    completeness: {
      totalFields: 50,
      availableFields: 41,
      missingFields: 9,
      completenessPercentage: 82,
      missingFieldNames: [
        'Mutation Date',
        'Co-owner Name',
        'Registration Number',
        'Land Classification',
        'Boundary Coordinates',
        'Value per Unit Area',
        'Area Discrepancy',
        'Confidence Score',
        'Parties Involved'
      ]
    }
  },

  // Mock parcel 2 - HR-GGM-2026-441209
  'HR-GGM-2026-441209': {
    landPin: 'HR-GGM-2026-441209',
    ownership: {
      ownerName: 'Rajesh Sharma',
      fatherName: 'Ved Prakash Sharma',
      coOwners: [],
      ownershipType: 'Freehold',
      ownershipStatus: 'Clear'
    },
    location: {
      state: 'Haryana',
      district: 'Gurugram',
      tehsil: 'Wazirabad',
      village: 'Badshahpur',
      khasraNumber: '76//12/1',
      latitude: 28.398,
      longitude: 77.0543,
      boundaryCoordinates: [
        { lat: 28.39, lng: 77.05 },
        { lat: 28.40, lng: 77.05 },
        { lat: 28.40, lng: 77.06 },
        { lat: 28.39, lng: 77.06 }
      ]
    },
    landDetails: {
      landUseType: 'Commercial / Mixed Use',
      landClassification: 'Commercial',
      recordedArea: 1.25,
      areaUnit: 'Acres',
      gisSpatialArea: 1.25,
      calculatedArea: 1.25,
      marketValue: 8900000,
      valuePerUnitArea: 7120000,
      areaDiscrepancy: 0,
      areaDiscrepancyPercentage: 0
    },
    analysis: {
      status: 'Verified',
      discrepancy: 0,
      discrepancyPercentage: 0,
      boundaryMatch: 'Match',
      confidenceScore: 100,
      issuesDetected: [],
      lastAnalysisDate: '2024-11-20'
    },
    legal: {
      overallStatus: 'Verified',
      activeCases: 0,
      closedCases: 3,
      cases: [
        {
          caseId: 'LC-2023-112',
          courtAuthority: 'District Court, Gurugram',
          caseType: 'Property Dispute',
          caseStatus: 'Resolved',
          filingDate: '2023-11-01',
          lastUpdated: '2024-05-15',
          partiesInvolved: ['Rajesh Sharma'],
          remarks: 'Case resolved in favor of the applicant'
        }
      ]
    },
    sources: [
      {
        sourceType: 'Cadastral Record',
        sourceName: 'Haryana Land Records',
        documentName: 'Jamabandi',
        documentId: 'HR-JR-2023-112',
        recordDate: '2023-10-15',
        ingestionDate: '2023-10-20',
        sourceAuthority: 'Haryana Land Records Department',
        verificationStatus: 'Verified'
      }
    ],
    history: [
      {
        event: 'Record Created',
        date: '2023-05-10',
        type: 'Initial Survey'
      },
      {
        event: 'Ownership Change',
        date: '2023-11-01',
        type: 'Sale Deed'
      }
    ],
    completeness: {
      totalFields: 50,
      availableFields: 50,
      missingFields: 0,
      completenessPercentage: 100,
      missingFieldNames: []
    }
  },

  // Mock parcel 3 - UP-LKO-2026-118942
  'UP-LKO-2026-118942': {
    landPin: 'UP-LKO-2026-118942',
    ownership: {
      ownerName: 'Amitabh Verma',
      fatherName: 'Suresh Chandra Verma',
      coOwners: ['Anita Verma'],
      ownershipType: 'Freehold',
      ownershipStatus: 'Under Review'
    },
    location: {
      state: 'Uttar Pradesh',
      district: 'Lucknow',
      tehsil: 'Sarojini Nagar',
      village: 'Amausi',
      khasraNumber: '318//4',
      latitude: 26.7606,
      longitude: 80.8893,
      boundaryCoordinates: [
        { lat: 26.76, lng: 80.88 },
        { lat: 26.77, lng: 80.88 },
        { lat: 26.77, lng: 80.89 },
        { lat: 26.76, lng: 80.89 }
      ]
    },
    landDetails: {
      landUseType: 'Residential Plot',
      landClassification: 'Residential',
      recordedArea: 3.10,
      areaUnit: 'Acres',
      gisSpatialArea: 3.10,
      calculatedArea: 3.10,
      marketValue: 27500000,
      valuePerUnitArea: 8870967,
      areaDiscrepancy: 0,
      areaDiscrepancyPercentage: 0
    },
    analysis: {
      status: 'Verified',
      discrepancy: 0,
      discrepancyPercentage: 0,
      boundaryMatch: 'Match',
      confidenceScore: 100,
      issuesDetected: [],
      lastAnalysisDate: '2024-08-11'
    },
    legal: {
      overallStatus: 'Verified',
      activeCases: 0,
      closedCases: 4,
      cases: [
        {
          caseId: 'LC-2023-089',
          courtAuthority: 'District Court, Lucknow',
          caseType: 'Property Mutation',
          caseStatus: 'Resolved',
          filingDate: '2023-07-15',
          lastUpdated: '2024-06-01',
          partiesInvolved: ['Amitabh Verma', 'Anita Verma'],
          remarks: 'Mutation successfully completed'
        }
      ]
    },
    sources: [
      {
        sourceType: 'Cadastral Record',
        sourceName: 'Uttar Pradesh Land Records',
        documentName: 'Bhu Naksha',
        documentId: 'UP-BN-2023-089',
        recordDate: '2023-07-15',
        ingestionDate: '2023-07-20',
        sourceAuthority: 'Uttar Pradesh Revenue Department',
        verificationStatus: 'Verified'
      }
    ],
    history: [
      {
        event: 'Record Created',
        date: '2023-02-10',
        type: 'Initial Survey'
      },
      {
        event: 'Ownership Change',
        date: '2023-06-15',
        type: 'Sale Deed'
      },
      {
        event: 'Mutation',
        date: '2023-07-15',
        type: 'Land Transfer'
      }
    ],
    completeness: {
      totalFields: 50,
      availableFields: 50,
      missingFields: 0,
      completenessPercentage: 100,
      missingFieldNames: []
    }
  },

  // Mock parcel 3 - RJ-JPR-2026-773410
  'RJ-JPR-2026-773410': {
    landPin: 'RJ-JPR-2026-773410',
    ownership: {
      ownerName: 'Vikram Singh Rathore',
      fatherName: 'Bhairon Singh Rathore',
      coOwners: [],
      ownershipType: 'Freehold',
      ownershipStatus: 'Disputed'
    },
    location: {
      state: 'Rajasthan',
      district: 'Jaipur',
      tehsil: 'Sanganer',
      village: 'Muhana',
      khasraNumber: '204//18/3',
      latitude: 26.7915,
      longitude: 75.7312,
      boundaryCoordinates: [
        { lat: 26.79, lng: 75.73 },
        { lat: 26.80, lng: 75.73 },
        { lat: 26.80, lng: 75.74 },
        { lat: 26.79, lng: 75.74 }
      ]
    },
    landDetails: {
      landUseType: 'Agricultural (Dryland)',
      landClassification: 'Agricultural',
      recordedArea: 6.40,
      areaUnit: 'Acres',
      gisSpatialArea: 6.00,
      calculatedArea: 6.00,
      marketValue: 32000000,
      valuePerUnitArea: 5000000,
      areaDiscrepancy: 0.40,
      areaDiscrepancyPercentage: 6.25
    },
    analysis: {
      status: 'Minor Discrepancy',
      discrepancy: 0.40,
      discrepancyPercentage: 6.25,
      boundaryMatch: 'Mismatch',
      confidenceScore: 70,
      issuesDetected: [
        'Boundary inconsistency with road margin'
      ],
      lastAnalysisDate: '2024-07-02'
    },
    legal: {
      overallStatus: 'Under Review',
      activeCases: 1,
      closedCases: 0,
      cases: [
        {
          caseId: 'LC-2023-077',
          courtAuthority: 'Additional District Judge, Jaipur',
          caseType: 'Boundary Dispute',
          caseStatus: 'Pending',
          filingDate: '2023-06-10',
          lastUpdated: '2024-10-02',
          partiesInvolved: ['Vikram Singh Rathore', 'Neighbouring Landowner'],
          remarks: 'Boundary dispute regarding road margin'
        }
      ]
    },
    sources: [
      {
        sourceType: 'Survey Record',
        sourceName: 'Rajasthan Cadastral Survey',
        documentName: 'Khasra Record',
        documentId: 'RJ-KH-2023-077',
        recordDate: '2023-05-20',
        ingestionDate: '2023-06-01',
        sourceAuthority: 'Rajasthan Land Records Department',
        verificationStatus: 'Verified'
      }
    ],
    history: [
      {
        event: 'Record Created',
        date: '2023-04-10',
        type: 'Initial Survey'
      },
      {
        event: 'Boundary Dispute Filed',
        date: '2023-06-10',
        type: 'Legal Case'
      }
    ],
    completeness: {
      totalFields: 50,
      availableFields: 42,
      missingFields: 8,
      completenessPercentage: 84,
      missingFieldNames: [
        'Boundary Coordinates',
        'Value per Unit Area',
        'Confidence Score',
        'Co-owner Name',
        'Registration Number',
        'Mutation Date',
        'Land Classification',
        'Parties Involved'
      ]
    }
  },

  // Mock parcel 4 - MH-MUM-2026-905183
  'MH-MUM-2026-905183': {
    landPin: 'MH-MUM-2026-905183',
    ownership: {
      ownerName: 'Nitin Kulkarni',
      fatherName: 'Anant Kulkarni',
      coOwners: [],
      ownershipType: 'Urban',
      ownershipStatus: 'Clear'
    },
    location: {
      state: 'Maharashtra',
      district: 'Mumbai Suburban',
      tehsil: 'Kurla',
      village: 'Chembur',
      khasraNumber: 'CTS 1084/A',
      latitude: 19.0622,
      longitude: 72.8994,
      boundaryCoordinates: [
        { lat: 19.06, lng: 72.90 },
        { lat: 19.07, lng: 72.90 },
        { lat: 19.07, lng: 72.91 },
        { lat: 19.06, lng: 72.91 }
      ]
    },
    landDetails: {
      landUseType: 'Urban Commercial',
      landClassification: 'Commercial',
      recordedArea: 0.45,
      areaUnit: 'Sq Ft',
      gisSpatialArea: 0.45,
      calculatedArea: 0.45,
      marketValue: 24500000,
      valuePerUnitArea: 5444444,
      areaDiscrepancy: 0,
      areaDiscrepancyPercentage: 0
    },
    analysis: {
      status: 'Verified',
      discrepancy: 0,
      discrepancyPercentage: 0,
      boundaryMatch: 'Match',
      confidenceScore: 100,
      issuesDetected: [],
      lastAnalysisDate: '2026-01-14'
    },
    legal: {
      overallStatus: 'Verified',
      activeCases: 0,
      closedCases: 2,
      cases: [
        {
          caseId: 'LC-2023-145',
          courtAuthority: 'Bombay High Court',
          caseType: 'Property Settlement',
          caseStatus: 'Resolved',
          filingDate: '2023-12-01',
          lastUpdated: '2024-03-15',
          partiesInvolved: ['Nitin Kulkarni'],
          remarks: 'Property settlement completed'
        }
      ]
    },
    sources: [
      {
        sourceType: 'Registration Record',
        sourceName: 'Mumbai Land Records',
        documentName: 'Sale Deed',
        documentId: 'MU-SD-2023-145',
        recordDate: '2023-11-15',
        ingestionDate: '2023-12-01',
        sourceAuthority: 'Mumbai Land Records Department',
        verificationStatus: 'Verified'
      }
    ],
    history: [
      {
        event: 'Record Created',
        date: '2023-08-01',
        type: 'Initial Survey'
      },
      {
        event: 'Ownership Change',
        date: '2023-11-15',
        type: 'Sale Deed'
      }
    ],
    completeness: {
      totalFields: 50,
      availableFields: 50,
      missingFields: 0,
      completenessPercentage: 100,
      missingFieldNames: []
    }
  }
};

/**
 * Get land parcel by PIN
 * @param landPin - The Unique Land Parcel Identification Number
 * @returns LandParcel object or null if not found
 */
export const getLandParcelByPin = (landPin: string): LandParcel | null => {
  // Normalize the PIN for lookup (trim, uppercase)
  const normalizedPin = landPin.trim().toUpperCase();
  return mockLandParcels[normalizedPin] || null;
};

/**
 * Search land parcels by query
 * @param query - Search query (ULPIN, parcel ID, owner name, or district)
 * @returns Array of matching land parcels
 */
export const searchLandParcels = (query: string): LandParcel[] => {
  const normalizedQuery = query.trim().toLowerCase();
  const results: LandParcel[] = [];

  Object.values(mockLandParcels).forEach(parcel => {
    if (
      parcel.landPin.toLowerCase().includes(normalizedQuery) ||
      parcel.ownership.ownerName.toLowerCase().includes(normalizedQuery) ||
      parcel.location.district.toLowerCase().includes(normalizedQuery) ||
      parcel.location.state.toLowerCase().includes(normalizedQuery) ||
      parcel.landDetails.landUseType.toLowerCase().includes(normalizedQuery)
    ) {
      results.push(parcel);
    }
  });

  return results;
};

// Export types for use in components
export type {
  LandParcel,
  KhasraInfo,
  LocationInfo,
  OwnershipInfo,
  LandDetails,
  AnalysisInfo,
  LegalCase,
  LegalInfo,
  SourceInfo
};