import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

try {
  const res = await cloudinary.uploader.upload(
    'https://res.cloudinary.com/demo/image/upload/sample.jpg',
    {
      folder: 'diagnostics',
      public_id: 'ping_' + Date.now(),
      unique_filename: false,
    }
  );
  console.log('✅ UPLOAD OK:', res.secure_url);
} catch (err) {
  console.error('❌ UPLOAD FAILED:', err.http_code, err.message);
}
