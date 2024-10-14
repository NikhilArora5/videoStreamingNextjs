"use client"

import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { uploadVideo } from '@/app/apiService/video';

const videoSchema = z.object({
  title: z.string({
    invalid_type_error: "Title must be a string",
    required_error: "Title is required",
  }).min(1, 'Title is required'),
  
  description: z.string({
    invalid_type_error: "Description must be a string",
    required_error: "Description is required",
  }).min(1, 'Description is required'),

  // Require image file
  image: z
    .custom<FileList>((files) => files instanceof FileList && files.length > 0, {
      message: "Thumbnail image is required",
    }),

  // Require video file
  video: z
    .custom<FileList>((files) => files instanceof FileList && files.length > 0, {
      message: "Video file is required",
    }),
});

type VideoFormData = z.infer<typeof videoSchema>;

function VideoForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<VideoFormData>({
    resolver: zodResolver(videoSchema),
  });

  const onSubmit = async(data: VideoFormData) => {
    const formData = new FormData();
    console.log("data",data)
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('image', data.image[0]);  // Access the file object
    formData.append('video', data.video[0]);  // Access the file object

    console.log('FormData:', formData);

    try {

        const res=await uploadVideo(formData)
        
    } catch (error) {
        
    }
    // Handle form submission
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Upload Video</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        {/* Title Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            {...register('title')}
            className={`mt-1 block w-full px-3 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
        </div>

        {/* Description Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            {...register('description')}
            className={`mt-1 block w-full px-3 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
        </div>

        {/* Thumbnail Image Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Thumbnail Image</label>
          <input
            type="file"
            accept="image/*"
            {...register('image')}
            className={`mt-1 block w-full px-3 py-2 border ${errors.image ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
          />
          {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message?.toString()}</p>}
        </div>

        {/* Video File Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Video File</label>
          <input
            type="file"
            accept="video/*"
            {...register('video')}
            className={`mt-1 block w-full px-3 py-2 border ${errors.video ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
          />
          {errors.video && <p className="text-red-500 text-sm mt-1">{errors.video.message?.toString()}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500"
        >
          Upload Video
        </button>
      </form>
    </div>
  );
}

export default VideoForm;
