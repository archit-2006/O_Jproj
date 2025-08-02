import { BrowserRouter,Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import './App.css';
import Login from '../Pages/Log-in';
import Home from '../Pages/Home';
import Register from '../Pages/Register';

function App() {
  const [count, setCount] = useState(0)

  return <BrowserRouter>
  <Routes>
    <Route path='/' element={<Home />}/>
    <Route path='/login' element={<Login />}/>
    <Route path='/register' element={<Register />}/>
    {/* <Route path='/' element={<Home />}/> */}
  </Routes>
  </BrowserRouter>
}

export default App
