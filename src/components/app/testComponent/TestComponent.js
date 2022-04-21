import {useState} from 'react'
import {flushSync} from 'react-dom'

function TestComponent() {
  const [count, setCount] = useState(0)
  const [flag, setFlag] = useState(false)

  function handleClick() {
    setTimeout(() => {
      flushSync(() => setCount(c => c + 1))
      flushSync(() => setFlag(f => !f))
    }, 100)
  }
  console.log('render')

  return (
    <div>
      <button onClick={handleClick}>Next</button>
      <h1 style={{color: flag ? 'blue' : 'vlack'}}>{count}</h1>
    </div>
  )
}

export default TestComponent