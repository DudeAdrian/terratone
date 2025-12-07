import React from "react";

<a href="/services" className="mr-4">Services</a>
const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-blue-600 text-white p-4">
        <nav>
          <a href="/" className="mr-4">Home</a>
        </nav>
      </header>

      <main className="flex-grow p-4">
        {children}
      </main>

      <footer className="bg-blue-600 text-white p-4 text-center">
        Sofie Systems © 2025
      </footer>
    </div>
  );
};

export default MainLayout;
