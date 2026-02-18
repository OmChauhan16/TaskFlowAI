// test-env.js
import dotenv from 'dotenv';
dotenv.config();

console.log('All environment variables:');
console.log(process.env);

console.log('\nCloudinary specific:');
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY);
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET);