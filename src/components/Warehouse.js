//ReactJS är ett JavaScript-bibliotek med öppen källkod som används för att bygga användargränssnitt och hantera vylager för webb och mobil applikationer.
import { Fragment, useEffect, useState } from "react"

// Ett vanligt mönster i React är att en komponent returnerar flera element. Fragment låter dig gruppera en lista med barn utan att lägga till extra noder till DOM
//React useState Hook låter oss spåra tillstånd i en funktionskomponent. State hänvisar i allmänhet till data eller egenskaper som måste spåras i en applikation.
import Navbar from "./Navbar";
import ip from "../misc.js";

// en Arrow Function Expression som registrerar ny användare. Funktionen kommer att ta hand om uppdatering av sidan efter varje ändring. 
// setAuth ser till att en autentiserade användaren är inloggad.
const Warehouse = ({setAuth}) => {
    
    const [data, setData] = useState([{
        id: null,
        title: "",
        author: "",
        published: null,
        stock: null,
        coverurl: ""
    }]);
// Funktionen setState används för att uppdatera tillståndet, användarens info. Den accepterar ett nytt tillståndsvärde och köar en omrendering av komponenten.
    const [userLoaned, setUserLoaned] = useState([]);
    const [email, setEmail] = useState("");

// en asynkron funktion för att få info om alla böcker som funns i databasen.
    async function getData() {
        try {
            // här kontaktas API:n för att få info i biblioteket.  
            const response = await fetch(`http://${ip}:5000/get/all`, {
                method: "GET",
            });
            // här konverteras användarens info från ett javascript objekt till en JSON-sträng
            const parseRes = await response.json();
            setData(parseRes);
            
        } catch (err) {
            console.error(err.message);
        }
    }

    function getBookIdArray(books) {        
        return books.map(book => book.id);        
    }

    // funkionen tar fram lånelistan för en specifik användare.
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
// funkionen tar fram info om en specifik användare från den lokala JWT.
    async function getUserInfo() {
        const jwt = localStorage.token;
        // En JWT består av tre delar, den andra delen håller den information som har lagrats vid skapandet av token. Först måste base64 encodingen översättas.
        const payload = JSON.parse(atob(jwt.split('.')[1]));
        setEmail(payload.email);
    }
// funkionen ser till att böckerna ska läggas till låntagres sida samtidigt som infon tas bort från biliotekets sidan (genom stored procedures).
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
// en funkion som möjliggör att användaren kan lämna tillbaka böcker.
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
// useEffect körs då variabeln "email" ändras. Detta sker t ex då användaren loggar in. Utan kopplingen till email kommer sidan endast visa en cache:ad version.
// När useEffect körs andropas funktioner för att hämta data från databasen om tillgängliga böcker och nuvarande användarens lån.
    useEffect(() => {
        getUserInfo();        
        getData();
        getUserLoans();        
    }, [email]);

    return (
       <Fragment>
           <Navbar setAuth={setAuth} />
           {/* Visa endast listan om det finns böcker tillgängliga, annars visas ett felmeddelande*/}
           {data.length > 1 && 
           <div className="flex justify-center w-screen/2  py-20">
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
                                    {/* Om användaren redan har lånat boken visas en annan knapp och en tredje inaktiv knapp om den är slut i lager*/}
                                    <td className="px-6 py-4">{ userLoaned.includes(d.id) ? 
                                        <button className="w-16 bg-darker-green hover:bg-greyish p-2 rounded-md text-cwhite" onClick={e => returnBook(d.id)}>Åter</button> :
                                        d.stock > 0 ? <button className="w-16 bg-lighter-green hover:bg-greyish p-2 rounded-md text-cwhite" onClick={e => addToLoan(d.id)}>Låna</button> :
                                        <button className="w-16 bg-warning-red p-2 rounded-md text-cwhite">-</button>
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
                <div className="flex justify-center w-screen/2 py-20">
                    Oj, något gick fel.
                </div>}
       </Fragment>
    );
}

export default Warehouse;