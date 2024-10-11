import { z } from 'zod';

export const videoSchema = z.object({
  title: z.string({
    invalid_type_error: "Title must be a string",
    required_error: "Title is required"
  }).min(1, 'Title is required'),
  
  description: z.string({
    invalid_type_error: "Description must be a string",
    required_error: "Description is required"
  }).min(1, 'Description is required'),
  
  image: z.string({
    invalid_type_error: "Image URL must be a string",
    required_error: "Image URL is required"
  }).url('Image URL must be valid'),
});

export type VideoFormData = z.infer<typeof videoSchema>;
