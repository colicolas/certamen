import { Metadata } from 'next'; // Import Metadata from Next.js
import { ReactNode } from 'react'; // Import ReactNode from React

export const metadata: Metadata = {
  title: "sign up.",
  description: "lucendo discimus",
};

export default function RegisterLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      {children}
    </div>
  );
}
