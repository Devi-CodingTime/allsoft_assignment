import apiClient from './client';

export const generateOTP = (mobileNumber) =>
  apiClient.post('/generateOTP', { mobile_number: mobileNumber });

export const validateOTP = (mobileNumber, otp) =>
  apiClient.post('/validateOTP', { mobile_number: mobileNumber, otp });

export const saveDocumentEntry = (file, metadata) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('data', JSON.stringify(metadata));
  return apiClient.post('/saveDocumentEntry', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const searchDocumentEntry = (filters) =>
  apiClient.post('/searchDocumentEntry', filters);

export const fetchDocumentTags = (term = '') =>
  apiClient.post('/documentTags', { term });