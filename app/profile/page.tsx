// app/profile/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { getUserProfile, updateUserProfile } from "./actions";
import { useSession } from "next-auth/react";
import Image from "next/image";

const ProfilePage = () => {
  const { data: session } = useSession();
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", phoneNum: "", DOB: "" });

  useEffect(() => {
    // Fetch profile data when component mounts
    const fetchProfile = async () => {
      const userProfile = await getUserProfile();
      setProfile(userProfile);
      setFormData({
        name: userProfile.name,
        phoneNum: userProfile.phoneNum,
        DOB: userProfile.DOB,
      });
    };

    if (session?.user?.id) {
      fetchProfile();
    }
  }, [session]);

  const handleEdit = () => setEditMode(true);

  const handleSave = async () => {
    await updateUserProfile(formData);
    setEditMode(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <div className="flex flex-col items-center">
          {/* Profile Image */}
          <div className="relative mb-6">
            <Image
              className="w-32 h-32 rounded-full object-cover shadow-md"
              src={session?.user?.image || "/default-avatar.png"} // Use default image if none exists
              alt="Profile"
              width={90}
              height={90}
            />
          </div>

          <h1 className="text-3xl font-bold mb-4 text-gray-800">
            {editMode ? (
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input text-center text-3xl font-semibold"
                placeholder="Name"
              />
            ) : (
              profile.name
            )}
          </h1>
          <p className="text-gray-500">{session?.user?.email}</p>
        </div>

        <div className="mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              {editMode ? (
                <input
                  name="phoneNum"
                  value={formData.phoneNum}
                  onChange={handleChange}
                  className="input mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Phone Number"
                />
              ) : (
                <p className="text-lg font-medium text-gray-700 mt-2">
                  {profile.phoneNum || "N/A"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date of Birth
              </label>
              {editMode ? (
                <input
                  name="DOB"
                  value={formData.DOB}
                  onChange={handleChange}
                  className="input mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Date of Birth"
                  type="date"
                />
              ) : (
                <p className="text-lg font-medium text-gray-700 mt-2">
                  {profile.DOB || "N/A"}
                </p>
              )}
            </div>
          </div>

          {/* Edit and Save Buttons */}
          <div className="mt-8 flex justify-center space-x-4">
            {editMode ? (
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-500"
              >
                Save Changes
              </button>
            ) : (
              <button
                onClick={handleEdit}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-500"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
