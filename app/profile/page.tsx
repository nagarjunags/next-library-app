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
  const { data: session, status } = useSession(); // status: 'loading', 'authenticated', 'unauthenticated'
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

    if (session) {
      if (session.user) {
        fetchProfile();
      }
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
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Card className="bg-gradient-to-br from-blue-100 to-purple-100">
        <CardHeader className="flex flex-col items-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative mb-6"
          >
            <Image
              className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-white"
              src={session?.user?.image || "/default-avatar.png"}
              alt="Profile"
              width={128}
              height={128}
            />
          </motion.div>
          <CardTitle className="text-3xl font-bold mb-2 text-blue-800">
            {editMode ? (
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="text-center text-3xl font-semibold"
                placeholder="Name"
              />
            ) : (
              profile.name
            )}
          </CardTitle>
          <p className="text-blue-600">{session?.user?.email}</p>
        </CardHeader>
        <CardContent className="mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-center">
            <div>
              <Label htmlFor="phoneNum" className="text-blue-700">
                Phone Number
              </Label>
              {editMode ? (
                <Input
                  id="phoneNum"
                  name="phoneNum"
                  value={formData.phoneNum}
                  onChange={handleChange}
                  className="mt-1 text-center"
                  placeholder="Phone Number"
                />
              ) : (
                <p className="text-lg font-medium text-blue-800 mt-2">
                  {profile.phoneNum || "N/A"}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="DOB" className="text-blue-700">
                Date of Birth
              </Label>
              {editMode ? (
                <Input
                  id="DOB"
                  name="DOB"
                  value={formData.DOB}
                  onChange={handleChange}
                  className="mt-1 text-center"
                  placeholder="Date of Birth"
                  type="date"
                />
              ) : (
                <p className="text-lg font-medium text-blue-800 mt-2">
                  {profile.DOB || "N/A"}
                </p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          {editMode ? (
            <Button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          ) : (
            <Button
              onClick={handleEdit}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Edit className="mr-2 h-4 w-4" /> Edit Profile
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProfilePage;
