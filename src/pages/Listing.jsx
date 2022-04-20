// Utilities
import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from "react-router-dom"
import { getDoc, doc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { db } from '../firebase.config'

// Components
import Spinner from '../components/Spinner'
import shareIcon from '../assets/svg/shareIcon.svg'

function Listing() {
  // States
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [shareLinkCopied, setshareLinkCopied] = useState(false)

  const navigate = useNavigate()
  const params = useParams()
  const auth = getAuth()

  useEffect(() => {
    const fetchListing = async () => {

      const docRef = doc(db, 'listings', params.listingId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists) {
        console.log(docSnap.data())
        setListing(docSnap.data())
        setLoading(false)
      }
    }
    fetchListing()
  }, [navigate, params.listingId])

  // //deconstruct listing
  // const {
  //   bathroom,
  //   bedrooms,
  //   discountedPrice,
  //   furnished,
  //   geolocation,
  //   imageUrls,
  //   location,
  //   name,
  //   offer,
  //   parking,
  //   regularPrice,
  //   timestamp,
  //   type,
  //   userRef,
  // } = listing


  if (loading) {
    return (
      <Spinner/>
    )
  }

  return (
    <main className='pageContainer'>

      {/* Image SLIDER */}
      

      <div className="shareIconDiv" onClick={() => {
        // Share link
        navigator.clipboard.writeText(window.location.href)
        setshareLinkCopied(true)
        // reset after 2 seconds
        setTimeout(() => {
          setshareLinkCopied(false)
        }, 2000)
      }}>
        <img src={shareIcon} alt="share" />
        {shareLinkCopied && <p className='linkCopied'>Link Copied!</p>}
      </div>


      <div className="listingDetails">
        <p className="listingName">
        {listing.name} - ${(listing.offer ? listing.discountedPrice : listing.regularPrice)
                .toString().replace(/\B(?=(\d{3})+(?!\d))/g,',')} 
              {listing.type === 'rent' && ' / Month' }
        </p>
        <p className="listingLocation">{listing.location}</p>
        <p className="listingType">For {listing.type}</p>
        {listing.offer && (
        <p className="discountPrice">${listing.regularPrice - listing.discountedPrice} OFF</p>
        )}
        <ul className="listingDetailsList">
          <li>
            {listing.bedrooms}
            {listing.bedrooms > 1
              ? ' Bedrooms'
              : ' Bedroom'}
          </li>
          <li>
            {listing.bathrooms}
            {listing.bathrooms > 1
              ? ' Bathrooms'
              : ' Bathroom'}
          </li>
          <li>{listing.parking && 'Parking Spot'}</li>
          <li>{listing.furnished && 'Furnished'}</li>
        </ul>

        <p className="listingLocationTitle">Location</p>

        {/* MAP */}

        {/* Contact if listing is not the current user */
          auth.currentUser?.uid !== listing.userRef && (
            <Link
              to={`/contact/${listing.userRef}?listingName=${listing.name}`}
              className='primaryButton'>
                Contact Landlord
              </Link>
          )
        }

      </div>
    </main>
  )
}
export default Listing