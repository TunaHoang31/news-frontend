import React, { useState, useEffect } from "react";
import { getUserAccount } from '../services/userService'


const UserContext = React.createContext(null);

const UserProvider = ({ children }) => {

    // User is the name of the "data" that gets stored in context
    const userDefault = {
        isLoading: true,
        isAuthenticated: false,
        token: "",
        account: {}
    }
    const [user, setUser] = useState(userDefault);

    // Login updates the user data with a name parameter
    const loginContext = (userData) => {
        setUser({ ...userData, isLoading: false })
    };

    // Logout updates the user data to default
    const logoutContext = () => {
        setUser({ ...userDefault, isLoading: false })
    };

    const fetchUser = async () => {
        let response = await getUserAccount();
        if (response && response.EC === 0) {
            let groupWithRoles = response.DT.groupWithRoles;
            let email = response.DT.email;
            let username = response.DT.username;
            let token = response.DT.access_token;

            let data = {
                isAuthenticated: true,
                token,
                account: { groupWithRoles, email, username },
                isLoading: false
            }
            setUser(data);
        } else {
            setUser({ ...userDefault, isLoading: false })
        }
    }

    useEffect(() => {
        // if (window.location.pathname !== '/' && window.location.pathname !== '/login') {
        //     fetchUser()
        // } else {
        //     setUser({ ...user, isLoading: false })
        // }
        // fetchUser();
        const token = localStorage.getItem('jwt');
        if (token) {
            fetchUser();
        } else {
            setUser({ ...userDefault, isLoading: false });
        }
    }, [])
    return (
        <UserContext.Provider value={{ user, loginContext, logoutContext }}>
            {children}
        </UserContext.Provider>
    );

}

export { UserContext, UserProvider };