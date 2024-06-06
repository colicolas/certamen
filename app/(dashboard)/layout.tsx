import { ReactNode } from "react";
//import { useSession, signIn } from "next-auth/react";
import TopNavbar from "@/components/TopNavbar";
import BottomNavbar from "@/components/BottomNavbar";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

const DashboardLayout = async ({ children }: { children: ReactNode }) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    // If no session, redirect to sign-in page
    return (
      <div>
        <p>Redirecting...</p>
        <meta httpEquiv="refresh" content="0; url=/auth/signin" />
      </div>
    );
  }
  
  const user = {
    level: 1,
    xp: 50,
    coins: 100,
    profilePic: "/path/to/profile-pic.jpg",
  };

  return (
    <div className="min-h-screen flex flex-col">
      <TopNavbar />
      <main className="flex-1">{children}</main>
      <BottomNavbar user={user} />
    </div>
  );
};

export default DashboardLayout;
