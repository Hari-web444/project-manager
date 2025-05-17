const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3');
const { getAwsSecrets } = require('../utilities/vaultClient');

let uploadInstance = null;

async function setupS3Uploader() {
  if (uploadInstance) return uploadInstance;

  const awsSecret = await getAwsSecrets();

  const s3 = new S3Client({
    region: awsSecret.region,
    credentials: {
      accessKeyId: awsSecret.accessKeyId,
      secretAccessKey: awsSecret.secretAccessKey,
    },
  });

  uploadInstance = multer({
    storage: multerS3({
      s3,
      bucket: awsSecret.bucket,
      metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname });
      },
      key: (req, file, cb) => {
        const uniqueName = `products/${Date.now()}_${file.originalname}`;
        cb(null, uniqueName);
      },
    }),
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (allowedTypes.includes(file.mimetype)) cb(null, true);
      else cb(new Error('Only JPEG/PNG/JPG allowed'), false);
    },
    limits: { fileSize: 5 * 1024 * 1024 },
  });

  return uploadInstance;
}

module.exports = setupS3Uploader;
