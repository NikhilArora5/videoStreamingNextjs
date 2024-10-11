import axios from "axios";
import { BookFormData } from "../schemas/bookSchema.";

export const createBook = async (data: BookFormData) => {
    try {
        const response = await axios.post("/api/book", data);
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


export const getBooks = async () => {
    try {
        const response = await axios.get("/api/book");
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