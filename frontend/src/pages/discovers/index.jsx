import { BASE_URL } from '@/config'
import { getAllUsers } from '@/config/redux/action/authAction'
import DashboardLayout from '@/layout/DashboardLayout'
import UserLayout from '@/layout/UserLayout'
import React, { useEffect, useReducer } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from "./index.module.css"
import { useRouter } from 'next/navigation'

function DiscoverPage() {

  const authState = useSelector((state) => state.auth)

 const dispath = useDispatch();
 
 useEffect(()=>{
   if(!authState.all_profiles_fetched){
     dispath(getAllUsers())
    }
  })
  const router = useRouter();
  return (
    <UserLayout>

          <DashboardLayout>

             <div>
              <h1 className={styles.discoverHead}>User Directory</h1>
              <div className={styles.allUserProfile}>
                {authState.all_profiles_fetched && authState.all_users.map((user) =>{
                  return(
                    <div onClick={()=>{
                      router.push(`/view_profile/${user.userId.username}`)
                    }} key={user.userId._id} className={styles.userCard}>
                      <img className={styles.userCard_image} src={`${BASE_URL}/${user.userId.profilePicture}`} alt="profile" />
                      <div className={styles.nameData}>
                      <h3>{user.userId.name}</h3>
                      <p style={{color: "gray"}}>@{user.userId.username}</p>
                      </div>
                    </div>
                  )
                })}
              </div>



             </div>
          </DashboardLayout>
         


    
    </UserLayout>
  )
}

export default DiscoverPage
