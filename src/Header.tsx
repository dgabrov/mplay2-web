import {useAppDispatch, useAppSelector} from "./store.ts";
import {logout} from "./slices/mediaReducer.ts";
import {LOCATION_LOGIN, LOCATION_HOME} from "./data/constants.ts";
import {navigate} from "./slices/locationReducer.ts";

const Header = () => {
    const dispatch = useAppDispatch();

    const errors = useAppSelector((state) => state.media.errors)

    let error = null
    if (errors.length > 0) {
        const lines = errors.map((item) => {
            return (
                <div key={item.id}>
                    {item.message}
                </div>
            )
        })

        error = <div className="error">{lines}</div>;
    }

    // see if the user is logged in, and if so, proceed
    const loginData = useAppSelector((state) => state.media.user)
    let lblRight = 'not logged in'
    const isLoggedIn = loginData.login?.length > 0

    if(isLoggedIn){
        const name = loginData.name;
        const login = loginData.login;

        lblRight = `${name} (${login})`
    }

    const proceedLogout = (e: any) => {
        e.preventDefault();

        dispatch(logout())
        dispatch(navigate(LOCATION_LOGIN))
    }

    const proceedHome = (e: any) => {
        e.preventDefault();

        dispatch(navigate(LOCATION_HOME))
    }


    return (
        <>
            <div className="header">
                <div className="nav">
                    {isLoggedIn && <a href="#" className="nav-item" onClick={proceedHome}>Home</a>}
                    {isLoggedIn && <a href="#" className="nav-item" onClick={proceedLogout}>Logout</a>}
                </div>
                <div className="user-info">
                    {lblRight}
                </div>
            </div>
            <div>
                {error}
            </div>
        </>
    )
}

export default Header
