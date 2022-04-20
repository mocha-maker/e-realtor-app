import { useEffect, useState } from 'react'
import { getAuth, updateProfile } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { updateDoc, doc } from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'

function Profile() {

  const navigate = useNavigate()
  // get logged in user
  const auth = getAuth()

  // track form changes
  const [updateDetails, setUpdateDetails] = useState(false)

  // save as form data
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  })

  // destructure form data
  const {name, email} = formData

  // Log out on click
  const onLogout = (e) => {
    auth.signOut()
    navigate('/')
    toast.success('Logged out successfully')
  }
  // Update on click
  const onUpdate = async (e) => {

    try {
      // Check if form is different from existing data
      if(auth.currentUser.displayName !== name) {
        // Update details in the database
        await updateProfile(auth.currentUser, {
          displayName: name
        })

        // Update in firestore
        const userRef = doc(db, 'users', auth.currentUser.uid)
        await updateDoc(userRef, {
          name,
        })
      }
      toast.success('Profile details updated')
    } catch (error) {
      toast.error('Could not update profile details')
    }

  }
  
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }

  return <div className="profile">
    <header className="profileHeader">
      <p className="pageHeader">My Profile</p>
      <button 
        type='button'
        className="logOut"
        onClick={onLogout}>
          Logout
        </button>
    </header>

    <main>
      <div className="profileDetailsHeader">
        <p className="personalDetailsText">Personal Details</p>
        <p className="changePersonalDetails" onClick={() => {
          updateDetails && onUpdate()
          setUpdateDetails((prevState) => !prevState)}}>
          { updateDetails ? 'done' : 'change'}
        </p>
      </div>

      <div className="profileCard">

        <form className='form'>
        <label htmlFor='name' className='formLabel'>
            Name:
          </label>
          <input 
            type="text" id="name" 
            value={name}
            className={!updateDetails ? 'profileName' : 'profileNameActive'}
            disabled={!updateDetails}
            onChange={onChange}
          />
          <label htmlFor='email' className='formLabel'>
            Email:
          </label>
          <input 
            type="text" id="email" 
            value={email}
            className={!updateDetails ? 'profileEmail' : 'profileEmailActive'}
            disabled={!updateDetails}
            onChange={onChange}
          />
        </form>
      </div>

    </main>
  </div>
}
export default Profile