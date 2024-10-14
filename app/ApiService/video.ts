
import axios from "axios";
import { VideoFormData } from "../schemas/videoSchema";

export const uploadVideo = async (data: any) => {
    try {
        const response = await axios.post("/api/video", data);
        return response.data

    } catch (error) {

        if (axios.isAxiosError(error)) {
            if (error.response) {
                throw new Error(error.response.data.message);
            } else if (error.request) {
                throw new Error("No response from server");
            }
        }
        throw new Error("Request setup error");

    }
}