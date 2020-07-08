import React from 'react'
const UserContext = React.createContext({
  isAuthModalOpened: false,
  setAuthModalState: () => {}
})
export default UserContext