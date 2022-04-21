import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import Spinner from '../components/Spinner'
import ListingItem from '../components/ListingItem'

function Category() {
  // States
  const [listings, setListings] = useState(null)
  const [loading, setLoading] = useState(true)

  // Fetching toast to prevent duplicates
  const notify = () => {
    toast.loading("Fetching listings", {toastId: "fetchToast"})
  }

  const params = useParams()

  // Retrieve data from db on Load
  useEffect(() => {
    const fetchListings = async () => {
      try {
        notify()
        
        // Get collection reference
        const listingsRef = collection(db, 'listings')

        // Create a query (collection field, query type, query)
        const q = query(
          listingsRef,
          where('type', '==', params.categoryName),
          orderBy('timestamp', 'desc'),
          limit(10)
        )

        // Execute query
        const querySnap = await getDocs(q)

        // Iterate through snapshot

        const results = []

        querySnap.forEach((doc) => {
          return results.push({
            id: doc.id,
            data: doc.data(),
          })
        })
        setListings(results)
        setLoading(false)
        toast.dismiss()

      } catch (error) {
        console.log(error);
        toast.dismiss()
        toast.error("Could not fetch listings")
      }
    }

    // Run fetch listings
    fetchListings()
  }, [params.categoryName])

  return (
    <div className='category'>
      <header className='pageContainer'>
        <p className='pageHeader'>Places for {params.categoryName === 'rent' ? 'Rent' : 'Sale'}</p>
      </header>
      
      { loading ? (
      <Spinner/>
      ) : listings && listings.length > 0 ? (
        <>
          <main className='pageContainer'>
            <ul className="categoryListings">
              {listings.map((listing) => (
                <ListingItem 
                  listing={listing.data} 
                  id={listing.id}
                  onDelete={false}/>              
              ))}
            </ul>
          </main>
        </>
      ) : (
        <p>No listings available.</p>
      )}
    </div>
  )
}
export default Category
