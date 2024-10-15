// app/api/upload/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/app/db/config/db.config";
import fs from "fs";
import path from "path";
import formidable from "formidable";
import { badRequest, successResponseWithMessage } from "@/app/helpers/apiResponses";
import { VideoFormData, validationVideoSchema, videoSchema } from "@/app/schemas/videoSchema";
import { ReqBodyValidationresponse, validateBodyData } from "@/app/middleware/requestBodyValiation";
import AWS from "aws-sdk";
import { PassThrough } from "stream"; // Importance

import QencodeApiClient from "qencode-api"
import { v4 as uuidv4 } from 'uuid';
const apiKey = process.env.QENCOD_API_KEY;

// Configure AWS SDK
const s3 = new AWS.S3({
  region: process.env.AWS_REGION, // e.g., "us-west-2"
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Your AWS access key
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Your AWS secret key
});
export const config = {
  api: {
    bodyParser: false, // Disable the default body parser to handle FormData
  },
};

// Function to handle file uploads
const saveFile = async (file: formidable.File) => {
  const uploadDir = path.join(process.cwd(), 'uploads'); // Ensure you have an 'uploads' directory
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  const filePath = path.join(uploadDir, file.originalFilename || file.newFilename);
  await fs.promises.rename(file.filepath, filePath); // Move the file from temp location to desired location
  return filePath; // Return the new file path
};





async function uploadFileToLocal(file: File) {
  const uploadDir = path.join(process.cwd(), "uploads");
  const fileName = `${Date.now()}_${file.name}`;
  const filePath = path.join(uploadDir, fileName);

  fs.mkdirSync(uploadDir, { recursive: true });

  const fileStream = fs.createWriteStream(filePath);

  const readableStream = file.stream();
  const reader = readableStream.getReader();
  let result;

  while (!(result = await reader.read()).done) {
    const chunk = result.value;
    fileStream.write(chunk);
  }

  fileStream.end();
  console.log(`File uploaded locally to ${filePath}`);

  return filePath; // Return the local file path
}

async function uploadFileToS3(file: File) {
  const fileName = `${Date.now()}_${file.name}`;
  const chunks: Uint8Array[] = [];

  const readableStream = file.stream();
  const reader = readableStream.getReader();
  let result;

  while (!(result = await reader.read()).done) {
    const chunk = result.value;
    chunks.push(chunk);

  }
  const buffer = Buffer.concat(chunks);



  const s3Params = {
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: `uploads/${fileName}`,
    Body: buffer, // Directly stream the file to S3
    ContentType: file.type,
    // ACL: '', // Optional: Set the file permissions
  };

  await s3.upload(s3Params).promise();
  console.log(`File uploaded to S3: ${s3Params.Key}`);
}

function generateS3Url(objectKey: string) {
  return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${objectKey}`;
}

const transcodeVideo = async (key: string) => {

  try {
    console.log("key Received", key)
    const sourceUrl = generateS3Url(key);
    console.log("sourceUrl", sourceUrl)
    const qencodeApiClient = await new QencodeApiClient(apiKey);
    console.log("runningTask()", qencodeApiClient)
    const destinationObject = {
      "url": `s3://s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.S3_BUCKET_NAME}/transcoded/${uuidv4()}`,
      "key": process.env.AWS_ACCESS_KEY_ID,
      "secret": process.env.AWS_SECRET_ACCESS_KEY,
      // "permissions": "public-read",
      // "storage_class": "REDUCED_REDUNDANCY"
    }
    console.log("destinationObject", destinationObject)


    let transcodingParams = {
      source: sourceUrl,
      format: [
        {
          output: "advanced_hls",
          optimize_bitrate: 1,  // Enable bitrate optimization
          destination: destinationObject,
          stream: [
            {
              size: "3840x2160",   // 4K resolution
              profile: "high",
              level: "5.1",
              bitrate: 12000,      // Increased bitrate for 4K
              video_codec: "libx264",
            },
            {
              size: "1920x1080",   // 1080p resolution
              profile: "main",
              level: "4.2",
              bitrate: 5000,       // Increased bitrate for 1080p
              video_codec: "libx264",
            },
            {
              size: "1280x720",    // 720p resolution
              profile: "main",
              level: "4.1",
              bitrate: 2500,       // Adjusted bitrate for 720p
              video_codec: "libx264",
            },
            {
              size: "854x480",     // 480p resolution
              profile: "main",
              level: "3.1",
              bitrate: 1200,       // Increased bitrate for 480p
              video_codec: "libx264",
            },
            {
              size: "640x360",     // 360p resolution
              profile: "main",
              level: "3.1",
              bitrate: 900,        // Increased bitrate for 360p
              video_codec: "libx264",
            },
            {
              size: "426x240",     // 240p resolution
              profile: "main",
              level: "3.1",
              bitrate: 500,        // Slightly increased bitrate for 240p
              video_codec: "libx264",
            },
          ],
        },
      ],
    };


    let task = await qencodeApiClient.CreateTask();
    console.log("Task", task)

    const res = await task.StartCustom(transcodingParams);



    console.log("res", res)
  } catch (error: any) {
    throw new Error(error)
  }

};

export async function POST(request: NextRequest) {
  try {
    const db = await connect();

    // Parse the incoming form data
    const formData = await request.formData();
    const formPayload = Object.fromEntries(formData);
    const image = formData.get("image");
    const video = formData.get("video");

    const formValidationData: ReqBodyValidationresponse = validateBodyData(validationVideoSchema, formPayload);
    if (!formValidationData.isValidated) {
      return badRequest(NextResponse, formValidationData.message, formValidationData.error);
    }

    // Check if valid files are received
    if (!(image instanceof File) || !(video instanceof File)) {
      return badRequest(NextResponse, "No valid files received")
    }
    console.log("image", image)
    const videoObj = {
      title: "adad",
      description: "ada",
      image: "",
      video: ""

    }

   const savedVideo= await db.video.create(videoObj)
   const videos= await db.video.findAll()
   console.log("videos", videos)
  //  console.log("savedVideo",savedVideo.id)
    // Upload files concurrently
    await Promise.all([
      // uploadFileToLocal(image),
      // uploadFileToLocal(video),
      // uploadFileToS3(image),
      // uploadFileToS3(video),
    ]);
    const fileName = `${Date.now()}_${video.name}`;
    const objectKey = `uploads/${fileName}`
    // await Promise.all([transcodeVideo(objectKey)])




    return successResponseWithMessage(NextResponse, "Files uploaded successfully");

  } catch (error: any) {
    console.error("Error", error);
    return NextResponse.json({ error: error.message || 'Failed to upload files.' }, { status: 500 });
  }
}