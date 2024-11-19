const { useState } = React
const { useSelector } = ReactRedux
const { Link, NavLink } = ReactRouterDOM
const { useNavigate } = ReactRouter

import { UserMsg } from './UserMsg.jsx'
import { LoginSignup } from './LoginSignup.jsx'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { login, logout } from '../store/actions/user.actions.js'

export function AppHeader() {
  const navigate = useNavigate()
  const user = useSelector(storeState => storeState.loggedInUser)

  function onLogout() {
    logout()
      .then(() => {
        navigate('/')
        showSuccessMsg('logout successfully')
      })
      .catch(err => {
        showErrorMsg('OOPs try again')
      })
  }

  return (
    <header className="app-header full main-layout">
      <section className="header-container">
        <h1>React Todo App</h1>
        {user ? (
          <section>
            <Link to={`/user/${user._id}`}>
              Hello {user.fullname} Balacne :{user.balance}
            </Link>
            <button onClick={onLogout}>Logout</button>
          </section>
        ) : (
          <section>
            <LoginSignup />
          </section>
        )}
        <nav className="app-nav">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/todo">Todos</NavLink>
          <NavLink to="/dashboard">Dashboard</NavLink>
        </nav>
      </section>
      <UserMsg />
    </header>
  )
}
