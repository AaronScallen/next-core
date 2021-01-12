import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useUser } from '../context/userContext'
import firebase from '../firebase/clientApp'
import CreatePost from './indexx';

export default function Home() {
  // Our custom hook to get context values
  // const { loadingUser, user } = useUser();
  const [notification, setNotification] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [blogs, setBlogs] = useState([]);
  // const profile = { username: 'nextjs_user', message: 'Awesome!!' }

  // useEffect(() => {
  //   if (!loadingUser) {
  //     // You know that the user is loaded: either logged in or out!
  //     console.log(user.email)
  //   }

  // }, [loadingUser, user])

  // const createUser = async () => {
  //   const db = firebase.firestore()
  //   await db.collection('profile').doc(profile.username).set(profile)
  //   alert('User created!!')
  // }

firebase.auth()
.onAuthStateChanged((user) => {
  if (user) {
    setLoggedIn(true)
  } else {
    setLoggedIn(false)
  }
  })

  useEffect(() => {
    firebase.firestore()
      .collection('blog')
      .onSnapshot(snap => {
        const blogs = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setBlogs(blogs);
      });
  }, []);

  const handleLogout = () => {
    firebase.auth()
      .signOut()
      .then(() => {
        setNotification('Logged Out')
        setTimeout(() => {
          setNotification('')
        }, 2000)
      });
  }

  return (
    <div className="container">
      <Head>
        <title>NPD InfoCore</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="title">NPD InfoCore</h1>
        <h2 className="title">w/ Firebase Client-Side</h2>
        <p className="description">Fill in something!</p>
{notification}
        {!loggedIn
          ?
          <div>
            <Link href="/users/register">
              <a>Register</a>
            </Link> |
            <Link href="/users/login">
              <a> Login</a>
            </Link>
          </div>
          :
          <button onClick={handleLogout}>Logout</button>
        }
        <ul>
          {blogs.map(blog =>
            <li key={blog.id}>
              <Link href="/blog/[id]" as={'/blog/' + blog.id}>
                <a>{blog.title}</a>
              </Link>
            </li>
          )}
        </ul>
        {loggedIn && <CreatePost />}
        <p className="description">
          Cloud Firestore Security Rules write permissions are required for
          adding users
        </p>
        {/* <button onClick={createUser}>Create 'nextjs_user'</button> */}


      </main>

      
    </div>
  )
}
// https://colinhacks.com/essays/nextjs-firebase-authentication