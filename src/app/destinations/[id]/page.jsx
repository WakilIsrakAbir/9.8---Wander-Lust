"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import { api } from '@/lib/api-proxy';

export default function DestinationsDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const { data: session } = authClient.useSession();
  
  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    destinationName: '',
    country: '',
    category: '',
    price: '',
    duration: '',
    departureDate: '',
    imageUrl: '',
    description: ''
  });

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    const fetchDestination = () => {
      api.destinations(id)
        .then(data => {
          setDestination(data);
          setEditFormData({
            destinationName: data.destinationName || '',
            country: data.country || '',
            category: data.category || '',
            price: data.price || '',
            duration: data.duration || '',
            departureDate: data.departureDate || '',
            imageUrl: data.imageUrl || '',
            description: data.description || ''
          });
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch destination", err);
          setLoading(false);
        });
    };

    fetchDestination();
  }, [id]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    api.destinations(id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editFormData),
    })
    .then(data => {
      if(data.modifiedCount > 0) {
        setDestination({ ...destination, ...editFormData });
      }
      setIsEditModalOpen(false);
    })
    .catch(err => {
      console.error("Failed to update destination", err);
    });
  };

  const handleDelete = () => {
    api.destinations(id, {
      method: 'DELETE',
    })
    .then(data => {
      if(data.deletedCount > 0) {
        router.push('/destinations');
      }
    })
    .catch(err => {
      console.error("Failed to delete destination", err);
    });
  };

  const handleBooking = () => {
    if (!session?.user) {
      router.push('/login');
      return;
    }

    setBookingLoading(true);
    
    const bookingData = {
      userId: session.user.id,
      destinationId: destination._id,
      destinationName: destination.destinationName,
      country: destination.country,
      price: destination.price,
      departureDate: destination.departureDate,
      imageUrl: destination.imageUrl
    };

    api.bookings({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    })
    .then(data => {
      if (data.success) {
        router.push('/my-bookings');
      }
    })
    .catch(err => {
      console.error("Failed to book destination", err);
      setBookingLoading(false);
    });
  };

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  if (!destination) {
    return <div className="text-center py-20">Destination not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-4xl mx-auto mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <Link href="/destinations" className="inline-flex items-center text-gray-600 hover:text-cyan-600 transition-colors font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Back to Destinations
        </Link>
        <div className="flex gap-2 w-full sm:w-auto">
          <button onClick={() => setIsEditModalOpen(true)} className="flex-1 sm:flex-none flex justify-center items-center gap-1 border border-gray-300 text-gray-700 px-4 py-2 sm:py-1.5 rounded hover:bg-gray-100 transition text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
            Edit
          </button>
          <button onClick={() => setIsDeleteModalOpen(true)} className="flex-1 sm:flex-none flex justify-center items-center gap-1 border border-red-200 text-red-500 px-4 py-2 sm:py-1.5 rounded hover:bg-red-50 transition text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
            Delete
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <img 
          src={destination.imageUrl || "https://placehold.co/1200x600?text=No+Image"} 
          alt={destination.destinationName}
          className="w-full h-auto max-h-[600px] object-contain bg-gray-50"
        />
        <div className="p-5 md:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start mb-6 sm:mb-4 gap-4 sm:gap-0">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{destination.destinationName}</h1>
              <div className="flex items-center gap-2 text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                {destination.country}
              </div>
            </div>
            <div className="text-left sm:text-right">
              <div className="text-3xl font-bold text-cyan-600">${destination.price}</div>
              <div className="text-gray-500 text-sm">per person</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 py-4 sm:py-6 border-y border-gray-100">
            <div>
              <div className="text-sm text-gray-500 mb-1">Duration</div>
              <div className="font-medium text-gray-900">{destination.duration}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Category</div>
              <div className="font-medium text-gray-900">{destination.category}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Departure Date</div>
              <div className="font-medium text-gray-900">{destination.departureDate ? new Date(destination.departureDate).toLocaleDateString() : ''}</div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Overview</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {destination.description}
            </p>
          </div>
          
          <div className="mt-10">
            <button 
              onClick={handleBooking}
              disabled={bookingLoading}
              className="w-full bg-cyan-600 text-white py-4 rounded-md font-semibold text-lg hover:bg-cyan-700 transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
            >
              {bookingLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : !session?.user ? (
                "Login to Book"
              ) : (
                "Confirm Booking"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 sm:p-6 border-b">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Update Travel Package</h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Make changes to the travel package details below</p>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 sm:p-6 overflow-y-auto">
              <form id="edit-form" onSubmit={handleUpdate}>
                <div className="mb-4 sm:mb-5">
                  <input type="text" name="destinationName" value={editFormData.destinationName} onChange={handleEditChange} placeholder="Destination Title (e.g. Bali Paradise)" className="w-full border border-gray-200 bg-gray-50 rounded p-2.5 focus:ring-1 focus:ring-cyan-500 focus:bg-white outline-none transition-all" required />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 sm:mb-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Country</label>
                    <input type="text" name="country" value={editFormData.country} onChange={handleEditChange} placeholder="e.g. Indonesia" className="w-full border border-gray-200 bg-gray-50 rounded p-2.5 focus:ring-1 focus:ring-cyan-500 focus:bg-white outline-none transition-all" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                    <select name="category" value={editFormData.category} onChange={handleEditChange} className="w-full border border-gray-200 bg-gray-50 rounded p-2.5 focus:ring-1 focus:ring-cyan-500 focus:bg-white outline-none transition-all">
                      <option value="">Select Category</option>
                      <option value="City">City</option>
                      <option value="Beach">Beach</option>
                      <option value="Mountain">Mountain</option>
                      <option value="Archetucture">Archetucture</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 sm:mb-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (USD)</label>
                    <input type="text" name="price" value={editFormData.price} onChange={handleEditChange} placeholder="e.g., 1299" className="w-full border border-gray-200 bg-gray-50 rounded p-2.5 focus:ring-1 focus:ring-cyan-500 focus:bg-white outline-none transition-all" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Duration</label>
                    <input type="text" name="duration" value={editFormData.duration} onChange={handleEditChange} placeholder="e.g., 7 Days/6 Nights" className="w-full border border-gray-200 bg-gray-50 rounded p-2.5 focus:ring-1 focus:ring-cyan-500 focus:bg-white outline-none transition-all" required />
                  </div>
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Departure Date</label>
                  <input type="date" name="departureDate" value={editFormData.departureDate} onChange={handleEditChange} className="w-full border border-gray-200 bg-gray-50 rounded p-2.5 focus:ring-1 focus:ring-cyan-500 focus:bg-white outline-none transition-all" required />
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Image URL</label>
                  <input type="url" name="imageUrl" value={editFormData.imageUrl} onChange={handleEditChange} placeholder="https://example.com/image.jpg" className="w-full border border-gray-200 bg-gray-50 rounded p-2.5 focus:ring-1 focus:ring-cyan-500 focus:bg-white outline-none transition-all" required />
                </div>

                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                  <textarea name="description" value={editFormData.description} onChange={handleEditChange} placeholder="Describe the travel experience..." rows={4} className="w-full border border-gray-200 bg-gray-50 rounded p-2.5 focus:ring-1 focus:ring-cyan-500 focus:bg-white outline-none resize-none transition-all" required></textarea>
                </div>
              </form>
            </div>
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 p-4 sm:p-6 border-t bg-gray-50 rounded-b-lg">
              <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex items-center justify-center gap-1.5 border border-red-200 bg-white text-red-500 px-5 py-2.5 rounded text-sm font-medium hover:bg-red-50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
                Cancel
              </button>
              <button type="submit" form="edit-form" className="flex items-center justify-center gap-1.5 bg-cyan-600 text-white px-5 py-2.5 rounded text-sm font-medium hover:bg-cyan-700 transition-colors shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0 1 20.25 6v12A2.25 2.25 0 0 1 18 20.25H6A2.25 2.25 0 0 1 3.75 18V6A2.25 2.25 0 0 1 6 3.75h1.5m9 0h-9" />
                </svg>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
            <div className="flex justify-between items-start p-6 border-b">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-2 rounded-full text-red-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3Z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Delete Travel Package</h2>
              </div>
              <button onClick={() => setIsDeleteModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-gray-600 leading-relaxed">
                Are you sure you want to delete <span className="font-bold text-gray-900">&quot;{destination.destinationName}&quot;</span>? This action cannot be undone and will permanently remove this travel package from the system.
              </p>
            </div>
            
            <div className="flex justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-lg">
              <button onClick={() => setIsDeleteModalOpen(false)} className="px-5 py-2.5 rounded text-sm font-medium border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm">
                Cancel
              </button>
              <button onClick={handleDelete} className="flex items-center gap-1.5 bg-red-500 text-white px-5 py-2.5 rounded text-sm font-medium hover:bg-red-600 transition-colors shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
                Delete Package
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}