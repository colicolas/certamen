import { ReactNode } from "react";
import TopNavbar from "@/components/TopNavbar";
import BottomNavbar from "@/components/BottomNavbar";
import { authOptions } from "@/lib/authOptions";
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
    level: session.user.level !== undefined ? session.user.level : 1,
    xp: session.user.xp !== undefined ? session.user.xp : 0,
    coins: session.user.coins !== undefined ? session.user.coins : 0,
    profilePic: session.user.profile
      ? `/${session.user.profile}.jpg`
      : "/path/to/profile-pic.jpg",
  };

  /*const user = {
    level: session.user.level || 2,
    xp: session.user.xp || 1,
    coins: session.user.coins || 1,
    profilePic: "/" + session.user.profile + ".jpg" || "/path/to/profile-pic.jpg",
  };*/

  return (
    <div className="min-h-screen flex flex-col">
      <TopNavbar />
      <main className="flex-1">{children}</main>
      <BottomNavbar user={user} />
    </div>
  );
};

export default DashboardLayout;
