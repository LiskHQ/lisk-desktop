
import app from '../app'

app.filter('timestamp', (timestamp) => {
  return timestamp.fix
})
