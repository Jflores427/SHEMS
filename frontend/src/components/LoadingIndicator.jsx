import React from "react";

const LoadingIndicator = (props) => {
  const { minHeightVal, size } = props;
  return (
    <div
      className="container d-flex flex-row justify-content-center align-items-center"
      style={{ minHeight: minHeightVal }}
    >
      <div
        class="spinner-border text-secondary"
        role="status"
        style={{ width: size, height: size }}
      >
        <span class="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingIndicator;
