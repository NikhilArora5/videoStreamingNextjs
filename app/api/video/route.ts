// app/api/upload/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/app/db/config/db.config";
import fs from "fs";
import path from "path";
import formidable from "formidable";
import { badRequest, successResponseWithMessage } from "@/app/helpers/apiResponses";
import { validationVideoSchema, videoSchema } from "@/app/schemas/videoSchema";
import { ReqBodyValidationresponse, validateBodyData } from "@/app/middleware/requestBodyValiation";

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
export async function POST(request: NextRequest) {
  try {
    const db = await connect();
    

    // Parse the incoming form data
    const formData = await request.formData();
    console.log("formData", formData)
    const formPayload = Object.fromEntries(await formData)
    // Get the file from the form data
    const image = formData.get("image");
    
    const formValidationData: ReqBodyValidationresponse = validateBodyData(validationVideoSchema, formPayload)
   
    if (!formValidationData.isValidated) {
      return badRequest(NextResponse, formValidationData.message, formValidationData.error)

    }

    // const buffer = Buffer.from(await image.);


    // Check if a file is received
    if (!image || !(image instanceof File)) {
      return NextResponse.json({ error: "No valid files received." }, { status: 400 });
    }

    const buffer = Buffer.from(await image.arrayBuffer());
    const uploadDir = path.join(process.cwd(), "uploads"); // Define your uploads directory
    const fileName = `${Date.now()}_${image.name}`; // Create a unique filename
    const filePath = path.join(uploadDir, fileName);

    // Ensure the uploads directory exists
    fs.mkdirSync(uploadDir, { recursive: true });

    // Write the file to the local directory
    fs.writeFileSync(filePath, buffer);

    // Convert the file data to a Buffer
    console.log(JSON.stringify(image))


    return successResponseWithMessage(NextResponse, "Success")

  } catch (error:any) {
    console.log("error",)
    console.log("error", error)
    return NextResponse.json({ error: error.message||'Failed to upload video.' }, { status: 500 });
  }
}