import api from './api';
import axios from 'axios';

export const uploadService = {
  getPresignedUrl: async (fileName, fileType, fileSize) => {
    const response = await api.post('/upload/presigned-url', {
      fileName,
      fileType,
      fileSize,
    });
    return response.data;
  },

  uploadToS3: async (presignedUrl, file) => {
    await axios.put(presignedUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
    });
  },

  confirmUpload: async (key, fileUrl, fileType, width, height, fileSize) => {
    const response = await api.post('/upload/confirm', {
      key,
      fileUrl,
      fileType,
      width,
      height,
      fileSize,
    });
    return response.data;
  },

  uploadFile: async (file) => {
    // Get presigned URL
    const presignedData = await uploadService.getPresignedUrl(
      file.name,
      file.type,
      file.size
    );

    // Upload to S3
    await uploadService.uploadToS3(presignedData.data.uploadUrl, file);

    // Get image dimensions
    const dimensions = await new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.src = URL.createObjectURL(file);
    });

    // Confirm upload
    const confirmData = await uploadService.confirmUpload(
      presignedData.data.key,
      presignedData.data.fileUrl,
      file.type,
      dimensions.width,
      dimensions.height,
      file.size
    );

    return confirmData.data;
  },
};