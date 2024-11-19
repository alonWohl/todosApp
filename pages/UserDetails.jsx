const { useSelector, useDispatch } = ReactRedux
import { showSuccessMsg } from '../services/event-bus.service.js'
import { updateUser } from '../store/actions/user.actions.js'

export function UserDetails() {
  const user = useSelector(state => state.loggedInUser)
  const dispatch = useDispatch()

  function onSave(ev) {
    ev.preventDefault()
    const userToUpdate = {
      fullname: user.fullname,
      prefs: user.prefs
    }
    updateUser(userToUpdate).then(() => {
      showSuccessMsg('Settings saved')
    })
  }

  function handlePrefChange({ target }) {
    const field = target.name
    const value = target.value

    dispatch({
      type: 'SET_USER',
      user: {
        ...user,
        prefs: {
          ...user.prefs,
          [field]: value
        }
      }
    })
  }

  function handleChange({ target }) {
    const field = target.name
    const value = target.value

    dispatch({
      type: 'SET_USER',
      user: {
        ...user,
        [field]: value
      }
    })
  }

  function getActivityTimeAgo(at) {
    const now = Date.now()
    const diff = now - at

    if (diff < 60000) return 'Just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`
    return `${Math.floor(diff / 86400000)} days ago`
  }

  if (!user) return <section>User not found.</section>

  return (
    <section style={{ color: user.prefs.color, backgroundColor: user.prefs.bgColor }}>
      <h2>User Details</h2>
      <form onSubmit={onSave}>
        <div>
          <label>
            Full Name:
            <input type="text" name="fullname" value={user.fullname} onChange={handleChange} placeholder="Enter your full name" />
          </label>
        </div>
        <fieldset>
          <legend>Preferences</legend>
          <label>
            Text Color:
            <input type="color" name="color" value={user.prefs.color || '#000000'} onChange={handlePrefChange} />
          </label>
          <label>
            Background Color:
            <input type="color" name="bgColor" value={user.prefs.bgColor || '#ffffff'} onChange={handlePrefChange} />
          </label>
        </fieldset>
        <button type="submit">Save</button>
      </form>
      <section>
        <h3>Activities</h3>
        <ul>
          {user.activities.map((activity, idx) => (
            <li key={idx}>
              {getActivityTimeAgo(activity.at)}: {activity.txt}
            </li>
          ))}
        </ul>
      </section>
    </section>
  )
}
