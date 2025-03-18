module.exports = {
    solidity: {
      version: "0.8.20", // Use your Solidity version
      settings: {
        optimizer: {
          enabled: true,
          runs: 200, // Lower this if needed (e.g., 50)
        },
      },
    },
  };
  