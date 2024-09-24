// import { AccountModal } from "./components/AccountModal"
// import { AvatarDropdown } from "./components/AvatarDropdown"
// import { Login } from "./components/Login"
// import Register from "./components/Register"
// import { AuthProvider } from "./context/AuthProvider"
import { AuthProvider, Register } from '@gatekeeper-auth/react'
import Test from './components/Test';

function App() {
  return (
    <AuthProvider>
      <Register />
      <Test />

    </AuthProvider>
  )
}

export default App
