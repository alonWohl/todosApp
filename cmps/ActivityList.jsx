import { utilService } from '../services/util.service.js'

export function ActivityList({ activities }) {
  function getActivityTime(activity) {
    return utilService.getFormattedTime(activity.at)
  }

  return (
    <ul className="activities-list clean-list">
      {activities.map((activity, idx) => (
        <li key={activity.at}>
          {getActivityTime(activity)}
          {activity.txt}
        </li>
      ))}
    </ul>
  )
}
