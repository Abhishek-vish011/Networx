import { getAboutUser } from '@/config/redux/action/authAction'
import DashboardLayout from '@/layout/DashboardLayout'
import UserLayout from '@/layout/UserLayout'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from "./index.module.css"
import { BASE_URL, clientServer } from '@/config'
import { getAllPosts } from '@/config/redux/action/postAction'
export default function ProfilePage() {

    const dispatch = useDispatch();
    const postReducer = useSelector((state)=> state.posts);

    const authState = useSelector((state)=> state.auth);
    const [userProfile, setUserProfile] = useState({})
    const [userPosts, setUserPosts] = useState([])
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [inputData, setInputData] = useState({company: '', position: '', years: '' });

    const handleWorkInputChange = (e) =>{
      const { name, value} = e.target;
      setInputData({ ...inputData, [name]: value});
    }


    useEffect(()=>{
        dispatch(getAboutUser({ token: localStorage.getItem("token")}))
        dispatch(getAllPosts())
    }, [])

    useEffect(()=>{
        if(authState.user != undefined){
           setUserProfile(authState.user)
           let post = postReducer.posts.filter((post)=>{
               return post.userId.username === authState.user.userId.username
             })
             setUserPosts(post);
       }
    }, [authState.user, postReducer.posts])

  const updateProfilePicture = async(file)=>{
    const formData = new FormData();
    formData.append("profile_picture", file);
    formData.append("token", localStorage.getItem("token"));

    const response = await clientServer.post("/update_profile_picture", formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    dispatch(getAboutUser({token: localStorage.getItem("token")}))
  }


  const updateProfileData = async () => {
    const request = await clientServer.post("/user_update", {
      token: localStorage.getItem("token"),
      name: userProfile.userId.name,
    });

    const response = await clientServer.post("/update_profile_data", {
      token: localStorage.getItem("token"),
      bio: userProfile.bio,
      currentPost: userProfile.currentPost,
      pastWork: userProfile.pastWork,
      education: userProfile.education
    });

    dispatch(getAboutUser({ token: localStorage.getItem("token")}));
  }

  return (
    <UserLayout>
        <DashboardLayout>
            {authState.user && userProfile.userId &&
              <div className={styles.container}>
      <div className={styles.backDropContainer}>
 
            <label htmlFor='profilePictureUpload' className={styles.backDrop_overLap}><p>Edit</p></label>
            <input onChange={(e)=>{
                updateProfilePicture(e.target.files[0])

            }} hidden   accept="image/jpeg, image/png, image/jpg, image/webp" type="file" id='profilePictureUpload' />
        <img  src={`${BASE_URL}/${userProfile.userId.profilePicture}`} alt="" />
      </div>
      <div className={styles.profileContainer_detail}>
        <div className={styles.profileContainer_flex}>
           <div style={{flex: "0.6"}}>
            <div className={styles.profileSetUp}>
  <input
    className={styles.nameEdit}
    type="text"
    value={userProfile?.userId?.name || ""}
    onChange={(e) => {
      setUserProfile({
        ...userProfile,
        userId: {
          ...userProfile.userId,
          name: e.target.value,
        },
      });
    }}
  />
  <p style={{ color: "gray" }}>@{userProfile?.userId?.username}</p>
</div>

            
           <div>
            <textarea value={userProfile.bio} onChange={(e)=>{
              setUserProfile({ ...userProfile, bio: e.target.value})
            }}
            rows={Math.max(3, Math.ceil(userProfile.bio.length/80))}
            style={{width: "100%",}} placeholder='Biography'></textarea>
           </div>
           </div>
           <div className={styles.recentCard}>
            <h3>Recent Activity</h3>
            <h4>  {console.log("userPosts value:", userPosts)}</h4>
           {Array.isArray(userPosts) ? (
  userPosts.map((post) => {
    console.log("Post symbol:", post);
    return (
      <div key={post._id} className={styles.postCard}>
        <div className={styles.card}>
          <div className={styles.card_profileContainer}>
            {post.media !== "" ? (
              <img src={`${BASE_URL}/${post.media}`} alt="" />
            ) : (
              <div style={{ width: "3.4rem", height: "3.4rem" }}>No thing here</div>
            )}
          </div>
          <p>{post.body || "NO WORD"}</p>
        </div>
      </div>
    );
  })
) : (
  <p>Loading or no posts available...</p>
)}

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

            <button className={styles.addWorkButton} onClick={()=>[
                setIsModalOpen(true)
            ]}>Add Works</button>

        </div>
      </div>


      {userProfile != authState.user && 
      <div onClick={()=>{
        updateProfileData();
      }} className={styles.updateProfilebtn}>
             Update Profile
        </div>}
    </div>
}
 {
              isModalOpen  &&
               <div onClick={()=>{
                setIsModalOpen(false)
               }} className={styles.commentsContainer}>
                  <div onClick={(e)=>{
                    e.stopPropagation()
                  }} className={styles.allCommentsContainer}>
                           <input onChange={handleWorkInputChange} name='company' className={styles.inputField} type="text" placeholder='Enter Company' />
                           <input onChange={handleWorkInputChange} name='position' className={styles.inputField} type="text" placeholder='Enter Position' />
                           <input onChange={handleWorkInputChange} name='years' className={styles.inputField} type="number" placeholder='Years' />
                           <div onClick={()=>{
                               setUserProfile({ ...userProfile, pastWork: [ ...userProfile.pastWork, inputData]})
                               setIsModalOpen(false)
                           }} className={styles.updateProfilebtn}>Add Work</div>
                  </div>
               </div>
}
        </DashboardLayout>
    </UserLayout>
  )
}


