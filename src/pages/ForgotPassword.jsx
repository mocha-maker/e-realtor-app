import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'

import { toast } from 'react-toastify'
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'

function ForgotPassword() {
  const [email, setEmail] = useState('')

  // Update state on enter
  const onChange = (e) => setEmail(e.target.value)

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const auth = getAuth()
      if (!email) { return toast.error("Please enter an email address") } 

      await sendPasswordResetEmail(auth, email)
      toast.success("Password Reset Email Sent")
      
    } catch (error) {
      toast.error("Could not send reset email: Email is not registered")
    }
  }

  return (
    <div className='pageContainer'>
      <header>
        <p className='pageHeader'>Forgot Password</p>
      </header>

      <main>
        <form onSubmit={onSubmit}>
          <input type='text' name='email' id='email' className='emailInput' placeholder='Email' onChange={onChange} value={email}/>
          
          <div className="signInBar">
            <div className="signInText">Send Reset Link</div>
            <button className="signInButton"><ArrowRightIcon fill='#fff' width='34px' height='34px'/></button>
          </div>
          <Link className='registerLink' to='/sign-in'>Sign In</Link>
        </form>
      </main>
    </div>
  )
}
export default ForgotPassword
