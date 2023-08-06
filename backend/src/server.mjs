import express from "express";
import cors from "cors";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import mime from "mime-types";
import { v4 as uuidv4 } from "uuid";
import { object, string, number } from "yup";

const { S3_BUCKET, S3_ID, S3_SECRET, S3_REGION, S3_ENDPOINT } = process.env;

const SECOND = 1;
const MINUTE = 60 * SECOND;

const BYTE = 1;
const KILOBYTE = 1024 * BYTE;
const MEGABYTE = 1024 * KILOBYTE;

const s3Client = new S3Client({
  region: S3_REGION,
  endpoint: S3_ENDPOINT,
  forcePathStyle: true, // Required for MinIO to work.
  credentials: {
    accessKeyId: S3_ID,
    secretAccessKey: S3_SECRET,
  },
});

const requestSchema = object({
  contentType: string().required(),
  contentLength: number()
    .integer()
    .positive()
    .max(5 * MEGABYTE)
    .required(),
});

const app = express();
app.use(express.json());
app.use(cors());

app.post("/uploads", async (req, res) => {
  try {
    await requestSchema.validate(req.body, { abortEarly: false });
  } catch (validationErrors) {
    res.status(422).json(validationErrors.inner);
  }

  const { contentType, contentLength } = req.body;
  const extension = mime.extension(contentType);

  const putCommand = new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: `${uuidv4()}.${extension}`,
    ContentType: contentType,
    ContentLength: contentLength,
  });

  const signedUrl = await getSignedUrl(s3Client, putCommand, {
    expiresIn: 5 * MINUTE,
  });

  res.json({ signedUrl: signedUrl });
});

app.listen(3000, "0.0.0.0", function () {
  console.log("S3 uploader is now listening...");
});
