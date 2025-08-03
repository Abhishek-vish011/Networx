import { BASE_URL, clientServer } from "@/config";
import { useSearchParams } from "next/navigation"
import React, { useEffect, useState } from 'react'
import Dashboard from "../dashboard";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import styles from "./index.module.css"
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import {getConnectionsRequest, getMyConnectionRequests, sendConnectionRequest} from "@/config/redux/action/authAction"
import { getAllPosts } from "@/config/redux/action/postAction";


export default function ViewProfilePage({userProfile}) {

    const router = useRouter();
    const postReducer = useSelector((state)=> state.posts);

    console.log("All Posts in Redux:", postReducer);
    const dispatch = useDispatch();
    const authState = useSelector((state)=> state.auth)

    const [userPosts, setUserPosts] = useState([]);

    const [isCurrentUserInConnection, setIsCurrentUserInConnection] = useState(false);
    const [isConnectionNull, setIsConnectionNull] = useState(true);

    const getUsersPost = async () =>{
      await dispatch(getAllPosts());
      await dispatch(getConnectionsRequest({token: localStorage.getItem("token")}));
      await dispatch(getMyConnectionRequests({ token: localStorage.getItem("token")}));
    }
      console.log(userPosts);

  useEffect(()=>{
      let post = postReducer.posts.filter((post)=>{
        return post.userId.username === router.query.username
      })
      setUserPosts(post);
    }, [postReducer.posts])

useEffect(() => {
  if (Array.isArray(authState.connections)) {
    const isConnected = authState.connections.some(
      (user) => user.connectionId._id === userProfile.userId._id
    );
    setIsCurrentUserInConnection(true);
    const connection = authState.connections.find(
  user => user?.connectionId?._id === userProfile?.userId?._id
      );

   if (connection?.status_accepted === true) {
         setIsConnectionNull(false);
   }
  }
  if(authState.connectionRequest.some(user => user.userId._id === userProfile.userId._id)){
    setIsCurrentUserInConnection(true)
    if(authState.connectionRequest.find(user => user.userId._id === userProfile.userId._id).status_accepted === true){
      setIsConnectionNull(false)
    }
  }
  
}, [authState.connections, authState.connectionRequest, userPosts.userId]);


    useEffect(()=>{
      getUsersPost();
    }, [])
  return (
    <UserLayout>
    <DashboardLayout>
    <div className={styles.container}>
      <div className={styles.backDropContainer}>
        <img className={styles.backDrop} src={`${BASE_URL}/${userProfile.userId.profilePicture}`} alt="" />
      </div>
      <div className={styles.profileContainer_detail}>
        <div className={styles.profileContainer_flex}>
           <div style={{flex: "0.6"}}>
            <div style={{display: "flex", width: "fit-content", alignItems: "center", gap: "1.2rem"}}>
              <h2>{userProfile.userId.name}</h2>
                 <p style={{color: "gray"}}>@{userProfile.userId.username}</p>
            </div>
             <div style={{display: "flex", alignItems: "center", gap: "1.2rem"}}>
              {isCurrentUserInConnection ? 
              <button className={styles.connectedButton}>{isConnectionNull ? "Pending" : "Connected"}</button>
            :
            <button onClick={()=>{
              dispatch(sendConnectionRequest({token: localStorage.getItem("token"), user_id: userProfile.userId._id }))
            }} className={styles.connectBtn}>Connect</button>}
              
              <div onClick={async()=>{
                const response = await clientServer.get(`/user/download_resume?id=${userProfile.userId._id}`);
                window.open(`${BASE_URL}/${response.data.message}`, "_blank")
              }}> 
                    <svg style={{width: "1.2em"}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>

              </div>


            </div>

           <div style={{marginTop: "1rem"}}>
            <p>{userProfile.bio}</p>
           </div>
           </div>
           <div className={styles.recentCard}>
            <h3>Recent Posts</h3>
            <h4>  {console.log("userPosts value:", userPosts)}</h4>
            {userPosts.map((post)=>{
              console.log("Post symbol:",post);
              return(
                <div key={post._id} className={styles.postCard}>
                  <div className={styles.card}>
                    <div className={styles.card_profileContainer}>
                      {post.media !== "" ? <img src={`${BASE_URL}/${post.media}`} alt=""/> 
                      : <div style={{width: "3.4rem", height: "3.4rem"}}>No thing here</div> }
                    </div>
                    <p>{post.body || "NO WORD"}</p>
                  </div>
                </div>
              )
            })}
           </div>
        </div>
      </div>

      <div className="workHistory">
                <h4>Work History</h4>
                  <div className={styles.workHistoryContainer}>
                      {Array.isArray(userProfile.pastWork) && userProfile.pastWork.map((work, index) => (
                        <div key={index} className={styles.workHistoryCard}>
                          <p style={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: "0.8rem" }}>
                        {work.company} - {work.position}
                      </p>
                      <p>{work.years}+</p>
                 </div>
            ))}

        </div>
      </div>
    </div>
    </DashboardLayout>
    </UserLayout>
  )
}


export async function getServerSideProps(context){

   console.log("From View");
  console.log(context.query.username);

  const request = await clientServer.get("/user/get_profile_based_on_username", {
    params: {
      username: context.query.username
    }
  })
  const response = await request.data;
  console.log("Response from porfil: ",response)
  return {props: {userProfile: request.data.profile}}
}

