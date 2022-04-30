import { Fragment } from "react"
import Navbar from "./Navbar";

const Warehouse = () => {

    const signedIn = true;

    return (
       <Fragment>
           <Navbar signedIn={signedIn} />
           <h1>WAREHOUSE</h1>
       </Fragment>
    );
}

export default Warehouse;