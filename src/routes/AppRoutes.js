import { Switch, Route } from "react-router-dom";
import Login from '../components/Login/Login';
import Register from '../components/Register/Register';
import Users from '../components/manageUsers/Users';
import PrivateRoutes from "./PrivateRoutes";
import Role from '../components/Role/role';
import GroupRole from "../components/GroupRole/GroupRole";
import Home from "../components/Home/Home";
import About from "../components/About/About";
import ArticleDetail from "../components/Home/ArticleDetail";
import NewsAdmin from "../components/NewsAdmin/NewsAdmin";

const AppRoutes = (props) => {
    const Projects = () => {
        return (
            // <span>projects</span>
            <div className="container mt-3">
                <h4>Todo... </h4>
            </div>
        )
    }
    return (
        <>
            <Switch>
                <PrivateRoutes path="/users" component={Users} />
                <PrivateRoutes path="/projects" component={Projects} />
                <PrivateRoutes path="/roles" component={Role} />
                <PrivateRoutes path="/group-role" component={GroupRole} />
                <PrivateRoutes path="/admin/news" component={NewsAdmin} />

                <Route path="/login" >
                    <Login />
                </Route>
                <Route path="/register" >
                    <Register />
                </Route>
                <Route path="/about" >
                    <About />
                </Route>
                <Route path="/news/:slug" >
                    <ArticleDetail />
                </Route>

                <Route path="/" exact>
                    <Home />
                </Route>

                <Route path="*">
                    <div className="container">404 Not Found...</div>

                </Route>
            </Switch>
        </>
    )
}

export default AppRoutes;