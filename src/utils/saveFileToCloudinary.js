import { v2 as cloudinary } from 'cloudinary';
import fs from 'node:fs/promises';
import createHttpError from 'http-errors';

import { getEnvVar } from './getEnvVar.js';
import { CLOUDINARY } from '../constants/index.js';

cloudinary.config({
  secure: true,
  cloud_name: getEnvVar(CLOUDINARY.CLOUD_NAME),
  api_key: getEnvVar(CLOUDINARY.API_KEY),
  api_secret: getEnvVar(CLOUDINARY.API_SECRET),
});

// export const saveFileToCloudinary = async (file) => {
//   const response = await cloudinary.v2.uploader.upload(file.path, {
//     folder: 'contacts-photos',
//     resource_type: 'auto',
//     transformation: [{ quality: 'auto' }, { width: 600, crop: 'scale' }],
//   });
//   await fs.unlink(file.path);
//   return response.secure_url;
// };

export const saveFileToCloudinary = async (file) => {
  try {
    await fs.access(file.path);
    const response = await cloudinary.uploader.upload(file.path, {
      folder: 'contacts-photos',
      resource_type: 'auto',
      transformation: [{ quality: 'auto' }, { width: 600, crop: 'scale' }],
    });
    console.log('File uploaded, secure_url-->', response);
    await fs.unlink(file.path).catch(() => {});
    return response.secure_url;
  } catch (error) {
    await fs.unlink(file.path).catch(() => {});
    if (error.code === 'ENOENT') {
      throw createHttpError(400, `File not found: ${file.path}`);
    }
    throw createHttpError(
      500,
      `Failed to upload file to Cloudinary: ${error.message}`,
    );
  }
};
