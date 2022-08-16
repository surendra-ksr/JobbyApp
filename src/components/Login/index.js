import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {username: '', password: '', showErrorMsg: false, errorMsg: ''}

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitFailure = errorMsg => {
    this.setState({showErrorMsg: true, errorMsg})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const {username, password, showErrorMsg, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="loginMain">
        <form className="formDiv" onSubmit={this.onSubmitForm}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="formLogo"
          />
          <div className="inputDiv">
            <label htmlFor="username">USERNAME</label>
            <input
              id="username"
              placeholder="Username"
              onChange={this.onChangeUsername}
              value={username}
              type="text"
            />
          </div>
          <div className="inputDiv">
            <label htmlFor="password">PASSWORD</label>
            <input
              id="password"
              onChange={this.onChangePassword}
              placeholder="Password"
              value={password}
              type="password"
            />
          </div>
          <button type="submit" className="loginButton button">
            Login
          </button>
          {showErrorMsg && <p className="errorMsg">*{errorMsg}</p>}
        </form>
        <div className="loginDetailsDiv">
          <p>username: "rahul"</p>
          <p>password: "rahul@2021"</p>
        </div>
      </div>
    )
  }
}

export default Login
