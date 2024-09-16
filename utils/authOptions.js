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
    /**
     * This callback modifies the functionality of the in-built SignIn function present in NextAuth.
     * If it is not declared here, by default it will return true upon successful authentication.
     */
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
          };
          userRepo.create(data);
        }
      } catch (error) {
        console.error(error);
        return false;
      }

      return true;
    },

    /**
     * This callback modifies the session by appending the UID of the current user
     * so that all other pages can reference the logged-in user in the particular session.
     */
    async session({ session }) {
      const userInDb = await userRepo.getByEmail(session.user.email);
      console.log(userInDb);
      session.user.id = userInDb.UId;
      session.user.role = userInDb.role;
      console.log("Role:", session.user.role);
      return session;
    },
  },

  // Custom sign-out behavior
  events: {
    async signOut({ url, token }) {
      // You can handle additional cleanup or logic here if needed
      console.log("User signed out");
    },
  },

  // Custom redirect after sign-out
  pages: {
    signOut: "/", // Redirect user to home page after sign-out
  },
};
