import { AccountModal } from "./components/AccountModal"
import { AvatarDropdown } from "./components/AvatarDropdown"
import { Login } from "./components/Login"
import Register from "./components/Register"
import { AuthProvider } from "./context/AuthProvider"

function App() {

  return (
    <AuthProvider>
      <Register />
    </AuthProvider>
  )
}

export default App
