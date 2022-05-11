import { Fragment, useEffect, useState } from "react"
import Navbar from "./Navbar";

const Warehouse = ({setAuth}) => {
    
    const [data, setData] = useState([{
        id: null,
        title: "",
        author: "",
        published: null,
        stock: null,
        coverurl: ""
    }]);

    const [userLoaned, setUserLoaned] = useState([]);
    const [email, setEmail] = useState("");

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

    async function getUserInfo() {
        const jwt = localStorage.token;
        const payload = JSON.parse(atob(jwt.split('.')[1]));
        setEmail(payload.email);
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
            console.log(parseRes);
            setUserLoaned(idArray); 
            getData();
            
            
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
            setUserLoaned(idArray);
            getData();
            
            
        } catch (err) {
            console.error(err.message);
        }
    }

    useEffect(() => {
        getUserInfo();        
        getData();
        getUserLoans();        
    }, [email]);

    useEffect(() => {
        console.log(userLoaned)
    })

    return (
       <Fragment>
           <Navbar setAuth={setAuth} />
           {data.length > 1 && <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th className="px-6 py-3">ID</th>
                            <th className="px-6 py-3">Title</th>
                            <th className="px-6 py-3">Author</th>
                            <th className="px-6 py-3">Published</th>
                            <th className="px-6 py-3">In stock</th>
                            <th className="px-6 py-3">Action</th> 
                        </tr>
                    </thead>
                    <tbody >
                        {data.map(d => (
                             <tr className="bg-white border-b hover:bg-cwhite" key={d.id}>
                                <td className="px-6 py-4">{d.id}</td>
                                <td className="px-6 py-4">{d.title}</td>
                                <td className="px-6 py-4">{d.author}</td>
                                <td className="px-6 py-4">{d.published}</td>
                                <td className="px-6 py-4">{d.stock}</td>
                                <td className="px-6 py-4">{ userLoaned.includes(d.id) ? 
                                    <button className="w-16 bg-darker-green hover:bg-greyish p-2 rounded-md text-cwhite" onClick={e => returnBook(d.id)}>Åter</button> :
                                    <button className="w-16 bg-lighter-green hover:bg-greyish p-2 rounded-md text-cwhite" onClick={e => addToLoan(d.id)}>Låna</button>
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