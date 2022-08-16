import Cookies from 'js-cookie'
import {Redirect, Link} from 'react-router-dom'

import Header from '../Header'
import './index.css'

const Home = props => {
  const jwtToken = Cookies.get('jwt_token')
  if (jwtToken === undefined) {
    return <Redirect to="/login" />
  }

  return (
    <>
      <Header />
      <div className="homeBg">
        <h1 className="homeH1">Find The Job That Fits Your Life</h1>
        <p className="homeDescription">
          Millions of people are searching for jobs, salary information, company
          reviews. Find the job that fits your abilities and potential.
        </p>
        <Link to="/jobs">
          <button type="button" className="findJobsButton button">
            Find Jobs
          </button>
        </Link>
      </div>
    </>
  )
}

export default Home
