import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Ensure we have email and password
        if (!credentials?.email || !credentials.password) {
          throw new Error("Missing credentials");
        }

        // Connect to the database
        await connectDB();

        // Find the user by email
        const user = await User.findOne({ email: credentials.email }).select("+password");

        // If user not found, throw an error
        if (!user) {
          throw new Error("Wrong Email");
        }

        // Compare the provided password with the stored hashed password
        const passwordMatch = await bcrypt.compare(credentials.password, user.password);

        // If the password does not match, throw an error
        if (!passwordMatch) {
          throw new Error("Wrong Password");
        }

        // Return the user if everything is correct
        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token, user }) {
      // Ensure session.user is properly initialized
      if (session.user) {
        session.user.id = token.id;
      } else {
        session.user = {
          id: token.id,
          name: token.name,
          email: token.email,
          image: token.picture
        };
      }
      session.accessToken = token.accessToken;
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
};
