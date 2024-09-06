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
     * This callback is modifying the functionality of the inBuilt Signin function present in th Nextauth
     * if it is not declared here by default it will be returning true upon successfull authentication from any
     * authproviders
     *
     * @async
     * @param {{ user: any; account: any; profile: any; email: any; credentials: any; }} param0
     * @param {any} param0.account
     * @param {any} param0.profile
     * @param {any} param0.user
     * @param {any} param0.email
     * @param {any} param0.credentials
     * @returns {unknown}
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
     * This callback function is just modifyng the session by appending the UID of the current user
     * so that all other pages can have the refference of which user is loggedin in the perticular session.
     *
     * This callback function implementation here can also be avoided if we are ok with the
     * default functionality
     *
     * @async
     * @param {{ session: any; }} param0
     * @param {any} param0.session
     * @returns {unknown}
     */
    async session({ session }) {
      const ueserInDb = await userRepo.getByEmail(session.user.email);
      session.user.id = ueserInDb.UId;
      return session;
    },
  },
};
