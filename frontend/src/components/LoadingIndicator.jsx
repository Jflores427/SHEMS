import React from "react";

const LoadingIndicator = (props) => {
  const { minHeightVal, size, color } = props;
  return (
    <div
      className="container d-flex flex-row justify-content-center align-items-center p-0"
      style={{ minHeight: minHeightVal}}
    >
      <div
        className={`spinner-border ${color ? `text-${color}` : `text-secondary`}`}
        role="status"
        style={{ width: size, height: size }}
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingIndicator;
