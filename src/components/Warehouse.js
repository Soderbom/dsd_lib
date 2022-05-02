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
    const [email, setEmail] = useState("");

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

    function getBookIdArray(books) {        
        return books.map(book => book.id);        
    }


    async function getUserLoans() {
        try {
            const response = await fetch(`http://localhost:5000/get/user_loans/${email}`, {
                method: "GET"
            });
            const parseRes = await response.json();
            const idArray = getBookIdArray(parseRes);
            setUserLoaned([...idArray]);        
            
        } catch (err) {
            console.error(err.message);
        }
    }

    async function addToLoan(book_id) {
        try {
            const body = {email, book_id}

            const response = await fetch("http://localhost:5000/post/loan_book", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body)
            });
            
            const parseRes = await response.json();
            const idArray = getBookIdArray(parseRes);
            setUserLoaned([...idArray]);  
            
        } catch (err) {
            console.error(err.message);
        }
    }

    async function returnBook(book_id) {
        try {
            const body = {email, book_id}

            const response = await fetch("http://localhost:5000/delete/return_book", {
                method: "DELETE",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body)
            });
            
            const parseRes = await response.json();
            const idArray = getBookIdArray(parseRes);
            setUserLoaned([...idArray]);  
            
        } catch (err) {
            console.error(err.message);
        }
    }

    useEffect(() => {
        // TODO implement fetching of email
        setEmail("a");
        getData();
        getUserLoans();
    }, []);

    return (
       <Fragment>
           <Navbar signedIn={signedIn} />
           {data.length > 1 && <div>
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
                        {data.map(d => (
                             <tr key={d.id}>
                                <td>{d.id}</td>
                                <td>{d.title}</td>
                                <td>{d.author}</td>
                                <td>{d.published}</td>
                                <td>{ userLoaned.includes(d.id) ? <button className="w-16 bg-green-700 hover:bg-green-500 p-2 rounded-md" onClick={e => returnBook(d.id)}>Åter</button> :
                                    <button className="w-16 bg-green-500 hover:bg-green-300 p-2 rounded-md" onClick={e => addToLoan(d.id)}>Låna</button>
                                    }</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            }
            {data.length === 1 && 
                <div>
                    Ooops something went wrong.
                </div>}
       </Fragment>
    );
}

export default Warehouse;