import { Link } from "react-router-dom";
import { useAuth } from "./Security/authContext";

export default function HeaderComponent() {

    const authContext = useAuth()

    const isAuthenticated = authContext.isAuthenticated
    
    function logout()
    {
        authContext.logout()        
    }

    return(
        
        <header className="border-bottom border-light border-5 p-2 ">
        <div className="container-fluid"
            style={{ marginLeft: "240px" }}
        >
            <div className="row">
                <nav className="navbar navbar-expand-lg">
                    {/* Toggle Button */}

                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarMenu"
                        aria-controls="navbarMenu"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                        >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    {/* <a className="navbar-brand ms-2 fs-2 fw-bold text-black" href="https://www.in28minutes.com">in28minutes</a> */}
                    <div className="collapse navbar-collapse" id="navbarMenu">
                        <ul className="navbar-nav">
                         
                        {isAuthenticated && <li className="nav-item fs-5">                          
                             <Link className="nav-link" to="/viewcompanies">Companies</Link>
                        </li> }
                        
                        {isAuthenticated && <li className="nav-item fs-5">                           
                             <Link className="nav-link" to="/viewdesignations">Designations</Link>
                        </li> }
                        
                        {isAuthenticated && <li className="nav-item fs-5">                           
                             <Link className="nav-link" to="/viewassettypes">View Asset Types</Link>
                        </li> }
                        
                         {isAuthenticated && <li className="nav-item fs-5">                           
                             <Link className="nav-link" to="/viewassets">View Assets </Link>
                        </li> }
                        
                         {isAuthenticated && <li className="nav-item fs-5">                           
                             <Link className="nav-link" to="/viewdepartments">View Departments </Link>
                        </li> }

                         {isAuthenticated && <li className="nav-item fs-5">                           
                             <Link className="nav-link" to="/viewemployees">View Employees </Link>
                        </li> }
                        {!isAuthenticated && <li className="nav-item fs-5">                           
                             <Link className="nav-link" to="/login">Login</Link>
                        </li> }
                        {isAuthenticated && <li className="nav-item fs-5">                           
                             <Link className="nav-link" to="/login" onClick={logout}>Logout</Link>
                        </li> }
                      </ul>
                    </div>                   
                </nav>
            </div>
        </div>
    </header>
       
    )
}