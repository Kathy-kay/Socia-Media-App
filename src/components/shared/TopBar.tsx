import { Link, useNavigate } from "react-router-dom"
import { Button } from "../ui/button"
import { useSignOutAccount } from "@/lib/react-query/queryAndMutation"
import { useEffect } from "react";
import { useUserContext } from "@/context/AuthContext";


const TopBar = () => {
    const {mutate: signOut, isSuccess} = useSignOutAccount();
    const {user} = useUserContext()

    const navigate = useNavigate();

    useEffect(() => {
        if(isSuccess) navigate(0)
    }, [isSuccess])
  return (
    <section className="topbar">
        <div className="flex-between py-4 px-5">
            <Link to="/" className="flex gap-3 items-center">
                <img src="/assets/images/logo.svg" 
                alt="Logo" 
                width={130}
                height={325}
                />
            </Link>
            <div className="flex gap-2">
                <Button variant="ghost" className="shad-button_ghost" onClick={() => signOut()}>
                    <img src="/assets/icons/logout.svg" alt="Logout" />
                </Button>
                <Link to={`/profile/${user.id}`} className="flex-center gap-3">
                    <img src={user.imageUrl || "/assets/images/profile.png"} 
                    alt="profile-img" 
                    width={30}
                    height={30}
                    className="h-8 w-8 rounded-full     "
                    />
                    
                </Link>
            </div>
        </div>
    </section>
  )
}

export default TopBar