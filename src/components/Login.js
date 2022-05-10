import { Fragment, useState} from "react";
import {Link} from "react-router-dom";

const Login = ({setAuth}) => {

    const [inputs, setInput] = useState(
        {
            email: "",
            password: "",
        }
    ); 

    const [errorMessage, setErrorMessage] = useState();

    const { email, password } = inputs;

    const onChange = (e) => {
        setInput({...inputs, [e.target.name] : e.target.value });
    };

    const onSubmitForm = async (e) => {
        e.preventDefault();

        try {
            const body = { email, password };

            const response = await fetch("http://localhost:5000/auth/login", {
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
                setErrorMessage("Invalid credentials.");
            }
            
        } catch (err) {
            console.error(err.message);
        }
    }

    return (
        <Fragment>
            <div className="flex flex-col min-h-screen justify-center items-center ">
                
                <div className="border-1 border-cwhite rounded-lg p-10 w-1/2 flex bg-greyish shadow-2xl">
                    <div className="flex flex-col " >
                    <h1 className="text-cwhite text-4xl font-bold">Library: Login</h1>
                        <form className="" onSubmit={onSubmitForm}>
                            <div className="p-2">
                                <input className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-cwhite" type="email" placeholder="E-mail" name="email" value={email} onChange={e => onChange(e)}/>                        
                                <input className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-cwhite" type="password" placeholder="Password" name="password" value={password} onChange={e => onChange(e)} />
                                {errorMessage && <div className="text-warning-red">{errorMessage}</div>}
                                <div className="my-4">
                                    <button className="p-4 bg-blueish rounded-sm hover:bg-lighter-green text-cwhite">Login</button>
                                    <Link className="px-4 text-cwhite" to="/register">Register</Link>
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