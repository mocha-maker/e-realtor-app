import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

// Database
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { setDoc, doc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase.config'

// Components
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'
import { toast } from 'react-toastify'

function SignUp() {

   const navigate = useNavigate()

 // Toggle password visibilty
  const [showPassword, setShowPassword] = useState(false)
  // Sign-in form data
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  // destructure formData
  const { name, email, password} = formData

  // On text input
  const onChange = (e) => {

    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }))

  }

  // On sign-up form submit - create a user
  const onSubmit = async (e) => {
    e.preventDefault()

    try {
      // Create a new user with entered details
      const auth = getAuth()
      const userCredentials = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredentials.user

      updateProfile(auth.currentUser, {
        displayName: name,
      })

      // Create a copy to remove password details from local store before saving to db - users collection
      const formDataCopy = {...formData}
      delete formDataCopy.password
      formDataCopy.timestamp = serverTimestamp()

      await setDoc(doc(db, 'users', user.uid), formDataCopy)

      // Go to home page
      navigate('/')
      
    } catch (error) {
      console.log(error.code);
      if (error.code === "auth/weak-password") {
        return toast.warning('Password should be at least 6 characters long.')
      }
      toast.error('Unable to register.')
    }
  }

  // Main HTML Rendering
  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Welcome!</p>
        </header>
        <main>
          <form onSubmit={onSubmit}>
          <input 
            type="text" 
            className="nameInput" 
            placeholder="Name"
            id='name'
            value={name}
            onChange={onChange}/>
          <input 
            type="email" 
            className="emailInput" 
            placeholder="Email"
            id='email'
            value={email}
            onChange={onChange}/>
            <div className="passwordInputDiv">
              <input 
                type={showPassword ? 'text' : 'password'} 
                className="passwordInput" 
                placeholder="Password"
                id='password'
                value={password}
                onChange={onChange}/>
                <img src={visibilityIcon} 
                  alt="show password" 
                  className='showPassword' 
                  style={showPassword ? { opacity: '1'} : {opacity: '0.5'}}
                  onClick={(e) => {
                    setShowPassword((prevState) => !prevState)
                  }} />
            </div>

            <div className="signUpBar">
              <p className="signUpText">
                Sign Up
              </p>
              <button className='signUpButton'>
                <ArrowRightIcon fill='#fff' width='34px' height='34px'/>
              </button>
            </div>
            </form>

            {/* Google OAuth */}
            
            <Link to='/sign-in' className='registerLink'>
              Already have an account? Sign-in!
            </Link>
        </main>
      </div>
    </>
  )
}
export default SignUp