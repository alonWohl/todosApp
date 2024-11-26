const { useState, useEffect } = React
const { useNavigate } = ReactRouterDOM
const { useSelector } = ReactRedux
import { ActivityList } from '../cmps/ActivityList.jsx'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { updateUser } from '../store/actions/user.actions.js'

export function UserDetails() {
  const loggedInUser = useSelector(storeState => storeState.userModule.user)
  const [userDetails, setUserDetails] = useState(null)
  const navigate = useNavigate()
  console.log(loggedInUser)

  useEffect(() => {
    if (loggedInUser) loadUser()
  }, [])

  function loadUser() {
    setUserDetails({
      fullname: loggedInUser.fullname || '',
      color: loggedInUser.pref.color || '#eeeeee',
      bgColor: loggedInUser.pref.bgColor || '#191919',
      activities: loggedInUser.activities || []
    })
  }

  function onEditUser(ev) {
    ev.preventDefault()
    const userToUpdate = {
      fullname: userDetails.fullname,
      pref: { color: userDetails.color, bgColor: userDetails.bgColor }
    }
    updateUser(userToUpdate)
      .then(() => {
        showSuccessMsg('User updated successfully!')
      })
      .catch(err => {
        console.error('Cannot update user:', err)
        showErrorMsg('Cannot update user')
      })
  }

  function handleChange({ target }) {
    const field = target.name
    let value = target.value

    switch (target.type) {
      case 'number':
      case 'range':
        value = +value || ''
        break

      case 'checkbox':
        value = target.checked
        break
    }
    setUserDetails(prevUser => ({ ...prevUser, [field]: value }))
  }

  if (!loggedInUser || !userDetails) return <div>No user</div>
  const { activities } = userDetails
  return (
    <div className="container">
      <h1>Profile</h1>
      <form className="activities-form" onSubmit={onEditUser}>
        <label htmlFor="fullname">Name:</label>
        <input type="text" id="fullname" name="fullname" value={userDetails.fullname} onChange={handleChange} />
        <label htmlFor="name">Color:</label>
        <input type="color" name="color" value={userDetails.color} onChange={handleChange} />
        <label htmlFor="name">BG Color:</label>
        <input type="color" name="bgColor" value={userDetails.bgColor} onChange={handleChange} />
        <button type="submit">save</button>
      </form>

      {activities && <ActivityList activities={activities} />}
    </div>
  )
}
