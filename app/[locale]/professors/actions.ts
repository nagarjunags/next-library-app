'use server'

import { ProfessorsRepository } from '@/db/professors.repository'
import { UserRepository } from "@/db/users.repository"
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";


const professorsRepository = new ProfessorsRepository()
const CALENDLY_API_TOKEN = process.env.CALENDLY_API_TOKEN
const ORGANIZATION_URI = process.env.CALENDLY_ORGANIZATION_URI


export async function deductcredit(){
  try{
  const session = await getServerSession(authOptions);
    const userId = session.user.id;
    const userRepo = new UserRepository()
    const user = await userRepo.getById(userId);
    const updata = {
      ...user,
      credits:user.credits-10,
    }

    await userRepo.update(userId,updata)
    window.location.reload();
  }
  catch(error)
  {
    console.log(error)
  }
}

export async function listProfessors(params: { limit: number; offset: number; search?: string }) {
  try {
    const result = await professorsRepository.list(params)
    // console.log(result)
    return result.items
  } catch (error) {
    console.error("Error fetching professors", error)
    throw new Error("Failed to fetch professors")
  }
}

export async function addProfessor(professorData: {
  name: string;
  department: string;
  bio: string;
  email: string;
}) {
  try {
    // Send the Calendly invitation
    const inviteResponse = await fetch(`${ORGANIZATION_URI}/invitations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CALENDLY_API_TOKEN}`,
      },
      body: JSON.stringify({ email: professorData.email }),
    });

    if (!inviteResponse.ok) {
      const errorData = await inviteResponse.json();
      if (errorData.title === "Already Invited") {
        console.log("Professor already invited");
      } else {
        throw new Error('Failed to send Calendly invitation');
      }
    }

    // Add the professor to the database without the Calendly link
    const newProfessor = await professorsRepository.create({
      ...professorData,
      calendlyEventLink: null,
    });

    return newProfessor;
  } catch (error) {
    console.error("Error adding professor", error);
    throw new Error("Failed to add professor");
  }
}

export async function checkInvitationStatus(professorId: number, email: string) {
  try {
    const response = await fetch(`${ORGANIZATION_URI}/invitations?email=${encodeURIComponent(email)}`, {
      headers: {
        'Authorization': `Bearer ${CALENDLY_API_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to check invitation status');
    }

    const data = await response.json();
    const invitation = data.collection[0];

    if (invitation && invitation.status === 'accepted') {
      const userResponse = await fetch(invitation.user, {
        headers: {
          'Authorization': `Bearer ${CALENDLY_API_TOKEN}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData = await userResponse.json();
      // console.log("--------------------------",userData);
      const schedulingUrl = userData.resource.scheduling_url;

      // Update the professor's Calendly link in the database
      console.log("scheduling URL:",professorId);
      await professorsRepository.update(professorId, schedulingUrl);

      return { status: 'accepted', schedulingUrl };
    }

    return { status: invitation ? invitation.status : 'not_found' };
  } catch (error) {
    console.error("Error checking invitation status", error);
    throw new Error("Failed to check invitation status");
  }
}