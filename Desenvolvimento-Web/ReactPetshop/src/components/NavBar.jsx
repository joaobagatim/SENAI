import { NavLink } from 'react-router-dom'
import petshoplogo from '../assets/img/pet-shop-logo.png'

function NavBar(){
    return(
        <header>
        <nav className="navbar navbar-expand-lg bg-header">
            <div className="container">
              <NavLink className="navbar-brand" to="/">
                <img src={petshoplogo} alt="Pet Shop Logo" className="logo" />
              </NavLink>
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ms-auto">
                  <li className="nav-item">
                    <NavLink className="nav-link active" aria-current="page" to="/">Home</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/banho-e-tosa">Banho e Tosa</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/hotel-resort">Hotel Resort</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/adestramento">Adestramento</NavLink>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#contato">Contato</a>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
    </header>
    )
}

export default NavBar