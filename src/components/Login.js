import { Fragment, useState} from "react";
import {Link} from "react-router-dom";
import ip from "../misc.js";

const Login = ({setAuth}) => {

    // useState för att uppdatera sidan och behålla användarens inloggningsuppgifter
    const [inputs, setInput] = useState(
        {
            email: "",
            password: "",
        }
    ); 

    const [errorMessage, setErrorMessage] = useState();

    const { email, password } = inputs;
    
    // Uppdatera fälten då de ändras
    const onChange = (e) => {
        setInput({...inputs, [e.target.name] : e.target.value });
    };

    
    const onSubmitForm = async (e) => {
        // Förhindra submit av form
        e.preventDefault();

        try {
            const body = { email, password };
            
            const response = await fetch(`http://${ip}:5000/auth/login`, {
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                // Konvertera till sträng
                body: JSON.stringify(body)
            });

            const parseRes = await response.json();
            
            // Om JWT är giltig ge användaren tillgång
            if (parseRes.jwtToken) {
                // Lagra token lokalt
                localStorage.setItem("token", parseRes.jwtToken);
                // Uppdatera så att användaren är inloggad
                setAuth(true);
                // Sätt felmeddelandet till en tom sträng så att inget meddelande visas.
                setErrorMessage("");
            } else {
                // Om det inte finns en JWT tillgänglig sätts felmeddelandet så att det kan visas
                setErrorMessage("Felaktiga uppgifter.");
            }
            
        } catch (err) {
            console.error(err.message);
        }
    }

    return (
        <Fragment>
            <div className="flex flex-col min-h-screen justify-center items-center">
                
                <div className="border-1 border-cwhite rounded-lg p-10 flex bg-greyish shadow-2xl">
                    <div className="flex flex-col " >
                    <h1 className="text-cwhite text-4xl font-bold">Library: Logga in</h1>
                        <form className="" onSubmit={onSubmitForm}>
                            <div className="p-2">
                                <input className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-cwhite" type="email" placeholder="E-mail" name="email" value={email} onChange={e => onChange(e)}/>                        
                                <input className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-cwhite" type="password" placeholder="Lösenord" name="password" value={password} onChange={e => onChange(e)} />
                                
                                {
                                    /* Visa ett felmeddelande om det finns ett, annars visas inget */
                                    errorMessage && <div className="text-warning-red font-bold">{errorMessage}</div>
                                }
                                <div className="my-4">
                                    <button className="p-4 bg-blueish rounded-sm hover:bg-lighter-green text-cwhite">Logga in</button>
                                    <Link className="px-4 text-cwhite" to="/register">Registrera</Link>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default Login;