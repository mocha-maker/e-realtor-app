import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

// Database
import { getAuth, signInWithEmailAndPassword, signInWithEmailLink } from 'firebase/auth'
import { setDoc, doc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase.config'

// Components
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'
import { toast } from 'react-toastify'

function SignIn() {

   const navigate = useNavigate()

 // Toggle password visibilty
  const [showPassword, setShowPassword] = useState(false)
  // Sign-in form data
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  // destructure formData
  const {email, password} = formData

  // On text input
  const onChange = (e) => {

    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }))

  }

  // On sign-in form submit
  const onSubmit = async (e) => {
    e.preventDefault()

    try {
      const auth = getAuth()
      const userCredentials = await signInWithEmailAndPassword(auth, email, password)
  
      if(userCredentials.user) {
        navigate('/')  
      } 
    } catch (error) {
      toast.error('Bad User Credentials')
    }

  }


  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Welcome Back!</p>
        </header>
        <main>
          <form onSubmit={onSubmit}>
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
            <Link to='/forgot-password' className='forgotPasswordLink'>
              Forgot Password
            </Link>

            <div className="signInBar">
              <p className="signInText">
                Sign In
              </p>
              <button className='signInButton'>
                <ArrowRightIcon fill='#fff' width='34px' height='34px'/>
              </button>
            </div>
            </form>

            {/* Google OAuth */}
            
            <Link to='/sign-up' className='registerLink'>
              First time? Sign up for a free account!
            </Link>
        </main>
      </div>
    </>
  )
}
export default SignIn