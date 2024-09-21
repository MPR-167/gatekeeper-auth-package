import { AccountModal } from "./components/AccountModal"
import { AvatarDropdown } from "./components/AvatarDropdown"
import { Login } from "./components/Login"
import { Register } from "./components/Register"
import { AuthProvider } from "./context/AuthProvider"

function App() {

  return (
    <AuthProvider>
      <AccountModal
        isOpen={true}
        onClose={() => { }}
        onSave={() => { }}
        currentUsername="gatekeeper"
        currentEmail="gatekeeper@example.com"
        currentAvatarUrl="https://www.wikipedia.org/portal/wikipedia.org/assets/img/Wikipedia-logo-v2@1.5x.png"
      />
    </AuthProvider>
  )
}

export default App
