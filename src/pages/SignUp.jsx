import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'

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



  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Welcome Back!</p>
        </header>
        <main>
          <form>
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