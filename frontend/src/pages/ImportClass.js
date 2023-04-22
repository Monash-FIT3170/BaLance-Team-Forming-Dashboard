import React, { useState } from "react";
import logo from "../assets/logo.png";

function ImportPage() {
  const [csvFile, setCsvFile] = useState(null);
  
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = (event) => {
        const csvString = event.target.result;
        setCsvFile(file);
        console.log(csvString)
      };
    }
  };
  

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) {
      setCsvFile(file);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <h1>This page is used to:</h1>
      <h3>- Upload a csv file with a class</h3>
      <h3>- Upload the students and class info</h3>
      <h3>- Sort the students into random groups which can be viewed</h3>
      {csvFile ? (
        <div>
          <p>Selected CSV file: {csvFile.name}</p>
        </div>
      ) : (
        <div>
          <p>Drag and drop a CSV file here, or click to select a file</p>
          <input type="file" onChange={handleFileUpload} />
        </div>
      )}
    </div>
  );
}

export default ImportPage;
