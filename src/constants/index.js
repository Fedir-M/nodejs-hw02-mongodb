import path from 'path';

export const sortList = ['asc', 'desc'];

export const SMTP = {
  SMTP_HOST: 'SMTP_HOST',
  SMTP_PORT: 'SMTP_PORT',
  SMTP_USER: 'SMTP_USER',
  SMTP_PASSWORD: 'SMTP_PASSWORD',
  SMTP_FROM: 'SMTP_FROM',
  JWT_SECRET: 'JWT_SECRET',
};

export const TEMP_UPLOAD_DIR = path.join(process.cwd(), 'src', 'temp');
// если проект находится в /home/user/my-project, то process.cwd() вернёт /home/user/my-project.
//path.join(process.cwd(), 'temp'); // Результат: /home/user/my-project/temp
// export const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

export const CLOUDINARY = {
  CLOUD_NAME: 'CLOUNDINARY_CLOUD_NAME',
  API_KEY: 'CLOUNDINARY_API_KEY',
  API_SECRET: 'CLOUNDINARY_API_SECRET',
};
