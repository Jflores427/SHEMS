import React, { useState, useEffect, Suspense } from "react";
import LoadingIndicator from "./LoadingIndicator";
import { getUploadImage, setUploadImage } from "../functionsAPI/apiUploadImage";

const UploadImage = (props) => {
  const { cID } = props;
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState("");

  const handleGetUploadImage = async (cID) => {
    try {
      const result = await getUploadImage(cID);
      setImage(result);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSetUploadImage = async (formData) => {
    try {
      const result = await setUploadImage(formData);
      console.log(result);
      window.location.reload();
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("cID", cID); // Add the customer ID
      formData.append("file", file); // Add the file itself
      handleSetUploadImage(formData);
    }
  };

  const handleUploadClick = () => {
    document.getElementById("imageUploadInput").click();
  };

  useEffect(() => {
    handleGetUploadImage(cID);
    setTimeout(setLoading.bind(null, false), 500);
  });

  return (
    <Suspense
      fallback={<LoadingIndicator minHeightVal={"400px"} size={"2rem"} />}
    >
      <div className="d-flex flex-column align-items-center gap-3">
        {loading ? (
          <LoadingIndicator minHeightVal={"215px"} size={"3rem"} />
        ) : (
          image && (
            <div className="mt-3">
              <img
                className="rounded"
                src={image}
                alt="Profile Picture"
                style={{
                  width: "200px",
                  height: "200px",
                  objectFit: "cover",
                }}
              />
            </div>
          )
        )}
        <button
          className="btn btn-primary"
          onClick={handleUploadClick}
          style={{
            background: "var(--bs-secondary)",
            color: "var(--bs-btn-color)",
          }}
        >
          Upload Image
        </button>
        <input
          type="file"
          id="imageUploadInput"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
        />
      </div>
    </Suspense>
  );
};

export default UploadImage;
