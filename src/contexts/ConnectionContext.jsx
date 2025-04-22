// This file creates a context for managing connection-related data
// (like database connection info and schemas) across your app
// shares - connectionsDetails, setConnectionsDetails, schemasDetails, setSchemasDetails

// useConnection

import { createContext, useContext, useState } from "react";

const ConnectionContext = createContext(); // Creates a new context object

export const ConnectionProvider = ({ children }) => {
  // state variables
  const [connectionsDetails, setConnectionsDetails] = useState(null); // Stores data about current database connections
  const [schemasDetails, setSchemasDetails] = useState([]); // Stores data about database schemas

  return (
    <ConnectionContext.Provider
      value={{
        connectionsDetails,
        setConnectionsDetails,
        schemasDetails,
        setSchemasDetails,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
};

// A shortcut (custom hook) to easily access the context from other components
export const useConnection = () => useContext(ConnectionContext);