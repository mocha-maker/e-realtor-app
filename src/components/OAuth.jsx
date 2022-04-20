import { useLocation, useNavigate } from 'react-router-dom'
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase.config'

// Components
import { toast } from 'react-toastify'
import googleIcon from '../assets/svg/googleIcon.svg'

function OAuth() {
  const navigate = useNavigate()
  const location = useLocation()

  const onGoogleClick = async () => {
    try {

      // Set up google auth popup
      const auth = getAuth()
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const user = result.user

      // Check if user exists in the firebase db using user ID
      const docRef = doc(db, 'users', user.uid)
      const docSnap = await getDoc(docRef)

      // If user doesn't exists, create a new user in firebase
      if(!docSnap.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        })
        toast.success('Sign up with Google successful')
      }

      navigate('/')
      toast.success('Login successful')

    } catch (error) {
      toast.error('Unable to sign in with Google')
    }
  }

  return (
    <div className='socialLogin'>
      <p>Sign {location.pathname === '/sign-up' ? 'up' : 'in'} with</p>
      <button className='socialIconDiv' onClick={onGoogleClick}>
        <img src={googleIcon} alt='google' className='socialIconImg' />
      </button>
    </div>
  )
}
export default OAuth
