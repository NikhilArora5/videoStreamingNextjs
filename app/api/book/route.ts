import { badRequest, successResponseWithData } from "@/app/helpers/apiResponses";
import { bookSchema } from "@/app/schemas/bookSchema.";
import { NextRequest, NextResponse } from "next/server";
import { connect } from '@/app/db/config/db.config';
import { authMiddleware } from "@/app/helpers/verifyRoleBaseAuth";

export async function POST(request: NextRequest) {
    try {

        const db=await connect()
        const reqBody = await request.json();
        const result = bookSchema.safeParse(reqBody);
        console.log(result.error?.issues, "result");

        if (result.error && result.error?.issues.length) {
            const reqBodyValidationErrors = Object.fromEntries(

                result.error?.issues?.map((issue) => [issue.path[0], issue.message]) || []
            );

            // Respond with a JSON object containing the validation errors
            return badRequest(NextResponse, "Invalid Form Data", reqBodyValidationErrors)

        }

        const saveBook = await db.book.create(reqBody)
        console.log(saveBook, "saveBook");

        return successResponseWithData(NextResponse, "Book created successfully", saveBook)



    } catch (error: any) {
        console.error("Server error:", error.message);

        return badRequest(NextResponse, error.message || "Internal Server error")

    }
}

export async function GET(request: NextRequest) {
    try {

        const db=await connect()

        const { success, user, message } = await authMiddleware(request)
        console.log("user from authMiddleware", user)
        if (!success) return badRequest(NextResponse, message || "Not authorized")

        const books = await db.book.find()
        console.log(books, "saveBook");

        return successResponseWithData(NextResponse, "Book fetched successfully", books)



    } catch (error: any) {
        console.error("Server error:", error.message);

        return badRequest(NextResponse, error.message || "Internal Server error")

    }
}