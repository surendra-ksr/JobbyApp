import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {Link} from 'react-router-dom'
import './index.css'

const JobCard = props => {
  const {jobData} = props
  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = jobData

  return (
    <Link to={`/jobs/${id}`} className="linkItem">
      <div className="jobCardDiv">
        <div className="jobTitleDiv">
          <img
            src={companyLogoUrl}
            alt="company logo"
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
          <h1>{packagePerAnnum}</h1>
        </div>
        <hr className="jobCardHr" />
        <h1>Description</h1>
        <p>{jobDescription}</p>
      </div>
    </Link>
  )
}

export default JobCard
