import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

function isAdminEmail(email?: string | null) {
  if (!email) return false;
  const allowed = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return allowed.includes(email.toLowerCase());
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  session: { strategy: "jwt" },
  callbacks: {
    signIn({ user }) {
      return isAdminEmail(user.email);
    },
    authorized({ auth }) {
      return isAdminEmail(auth?.user?.email);
    },
  },
});
