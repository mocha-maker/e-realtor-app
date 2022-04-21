// Utilities
import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from "react-router-dom"
import { getDoc, doc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { db } from '../firebase.config'
import { MapContainer, Marker, Popup, TileLayer  } from 'react-leaflet'
import { Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css'

import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

// Components
import Spinner from '../components/Spinner'
import shareIcon from '../assets/svg/shareIcon.svg'
import MapMarkerIcon from '../assets/png/map-marker-icon.png'
import { Swiper, SwiperSlide } from 'swiper/react'
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y])

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

        console.log();
      }
    }
    fetchListing()
  }, [navigate, params.listingId])


  if (loading) {
    return (
      <Spinner/>
    )
  }

  return (
    <main>

      <Swiper
        slidesPerView={1}
        pagination={{clickable: true}}
        className='swiper-container'>
          {listing.imageUrls.map((url,index) => {
            return <SwiperSlide key={index}>
              <div className='swiperSlideDiv'
                style={{
                background: `url(${listing.imageUrls[index]}) center no-repeat`,
                }} 
                >

              </div>
            </SwiperSlide>
          })}

      </Swiper>
      
      <div className="pageContainer">
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
          <div className="leafletContainer">
            <MapContainer style={{height: '100%', width: '100%'}} center={[listing.geolocation.lat, listing.geolocation.lng]} zoom={13} scrollWheelZoom={false}>
              <TileLayer
                attribution='&copy; <a href="https://www.osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[listing.geolocation.lat, listing.geolocation.lng]} 
                icon={new Icon({iconUrl: MapMarkerIcon, iconSize: [40,40]})}>
                <Popup>
                  <p>{listing.location}</p>
                </Popup>
              </Marker>
            </MapContainer>
          </div>

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
      </div>
    </main>
  )
}
export default Listing