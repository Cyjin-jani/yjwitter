import { authService } from 'fbase';
import React, { useState } from 'react'

function AuthForm() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(true);
    const [error, setError] = useState("");

    const onChange = (event) => {
        const {target: {name, value}} = event;
        if(name === "email") {
            setEmail(value)
        } else if (name === "password") {
            setPassword(value)
        }
    }

    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            let data;
            if(newAccount) {
                //create Account
                data = await authService.createUserWithEmailAndPassword(email, password);
            } else {
                //Log in
                data = await authService.signInWithEmailAndPassword(email, password);
            }
            console.log(data);
        } catch(error) {
            setError(error.message);
        }
    }

    const toggleAccount = () => setNewAccount((prev) => !prev);

    return (
        <>
            <form onSubmit={onSubmit} className="container">
                <input className="authInput" name="email" type="text" placeholder="Email" required value={email} onChange={onChange}/>
                <input className="authInput" name="password" type="password" placeholder="password" required value={password} onChange={onChange} />
                <input className="authInput authSubmit" type="submit" value={newAccount ? "Create Account" : "Sign In"} />
                <br/>
                {error && <span className="authError">{error}</span>}
            </form>
            <span onClick={toggleAccount} className="authSwitch">
                {newAccount ? "Sign In" : "Create Account"}
            </span>
        </>
    )
}

export default AuthForm
