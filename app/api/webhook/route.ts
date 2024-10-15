import { badRequest, successResponseWithMessage } from "@/app/helpers/apiResponses";
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/app/db/config/db.config";

export async function GET(request: NextRequest) {
    try {
        const reqBody = await request.json();

        console.log("reqBody WEBHOOK CALLED", reqBody)

        return successResponseWithMessage(NextResponse, "success")

    } catch (error) {

    }
}


export async function POST(request: NextRequest) {
    try {
        const bodyText = await request.text();
        const params = new URLSearchParams(bodyText);
        const db = await connect()
        // Convert to an object
        const body = Object.fromEntries(params.entries());

        const task_token = body?.task_token
        const event = body?.event
        const isEncoded = false

        if (task_token) {

            await db.video.update({ encoding_status: event, isEncoded: event == "saved" ? true : false }, { where: { job_id: task_token } })
        }

        console.log(body); // Yo
        return successResponseWithMessage(NextResponse, "success")

    } catch (error) {

        console.log("Error POST", error)

        return badRequest(NextResponse, "error", error)

    }
}