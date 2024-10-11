"use client"
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { bookSchema, BookFormData } from '@/app/schemas/bookSchema.'; // Assuming the schema is in a separate file
import { createBook } from '@/app/ApiService/book';
import toast from 'react-hot-toast';

const CreateBookForm: React.FC = () => {
  // Initialize useForm with the Zod schema and zodResolver for validation
  const { register, handleSubmit, formState: { errors }, reset } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
  });

  // Form submission handler
  const onSubmit = async(data: BookFormData) => {
    console.log("Form Data: ", data);

    try {
        
        const res =await createBook(data)
        console.log(res.data);
        toast.success("Book created successfully");

    } catch (error:any) {
        
        toast.error(error||"Book error");
    }
    // Perform any action with the form data, such as submitting to an API
    // reset(); // Reset the form after successful submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg mx-auto p-4 bg-white shadow-md rounded">
      {/* Author Field */}
      <div className="mb-4">
        <label htmlFor="author" className="block text-sm font-medium text-gray-700">
          Author Name
        </label>
        <input
          id="author"
          {...register('author')}
          className={`mt-1 block w-full px-3 py-2 border ${errors.author ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
        />
        {errors.author && <p className="mt-2 text-sm text-red-500">{errors.author.message}</p>}
      </div>

      {/* Title Field */}
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Book Title
        </label>
        <input
          id="title"
          {...register('title')}
          className={`mt-1 block w-full px-3 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
        />
        {errors.title && <p className="mt-2 text-sm text-red-500">{errors.title.message}</p>}
      </div>

      {/* Description Field */}
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          {...register('description')}
          className={`mt-1 block w-full px-3 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
        />
        {errors.description && <p className="mt-2 text-sm text-red-500">{errors.description.message}</p>}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow hover:bg-indigo-700 focus:outline-none"
      >
        Create Book
      </button>
    </form>
  );
};

export default CreateBookForm;
