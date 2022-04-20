import { useEffect, useState } from 'react'
import { getAuth } from 'firebase/auth'

function Profile() {
  const [user, setUser] = useState(null)
  const auth = getAuth()

  // on load
  useEffect(() => {
    setUser(auth.currentUser);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return user ? <h3>{user.displayName}</h3> : 'Please log in'
}
export default Profile