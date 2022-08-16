import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {Link} from 'react-router-dom'
import './index.css'

const SimilarJobCard = props => {
  const {jobDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    rating,
    title,
  } = jobDetails

  return (
    <Link to={`/jobs/${id}`} className="linkItem">
      <div className="jobCardDiv similarDiv">
        <div className="jobTitleDiv">
          <img
            src={companyLogoUrl}
            alt="similar job company logo"
            className="companyLogo"
          />
          <div className="jobTitleRightDiv">
            <h1>{title}</h1>
            <div className="jobRatingDiv">
              <AiFillStar className="ratingStar" />
              <p className="ratingH1">{rating}</p>
            </div>
          </div>
        </div>
        <h1>Description</h1>
        <p>{jobDescription}</p>
        <div className="locationSalaryDiv">
          <div className="locationType">
            <div className="locationDiv">
              <MdLocationOn className="locationIcon" />
              <p>{location}</p>
            </div>
            <div className="locationDiv">
              <BsFillBriefcaseFill className="locationIcon" />
              <p>{employmentType}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default SimilarJobCard
