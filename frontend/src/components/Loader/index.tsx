// Loader.js

import React from "react";
import "./styles.css"; // Import the CSS for styling

const Loader = () => {
  return (
    <div className="loader-container">
      <svg className="loader" viewBox="0 0 100 100">
        <circle className="loader-circle" cx="50" cy="50" r="45" />
      </svg>
    </div>
  );
};

export default Loader;
