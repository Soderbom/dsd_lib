import { Fragment, useState, useEffect } from "react"
import Navbar from "./Navbar";
import {Link} from "react-router-dom";

const Shelf = ({setAuth}) => {
    
    const [data, setData] = useState([{
        id: null,
        title: "",
        author: "",
        published: null,
        stock: null,
        coverurl: ""
    }]);

    const [email, setEmail] = useState("");

    async function getUserLoans() {
        try {
            const response = await fetch(`http://localhost:5000/get/user_loans/${email}`, {
                method: "GET"
            });
            const parseRes = await response.json();
            setData([...parseRes]);   
            
        } catch (err) {
            console.error(err.message);
        }
    }

    async function getUserInfo() {
        const jwt = localStorage.token;
        const payload = JSON.parse(atob(jwt.split('.')[1]));
        setEmail(payload.email);
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
            setData(parseRes);
            getUserLoans();
            
            
        } catch (err) {
            console.error(err.message);
        }
    }

    useEffect(() => {
        getUserInfo();       
        getUserLoans();
    }, [email]);

    return (
       <Fragment>
           <Navbar setAuth={setAuth} />
           <div className="flex flex-wrap justify-center">
            {data.length >= 1 && <div className="flex flex-wrap justify-right w-screen/2 h-full m-20">
                    
                            {data.map(d => (
                                <div class="max-w-sm lg:max-w-full lg:flex flex m-5">
                                    <div class=" flex-none text-center">
                                        <img src={d.coverurl} />
                                    </div>
                                    <div class="p-4 flex flex-col justify-between leading-normal">
                                            <div class="">
                                                    {d.published} 
                                                    <button className="mx-5 w-10 bg-lighter-green hover:bg-greyish p-2 rounded-full font-bold text-cwhite" onClick={e => returnBook(d.id)}>X</button>                           
                                                    <div class="text-darker-green font-bold text-xl mb-2">{d.title}</div>
                                                    <p class="text-lighter-green text-base">{d.author}</p>                                                 
                                            </div>
                                        
                                    </div>
                            </div>
                            ))}
                        
                </div>}
            {data.length === 0 && 
                <div className="flex justify-center w-screen/2 p-20">
                    Du har inga lånade böcker
                </div>}
            </div>
       </Fragment>
    );
}

export default Shelf;