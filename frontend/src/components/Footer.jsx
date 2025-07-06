import React from "react";

function Footer() {
  return (
    <div>
      <footer className="w-full text-gray-700 bg-base-300 text-center py-4">
        <p>
          Copyright © {new Date().getFullYear()} - All right reserved by Vigour
          Private Limited
        </p>
      </footer>
    </div>
  );
}

export default Footer;
