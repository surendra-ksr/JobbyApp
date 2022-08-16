import Header from '../Header'
import './index.css'

const NotFound = () => (
  <>
    <Header />
    <div className="NotFoundDiv">
      <img
        className="notFoundImg"
        src="https://assets.ccbp.in/frontend/react-js/jobby-app-not-found-img.png"
        alt="not found"
      />
      <h1 className="notFoundH1">Page Not Found</h1>
      <p className="notFoundP">
        we're sorry, the page you requested could not be found
      </p>
    </div>
  </>
)

export default NotFound
