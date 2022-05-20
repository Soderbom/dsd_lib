import { Fragment, useState, useEffect } from "react";
import {Link} from "react-router-dom";

const Navbar = ({setAuth}) => {

    const [username, setUsername] = useState("");

    const logOut = (e) => {
        e.preventDefault();
        setAuth(false);
        localStorage.removeItem("token");
    }    

    async function getUserInfo() {
        const jwt = localStorage.token;
        const payload = JSON.parse(atob(jwt.split('.')[1]));
        setUsername(payload.username);
    }

    useEffect(() => {
        getUserInfo();
    }, [username])

    return (
        <Fragment>
            <div className="p-5 bg-lighter-green shadow-xl flex justify-between items-baseline">
                <h2 className="text-cwhite text-4xl">Library: {username}</h2>
                <div>
                    {window.location.pathname === "/warehouse" ? 
                        <Link className="m-2 text-cwhite bg-lighter-green p-3 hover:bg-blueish rounded-md" to="/shelf"><button>Min hylla</button></Link> : 
                        <Link className="m-2 text-cwhite bg-lighter-green p-3 hover:bg-blueish rounded-md" to="/warehouse"><button>Varuhus</button></Link>}
                    <button className="m-2 text-cwhite bg-greyish p-3 hover:bg-blueish rounded-md" onClick={e => logOut(e)}>Logga ut</button>      
                </ div>        
            </div>
        </Fragment>
    );
}

export default Navbar;