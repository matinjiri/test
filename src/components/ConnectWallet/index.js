import Button from "react-bootstrap/Button";

const ConnectWallet = ({ handleConnect, isConnected, walletAddress }) => {
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        handleConnect(accounts[0]);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert("MetaMask not detected! Please install MetaMask.");
    }
  };

  return (
    <Button
      className={isConnected ? "btn btn-success" : "btn btn-danger"}
      onClick={connectWallet}
    >
      <h3>{isConnected ? `Connected: ${walletAddress}` : "Connect Wallet"}</h3>
    </Button>
  );
};

export default ConnectWallet;
