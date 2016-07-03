
import app from '../app'

app.filter('lsk', (lsk) => {
  return lsk.normalize
})
