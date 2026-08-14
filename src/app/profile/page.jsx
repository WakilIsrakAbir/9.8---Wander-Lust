"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { api } from '@/lib/api-proxy';

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [stats, setStats] = useState({
    totalBookings: 0,
    countriesVisited: 0,
    upcomingTrips: 0,
    totalSpent: 0
  });
  const [profileData, setProfileData] = useState({ location: 'Dhaka, Bangladesh', nationality: 'Bangladeshi' });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({ name: '', location: '', nationality: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isPending) return;
    
    if (!session?.user) {
      router.push('/login');
      return;
    }

    const fetchUserStats = async () => {
      try {
        const bookings = await api.bookings_user(session.user.id);
        
        const totalBookings = bookings.length;
        const totalSpent = bookings.reduce((sum, b) => sum + Number(b.price || 0), 0);
        
        // Count unique countries
        const countries = new Set(bookings.map(b => b.country).filter(Boolean));
        const countriesVisited = countries.size || (totalBookings > 0 ? 1 : 0); // fallback if country missing

        // Upcoming trips (assuming departureDate exists and is in the future, or just using 'Confirmed' status)
        const now = new Date();
        const upcomingTrips = bookings.filter(b => {
          if (b.departureDate) {
            return new Date(b.departureDate) > now;
          }
          return b.status === 'Confirmed';
        }).length;

        setStats({
          totalBookings,
          countriesVisited,
          upcomingTrips,
          totalSpent
        });
        
        const fetchedProfile = await api.profiles(session.user.id);
        if (fetchedProfile && (fetchedProfile.location || fetchedProfile.nationality)) {
          setProfileData({
            location: fetchedProfile.location || 'Dhaka, Bangladesh',
            nationality: fetchedProfile.nationality || 'Bangladeshi'
          });
        }
      } catch (err) {
        console.error("Failed to fetch stats or profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, [session, isPending, router]);

  const handleEditClick = () => {
    setEditFormData({
      name: session?.user?.name || '',
      location: profileData.location,
      nationality: profileData.nationality
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editFormData.name !== session?.user?.name) {
        await authClient.updateUser({ name: editFormData.name });
      }

      await api.profiles(session.user.id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: editFormData.location,
          nationality: editFormData.nationality
        })
      });

      setProfileData({
        location: editFormData.location,
        nationality: editFormData.nationality
      });
      setIsEditModalOpen(false);
      // Optional: refresh page to get updated session name if it doesn't auto-update
      window.location.reload();
    } catch (err) {
      console.error("Failed to update profile", err);
    } finally {
      setSaving(false);
    }
  };

  if (isPending || loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading profile...</div>;
  }

  const memberSince = session?.user?.createdAt 
    ? new Date(session.user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) 
    : 'Mar 2024';

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h1 className="text-[32px] font-normal text-gray-900 tracking-tight">My Profile</h1>
          <p className="mt-1 text-[14px] text-gray-500">Manage your account settings and travel preferences</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Left Column - User Info */}
          <div className="w-full md:w-[320px] bg-white border border-gray-100 rounded-lg shadow-sm p-8 flex flex-col h-fit">
            <div className="flex flex-col items-center text-center mb-8 pt-4">
              {/* No image as requested, using name prominently */}
              <h2 className="text-2xl font-bold text-gray-900">{session?.user?.name || 'Traveler'}</h2>
              
              <div className="flex items-center text-gray-500 mt-2 text-sm">
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {profileData.location}
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6 space-y-4 mb-8">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Member since</span>
                <span className="font-semibold text-gray-900">{memberSince}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Nationality</span>
                <span className="font-semibold text-gray-900">{profileData.nationality}</span>
              </div>
            </div>

            <button 
              onClick={handleEditClick}
              className="w-full bg-[#17a2b8] text-white py-2.5 rounded-md font-medium hover:bg-[#138496] transition-colors flex items-center justify-center gap-2 text-sm mt-auto"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
              Edit Profile
            </button>
          </div>

          {/* Right Column - Statistics */}
          <div className="flex-1">
            <h3 className="text-[20px] font-semibold text-gray-800 mb-6 tracking-tight">Travel Statistics</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Total Bookings Card */}
              <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-6 flex justify-between items-center">
                <div>
                  <div className="text-[13px] text-gray-500 mb-1">Total Bookings</div>
                  <div className="text-[28px] font-semibold text-gray-900 leading-none">{stats.totalBookings}</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-cyan-50 flex items-center justify-center text-cyan-500">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>

              {/* Countries Visited Card */}
              <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-6 flex justify-between items-center">
                <div>
                  <div className="text-[13px] text-gray-500 mb-1">Countries Visited</div>
                  <div className="text-[28px] font-semibold text-gray-900 leading-none">{stats.countriesVisited}</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-500">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>

              {/* Upcoming Trips Card */}
              <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-6 flex justify-between items-center">
                <div>
                  <div className="text-[13px] text-gray-500 mb-1">Upcoming Trips</div>
                  <div className="text-[28px] font-semibold text-gray-900 leading-none">{stats.upcomingTrips}</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-400">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>

              {/* Total Spent Card */}
              <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-6 flex justify-between items-center">
                <div>
                  <div className="text-[13px] text-gray-500 mb-1">Total Spent</div>
                  <div className="text-[28px] font-semibold text-gray-900 leading-none">${stats.totalSpent.toLocaleString()}</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-400">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-[95%] sm:max-w-md flex flex-col">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Edit Profile</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <form id="edit-profile-form" onSubmit={handleUpdateProfile}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                  <input type="text" value={editFormData.name} onChange={(e) => setEditFormData({...editFormData, name: e.target.value})} className="w-full border border-gray-200 bg-gray-50 rounded p-2.5 focus:ring-1 focus:ring-cyan-500 outline-none" required />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
                  <input type="text" value={editFormData.location} onChange={(e) => setEditFormData({...editFormData, location: e.target.value})} className="w-full border border-gray-200 bg-gray-50 rounded p-2.5 focus:ring-1 focus:ring-cyan-500 outline-none" required />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Nationality</label>
                  <input type="text" value={editFormData.nationality} onChange={(e) => setEditFormData({...editFormData, nationality: e.target.value})} className="w-full border border-gray-200 bg-gray-50 rounded p-2.5 focus:ring-1 focus:ring-cyan-500 outline-none" required />
                </div>
              </form>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-lg">
              <button type="button" onClick={() => setIsEditModalOpen(false)} className="border border-gray-300 bg-white text-gray-700 px-5 py-2.5 rounded text-sm font-medium hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button type="submit" form="edit-profile-form" disabled={saving} className="bg-cyan-600 text-white px-5 py-2.5 rounded text-sm font-medium hover:bg-cyan-700 transition-colors disabled:opacity-70 flex items-center">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
