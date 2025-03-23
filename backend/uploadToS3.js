import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import mime from "mime-types";
import dotenv from "dotenv";

dotenv.config({
  path: "./config/config.env"
});
dotenv.configDotenv({
  path: "./config/config.env"
});

const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey =process.env.AWS_SECRET_ACCESS_KEY;
const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

// initialize S3 client and set configurations
const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey
  }
});


// utility function to upload image to s3 bucket
export const uploadSingleFileToS3 = async (photo, pathKey = "staging/testing") => {
  if (!photo || !photo.buffer || !photo.originalname) return false;
  try {
    const fileExtension = photo.originalname.split(".").pop();
    const timestamp = new Date().toISOString().replace(/:/g, "-").replace(/\..+/, "");
    const fileName = `${photo.originalname?.replace(/\s+/g, "-").split(".").slice(0, -1).join(".")}_${timestamp}.${fileExtension}`;

    const detectedMimeType = mime.lookup(photo.originalname) || "application/octet-stream";

    const uploadParams = {
      Bucket: BUCKET_NAME,
      Body: photo.buffer,
      Key: `${pathKey}/${fileName}`,
      ContentType: detectedMimeType
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    const url = await getSignedUrl(
      s3Client,
      new GetObjectCommand({ Bucket: BUCKET_NAME, Key: `${pathKey}/${fileName}` }),
      { expiresIn: 60 }
    );

    return { fileName, url: url.split("?")[0], key: `${pathKey}/${fileName}` };
  } catch (error) {
    console.log("Error while uploading file to the S3", error);
    return null;
  }
};
