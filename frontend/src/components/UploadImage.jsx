import React, { useState, useEffect } from "react";
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
    setTimeout(setLoading.bind(null, false), 200);
  });

  return (
      <div className="d-flex flex-column align-items-center gap-3">
        {loading ? (
          <LoadingIndicator minHeightVal={"236px"} size={"3rem"} />
        ) : (
          image && (
            <div className="bg-light border border-5 border-secondary rounded-2 mt-3">
            <div className="border border-5 border-dark rounded-0">
              <img
                className=""
                src={image}
                alt="Profile Picture"
                style={{
                  width: "200px",
                  height: "200px",
                  objectFit: "contain",
                }}
              />
            </div>
            </div>
          )
        )}
        <button
          className="btn btn-primary border border-dark"
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
  );
};

export default UploadImage;
