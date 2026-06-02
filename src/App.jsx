import { useState } from 'react'
import AboutUs from './views/about'

function App() {
  const [count, setCount] = useState(0)

  return (
    <AboutUs/>
  )
}

export default App
