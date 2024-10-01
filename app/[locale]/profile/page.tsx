//@/app/[locale]/profile/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import BuyProduct from '@/components/razorpay/BuyProduct'
import { getUserProfile, updateUserProfile, getScheduledEvents } from "./actions";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Edit, Save, Phone, Calendar, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CalendlyEventCard from "@/components/CalendlyEventCard";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "react-hot-toast";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState(null);
  const [scheduledEvents, setScheduledEvents] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", phoneNum: "", DOB: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (session && session.user) {
        try {
          setLoading(true);
          setError(null);

          const [userProfile, events] = await Promise.all([
            getUserProfile(),
            getScheduledEvents()
          ]);

          setProfile(userProfile);
          setFormData({
            name: userProfile.name || "",
            phoneNum: userProfile.phoneNum || "",
            DOB: userProfile.DOB || "",
          });
          setScheduledEvents(events);
        } catch (err) {
          console.error("Error fetching data:", err);
          setError("Failed to load profile data. Please try again.");
          toast.error("Failed to load profile data. Please try again.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [session]);

  const handleEdit = () => setEditMode(true);

  const handleSave = async () => {
    try {
      await updateUserProfile(formData);
      setEditMode(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to save profile changes:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancelEvent = async (eventId: string) => {
    console.log("Cancelling event:", eventId);
    toast.success("Event cancelled successfully!");
  };

  const handleRescheduleEvent = async (eventId: string) => {
    console.log("Rescheduling event:", eventId);
    toast.success("Event rescheduled successfully!");
  };

  const handleBuyMembership = () => {
    // You could add payment logic here or redirect to a membership payment page.
    // window.location.href = "/membership/payment";
    toast.success("Redirecting to buy membership!");
    // Example: router.push('/membership/payment');
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <Card className="p-6 bg-white shadow-lg rounded-lg">
          <CardTitle className="text-red-500 mb-4">Error</CardTitle>
          <p>{error}</p>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <Card className="p-6 bg-white shadow-lg rounded-lg">
          <p className="text-gray-600">No profile data available.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-start min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 sm:p-8">
      <Card className="w-full max-w-4xl bg-white shadow-xl rounded-2xl overflow-hidden">
        <CardHeader className="relative pb-0">
          
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 h-32"></div>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 flex justify-center"
          >
            <div className="w-32 h-32 rounded-full bg-white shadow-lg flex items-center justify-center text-4xl font-bold text-blue-500">
              {profile.name ? profile.name[0].toUpperCase() : 'N'}
              
            </div>
          </motion.div>
        </CardHeader>
        <CardContent className="pt-20 px-8">
          <CardTitle className="text-3xl font-bold text-center mb-2 text-gray-800">
       
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
          <p className="text-blue-600 text-center text-sm mb-8">{session?.user?.email}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-500" />
                {editMode ? (
                  <Input
                    id="phoneNum"
                    name="phoneNum"
                    value={formData.phoneNum}
                    onChange={handleChange}
                    className="flex-grow"
                    placeholder="Phone Number"
                  />
                ) : (
                  <p className="text-sm font-medium text-gray-800">
                    {profile.phoneNum || "Not provided"}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-blue-500" />
                {editMode ? (
                  <Input
                    id="DOB"
                    name="DOB"
                    value={formData.DOB}
                    onChange={handleChange}
                    className="flex-grow"
                    placeholder="Date of Birth"
                    type="date"
                  />
                ) : (
                  <p className="text-sm font-medium text-gray-800">
                    {profile.DOB || "Not provided"}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-500" />
                <p className="text-sm font-medium text-gray-800">{session?.user?.email}</p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">About Me</h3>
              <p className="text-gray-600">
                {profile.bio || "No bio provided. Edit your profile to add a bio."}
              </p>
            </div>
          </div>

          <CardFooter className="flex flex-col items-center pb-8 pt-6">
            {editMode ? (
              <Button onClick={handleSave} className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full text-lg">
                <Save className="mr-2 h-5 w-5" /> Save Changes
              </Button>
            ) : (
              <Button onClick={handleEdit} className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full text-lg">
                <Edit className="mr-2 h-5 w-5" /> Edit Profile
              </Button>
            )}

            {/* Buy Membership Button */}
            <Button
              onClick={handleBuyMembership}
              className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-full text-lg"
            >
              Buy Membership
            </Button>
          </CardFooter>

          <div className="mt-12">
            <h3 className="text-2xl font-semibold text-center text-gray-800 mb-6">Scheduled Events</h3>
            {scheduledEvents.length > 0 ? (
              <div className="space-y-6">
                {scheduledEvents.map((event) => (
                  <CalendlyEventCard
                    key={event.uri}
                    event={event}
                    onCancel={() => handleCancelEvent(event.uri)}
                    onReschedule={() => handleRescheduleEvent(event.uri)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center">No upcoming events scheduled.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
