import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {RiExternalLinkLine} from 'react-icons/ri'
import Loader from 'react-loader-spinner'
import {Component} from 'react'
import Cookies from 'js-cookie'
import Header from '../Header'
import SimilarJobCard from '../SimilarJobCard'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  progress: 'PROGRESS',
  success: 'SUCCESS',
  noJobs: 'NO_JOBS',
  failure: 'FAILURE',
}

class JobItemDetails extends Component {
  state = {
    jobDetailsData: {},
    lifeAtCompany: {},
    jobSkills: [],
    similarJobs: [],
    isPageLoaded: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({isPageLoaded: apiStatusConstants.progress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jobUrl = `https://apis.ccbp.in/jobs/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(jobUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const jobDetails = data.job_details
      const updatedJobDetails = {
        companyLogoUrl: jobDetails.company_logo_url,
        companyWebsiteUrl: jobDetails.company_website_url,
        employmentType: jobDetails.employment_type,
        id: jobDetails.id,
        jobDescription: jobDetails.job_description,
        lifeAtCompany: {
          description: jobDetails.life_at_company.description,
          imageUrl: jobDetails.life_at_company.image_url,
        },

        location: jobDetails.location,
        packagePerAnnum: jobDetails.package_per_annum,
        skills: jobDetails.skills.map(each => ({
          imageUrl: each.image_url,
          name: each.name,
        })),
        rating: jobDetails.rating,
        title: jobDetails.title,
      }
      const similarJobs = data.similar_jobs
      const updatedSimilarJobs = similarJobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        rating: each.rating,
        title: each.title,
      }))
      const {skills} = updatedJobDetails
      const {lifeAtCompany} = updatedJobDetails
      this.setState({
        jobDetailsData: updatedJobDetails,
        jobSkills: skills,
        lifeAtCompany,
        similarJobs: updatedSimilarJobs,
        isPageLoaded: apiStatusConstants.success,
      })
    } else {
      this.setState({isPageLoaded: apiStatusConstants.failure})
    }
  }

  onRetry = () => {
    this.getJobDetails()
  }

  renderJobsFailureView = () => (
    <div className="jobsFailureDiv">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        className="jobFailureImg"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p className="jobsFailureP">
        We cannot seem to find the page you are looking for.
      </p>
      <button type="button" onClick={this.onRetry} className="retryButton">
        Retry
      </button>
    </div>
  )

  renderLoaderView = () => (
    <div className="loaderDiv" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  render() {
    const {
      jobDetailsData,
      jobSkills,
      isPageLoaded,
      lifeAtCompany,
      similarJobs,
    } = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
    } = jobDetailsData
    const {description, imageUrl} = lifeAtCompany

    const renderJobDetailsView = () => (
      <>
        <div className="jobCardDiv">
          <div className="jobTitleDiv">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
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
            <p>{packagePerAnnum}</p>
          </div>
          <hr className="jobCardHr" />
          <div className="desHead">
            <h1>Description</h1>
            <a className="visitTag" href={companyWebsiteUrl}>
              Visit <RiExternalLinkLine />
            </a>
          </div>

          <p className="jobDes">{jobDescription}</p>
          <h1>Skills</h1>
          <ul className="skillsDiv">
            {jobSkills.map(each => (
              <li key={each.name} className="eachSkill">
                <img className="skillImg" src={each.imageUrl} alt={each.name} />
                <p className="skillName">{each.name}</p>
              </li>
            ))}
          </ul>
          <div className="lifeAtCompany">
            <h1>Life at Company</h1>
            <div className="companyLifeDesDiv">
              <p className="jobDes">{description}</p>
              <img src={imageUrl} alt="life at company" />
            </div>
          </div>
        </div>
        <h1 className="similarJobsH1">Similar Jobs</h1>
        <ul className="similarJobsDiv">
          {similarJobs.map(each => (
            <SimilarJobCard key={each.id} jobDetails={each} />
          ))}
        </ul>
      </>
    )

    const renderItemDetailsView = () => {
      switch (isPageLoaded) {
        case apiStatusConstants.progress:
          return this.renderLoaderView()
        case apiStatusConstants.success:
          return renderJobDetailsView()
        case apiStatusConstants.failure:
          return this.renderJobsFailureView()
        default:
          return null
      }
    }

    return (
      <>
        <Header />
        <div className="jobItemDiv">{renderItemDetailsView()}</div>
      </>
    )
  }
}

export default JobItemDetails
