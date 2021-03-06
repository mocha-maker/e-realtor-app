// Component for showing a listing within a list

import { Link } from 'react-router-dom'
import { ReactComponent as DeleteIcon } from '../assets/svg/deleteIcon.svg'
import { ReactComponent as EditIcon } from '../assets/svg/editIcon.svg'
import bedIcon from '../assets/svg/bedIcon.svg'
import bathtubIcon from '../assets/svg/bathtubIcon.svg'
import sofaIcon from '../assets/png/sofaIcon.png'

function ListingItem({ listing, id, onDelete, onEdit }) {

  // deconstruct listing
  const {
    type,
    name,
    imageUrls,
    location,
    offer,
    discountedPrice,
    regularPrice,
    bedrooms,
    bathrooms,
    furnished
  } = listing

  return (
    <li className="categoryListing">
      <Link to={`/category/${type}/${id}`} className='categoryListingLink'>
        <div className='imageContainer'>
          <img 
            className='categoryListingImg'
            src={imageUrls[0]} alt={name} />
          {offer && (
            <p className='discountTag'>
              {Math.round((1 - (discountedPrice / regularPrice)) * 100) + "% OFF"}
          </p>)}
        </div>
        <div className="categoryListingDetails">
          <p className="categoryListingLocation">{location}</p>
          <p className="categoryListingName">{name}</p>
          
          <p className="categoryListingPrice">
            ${(offer ? discountedPrice : regularPrice)
                .toString().replace(/\B(?=(\d{3})+(?!\d))/g,',')} 
              {type === 'rent' && ' / Month' }
          </p>
          <div className="categoryListingInfoDiv">
            <img src={bedIcon} alt='bed'/>
            <p className='categoryListingInfoText'>
            {bedrooms} {bedrooms > 1 ? 'Bedrooms' : 'Bedroom'}
            </p>
            <img src={bathtubIcon} alt='bathtub'/>
            <p className='categoryListingInfoText'>
            {bathrooms} {bathrooms > 1 ? 'Bathrooms' : 'Bathroom'}
            </p>
            { furnished && <><img src={sofaIcon} alt='Furnished' width={30} height={30}/>
            <p className='categoryListingInfoText'>Furnished</p>
            </>
            }
          </div>
          </div>
      </Link>


      {// If owned, allow edit
        onEdit && (
        <EditIcon 
          className='editIcon'
          onClick={() => onEdit(id)}
        />
        )
      }
      {// If owned, allow delete
        onDelete && (
        <DeleteIcon 
          className='removeIcon'
          onClick={() => onDelete(id, name)}
        />
        )
      }

    </li>
  )
}
export default ListingItem