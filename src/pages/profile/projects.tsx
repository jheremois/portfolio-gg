import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  portfolio_name: Yup.string().required('Portfolio name is required'),
  color: Yup.string().required('Color is required'),
  description: Yup.string().required('Description is required'),
  link: Yup.string().url('Invalid URL').required('Link is required'),
});

export default function CreatePortfolioItem() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  if (status === 'unauthenticated') {
    router.push('/');
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
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
        router.push('/profile'); // Redirect to the profile page or list of portfolio items
      } else {
        toast.error(data.error || 'Failed to create portfolio item');
      }
    } catch (error) {
      toast.error('An error occurred while creating the portfolio item.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Create New Portfolio Item</h1>
        <Formik
          initialValues={{
            portfolio_name: '',
            color: '',
            description: '',
            link: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
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
                    className="block w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  <ErrorMessage name="portfolio_name" component="p" className="text-red-500 text-xs mt-1" />
                </div>

                <div>
                  <label htmlFor="color" className="block text-sm font-medium mb-1">
                    Color
                  </label>
                  <Field
                    type="text"
                    id="color"
                    name="color"
                    className="block w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="e.g., #FFFFFF"
                  />
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
                    className="block w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    rows={4}
                  />
                  <ErrorMessage name="description" component="p" className="text-red-500 text-xs mt-1" />
                </div>

                <div>
                  <label htmlFor="link" className="block text-sm font-medium mb-1">
                    Link
                  </label>
                  <Field
                    type="text"
                    id="link"
                    name="link"
                    className="block w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  <ErrorMessage name="link" component="p" className="text-red-500 text-xs mt-1" />
                </div>

                <div className="flex flex-col items-center mb-6">
                  <div className="w-48 h-48 bg-gray-700 rounded-full overflow-hidden mb-4">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Project Image" className="w-full h-full object-cover" />
                    ) : (
                      <p className="text-gray-400">No image selected</p>
                    )}
                  </div>
                  <label htmlFor="image" className="cursor-pointer bg-gray-800 text-white px-4 py-2 rounded">
                    Upload Project Image
                    <input
                      id="image"
                      type="file"
                      className="hidden"
                      onChange={handleImageUpload}
                      accept="image/*"
                    />
                  </label>
                  <p className="text-sm text-gray-400 mt-2">JPG or PNG allowed.</p>
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
