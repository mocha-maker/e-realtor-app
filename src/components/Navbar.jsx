import { useNavigate, useLocation } from 'react-router-dom'
import { ReactComponent as OfferIcon } from '../assets/svg/localOfferIcon.svg'
import { ReactComponent as ExploreIcon } from '../assets/svg/exploreIcon.svg'
import { ReactComponent as ProfileIcon } from '../assets/svg/personOutlineIcon.svg'


function Navbar() {

  const navigate = useNavigate()
  const location = useLocation()

  // check if pathname matches and highlight icon
  const pathMatchRoute = (route) => {
    const activeColor = '#2c2c2c'
    const inactiveColor = '#8f8f8f'

    return route === location.pathname ? activeColor : inactiveColor
  }

  return (
    <footer className="navbar">
      <nav className="navbarNav">
        <ul className="navbarListItems">
        <li className="navbarListItem"
            onClick={() => navigate('/')}>
            <ExploreIcon fill={pathMatchRoute('/')} width='36px' height='36px'/>
            <p>Explore</p>
          </li>
          <li className="navbarListItem" 
            onClick={() => navigate('offers')}>
            <OfferIcon fill={pathMatchRoute('/offers')} width='36px' height='36px'/>
            <p>Offer</p>
          </li>
          <li className="navbarListItem"
            onClick={() => navigate('profile')}>
            <ProfileIcon fill={pathMatchRoute('/profile')} width='36px' height='36px'/>
            <p>Profile</p>
          </li>
        </ul>
      </nav>
    </footer>
  )
}
export default Navbar