import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  portfolio_name: Yup.string().required('Portfolio name is required').max(50, 'Name must be 50 characters or less'),
  color: Yup.string().matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format').required('Color is required'),
  description: Yup.string().required('Description is required').max(500, 'Description must be 500 characters or less'),
  link: Yup.string().url('Invalid URL').required('Link is required'),
});

export default function CreatePortfolioItem() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    } else {
      setIsLoading(false);
    }
  }, [status, router]);

  const handleImageUpload = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleSubmit = async (values: any, { setSubmitting, resetForm }: any) => {
    const formData = new FormData();
    formData.append('portfolio_name', values.portfolio_name);
    formData.append('color', values.color);
    formData.append('description', values.description);
    formData.append('link', values.link);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const response = await fetch('/api/createPortfolioItem', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Portfolio item created successfully');
        resetForm();
        setImageFile(null);
        setImagePreview(null);
        router.push('/profile');
      } else {
        toast.error(data.error || 'Failed to create portfolio item');
      }
    } catch (error) {
      toast.error('An error occurred while creating the portfolio item.');
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen text-text p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Create New Portfolio Item</h1>
        <Formik
          initialValues={{
            portfolio_name: '',
            color: '#000000',
            description: '',
            link: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="portfolio_name" className="block text-sm font-medium mb-1">
                    Portfolio Name
                  </label>
                  <Field
                    type="text"
                    id="portfolio_name"
                    name="portfolio_name"
                    className="flex-1 min-w-0 block w-full px-3 py-3 rounded-lg bg-input border-2 border-gray-300/20 text-text focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    maxLength={50}
                  />
                  <ErrorMessage name="portfolio_name" component="p" className="text-red-500 text-xs mt-1" />
                </div>

                <div>
                  <label htmlFor="color" className="block text-sm font-medium mb-1">
                    Color
                  </label>
                  <div className="flex items-center space-x-2">
                    <Field
                      type="color"
                      id="color"
                      name="color"
                      className="h-10 w-10 rounded-md border border-gray-600 cursor-pointer"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setFieldValue('color', e.target.value);
                      }}
                    />
                    <Field
                      type="text"
                      name="color"
                      className="flex-1 min-w-0 block w-full px-3 py-3 rounded-lg bg-input border-2 border-gray-300/20 text-text focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="e.g., #FFFFFF"
                    />
                  </div>
                  <ErrorMessage name="color" component="p" className="text-red-500 text-xs mt-1" />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <Field
                    as="textarea"
                    id="description"
                    name="description"
                    className="flex-1 min-w-0 block w-full px-3 py-3 rounded-lg bg-input border-2 border-gray-300/20 text-text focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    rows={4}
                    maxLength={500}
                  />
                  <ErrorMessage name="description" component="p" className="text-red-500 text-xs mt-1" />
                  <p className="text-xs text-gray-400 mt-1">{500 - values.description.length} characters remaining</p>
                </div>

                <div>
                  <label htmlFor="link" className="block text-sm font-medium mb-1">
                    Link
                  </label>
                  <Field
                    type="text"
                    id="link"
                    name="link"
                    className="flex-1 min-w-0 block w-full px-3 py-3 rounded-lg bg-input border-2 border-gray-300/20 text-text focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  <ErrorMessage name="link" component="p" className="text-red-500 text-xs mt-1" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Project Image</label>
                  <div className="flex items-center space-x-6">
                    <div 
                      className={`w-64 h-64 flex-shrink-0 rounded-lg overflow-hidden transition-all duration-300 ease-in-out ${
                        isDragging 
                          ? 'border-2 border-blue-500 bg-blue-500 bg-opacity-10' 
                          : imagePreview 
                            ? 'border-2 border-green-500' 
                            : 'border-2 border-dashed border-gray-600 hover:border-gray-500'
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      {imagePreview ? (
                        <div className="relative w-full h-full group">
                          <img 
                            src={imagePreview} 
                            alt="Project Preview" 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button
                              type="button"
                              onClick={() => {
                                setImageFile(null);
                                setImagePreview(null);
                              }}
                              className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors duration-300"
                              aria-label="Remove image"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label htmlFor="image" className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                          </svg>
                          <span className="mt-2 text-sm text-gray-400 text-center">Drag and drop or click to select</span>
                          <input
                            id="image"
                            type="file"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(file);
                            }}
                            accept="image/jpeg,image/png"
                          />
                        </label>
                      )}
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm text-gray-300 mb-2">
                        Upload a square image for your project. This image will be displayed as a thumbnail and in the project details.
                      </p>
                      <ul className="list-none text-sm text-gray-300 space-y-1">
                        <li className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          Use a 1:1 aspect ratio (square)
                        </li>
                        <li className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          Minimum size: 400x400 pixels
                        </li>
                        <li className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          Maximum file size: 5MB
                        </li>
                        <li className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          Supported formats: JPG, PNG
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Portfolio Item'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}