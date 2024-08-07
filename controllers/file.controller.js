import multer from "multer";
import {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";
import { Router } from "express";

const router = Router();
const client = new S3Client({});

// Set up memory storage for uploaded files
const storage = multer.memoryStorage();

// Set up multer for file upload
const upload = multer({ storage: storage });

// Function to check if a file exists in the S3 bucket
const fileExists = async (s3Client, bucketName, key) => {
  try {
    await s3Client.send(
      new HeadObjectCommand({ Bucket: bucketName, Key: key })
    );
    return true;
  } catch (error) {
    if (error.name === "NotFound") {
      return false;
    }
    throw error;
  }
};

// Endpoint to handle file uploads
router.post(
  "/upload",
  upload.fields([{ name: "avatar" }]),
  async (req, res) => {
    try {
      const s3Client = new S3Client({
        Bucket:process.env.S3_BUCKET_NAME,
aws_access_key_id : process.env.aws_access_key_id,
aws_secret_access_key : process.env.aws_secret_access_key,
region : process.env.aws_region,
      });
      const bucketName = process.env.S3_BUCKET_NAME;

      // Loop through each file and upload to S3
      for (const fieldname in req.files) {
        const files = req.files[fieldname];
        for (const file of files) {
          let key = file.originalname;

          // Check if the file already exists in the bucket
          if (await fileExists(s3Client, bucketName, key)) {
            return res
              .status(400)
              .json({
                message: "File already exists",
                file: file.originalname,
              });
          }

          // Put an object into an Amazon S3 bucket.
          await s3Client.send(
            new PutObjectCommand({
              Bucket: bucketName,
              Key: key, // Use the original file name as the key
              Body: file.buffer, // Use the buffer directly
              ContentType: file.mimetype, // Set the content type
            })
          );
        }
      }

      res
        .status(200)
        .json({ message: "Files uploaded successfully", files: req.files });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error uploading files", error });
    }
  }
);

// Endpoint to fetch all objects in the S3 bucket
router.get("/list-objects", async (req, res) => {
    const command = new ListObjectsV2Command({
      Bucket:  process.env.S3_BUCKET_NAME,
      // The default and maximum number of keys returned is 1000. This limits it to
      // one for demonstration purposes.
      MaxKeys: 1,
    });
    try {
      let isTruncated = true;

      console.log("Your bucket contains the following objects:\n");
      let contents = [];

      while (isTruncated) {
        const { Contents, IsTruncated, NextContinuationToken } =
          await client.send(command);
        const contentsList = Contents.map((c) => `${c.Key}`);
        contents.push(contentsList);
        console.log(contentsList);
        // contents += contentsList + "\n";
        isTruncated = IsTruncated;
        command.input.ContinuationToken = NextContinuationToken;
      }
      const flatArray = contents.flat();
        console.log({ flatArray });
        
         res.status(200).json({ message: "List of objects", objects:flatArray });
    } catch (err) {
        console.error(err);
           res.status(500).json({ message: "Error fetching objects", err });
    }
});

router.post('/delete-objects', async (req, res) => {
  // const deleteObjects = req.body;
  const command = new DeleteObjectsCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Delete: {
      Objects: [
        // { Key: "EXPORT 2023 AUG 61.xlsx" },
        // { Key: "EXPORT 2023 MAY JUL 42 POLAND.xlsx" },
      ],
    },
  });
try {
  const { Deleted } = await client.send(command);
  console.log(
    `Successfully deleted ${Deleted.length} objects from S3 bucket. Deleted objects:`
  );
  console.log(Deleted.map((d) => `${d.Key}`).join("\n"));
} catch (err) {
  console.error(err);
}
});
export default router;
