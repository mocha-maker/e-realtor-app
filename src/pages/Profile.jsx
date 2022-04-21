import { useState, useEffect } from 'react'
import {
  getAuth,
  updateProfile,
  updateEmail,
  signInWithEmailAndPassword,
} from 'firebase/auth'
import { useNavigate, Link } from 'react-router-dom'
import { updateDoc, doc, collection, getDocs, query, where, orderBy, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase.config'

// Components
import { toast } from 'react-toastify'
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg'
import ListingItem from '../components/ListingItem'
import Spinner from '../components/Spinner'

function Profile() {
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  // get logged in user
  const auth = getAuth()

  // track form changes
  const [updateDetails, setUpdateDetails] = useState(false)
  const [userListings, setUserListings] = useState(null)

  // save as form data
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
    password: auth.currentUser.password,
  })

  // destructure form data
  const { name, email, password } = formData

  // On Load create user listings
  useEffect(() => {
    const fetchUserListings = async () => {
      const listingsRef = collection(db, 'listings')
      const q = query(listingsRef,
          where('userRef', '==', auth.currentUser.uid),
          orderBy('timestamp', 'desc'),
      )
      const querySnap = await getDocs(q)

      let listings =[]

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        })
      })

      console.log(listings)
      setUserListings(listings)
      setLoading(false)
    }

    fetchUserListings()
  },[auth.currentUser.uid])

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
      if (auth.currentUser.displayName !== name) {
        // Update details in the database
        await updateProfile(auth.currentUser, {
          displayName: name,
        })

        // Update in firestore
        const userRef = doc(db, 'users', auth.currentUser.uid)
        await updateDoc(userRef, {
          name,
        })

        auth.currentUser.displayName === name && toast.success('Name updated')
      }

      if (auth.currentUser.email !== email) {
        try {
          // Reauthorize with password
          const credential = await signInWithEmailAndPassword(
            auth,
            auth.currentUser.email,
            password
          )
          console.log(credential.user)

          // If successful credential authorization
          if (credential.user) {
            // Update details in the database
            await updateEmail(auth.currentUser, email)

            // Update in firestore
            const userRef = doc(db, 'users', auth.currentUser.uid)
            await updateDoc(userRef, {
              email,
            })

            auth.currentUser.email === email && toast.success('Email updated')
          }
        } catch (error) {
          toast.error('Bad credentials')
        }
      }
    } catch (error) {
      toast.error('Could not update profile details')
    }

    // Clear password from state and form
    setFormData((prevState) => ({
      ...prevState,
      password: '',
    }))
  }

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }

  const onEdit = async (listingId) => {
    navigate(`/edit-listing/${listingId}`)
  }

  const onDelete = async (listingId) => {
    if(window.confirm('Are you sure you want to delete this listing?')) {
      await deleteDoc(doc(db, 'listings', listingId))
      const updatedListings = userListings.filter((listing) => listing.id !== listingId)
      setUserListings(updatedListings)
      toast.success('Successfully deleted listing')
    }
  }

  if (loading) {
    return <Spinner/>
  }

  return (
    <div className='profile'>
      <header className='pageContainer'>
        <p className='pageHeader'>My Profile</p>
        <button type='button' className='logOut' onClick={onLogout}>
          Logout
        </button>
      </header>

      <main className='pageContainer'>
        <div className='profileDetailsHeader'>
          <p className='personalDetailsText'>Personal Details</p>
          <p
            className='changePersonalDetails'
            onClick={() => {
              updateDetails && onUpdate()
              setUpdateDetails((prevState) => !prevState)
            }}
          >
            {updateDetails ? 'done' : 'change'}
          </p>
        </div>

        <div className='profileCard'>
          <form className='form'>
            <label htmlFor='name' className='formLabel'>
              Name:
            </label>
            <input
              type='text'
              id='name'
              value={name}
              className={!updateDetails ? 'profileName' : 'profileNameActive'}
              disabled={!updateDetails}
              onChange={onChange}
            />
            <label htmlFor='email' className='formLabel'>
              Email:
            </label>
            <input
              type='text'
              id='email'
              value={email}
              className={!updateDetails ? 'profileEmail' : 'profileEmailActive'}
              disabled={!updateDetails}
              onChange={onChange}
            />
            <label htmlFor='password' className='formLabel'>
              Password:
            </label>
            <input
              type='password'
              id='password'
              value={password}
              className={!updateDetails ? 'profileName' : 'profileNameActive'}
              disabled={!updateDetails}
              onChange={onChange}
            />
          </form>
        </div>

        <Link to='/create-listing' className='createListing'>
          <img src={homeIcon} alt='homeIcon' />
          <p>Sell or Rent Your Home</p>
          <img src={arrowRight} alt='arrow right' />
        </Link>

        {!loading && userListings?.length > 0 && (
          <>
          <h3>Your Listings</h3>
          <ul className="categoryListings">
              {userListings.map((listing) => (
                <ListingItem 
                  key={listing.id}
                  listing={listing.data} 
                  id={listing.id}
                  onDelete={onDelete}
                  onEdit={onEdit}/>              
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  )
}
export default Profile
