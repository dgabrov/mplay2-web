import {useState} from "react";
import {afterLogin, pushError} from "./slices/mediaReducer.ts";
import {useAppDispatch} from "./store.ts";
import {getService} from "./service/service.ts";
import {navigate} from "./slices/locationReducer.ts";
import {LOCATION_HOME} from "./data/constants.ts";

const Login = () => {

    const dispatch = useAppDispatch()

    const [login, setLogin] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const chLogin = (event: any) => {
        setLogin(event.target.value)
    }

    const chPassword = (event: any) => {
        setPassword(event.target.value)
    }

    const doLogin = async () => {
        try {
            const loginData = await getService().proceedLogin(login, password)

            dispatch(afterLogin(loginData))
            dispatch(navigate(LOCATION_HOME))
        } catch(e: any) {
            dispatch(pushError(e))
        }
    }

    return (
        <div className="content"><h1>Login</h1>
            <h2>Please provide your credentials</h2>
            <table className="login-table">
                <tbody>
                <tr>
                    <td>Login:</td>
                    <td><input type="text" className="form-input" value={login} onChange={chLogin}/></td>
                </tr>
                <tr>
                    <td>Password:</td>
                    <td><input type="password" className="form-input" value={password} onChange={chPassword}/></td>
                </tr>
                <tr>
                    <td></td>
                    <td>
                        <button className="regular-btn" onClick={doLogin}>Login</button>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    )
}

export default Login;