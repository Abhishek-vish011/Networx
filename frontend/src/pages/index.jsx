import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import UserLayout from "@/layout/UserLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const router = useRouter();
  return (
    <UserLayout>
     <div className={styles.container}>
      <div className={styles.mainContainer}>
        <div className={styles.mainContainer_left}>
            <p>Connect with Friends without Exaggeration</p>
            <p className={styles.typingtext}><span style={{color: "#c34f5e"}}>A True social media platform,</span> with stories no blufs !</p>
            <div onClick={()=>{
               router.push("/login")
            }} className={styles.buttonJoin}>
              <p>Join Now</p>
            </div>
        </div>
        <div className={styles.mainContainer_right}>
          <img className={styles.netImage} src="Images/connectingImage.avif" alt="load"/>
        </div>
      </div>
     </div>

     <div className={styles.belte}>
      <p>Connect with professionals, creators, and thinkers who share your vision.</p>
     </div>
     
      
     <div className={styles.networkImage}>
      <div>
         <div className={styles.firstSet}>
            <img src="Images/Image1.webp" alt="" />
            <img src="Images/Image2.webp" alt="" />
            <img src="Images/Image3.webp" alt="" />
            <img src="Images/Image4.webp" alt="" />
         </div>
         </div>
     </div>
         <div className={styles.secondSet}>
          <div className={styles.secondSetUp}>
             <h2>Welcome to Networx! We’re glad you’re here.</h2>
             <p>Join a thriving community where opportunities and people align with you</p>
             <p>Create your profile and get discovered by like-minded collaborators.</p>
             </div>
              <div onClick={()=>{
               router.push("/login")
            }} className={styles.buttonJoin}>
              <p>Create Your Profile</p>
            </div>
         </div>
     
     <div className={styles.middleSet}>
         <div>
            <h4>Elevate Your Influence – Share thoughts, stories, and expertise. Become a voice others follow.</h4>
            <p>Establish credibility by consistently sharing valuable insights that reflect your expertise and build audience trust.</p>
            <p>Inspire others by expressing unique perspectives, encouraging meaningful dialogue, and fostering professional growth.</p>
         </div>
         <div>
          <img src="Images/ConnectImage.jpg" alt="" />
         </div>
     </div>

     <div className={styles.footer}>
        <div className={styles.footerContainer}>
    <div className={styles.footerLogo}>
      <h2>Networx</h2>
      <p>Connect. Collaborate. Grow.</p>

      <div style={{marginTop: "1.2rem"}}>
        <h4>Contact Us</h4>
        <p>+91-7470379217</p>
        <p>aviVishw1@gmail.com</p>
      </div>
      <div style={{marginTop: "1.2rem"}}>
        Lunch By:- Abhishek Vishwakarma
      </div>

      <div style={{marginTop: "2.2rem"}}>
       <p>Enjoy a smooth, high-speed experience with advanced <br /> functionality throughout the application.</p>
      </div>
    </div>

    <div className={styles.footerLinks}>
      <div>
        <h4>Company</h4>
        <ul>
          <li><a href="#">About Us</a></li>
          <li><a href="#">Careers</a></li>
          <li><a href="#">Press</a></li>
        </ul>
      </div>

      <div>
        <h4>Support</h4>
        <ul>
          <li><a href="#">Help Center</a></li>
          <li><a href="#">Privacy Policy</a></li>
          <li><a href="#">Terms of Service</a></li>
        </ul>
      </div>

      <div>
        <h4>Connect</h4>
        <ul>
          <li><a href="#">LinkedIn</a></li>
          <li><a href="#">Twitter</a></li>
          <li><a href="#">Instagram</a></li>
        </ul>
      </div>
    </div>
  </div>

  <div className={styles.footerBottom}>
    <p>&copy; {new Date().getFullYear()} Networx. All rights reserved.</p>
  </div>
     </div>

    </UserLayout>
  );
}
