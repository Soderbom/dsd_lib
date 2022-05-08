import { Fragment } from "react";

const Navbar = ({setAuth}) => {

    const logOut = (e) => {
        e.preventDefault();
        setAuth(false);
        localStorage.removeItem("token");
    }    

    return (
        <Fragment>
            <div className="p-5 bg-lighter-green shadow-xl flex justify-between items-baseline">
                <h2 className="text-cwhite text-4xl">Library</h2>
                <button className="m-2 text-cwhite bg-greyish p-3 hover:bg-blueish rounded-md" onClick={e => logOut(e)}>Sign out</button>              
            </div>
        </Fragment>
    );
}

export default Navbar;