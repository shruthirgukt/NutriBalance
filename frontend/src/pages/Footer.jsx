import React from "react";

const Footer = () => {
  return (
    <footer className="bg-teal-600 text-white mt-auto py-4">
      <div className="max-w-7xl mx-auto px-4 text-center text-sm">
        &copy; {new Date().getFullYear()} Nutrabalance. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
