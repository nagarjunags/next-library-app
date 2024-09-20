"use client";

import React, { useState, useEffect } from "react";
import { getUserProfile, updateUserProfile } from "./actions";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Edit, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ProfilePage = () => {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", phoneNum: "", DOB: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userProfile = await getUserProfile();
        setProfile(userProfile);
        setFormData({
          name: userProfile.name || "",
          phoneNum: userProfile.phoneNum || "",
          DOB: userProfile.DOB || "",
        });
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    if (session && session.user) {
      fetchProfile();
    }
  }, [session]);

  const handleEdit = () => setEditMode(true);

  const handleSave = async () => {
    try {
      await updateUserProfile(formData);
      setEditMode(false);
    } catch (error) {
      console.error("Failed to save profile changes:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (status === "loading" || !profile) return <p>Loading...</p>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <Card style={{ width: '50%' }} className="max-w-md bg-white shadow-xl rounded-2xl overflow-hidden">
        <CardHeader className="relative pb-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 h-24"></div>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 flex justify-center"
          >
            <Image
              className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
              src={session?.user?.image || "/default-avatar.png"}
              alt="Profile"
              width={80}
              height={80}
            />
          </motion.div>
        </CardHeader>
        <CardContent className="pt-2 px-6">
          <CardTitle className="text-xl font-bold text-center mb-1 text-gray-800">
            {editMode ? (
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="text-center text-xl font-semibold"
                placeholder="Name"
              />
            ) : (
              profile.name
            )}
          </CardTitle>
          <p className="text-blue-600 text-center text-sm mb-4">{session?.user?.email}</p>

          {/* Padding added to the parent div */}
          <div className="flex justify-between space-x-4 px-4">
            {/* Phone Number */}
            <div className="flex flex-col items-center space-y-1">
              <Label htmlFor="phoneNum" className="text-sm font-medium text-gray-600">
                Phone Number
              </Label>
              {editMode ? (
                <Input
                  id="phoneNum"
                  name="phoneNum"
                  value={formData.phoneNum}
                  onChange={handleChange}
                  className="text-center"
                  placeholder="Phone Number"
                />
              ) : (
                <p className="text-sm font-medium text-gray-800">
                  {profile.phoneNum || "N/A"}
                </p>
              )}
            </div>

            {/* Date of Birth */}
            <div className="flex flex-col items-center justify-center">
              <Label htmlFor="DOB" className="text-sm font-medium text-gray-600">
                Date of Birth
              </Label>
              {editMode ? (
                <Input
                  id="DOB"
                  name="DOB"
                  value={formData.DOB}
                  onChange={handleChange}
                  className="text-center"
                  placeholder="Date of Birth"
                  type="date"
                />
              ) : (
                <p className="text-sm font-medium text-gray-800">
                  {profile.DOB || "N/A"}
                </p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center pb-4 pt-2">
          {editMode ? (
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          ) : (
            <Button onClick={handleEdit}>
              <Edit className="mr-2 h-4 w-4" /> Edit Profile
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProfilePage;
