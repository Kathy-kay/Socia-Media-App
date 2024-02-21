import { Route, Routes } from "react-router-dom"
import SignInForm from "./_auth/forms/SignInForm"
import SignUpForm from "./_auth/forms/SignUpForm"
import AuthLayout from "./_auth/AuthLayout"
import RootLayout from "./root/RootLayout"
import { AllUsers, Bookmark, CreatePost, EditPost, Explore, Home, LikedPost, PostDetails, Profile, UpdateProfile } from "./root/pages"
import "./global.css"
import { Toaster } from "@/components/ui/toaster"


const App = () => {
  return (
    <main className="flex h-screen">
        <Routes>
            {/* public Route */}
            <Route element={<AuthLayout />}>
              <Route path="/sign-in" element={<SignInForm />}/>
              <Route path="/sign-up" element={<SignUpForm />}/>
            </Route>
            
  
            {/* private routes */}
            <Route element={<RootLayout />}>
              <Route index element={<Home />}/>
              <Route path="/explore" element={<Explore />}/>
              <Route path="/bookmark" element={<Bookmark />}/>
              <Route path="/all-users" element={<AllUsers />}/>
              <Route path="/create-post" element={<CreatePost />}/>
              <Route path="/edit-post/:id" element={<EditPost />}/>
              <Route path="/post/:id" element={<PostDetails />}/>
              <Route path="/profile/:id/*" element={<Profile />}/>
              <Route path="/update-profile/:id" element={<UpdateProfile />}/>
              <Route path="/liked-post/:id" element={<LikedPost/>}/>
              
            </Route>    
        </Routes>
        <Toaster />
    </main>
  )
}

export default App