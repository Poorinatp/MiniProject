import { NavLink } from "react-router-dom"

function Design() {
    
    return(
        <div>
            <nav>
            <NavLink to="/">Home</NavLink>
			<NavLink to="/">Catalog</NavLink>
		</nav>
            <h1>Design</h1>
        </div>
    )
}

export default Design