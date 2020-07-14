/**
 * This file defines the Main styles.
 *
 * Use it to define generic component styles (e.g. the default text styles, default button styles...).
 */
import Colors from './Colors'
import { Platform } from 'react-native'

export default {
  button: {
    backgroundColor: Colors.primary,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white
  }
}
