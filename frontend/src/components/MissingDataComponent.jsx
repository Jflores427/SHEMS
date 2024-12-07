import React from 'react';

const MissingDataComponent = (props) => {
  const {message} = props
  return (
    <div className="container-fluid d-flex flex-col justify-content-center align-items-center" style={{ minHeight: "630px" }}
    >
      <span className="w-100 h-100 fs-2 my-5" style={{fontFamily:"sans-serif"}}>
        {message}
        </span>
        
    </div>
  )
}

export default MissingDataComponent;