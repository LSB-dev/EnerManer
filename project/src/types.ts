export enum FileStatus {
  SUCCESS = 'success',
  ERROR = 'error'
}

export type ReportingStatus = 'completed' | 'open' | 'overdue';
export type SubmissionStatus = 'submitted' | 'pending' | 'none';
export type ReportingMethod = 'smartmeter' | 'manual';

export interface ProcessedFile {
  name: string;
  size: number;
  type: string;
  status: FileStatus;
  timestamp: Date;
  message: string;
}

export interface SmartMeter {
  id: string;
  name: string;
  location: string;
  status: 'connected' | 'disconnected' | 'error';
  lastReading?: {
    timestamp: Date;
    value: number;
    unit: string;
  };
}

export interface SmartMeterReading {
  meterId: string;
  timestamp: Date;
  value: number;
  unit: string;
}

export type UserRole = 'reporting' | 'procurement';

export interface HistoricalReport {
  id: string;
  date: Date;
  type: 'electricity' | 'gas';
  status: 'archived' | 'received';
  plant: string;
  downloadUrl?: string;
}

export interface EnergyContract {
  id: string;
  supplier: string;
  type: 'electricity' | 'gas';
  startDate: Date;
  endDate: Date;
  volume: number;
  price: number;
  fixedShare: number;
  variableShare: number;
}

export interface ConsumptionForecast {
  plant: string;
  date: Date;
  value: number;
  uncertainty: number;
  unit: string;
}

export interface PlantContact {
  name: string;
  email: string;
  phone: string;
  role: string;
}

export interface PlantComment {
  id: string;
  text: string;
  timestamp: Date;
}

export interface ElectricityData {
  total: string;
  peak: string;
  offPeak: string;
  peakPower: string;
  supplier?: string;
}

export interface ConsumptionData {
  currentYear: {
    electricity: ElectricityData;
    gas: string;
    gasSupplier?: string;
  };
  forecast: {
    electricity: ElectricityData;
    gas: string;
    gasSupplier?: string;
  };
}

export interface QuarterlyReport {
  quarter: number;
  year: number;
  startDate: Date;
  endDate: Date;
  submissionDate: Date;
  gasSupplier: string;
  consumption: {
    electricity: number;
    gas: number;
  };
  generation: {
    pv: number;
    chp: number;
  };
}

export interface MeteringPoint {
  id: string;
  name: string;
  meteringPointId: string;
  billingRecipientId: string;
  institute: string;
  endConsumer: string;
  year: number;
  status: SubmissionStatus;
  reportingMethod: ReportingMethod;
}

export interface EnergyData {
  consumption: {
    electricity: {
      current: number;
      previous: number;
      unit: string;
      status: 'reported' | 'pending' | 'overdue';
    };
    gas: {
      current: number;
      previous: number;
      unit: string;
      status: 'reported' | 'pending' | 'overdue';
    };
  };
  generation: {
    pv: {
      capacity: number;
      generation: number;
      unit: string;
      status: 'active' | 'inactive' | 'maintenance';
    };
    chp: {
      capacity: number;
      generation: number;
      unit: string;
      status: 'active' | 'inactive' | 'maintenance';
    };
  };
  quarterlyReports?: QuarterlyReport[];
}

export interface PlantData {
  id: string;
  name: string;
  lastReport: Date | null;
  pendingReports: string[];
  historicalAverage: {
    electricity: number;
    gas: number;
  };
  contact: PlantContact;
  comments: PlantComment[];
  energyData: EnergyData;
  submissionStatus: SubmissionStatus;
  submissionLink?: string;
  submissionExpiry?: Date;
  meteringPoints: MeteringPoint[];
}