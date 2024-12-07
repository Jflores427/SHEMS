import React, { useState, useEffect, Suspense } from "react";
import LoadingIndicator from "./LoadingIndicator";

const UploadImage = (props) => {

  const { cID } = props;
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState('');
  const profilePicHost = "http://127.0.0.1:5000/";

  function getUploadImage(cID) {
    axios.get("http://127.0.0.1:5000/api/getUploadImage/", {
        params : { cID : cID}
    }).then(function (response) {
        const cProfileURL = response.data.cProfileURL;
        const cProfileURLPath = profilePicHost + cProfileURL;
        console.log(cProfileURLPath);
        if (cProfileURL) {
            setImage(cProfileURLPath)
        }
    }).catch( function (error) {
        console.log(error);
    })
  }

  function setUploadImage(formData) {
    axios.put("http://127.0.0.1:5000/api/setUploadImage/", formData, { headers: { "Content-Type": "multipart/form-data"}})
    .then(function (response) {
        console.log(response.data.message);
        setImage(response.data.cProfileURL)
    }).catch( function (error) {
        console.log(error);
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        // const fileURL = URL.createObjectURL(file);
        const formData = new FormData();
        formData.append("cID", cID); // Add the customer ID
        formData.append("file", file); // Add the file itself
        setUploadImage(formData);
    }
  };

  const handleUploadClick = () => {
    document.getElementById("imageUploadInput").click();
  };

  useEffect(() => {
    getUploadImage(cID);
    setTimeout(setLoading.bind(null,false), 300);
  })

  return (
    <Suspense fallback={<LoadingIndicator minHeightVal={"400px"} size={"2rem"} />}>
    <div className="d-flex flex-column align-items-center gap-3">
        <div className="mt-3">
        {loading ? <LoadingIndicator minHeightVal={"200px"} size={"3rem"} /> : image && (
          <img
            src={image ? image : defaultProfilePic}
            alt="Preview"
            style={{
              width: "200px",
              height: "200px",
              objectFit: "cover",
              borderRadius: "10px",
            }}
          />)}
        </div>
      <button
        className="btn btn-primary"
        onClick={handleUploadClick}
        style={{
            background: "var(--bs-secondary)",
            color: "var(--bs-btn-color)"
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