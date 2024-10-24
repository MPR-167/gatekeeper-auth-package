// import { AccountModal } from "./components/AccountModal"
// import { AvatarDropdown } from "./components/AvatarDropdown"
// import { Login } from "./components/Login"
// import Register from "./components/Register"
// import { AuthProvider } from "./context/AuthProvider"
// import { AuthProvider, Register } from '@gatekeeper-auth/react'

import { Login } from "./components/Login"
import { LogoutButton } from "./components/LogoutButton"
import { Register } from "./components/Register"
import { AuthProvider } from "./context/AuthContext"



function App() {
  return (
    <AuthProvider>
      <div className="flex flex-col items-center justify-center bg-gray-900 h-screen w-screen">
      {/* <Register/> */}
      {/* <Login/> */}
      <LogoutButton />
      </div>
    </AuthProvider>
  )
}

export default App
