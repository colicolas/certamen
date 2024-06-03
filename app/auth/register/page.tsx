"use client";
import { useState } from "react";
import { auth } from '@/lib/firebaseClient';
import Input from '@/components/FormTextInput';
import firebase from 'firebase/compat/app';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [division, setDivision] = useState("");
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [team, setTeam] = useState<string[]>([]);
  const [bio, setBio] = useState("none yet!");
  const [error, setError] = useState("");
  const [idToken, setIdToken] = useState("");
  const [googleSignedIn, setGoogleSignedIn] = useState(false);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const addSpecialty = (specialty: string) => {
    setSpecialties((prevSpecialties) => {
      if (prevSpecialties.includes(specialty)) {
        return prevSpecialties.filter((item) => item !== specialty);
      } else {
        return [...prevSpecialties, specialty];
      }
    });
  };

  const registerUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateEmail(email)) {
      setError("Invalid email address");
      return;
    }
    if (password.length < 6 && !googleSignedIn) {
      setError("Password must be at least 6 characters long");
      return;
    }
    setError(""); // Clear any previous errors

    const response = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email,
        password: googleSignedIn ? undefined : password,
        name,
        division,
        specialties,
        team,
        bio,
        idToken: googleSignedIn ? idToken : undefined,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || "Failed to register");
      return;
    }

    try {
      if (data.message === "Email already in use") {
        setError(data.message); // Display server-side error
      } else {
        console.log(data);
      }
    } catch (error) {
      setError("Failed to parse response");
      console.error("Failed to parse JSON response", error);
    }
  };

  const signInWithGoogle = async () => {
    if (!auth) return;

    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(provider);
      const idToken = await result.user.getIdToken();
      setIdToken(idToken);
      setEmail(result.user.email || "");
      setName(result.user.displayName || "");
      setGoogleSignedIn(true);
    } catch (error) {
      console.error("Google sign-in error:", error);
      setError("Google sign-in failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-beige-500">
      <div className="bg-beige-300 p-8 rounded-lg shadow-lg max-w-lg w-full"> {/* max-w-lg to make it wider */}
        <h2 className="text-center text-2xl font-bold text-gray-900 mb-6 uppercase">Sign Up</h2> {/* Darker and capitalized */}
        {error && <div className="mb-4 text-red-500">{error}</div>}
        <form onSubmit={registerUser}>
          {!googleSignedIn && (
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} id="email" />
          )}
          {!googleSignedIn && (
            <Input label="Username" type="text" value={name} onChange={(e) => setName(e.target.value)} id="name" />
          )}
          {!googleSignedIn && (
            <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} id="password" />
          )}
          <div className="mb-4">
            <label htmlFor="division" className="block text-gray-700 text-xs font-bold mb-2 uppercase">Certamen Division</label> {/* Smaller and capitalized */}
            <select
              id="division"
              value={division}
              onChange={(e) => setDivision(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="" disabled>Select your division</option>
              <option value="MS1">MS1</option>
              <option value="MS2">MS2</option>
              <option value="MS3">MS3</option>
              <option value="HS1">HS1</option>
              <option value="HS2">HS2</option>
              <option value="HS3">HS3</option>
              <option value="Advanced">Advanced (HS4+)</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-xs font-bold mb-2 uppercase">Specialty</label> {/* Smaller and capitalized */}
            <div className="flex flex-wrap">
              {["myth", "history", "literature", "pmaq", "vocab", "grammar", "culture"].map((specialty) => (
                <div key={specialty} className="flex items-center mr-4">
                  <input
                    type="checkbox"
                    id={`specialty-${specialty}`}
                    onChange={() => addSpecialty(specialty)}
                    className="mr-1 leading-tight"
                  />
                  <label htmlFor={`specialty-${specialty}`} className="text-gray-700 text-sm">{specialty.charAt(0).toUpperCase() + specialty.slice(1)}</label>
                </div>
              ))}
            </div>
          </div>
          <button type="submit" className="w-full bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-700 focus:outline-none focus:shadow-outline">
            Register
          </button>
        </form>
        <div className="mt-4">
          <button onClick={signInWithGoogle} className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-400 focus:outline-none focus:shadow-outline">
            Sign Up with Google
          </button>
        </div>
      </div>
    </div>
  );
}
