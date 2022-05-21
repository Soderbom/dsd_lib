import { Fragment, useEffect, useState } from "react"
import Navbar from "./Navbar";
import ip from "../misc.js";

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
            const response = await fetch(`http://${ip}:5000/get/all`, {
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
            const response = await fetch(`http://${ip}:5000/get/user_loans/${email}`, {
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

            const response = await fetch(`http://${ip}:5000/post/loan_book`, {
                method: "POST",
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

    async function returnBook(book_id) {
        try {
            const body = {email, book_id}

            const response = await fetch(`http://${ip}:5000/delete/return_book`, {
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

    return (
       <Fragment>
           <Navbar setAuth={setAuth} />
           
           {data.length > 1 && 
           <div className="flex justify-center w-screen/2 sm:rounded-lg py-20">
                <div>
                
                    <table className="text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th className="px-6 py-3">Titel</th>
                                <th className="px-6 py-3">Författare</th>
                                <th className="px-6 py-3">Publicerad</th>
                                <th className="px-6 py-3">Antal i lager</th>
                                <th className="px-6 py-3"></th> 
                            </tr>
                        </thead>
                        <tbody >
                            {data.map(d => (
                                <tr className="bg-white border-b" key={d.id}>
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
                    <button className=" bg-lighter-green hover:bg-greyish p-2 rounded-md text-cwhite my-10" onClick={e => getData()}>Uppdatera</button>
                </div>
            </div>
            }
            {data.length === 1 && 
                <div>
                    Oj, något gick fel.
                </div>}
       </Fragment>
    );
}

export default Warehouse;