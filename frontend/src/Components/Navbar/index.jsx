import React from 'react'
import styles from "./style.module.css"
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux';
import { reset } from '@/config/redux/reducer/authReducer';

export default function NavbarComponent() {
    const router = useRouter();
    const dispath = useDispatch();
    const authState = useSelector((state) => state.auth);
  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <h2 style={{cursor:"pointer"}} onClick={()=>{
            router.push("/")
        }}>Networx</h2>

        <div className={styles.navbarOptionContainer}>
          {authState.profileFetched && <div>
           <div style={{display: "flex", gap: "1.2rem"}}>
             {/* <p>Hey, {authState.user.userId.name}</p> */}
            <p onClick={()=>{
              router.push("/profile")
            }} style={{fontWeight: "bold", cursor: "pointer"}}>Profile</p>
            <p onClick={()=>{
              localStorage.removeItem("token")
              router.push("/login")
              dispath(reset())
            }} style={{fontWeight: "bold", cursor: "pointer"}}>Log Out</p>
           </div>
            </div>}

          {!authState.profileFetched && <div onClick={()=>{
                router.push("/login")
            }} className={styles.buttonJoin}>
                <p>Be a part</p>
            </div>}
            
        </div>
      </nav>
    </div>
  )
}
