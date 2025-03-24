import { S3Client, CreateMultipartUploadCommand, UploadPartCommand, CompleteMultipartUploadCommand } from "@aws-sdk/client-s3";
import { readFileSync, createReadStream } from "fs";
import dotenv from "dotenv";

dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
const FILE_PATH = "./uploads/20MB.zip.part6"; // Change this to your file path
const KEY = "stating/file-tester/20MB.zip.part6"; // S3 object key
const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks (minimum size for multipart upload)

export async function uploadFileToS3(file) {
  console.log(BUCKET_NAME)
  try {
    // Step 1: Initiate multipart upload
    const createMultipartUploadResponse = await s3.send(
      new CreateMultipartUploadCommand({
        Bucket: BUCKET_NAME,
        Key: KEY,
      })
    );
    const uploadId = createMultipartUploadResponse.UploadId;
    console.log(`Upload ID: ${uploadId}`);

    // Step 2: Read file and upload in chunks
    const fileStream = createReadStream(file, { highWaterMark: CHUNK_SIZE });
    let partNumber = 1;
    const parts = [];

    for await (const chunk of fileStream) {
      console.log(`Uploading part ${partNumber}...`);

      const uploadPartResponse = await s3.send(
        new UploadPartCommand({
          Bucket: BUCKET_NAME,
          Key: KEY,
          UploadId: uploadId,
          PartNumber: partNumber,
          Body: chunk,
        })
      );

      parts.push({ PartNumber: partNumber, ETag: uploadPartResponse.ETag });
      console.log(`Uploaded part ${partNumber}`);
      partNumber++;
    }

    // Step 3: Complete multipart upload
    await s3.send(
      new CompleteMultipartUploadCommand({
        Bucket: BUCKET_NAME,
        Key: KEY,
        UploadId: uploadId,
        MultipartUpload: { Parts: parts },
      })
    );

    console.log("File uploaded successfully!");
  } catch (error) {
    console.error("Error uploading file:", error);
  }
}

// uploadFileToS3();
