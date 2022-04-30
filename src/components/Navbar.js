import { Fragment } from "react";

const Navbar = (props) => {

    return (
        <Fragment>
            <div className="p-5 bg-green-600 shadow-xl flex justify-between items-baseline">
                <h2 className="text-white text-4xl">Library</h2>
                
                {!props.signedIn && <div>
                    <button className="m-2 text-white bg-green-800 p-3 hover:bg-green-700 rounded-md">Login</button>
                    <button className="text-white bg-green-800 p-3 hover:bg-green-700 rounded-md">Register</button>
                </div>}
                {props.signedIn && <div>
                    <button className="m-2 text-white bg-green-800 p-3 hover:bg-green-700 rounded-md">Sign out</button>
                </div>}
                
                
            </div>
        </Fragment>
    );
}

export default Navbar;