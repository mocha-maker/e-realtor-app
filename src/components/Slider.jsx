import { useState, useEffect }from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from '../firebase.config'

import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css/pagination'
import Spinner from './Spinner'
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y])


function Slider() {
  // States
  const [loading, setLoading] = useState(true)
  const [listings, setListings] = useState(null)

  const navigate = useNavigate()

  // On Load
  useEffect (() => {

    const fetchListings = async () => {
      const listingsRef = collection(db, 'listings')
      const q = query(listingsRef, orderBy('timestamp', 'desc'), limit(5))
      const querySnap = await getDocs(q)

      let listings = []

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data:doc.data(),
        })
      })

      console.log(listings)
      setListings(listings)
      setLoading(false)
    
    }
    fetchListings()

  },[])
  
  if (loading) {
    return <Spinner/>
  }

  if (listings.length <= 0) {
    return <></>
  }

  return !loading && (
    <>
      <p className='exploreHeading'>Recommended</p>

      <Swiper slidesPerView={1} pagination={{clickable: true}} className='swiper-container'>
        {listings.map(({data, id}) => {
          return <SwiperSlide key={id} onClick={() => navigate(`/category/${data.type}/${id}`)} >
            <div className="swiperSlideDiv"
            style={{background: `url(${data.imageUrls[0]}) center no-repeat`}}>
              <div className="swiperSlideText">{data.name}</div>
              <div className="swiperSlidePrice">
                ${(data.offer ? data.discountedPrice : data.regularPrice)
                .toString().replace(/\B(?=(\d{3})+(?!\d))/g,',')}
              {data.type === 'rent' && ' / Month' }</div>
            </div>
          </SwiperSlide>
        })
        }  
      </Swiper>  
    </>
  )
}
export default Slider