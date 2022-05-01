import { Fragment, useEffect, useState } from "react"
import Navbar from "./Navbar";

const Warehouse = (props) => {
    
    const [data, setData] = useState([{
        id: null,
        title: "",
        author: "",
        published: null,
        stock: null,
        coverurl: "",
    }]);

    const [userLoaned, setUserLoaned] = useState([]);

    const signedIn = true;

    async function getData() {
        try {
            const response = await fetch("http://localhost:5000/get/all", {
                method: "GET",
            });
            
            const parseRes = await response.json();
            setData(parseRes);
            
        } catch (err) {
            console.error(err.message);
        }
    }

    function addToLoan(e) {
        setUserLoaned([...userLoaned, e])
    }

    function removeFromLoan(e) {
        let old = userLoaned;
        const index = old.indexOf(e);
        old.splice(index,1);      
        setUserLoaned([...old])
    }

    useEffect(() => {
        getData();
    }, []);

    return (
       <Fragment>
           <Navbar signedIn={signedIn} />
           <div>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Published</th>
                            <th>Action</th> 
                        </tr>
                    </thead>
                    <tbody >
                        { data.map(d => (
                            <tr key={d.id}>
                                <td>{d.id}</td>
                                <td>{d.title}</td>
                                <td>{d.author}</td>
                                <td>{d.published}</td>
                                <td>{ userLoaned.includes(d.id) ? <button className="w-16 bg-green-700 hover:bg-green-500 p-2 rounded-md" onClick={e => removeFromLoan(d.id)}>Åter</button> :
                                    <button className="w-16 bg-green-500 hover:bg-green-300 p-2 rounded-md" onClick={e => addToLoan(d.id)}>Låna</button>
                                    }</td>
                            </tr>
                        ))}
                    </tbody>
                </table> 
            </div>
       </Fragment>
    );
}

export default Warehouse;