// import { AccountModal } from "./components/AccountModal"
// import { AvatarDropdown } from "./components/AvatarDropdown"
// import { Login } from "./components/Login"
// import Register from "./components/Register"
// import { AuthProvider } from "./context/AuthProvider"
import { AuthProvider, Register } from 'gatekeeper-auth'

function App() {

  return (
    <AuthProvider projectId={2} customRoleId={1} tenantId={1}>
      <Register />
    </AuthProvider>
  )
}

export default App
