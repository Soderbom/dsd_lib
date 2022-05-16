import { Fragment, useState} from "react";
import {Link} from "react-router-dom";

const Register = ({setAuth}) => {
    const [inputs, setInput] = useState(
        {
            email: "",
            username: "",
            password: "",
        }
    ); 

    const [errorMessage, setErrorMessage] = useState();

    const { email, username, password } = inputs;

    const onChange = (e) => {
        setInput({...inputs, [e.target.name] : e.target.value });
    };

    const onSubmitForm = async (e) => {
        e.preventDefault();

        try {
            const body = { email, username, password };

            const response = await fetch("http://localhost:5000/auth/register", {
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify(body)
            });

            const parseRes = await response.json();
            
            if (parseRes.jwtToken) {
                localStorage.setItem("token", parseRes.jwtToken);
                setAuth(true);
                setErrorMessage("");
            } else {
                setErrorMessage("Något gick fel.");
            }
            
        } catch (err) {
            console.error(err.message);
        }
    }
    return (
        <Fragment>
            <div className="flex flex-col min-h-screen justify-center items-center ">
                
                <div className="border-1 border-cwhite rounded-lg p-10 flex bg-greyish shadow-2xl">
                    <div className="flex flex-col " >
                    <h1 className="text-cwhite text-4xl font-bold">Library: Registrera</h1>
                        <form className="" onSubmit={onSubmitForm}>
                            <div className="p-2">
                                <input className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-cwhite" type="email" name="email" placeholder="E-mail" value={email} onChange={e => onChange(e)}/>  
                                <input className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-cwhite" type="text" name="username" placeholder="Användarnamn" value={username} onChange={e => onChange(e)}/>                        
                                <input className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-cwhite" type="password" name="password" placeholder="Lösenord" value={password} onChange={e => onChange(e)}/>
                                {errorMessage && <div className="text-warning-red font-bold">{errorMessage}</div>}
                                <div className="my-4">
                                    <button className="p-4 bg-blueish rounded-sm hover:bg-lighter-green text-cwhite">Registrera</button>
                                    <Link className="px-4 text-cwhite" to="/login">Logga in</Link>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default Register;