import { createContext, useContext, useState } from "react"

const ConnectionContext = createContext()

export const useConnection = () => useContext(ConnectionContext)

export const ConnectionProvider = ({ children }) => {
  const [connectionsDetails, setConnectionsDetails] = useState(null)
  const [schemasDetails, setSchemasDetails] = useState([])

  return (
    <ConnectionContext.Provider value={{ connectionsDetails, setConnectionsDetails, schemasDetails, setSchemasDetails }}>
      {children}
    </ConnectionContext.Provider>
  )
}