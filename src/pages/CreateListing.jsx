// Utilities
import { useEffect, useState } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage'
import { addDoc, serverTimestamp, collection } from 'firebase/firestore'
import { db } from '../firebase.config'
import { v4 as uuidv4 } from 'uuid'

// Components
import Spinner from '../components/Spinner'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'


function CreateListing() {
  // States
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    type: '',
    name: '',
    bedrooms: '',
    parking: '',
    furnished: '',
    address: '',
    offer: '',
    regularPrice: '',
    discountedPrice: '',
    images: {},
    latitude: 0,
    longitude: 0,
  })

  // TODO: Manually set geolocation toggle depending on if you have the API
  const [geolocationEnabled, setGeolocationEnabled] = useState(true)

  const geocodeURL = process.env.REACT_APP_GEOAPIFY_GEOCODE_URL
  const geocodeAPI = process.env.REACT_APP_GEOAPIFY_KEY

  // Destructure formData
  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    offer,
    regularPrice,
    discountedPrice,
    images,
    latitude,
    longitude,
  } = formData

  const auth = getAuth()
  const navigate = useNavigate()

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setFormData({
          ...formData,
          userRef: user.uid,
          type: 'sale',
        })
      } else {
        navigate('/sign-in')
      }
    })
    setLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Error if discount is more than regular
    if (discountedPrice >= regularPrice) {
      toast.error('Discounted price must be less than the regular price')
    }

    // Error if more than 6 images
    if (images.length > 6) {
      toast.error('You can only upload up to 6 images')
    }

    let geolocation = {}

    if (geolocationEnabled) {
      // If enabled Start Geocoding
      const query = `${geocodeURL}/search?text=${address}&format=json&apiKey=${geocodeAPI}`

      const response = await fetch(query)
      const data = await response.json()

      console.log(data)

      // On successful retrieval
      if (data.results.length > 0) {
        console.log('Reading Data')
        const found = data.results[0]

        // Set geocoded data to formData
        geolocation.lat = found.lat ?? 0
        geolocation.lng = found.lon ?? 0
        //location = found.formatted ?? null
      } else {
        toast.error('Please enter a valid address')
      }
    } else {
      // Record lat and long manually as entered in form
      geolocation.lat = latitude
      geolocation.lng = longitude
    }

    // Store an image in firebase
    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage()
        // Generate a unique filename using user id, the image upload name, and a unique key from uuidv4
        const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`
        // Create storageRef
        const storageRef = ref(storage, 'images/' + fileName)
        // Create Upload Task (destination, object)
        const uploadTask = uploadBytesResumable(storageRef, image)

        // From https://firebase.google.com/docs/storage/web/upload-files
        // Register three observers:
        // 1. 'state_changed' observer, called any time the state changes
        // 2. Error observer, called on failure
        // 3. Completion observer, called on successful completion
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            console.log('Upload is ' + progress + '% done')
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused')
                break
              case 'running':
                console.log('Upload is running')
                break
              default:
                break
            }
          },
          (error) => {
            console.log(error)
            reject(error)
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL)
            })
          }
        )
      })
    }

    // Resolve all selected images
    const imageUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch(() => {
      // if returns an error
      setLoading(false)
      toast.error('Images not uploaded')
      return
    })

    // Prepare formData copy

    const formDataCopy = {
      ...formData,
      imageUrls,
      geolocation,
      timestamp: serverTimestamp(),
    }

    formDataCopy.location = address

    // Remove unneeded fields
    delete formDataCopy.images
    delete formDataCopy.address
    !formDataCopy.offer && delete formData.discountedPrice

    console.log(formDataCopy)

    // Save to the database
    const docRef = await addDoc(collection(db, 'listings'), formDataCopy)
    
    setLoading(false)
    
    toast.success('Listing added')
    navigate(`/category/${formDataCopy.type}/${docRef.id}`)
  }

  const onMutate = (e) => {
    let bool = null

    // for bools
    e.target.value === 'true' && (bool = true)
    e.target.value === 'false' && (bool = false)

    // Files

    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: e.target.files,
      }))
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: bool ?? e.target.value,
      }))
    }
  }

  return !loading && (
    <div className='profile'>
      <header className='pageContainer'>
        <p className='pageHeader'>Create a Listing</p>
      </header>
      <main className='pageContainer'>
        <form onSubmit={onSubmit}>
          <label className='formLabel'>Sell / Rent</label>
          <div className='formButtons'>
            <button
              type='button'
              className={type === 'sale' ? 'formButtonActive' : 'formButton'}
              id='type'
              value='sale'
              onClick={onMutate}
            >
              Sell
            </button>
            <button
              type='button'
              className={type === 'rent' ? 'formButtonActive' : 'formButton'}
              id='type'
              value='rent'
              onClick={onMutate}
            >
              Rent
            </button>
          </div>

          <label className='formLabel'>Name</label>
          <input
            className='formInputName'
            type='text'
            id='name'
            value={name}
            onChange={onMutate}
            maxLength='32'
            minLength='10'
            required
          />

          <div className='formRooms flex'>
            <div>
              <label className='formLabel'>Bedrooms</label>
              <input
                className='formInputSmall'
                type='number'
                id='bedrooms'
                value={bedrooms}
                onChange={onMutate}
                min='1'
                max='50'
                required
              />
            </div>
            <div>
              <label className='formLabel'>Bathrooms</label>
              <input
                className='formInputSmall'
                type='number'
                id='bathrooms'
                value={bathrooms}
                onChange={onMutate}
                min='1'
                max='50'
                required
              />
            </div>
          </div>

          <label className='formLabel'>Parking spot</label>
          <div className='formButtons'>
            <button
              className={parking ? 'formButtonActive' : 'formButton'}
              type='button'
              id='parking'
              value={true}
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              className={
                !parking && parking !== null ? 'formButtonActive' : 'formButton'
              }
              type='button'
              id='parking'
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>

          <label className='formLabel'>Furnished</label>
          <div className='formButtons'>
            <button
              className={furnished ? 'formButtonActive' : 'formButton'}
              type='button'
              id='furnished'
              value={true}
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              className={
                !furnished && furnished !== null
                  ? 'formButtonActive'
                  : 'formButton'
              }
              type='button'
              id='furnished'
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>

          <label className='formLabel'>Address</label>
          <textarea
            className='formInputAddress'
            type='text'
            id='address'
            value={address}
            onChange={onMutate}
            required
          />

          {!geolocationEnabled && (
            <div className='formLatLng flex'>
              <div>
                <label className='formLabel'>Latitude</label>
                <input
                  className='formInputSmall'
                  type='number'
                  id='latitude'
                  value={latitude}
                  onChange={onMutate}
                  required
                />
              </div>
              <div>
                <label className='formLabel'>Longitude</label>
                <input
                  className='formInputSmall'
                  type='number'
                  id='longitude'
                  value={longitude}
                  onChange={onMutate}
                  required
                />
              </div>
            </div>
          )}

          <label className='formLabel'>Offer</label>
          <div className='formButtons'>
            <button
              className={offer ? 'formButtonActive' : 'formButton'}
              type='button'
              id='offer'
              value={true}
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              className={
                !offer && offer !== null ? 'formButtonActive' : 'formButton'
              }
              type='button'
              id='offer'
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>

          <label className='formLabel'>Regular Price</label>
          <div className='formPriceDiv'>
            <input
              className='formInputSmall'
              type='number'
              id='regularPrice'
              value={regularPrice}
              onChange={onMutate}
              min='50'
              max='750000000'
              required
            />
            {type === 'rent' && <p className='formPriceText'>$ / Month</p>}
          </div>

          {offer && (
            <>
              <label className='formLabel'>Discounted Price</label>
              <div className='formPriceDiv'>
                <input
                  className='formInputSmall'
                  type='number'
                  id='discountedPrice'
                  value={discountedPrice}
                  onChange={onMutate}
                  min='50'
                  max='750000000'
                  required={offer}
                />
              </div>
            </>
          )}

          <label className='formLabel'>Images</label>
          <p className='imagesInfo'>
            The first image will be the cover (max 6).
          </p>
          <input
            className='formInputFile'
            type='file'
            id='images'
            onChange={onMutate}
            max='6'
            accept='.jpg,.png,.jpeg'
            multiple
            required
          />
          <button type='submit' className='primaryButton createListingButton'>
            Create Listing
          </button>
        </form>
      </main>
      {loading && <Spinner />}
    </div>
  )
}
export default CreateListing
