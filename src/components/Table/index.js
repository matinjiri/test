/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { useEffect, useState } from "react";
import Papa from "papaparse"; 
import { ethers } from "ethers"; 
import "./style.css";

const SenderTable = (props) => {
  let indexOfLastItem;
  let indexOfFirstItem;
  let currentItems;
  const { wallets, setWallets, isConnected } = props;
  const { currentPage, setCurrentPage } = useState(1);
  const [itemPerPage] = useState(5);
  const [errorMessages, setErrorMessages] = useState([]);

  useEffect(() => {
    indexOfLastItem = currentPage * itemPerPage;
    indexOfFirstItem = indexOfLastItem - itemPerPage;
    currentItems = wallets && wallets.slice(indexOfFirstItem, indexOfLastItem);
  }, [wallets, currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Function to validate Ethereum address format
  const isValidEthereumAddress = (address) => {
    return ethers.isAddress(address);
  };

  // Function to handle the CSV file upload and parse the content
  const handleFileUpload = (e) => {
    const file = e.target.files[0]; // Get the uploaded file

    if (!file) {
      alert("Please select a file.");
      return;
    }

    // Read the content of the file using FileReader
    const reader = new FileReader();

    reader.onload = () => {
      // Use PapaParse to parse the CSV content
      const result = Papa.parse(reader.result, { header: false, skipEmptyLines: true });
      const walletAddresses = result.data.map((row) => row[0].trim()); // Assuming each row contains one address

      // Validate and filter addresses
      const validAddresses = [];
      const errors = [];

      walletAddresses.forEach((address) => {
        if (!isValidEthereumAddress(address)) {
          errors.push(`${address} is not a valid Ethereum address.`);
        } else if (validAddresses.includes(address)) {
          errors.push(`${address} is a duplicate address.`);
        } else {
          validAddresses.push(address);
        }
      });

      if (errors.length > 0) {
        setErrorMessages(errors); // Set error messages to display
        alert("Some addresses were invalid or duplicated. Please check the console for details.");
      } else {
        setWallets(validAddresses); // Set the wallets state with valid addresses
        alert("Addresses uploaded successfully.");
      }
    };

    reader.onerror = (error) => {
      console.error("Error reading file:", error);
      alert("Failed to read file.");
    };

    reader.readAsText(file); // Read the file as text
  };

  return (
    <div>
      {/* Display error messages */}
      {errorMessages.length > 0 && (
        <div className="errorMessages">
          {errorMessages.map((error, idx) => (
            <p key={idx} className="errorMessage">{error}</p>
          ))}
        </div>
      )}

      <Table responsive>
        <thead>
          <tr>
            <th>No</th>
            <th>Wallet Address</th>
          </tr>
        </thead>
        <tbody>
          {wallets && wallets.length > 0
            ? wallets.map((e, idx) => {
                return (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{e}</td>
                  </tr>
                );
              })
            : "No data"}
        </tbody>
      </Table>

      <div className="tableButton">
        <Button
          className="uploadButton"
          disabled={!isConnected}
          onClick={() => document.getElementById("fileInput").click()} 
        >
          Upload file
        </Button>

        {/* Hidden file input */}
        <input
          id="fileInput"
          type="file"
          accept=".csv"
          style={{ display: "none" }}
          onChange={handleFileUpload} 
        />
      </div>
    </div>
  );
};

export default SenderTable;
