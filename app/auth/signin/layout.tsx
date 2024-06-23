import { Metadata } from 'next'; // Import Metadata from Next.js
import { ReactNode } from 'react'; // Import ReactNode from React

export const metadata: Metadata = {
  title: "log in.",
  description: "lucendo discimus",
};

export default function SigninLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      {children}
    </div>
  );
}
