import React from 'react';

const MissingDataComponent = (props) => {
  const {message, minHeight} = props
  return (
    <div className="container-fluid d-flex flex-col justify-content-center align-items-center" style={{ minHeight: minHeight }}
    >
      <span className="w-100 h-100 fs-2 my-5" style={{fontFamily:"sans-serif"}}>
        {message}
        </span>
        
    </div>
  )
}

export default MissingDataComponent;