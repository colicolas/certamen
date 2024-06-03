// app/page.tsx
import React from 'react';
import LightButton from '../components/LightButton';
import DarkButton from '../components/DarkButton';
import Head from 'next/head';

const HomePage: React.FC = () => {
  return (
    <>
      <Head>
        <title> certamen. </title>
      </Head>
      <div className="min-h-screen bg-beige-300 flex flex-col items-center">
        <nav className="w-full flex justify-end p-6 space-x-4">
          <LightButton text="Log In" link="/auth/signin" style="bg-beige"/>
          <DarkButton text="Sign Up" link="/auth/register" style="ml-4"/>
        </nav>
        <div className="mt-24 text-center">
          <h1 className="text-5xl font-bold mb-4">certamen.</h1>
          <p className="text-lg text-gray-700 mb-2">
            pursue your studies of the classics
          </p>
          <p className="text-lg text-gray-700 mb-8 italic">
            discite ludendo :) 
          </p>
          <div className="flex space-x-4 justify-center">
            <DarkButton text="Study" link="/study" />
            <LightButton text="Play" link="/play" />
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
