import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'

function Contact() {
  // States
  const [message, setMessage] = useState('')
  const [landlord, setLandlord] = useState(null)
  // eslint-disable-next-line no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams()

  const params = useParams()

  useEffect(() => {
    const getLandlord = async () => { 
      const docRef = doc(db, 'users',params.landlordId)
      const docSnap = await getDoc(docRef)

      if(docSnap.exists()) {
        setLandlord(docSnap.data())
      } else {
        toast.error('Could not get landlord data')
      }

     }

    getLandlord()
  }, [params, params.landlordId])

  const onChange = (e) => { 
      setMessage(e.target.value)
   }

  return (
    <div className='pageContainer'>
      <header className='pageHeader'>Contact Landlord</header>

        {landlord !== null && (
          <main className='pageContainer'>
            <div className="contactLandlord">
              <p className="landlordName">Contact {landlord?.name}</p>
            </div>

            <form className="messageForm">
              <div className="messageDiv">
                <label htmlFor="message" className="messageLabel">Message</label>
                <input type="text" className="textarea" 
                  name='message'
                  id='message'
                  value={message}
                  onChange={onChange}/>
              </div>
              <a href={`mailto:${landlord.email}?Subject=${searchParams.get('listingName')}&body=${message}`} className='formButtonActive'>Send Message</a>
            </form>
          </main>
        )}

    </div>
  )
}
export default Contact