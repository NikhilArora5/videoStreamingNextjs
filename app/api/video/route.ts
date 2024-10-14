// app/api/upload/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/app/db/config/db.config";
import fs from "fs";
import path from "path";
import formidable from "formidable";
import { badRequest, successResponseWithMessage } from "@/app/helpers/apiResponses";
import { validationVideoSchema, videoSchema } from "@/app/schemas/videoSchema";
import { ReqBodyValidationresponse, validateBodyData } from "@/app/middleware/requestBodyValiation";
import AWS from "aws-sdk";
import { PassThrough } from "stream"; // Importance

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

// export async function POST(request: NextRequest) {
//   try {
//     const db = await connect();

//     // Parse the incoming form data
//     const form = formidable({ multiples: true });

//     const parsedData = await new Promise((resolve, reject) => {
//       form.parse(request.raw(), async (err, fields, files) => {
//         if (err) {
//           reject(err);
//         }

//         try {

//           const videoFilePath = await saveFile(files.video[0]); // Save video file
//           const imageFilePath = await saveFile(files.image[0]); // Save image file

//           // Extract fields
//           const { title, description } = fields;

//           // Here, you can save the data to your database.
//           const videoData = {
//             title,
//             description,
//             videoPath: videoFilePath,
//             imagePath: imageFilePath,
//           };

//           // Save to the database, replace this with your actual database logic
//           // const result = await db.collection('videos').insertOne(videoData);

//           resolve(videoData); // Resolve with the video data
//         } catch (error) {
//           reject(error);
//         }
//       });
//     });

//     return NextResponse.json(parsedData, { status: 201 });
//   } catch (error) {
//     console.log("error",)
//     console.log("error",error)
//     return NextResponse.json({ error: 'Failed to upload video.' }, { status: 500 });
//   }
// }

//single file upload
// export async function POST(request: NextRequest) {
//   try {
//     const db = await connect();


//     // Parse the incoming form data
//     const formData = await request.formData();
//     console.log("formData", formData)
//     const formPayload = Object.fromEntries(await formData)
//     // Get the file from the form data
//     const image = formData.get("image");

//     const video=formData.get("video");

//     const formValidationData: ReqBodyValidationresponse = validateBodyData(validationVideoSchema, formPayload)

//     if (!formValidationData.isValidated) {
//       return badRequest(NextResponse, formValidationData.message, formValidationData.error)

//     }

//     // const buffer = Buffer.from(await image.);


//     // Check if a file is received
//     if ( !(image instanceof File) || !(video instanceof File)) {
//       return NextResponse.json({ error: "No valid files received." }, { status: 400 });
//     }
//     const files:File[]=[]
//     files.push(image)
//     files.push(video)


//     const uploadDir = path.join(process.cwd(), "uploads"); // Define your uploads directory
//     const fileName = `${Date.now()}_${video.name}`; // Create a unique filename
//     const filePath = path.join(uploadDir, fileName);

//     //  Ensure the uploads directory exists
//     fs.mkdirSync(uploadDir, { recursive: true });


//     //1. UPLOADIN LOCALLY WITHOUT USIGN STREAM


//     /**
//      * Write the file to the local directory
//      * const buffer = Buffer.from(await image.arrayBuffer());
//      * fs.writeFileSync(filePath, buffer);
//      */

//     //2. UPLOADING LOCALLY WITH USIGN STREAM IN NEXTJS

//     /**
//      * Create a writable stream to the local directory
//      * const fileStream = fs.createWriteStream(filePath);

//      *  Convert ReadableStream to a Buffer and upload to S3
//      * const readableStream = image.stream(); // Get the ReadableStream
//      * const chunks: Uint8Array[] = []; // Array to hold the chunks
//      *

//      *  Read the stream
//     const reader = readableStream.getReader()
//     ;let result;

//    while (!(result = await reader.read()).done) {
//      const chunk = result.value;
//      chunks.push(chunk); // Push chunks to array
//      fileStream.write(chunk); // Write to the local file stream
//    }


//    Close the file stream after all chunks are written
//    fileStream.end();

//    console.log(`File uploaded locally to ${filePath}`);
//      */

//     // Create a writable stream to the local directory
//     const fileStream = fs.createWriteStream(filePath);

//     // Convert ReadableStream to a Buffer and upload to S3
//     const readableStream = video.stream(); // Get the ReadableStream
//     const chunks: Uint8Array[] = []; // Array to hold the chunks

//     // Read the stream
//     const reader = readableStream.getReader();
//     let result;

//     while (!(result = await reader.read()).done) {
//       const chunk = result.value;
//       chunks.push(chunk); // Push chunks to array
//       fileStream.write(chunk); // Write to the local file stream
//     }

//     // Close the file stream after all chunks are written
//     fileStream.end();

//     console.log(`File uploaded locally to ${filePath}`);

//     files.map((file)=>{

//     })


//     //code to upload the file on aws

//     // Create a single Buffer from the chunks for S3 upload
//     const buffer = Buffer.concat(chunks);

//     // Prepare S3 upload parameters
//     const s3Params = {
//       Bucket: process.env.S3_BUCKET_NAME!, // Replace with your S3 bucket name
//       Key: `uploads/${Date.now()}_${image.name}`, // Unique filename for S3
//       // Body: image.stream(), // Directly use the stream from the File object
//       Body: buffer,
//       ContentType: image.type, // Set the appropriate content type
//       // ACL: 'public-read', // Set the file permissions (optional)
//     };

//     // Upload to S3
//     // await s3.upload(s3Params).promise();
//     // console.log(`File uploaded to S3: ${s3Params.Key}`);


//     return successResponseWithMessage(NextResponse, "Success")

//   } catch (error: any) {
//     console.log("error",)
//     console.log("error", error)
//     return NextResponse.json({ error: error.message || 'Failed to upload video.' }, { status: 500 });
//   }
// }



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
    // ACL: 'public-read', // Optional: Set the file permissions
  };

  await s3.upload(s3Params).promise();
  console.log(`File uploaded to S3: ${s3Params.Key}`);
}

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
    // Upload files concurrently
    await Promise.all([
      uploadFileToLocal(image),
      // uploadFileToLocal(video),
      uploadFileToS3(image),
      // uploadFileToS3(video),
    ]);

    return successResponseWithMessage(NextResponse, "Files uploaded successfully");

  } catch (error: any) {
    console.error("Error", error);
    return NextResponse.json({ error: error.message || 'Failed to upload files.' }, { status: 500 });
  }
}