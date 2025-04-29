import { v4 as uuidv4 } from 'uuid';
import { PlantData } from '../types';

export const generateSubmissionLink = (plantId: string): string => {
  const token = uuidv4();
  // In a real application, this would be your deployed application URL
  return `${window.location.origin}/submit/${plantId}/${token}`;
};

export const generateSubmissionExpiry = (): Date => {
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + 24);
  return expiry;
};