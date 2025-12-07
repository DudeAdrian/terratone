import React from "react";
import MainLayout from "../components/MainLayout";

const Home = () => {
  return (
    <MainLayout>
      <div className="text-center mt-20">
        <h2 className="text-4xl font-semibold mb-4">Welcome to Sofie Systems</h2>
        <p className="text-lg max-w-xl mx-auto">
          This is the beginning of something amazing. Let’s build a beautiful UI.
        </p>
      </div>
    </MainLayout>
  );
};

export default Home;
