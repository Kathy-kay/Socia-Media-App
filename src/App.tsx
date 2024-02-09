import { Route, Routes } from "react-router-dom"
import SignInForm from "./_auth/forms/SignInForm"
import SignUpForm from "./_auth/forms/SignUpForm"
import AuthLayout from "./_auth/AuthLayout"
import RootLayout from "./root/RootLayout"
import { Home } from "./root/pages"
import "./global.css"
import { Toaster } from "@/components/ui/toaster"

const App = () => {
  return (
    <main className="flex h-screen">
        <Routes>
            {/* public Route */}
            <Route element={<AuthLayout />}>
              <Route path="/signin" element={<SignInForm />}/>
              <Route path="/signup" element={<SignUpForm />}/>
            </Route>
            
  
            {/* private routes */}
            <Route element={<RootLayout />}>
              <Route index element={<Home />}/>
            </Route>    
        </Routes>
        <Toaster />
    </main>
  )
}

export default App