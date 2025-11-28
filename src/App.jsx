import './App.css'
import NavBar from './components/NavBar'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import { BrowserRouter, Route, Routes} from 'react-router-dom'
import Home from './pages/Home'
import BanhoETosa from './pages/BanhoETosa'
import Adestramento from './pages/Adestramento'
import HotelResort from './pages/HotelResort'


function App() {


  return (
    <BrowserRouter>
    <header>
      <div className="container-fluid">
        <NavBar />
      </div>
    </header>

    <main>
      <Routes>
        <Route path='/' element={ <Home /> }/>
        <Route path='/banho-e-tosa' element={ <BanhoETosa /> }/>
        <Route path='/adestramento' element={ <Adestramento /> }/>
        <Route path='/hotel-resort' element={ <HotelResort /> }/>
      </Routes>
    </main>

    <footer></footer>
    </BrowserRouter>
  )
}

export default App
