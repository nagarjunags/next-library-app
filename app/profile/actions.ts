//@/app/profile/actions.ts
"use server";

import { UserRepository } from "@/db/users.repository";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";

const CALENDLY_API_TOKEN =  "eyJraWQiOiIxY2UxZTEzNjE3ZGNmNzY2YjNjZWJjY2Y4ZGM1YmFmYThhNjVlNjg0MDIzZjdjMzJiZTgzNDliMjM4MDEzNWI0IiwidHlwIjoiUEFUIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguY2FsZW5kbHkuY29tIiwiaWF0IjoxNzI3MTc0MjE3LCJqdGkiOiI2ZDZmM2U2NS1hMjE5LTRhOTEtYTcxYy1kZjUxMzRhNTM0OTYiLCJ1c2VyX3V1aWQiOiIxOWE0NGY3NC02NmU1LTQyN2UtOTg4Ny05MDEyMjMzNGVlOTAifQ.Jh1j1Vyg8fldMZi8vQaUNEruoIYdlZ4ZE6VPbnnjyN13hKQwCMoJDXAWGakwp-gyLaxhPAJKY1Y_1zV_bD9cUA";
;

export async function getUserProfile() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("User not authenticated");
  }
  const userRepo = new UserRepository();
  const userProfile = await userRepo.getById(session.user.id);
  return userProfile;
}

export async function updateUserProfile(updatedData: any) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("User not authenticated");
  }

  const userRepo = new UserRepository();
  await userRepo.update(session.user.id, updatedData);
  const updatedProfile = await userRepo.getById(session.user.id);
  return updatedProfile;
}

export async function getScheduledEvents() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("User not authenticated");
  }

  try {
    const userResponse = await fetch("https://api.calendly.com/users/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${CALENDLY_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (!userResponse.ok) {
      throw new Error(`Error fetching user info: ${userResponse.statusText}`);
    }

    const userData = await userResponse.json();
    const organizationUri = userData.resource.current_organization;

    const eventsResponse = await fetch(
      `https://api.calendly.com/scheduled_events?organization=${organizationUri}&invitee_email=${session.user.email}&status=active`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${CALENDLY_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!eventsResponse.ok) {
      console.error("Error response:", await eventsResponse.text());
      throw new Error(`Error fetching scheduled events: ${eventsResponse.statusText}`);
    }

    const eventsData = await eventsResponse.json();
    console.log(eventsData.collection.map((col) => col.location));
    return eventsData.collection;
  } catch (error) {
    console.error("Error fetching scheduled events", error);
    throw error;
  }
}
