import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import JobCard from '../JobCard'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  progress: 'PROGRESS',
  success: 'SUCCESS',
  noJobs: 'NO_JOBS',
  failure: 'FAILURE',
}

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

class Jobs extends Component {
  state = {
    isProfileLoaded: apiStatusConstants.initial,
    isJobsLoaded: apiStatusConstants.initial,
    profileDetails: {},
    jobsList: [],
    searchValue: '',
    jobTypesList: [],
    packageFilter: '',
  }

  componentDidMount() {
    this.getProfile()
    this.getJobs()
  }

  getOptions = () => {
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    return options
  }

  getProfile = async () => {
    this.setState({isProfileLoaded: apiStatusConstants.progress})
    const profileApiUrl = 'https://apis.ccbp.in/profile'
    const options = this.getOptions()
    const response = await fetch(profileApiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const profileDetails = data.profile_details
      const updatedProfileDetails = {
        name: profileDetails.name,
        profileImageUrl: profileDetails.profile_image_url,
        shortBio: profileDetails.short_bio,
      }
      this.setState({
        profileDetails: updatedProfileDetails,
        isProfileLoaded: true,
      })
    } else {
      this.setState({isProfileLoaded: false})
    }
  }

  getJobs = async () => {
    this.setState({isJobsLoaded: apiStatusConstants.progress})
    const {searchValue, jobTypesList, packageFilter} = this.state
    const jobsApiUrl = `https://apis.ccbp.in/jobs?employment_type=${jobTypesList.join(
      ',',
    )}&minimum_package=${packageFilter}&search=${searchValue}`
    const options = this.getOptions()
    const response = await fetch(jobsApiUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()

      const updatedData = fetchedData.jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))
      if (updatedData.length === 0) {
        this.setState({
          jobsList: updatedData,
          isJobsLoaded: apiStatusConstants.noJobs,
        })
      } else {
        this.setState({
          jobsList: updatedData,
          isJobsLoaded: apiStatusConstants.success,
        })
      }
    } else {
      this.setState({isJobsLoaded: apiStatusConstants.failure})
    }
  }

  addOrRemoveItem = (jobTypesList, jobType) =>
    jobTypesList.includes(jobType)
      ? jobTypesList.pop(jobType)
      : jobTypesList.push(jobType)

  onJobType = event => {
    const {jobTypesList} = this.state
    const jobType = event.target.value
    this.addOrRemoveItem(jobTypesList, jobType)
    this.setState({jobTypesList}, this.getJobs)
  }

  onSalaryItem = event => {
    this.setState({packageFilter: event.target.value}, this.getJobs)
  }

  onChangeSearchInput = event => {
    this.setState({searchValue: event.target.value})
  }

  onClickSearchBtn = () => {
    this.getJobs()
  }

  onRetryProfile = () => {
    this.getProfile()
  }

  onRetry = () => {
    this.getJobs()
  }

  renderProfileView = () => {
    const {profileDetails} = this.state
    const {profileImageUrl, name, shortBio} = profileDetails

    return (
      <div className="profileDiv">
        <img src={profileImageUrl} alt="profile" className="profileImg" />
        <h1 className="profileName">{name}</h1>
        <p className="profileBio">{shortBio}</p>
      </div>
    )
  }

  renderProfileFailureView = () => (
    <div className="profileFailureDiv">
      <button
        type="button"
        onClick={this.onRetryProfile}
        className="retryButton"
      >
        Retry
      </button>
    </div>
  )

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

  renderNoJobsView = () => (
    <div className="noJobsDiv">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png "
        className="jobFailureImg"
        alt="no jobs"
      />
      <h1>No Jobs Found</h1>
      <p className="jobsFailureP">
        We could not find any jobs. Try other filters.
      </p>
    </div>
  )

  renderJobsSuccessView = () => {
    const {jobsList} = this.state
    return (
      <ul>
        {jobsList.map(each => (
          <li key={each.id}>
            <JobCard key={each.id} jobData={each} />
          </li>
        ))}
      </ul>
    )
  }

  render() {
    const {isProfileLoaded, searchValue, isJobsLoaded} = this.state

    const renderJobsView = () => {
      switch (isJobsLoaded) {
        case apiStatusConstants.progress:
          return this.renderLoaderView()
        case apiStatusConstants.success:
          return this.renderJobsSuccessView()
        case apiStatusConstants.noJobs:
          return this.renderNoJobsView()
        case apiStatusConstants.failure:
          return this.renderJobsFailureView()
        default:
          return this.renderLoaderView()
      }
    }
    return (
      <div>
        <Header />
        <div className="jobsMain">
          <div className="leftDiv">
            {isProfileLoaded
              ? this.renderProfileView()
              : this.renderProfileFailureView()}
            <hr />
            <div className="jobTypesDiv">
              <h1 className="typesHead">Type of Employment</h1>
              <ul>
                {employmentTypesList.map(each => (
                  <li key={each.label} className="checkBoxDiv">
                    <input
                      type="checkbox"
                      id={each.employmentTypeId}
                      name={each.employmentTypeId}
                      value={each.employmentTypeId}
                      className="checkBox"
                      onClick={this.onJobType}
                    />
                    <label htmlFor={each.employmentTypeId}>{each.label}</label>
                  </li>
                ))}
              </ul>
            </div>
            <hr />
            <div className="jobTypesDiv">
              <h1 className="typesHead">Salary Range</h1>
              <ul>
                {salaryRangesList.map(each => (
                  <li key={each.salaryRangeId} className="checkBoxDiv">
                    <input
                      type="radio"
                      id={each.label}
                      name="salaryRange"
                      value={each.salaryRangeId}
                      className="checkBox"
                      onChange={this.onSalaryItem}
                    />
                    <label htmlFor={each.label}>{each.label}</label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="rightDiv">
            <div className="searchDiv">
              <input
                type="search"
                placeholder="Search"
                className="inputSearch"
                value={searchValue}
                onChange={this.onChangeSearchInput}
              />
              <button
                type="button"
                className="searchButton"
                testid="searchButton"
                onClick={this.onClickSearchBtn}
              >
                <BsSearch />
              </button>
            </div>
            {renderJobsView()}
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
