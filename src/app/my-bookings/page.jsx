"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import { Button } from '@heroui/react';
import { api } from '@/lib/api-proxy';

export default function MyBookingsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelLoadingId, setCancelLoadingId] = useState(null);
  
  const [selectedBookingDetails, setSelectedBookingDetails] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);

  useEffect(() => {
    if (isPending) return;
    
    if (!session?.user) {
      router.push('/login');
      return;
    }

    const fetchBookings = async () => {
      try {
        const data = await api.bookings_user(session.user.id);
        setBookings(data);
      } catch (err) {
        console.error("Failed to fetch bookings", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [session, isPending, router]);

  const handleCancel = async (bookingId) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    
    setCancelLoadingId(bookingId);
    try {
      const data = await api.bookings(bookingId, {
        method: 'DELETE',
      });
      if (data.deletedCount > 0) {
        setBookings(prev => prev.filter(b => b._id !== bookingId));
      }
    } catch (err) {
      console.error("Failed to cancel booking", err);
    } finally {
      setCancelLoadingId(null);
    }
  };

  const handleView = async (booking) => {
    setViewLoading(true);
    setIsViewModalOpen(true);
    try {
      const data = await api.destinations(booking.destinationId);
      setSelectedBookingDetails(data);
    } catch (err) {
      console.error("Failed to fetch destination details", err);
    } finally {
      setViewLoading(false);
    }
  };

  if (isPending || loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading your bookings...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h1 className="text-[32px] font-normal text-gray-900 tracking-tight">My Bookings</h1>
          <p className="mt-1 text-[14px] text-gray-500">Manage and view your upcoming travel plans</p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-500 mb-6">Looks like you haven&apos;t booked any trips yet.</p>
            <Link href="/destinations" className="bg-[#17a2b8] text-white px-6 py-2.5 rounded-full font-medium hover:bg-[#138496] transition-colors">
              Explore Destinations
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-white border border-gray-100 shadow-sm flex flex-col md:flex-row overflow-hidden">
                <div className="w-full md:w-[350px] h-[220px] md:h-auto flex-shrink-0">
                  <img 
                    src={booking.imageUrl || "https://placehold.co/600x400?text=No+Image"} 
                    alt={booking.destinationName}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="p-6 flex flex-col justify-between flex-grow">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${booking.status === 'Confirmed' ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'}`}>
                        {booking.status === 'Confirmed' ? (
                          <svg className="mr-1 h-3.5 w-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="mr-1 h-3.5 w-3.5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                        {booking.status}
                      </span>
                    </div>
                    
                    <h2 className="text-[26px] font-semibold text-gray-900 leading-tight mb-3">
                      {booking.destinationName}
                    </h2>
                    
                    <div className="space-y-2 text-sm text-gray-600 mb-6">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Departure: {booking.departureDate ? new Date(booking.departureDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Booking ID: {booking._id.substring(0, 8)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mt-auto gap-4 sm:gap-0">
                    <div className="text-[28px] font-bold text-[#17a2b8] leading-none">
                      ${booking.price}
                    </div>
                    
                    <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                      <Button
                        variant="bordered"
                        radius="none"
                        className="flex-1 sm:flex-none border-[#ff6b6b] text-[#ff6b6b] hover:bg-red-50 bg-white font-medium px-4 h-9 min-w-0"
                        onClick={() => handleCancel(booking._id)}
                        isLoading={cancelLoadingId === booking._id}
                        startContent={cancelLoadingId !== booking._id && (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => handleView(booking)}
                        radius="none"
                        className="flex-1 sm:flex-none bg-[#17a2b8] text-white hover:bg-[#138496] font-medium px-5 h-9 min-w-0"
                        startContent={
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        }
                      >
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* View Details Modal */}
      {isViewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden relative">
            <button onClick={() => { setIsViewModalOpen(false); setSelectedBookingDetails(null); }} className="absolute top-4 right-4 z-10 bg-black/20 hover:bg-black/40 text-white rounded-full p-2 backdrop-blur-sm transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
            
            {viewLoading || !selectedBookingDetails ? (
              <div className="p-20 text-center flex flex-col items-center justify-center h-full">
                <svg className="animate-spin h-8 w-8 text-cyan-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-gray-500 font-medium">Loading details...</p>
              </div>
            ) : (
              <div className="overflow-y-auto">
                <img 
                  src={selectedBookingDetails.imageUrl || "https://placehold.co/1200x600?text=No+Image"} 
                  alt={selectedBookingDetails.destinationName}
                  className="w-full h-auto max-h-[400px] object-contain bg-gray-50"
                />
                <div className="p-8">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-4 gap-4 sm:gap-0">
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{selectedBookingDetails.destinationName}</h1>
                      <div className="flex items-center gap-2 text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                        </svg>
                        {selectedBookingDetails.country}
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <div className="text-3xl font-bold text-cyan-600">${selectedBookingDetails.price}</div>
                      <div className="text-gray-500 text-sm">per person</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 py-4 border-y border-gray-100">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Duration</div>
                      <div className="font-medium text-gray-900">{selectedBookingDetails.duration}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Category</div>
                      <div className="font-medium text-gray-900">{selectedBookingDetails.category}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Departure Date</div>
                      <div className="font-medium text-gray-900">{selectedBookingDetails.departureDate ? new Date(selectedBookingDetails.departureDate).toLocaleDateString() : ''}</div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Overview</h2>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {selectedBookingDetails.description}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
