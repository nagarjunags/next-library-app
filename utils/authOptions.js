import GoogleProvider from "next-auth/providers/google";
import { UserRepository } from "@/db/users.repository";

const userRepo = new UserRepository();

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log("---------------------------------");
      console.log("email:", profile.email);
      console.log("Name:", profile.name);
      console.log("---------------------------------");

      try {
        const userInDb = await userRepo.getByEmail(profile.email);
        if (!userInDb) {
          const data = {
            name: profile.name,
            DOB: "0000-00-00", // TODO:These are filling dummy data which can be avoided
            phoneNum: "00",
            password: "null",
            email: profile.email,
            role:"user"
          };
          await userRepo.create(data);
        }
      } catch (error) {
        console.error(error);
        return false;
      }

      return true;
    },

    async session({ session }) {
      const userInDb = await userRepo.getByEmail(session.user.email);
      session.user.id = userInDb.UId;
      session.user.role = userInDb.role;
      session.user.credits = userInDb.credits;
      return session;
    },
  },

  events: {
    async signOut({ session, token }) {
      // Custom sign-out logic here, like logging
      console.log("User signed out:", session.user.email);
    },
  },

  pages: {
    signOut: "/", // Redirect user to home page after sign-out
  },
};
