import { Link } from 'react-router-dom'
import rentCategoryImage from '../assets/jpg/rentCategoryImage.jpg'
import sellCategoryImage from '../assets/jpg/sellCategoryImage.jpg'

function Explore() {
  return (
    <div className='explore'>
      <header className='pageContainer'>
        <p className="pageHeader">Explore</p>
      </header>

      <main className='pageContainer'>
        {/* Slider */}

        <p className="exploreCategoryHeading">Categories</p>
        <div className="exploreCategories">
          <Link to='/category/rent'>
            <img src={rentCategoryImage}
              alt='rent'
              className='exploreCategoryImg'/>
              <p className="exploreCategoryName">Places for Rent</p>
          </Link>
          <Link to='/category/sell'>
            <img src={sellCategoryImage}
              alt='sale'
              className='exploreCategoryImg'/>
              <p className="exploreCategoryName">Places for Sale</p>
          </Link>
        </div>
      </main>
    </div>
  )
}
export default Explore