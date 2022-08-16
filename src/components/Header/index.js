import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const onLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  const onHomeButton = () => {
    const {history} = props
    history.push('/')
  }

  const onJobsButton = () => {
    const {history} = props
    history.push('/jobs')
  }

  return (
    <ul className="headerBg">
      <li>
        <Link to="/">
          <button type="button" onClick={onHomeButton} className="button">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="logoImg"
            />
          </button>
        </Link>
      </li>
      <li>
        <div>
          <Link to="/">
            <button
              className="navButton button"
              onClick={onHomeButton}
              type="button"
            >
              Home
            </button>
          </Link>
          <Link to="/jobs">
            <button
              className="navButton button"
              onClick={onJobsButton}
              type="button"
            >
              Jobs
            </button>
          </Link>
        </div>
      </li>
      <li>
        <button
          className="logoutButton button"
          onClick={onLogout}
          type="button"
        >
          Logout
        </button>
      </li>
    </ul>
  )
}

export default withRouter(Header)
