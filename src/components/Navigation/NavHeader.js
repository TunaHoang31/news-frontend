import React, { useEffect, useState, useContext } from 'react';
import './Nav.scss';
import { Link, NavLink, useLocation, useHistory } from 'react-router-dom';
import { UserContext } from "../../context/UserContext";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { logoutUser } from '../../services/userService'
import { toast } from 'react-toastify';

const NavHeader = (props) => {
    const { user, logoutContext } = useContext(UserContext);
    const location = useLocation();
    const history = useHistory();

    const handleLogout = async () => {
        let data = await logoutUser(); //clear cookie
        localStorage.removeItem('jwt'); //clear localStorage
        logoutContext(); //clear user in context

        if (data && +data.EC === 0) {
            toast.success('Đăng xuất thành công.');
            history.push('/login');
            setTimeout(() => window.location.reload(), 200);
        } else {
            toast.error(data.EM);
        }
    }

    if ((user && user.isAuthenticated === true) || location.pathname === "/" || location.pathname === '/about') {
        return (
            <>
                <div className='nav-header'>
                    <Navbar expand="lg" className="bg-header">
                        <Container>
                            <Navbar.Brand href="#home">Tin tức nhanh</Navbar.Brand>
                            <Navbar.Toggle aria-controls="basic-navbar-nav" />
                            <Navbar.Collapse id="basic-navbar-nav">
                                <Nav className="me-auto">
                                    <NavLink to="/" exact className='nav-link'>Trang chủ</NavLink>
                                    {/* <NavLink to="/users" className='nav-link'>Người dùng</NavLink>
                                    <NavLink to="/roles" className='nav-link'>Quyền hạn</NavLink>
                                    <NavLink to="/group-role" className='nav-link'>Group-Roles</NavLink> */}
                                    <NavLink to="/about" className='nav-link'>About</NavLink>

                                </Nav>
                                <Nav>
                                    {user && user.isAuthenticated === true
                                        ?
                                        <>
                                            <Nav.Item className='nav-link'>
                                                Xin chào {user.account.username}!
                                            </Nav.Item>

                                            <NavDropdown title="Cài đặt" id="basic-nav-dropdown">
                                                <NavDropdown.Item as={Link} to="/admin/news">
                                                    Quản trị Tin tức
                                                </NavDropdown.Item>
                                                <NavDropdown.Divider />
                                                <NavDropdown.Item as={Link} to="/users">
                                                    Người dùng
                                                </NavDropdown.Item>
                                                <NavDropdown.Item as={Link} to="/roles">
                                                    Quyền hạn
                                                </NavDropdown.Item>
                                                <NavDropdown.Item as={Link} to="/group-role">
                                                    Group-Roles
                                                </NavDropdown.Item>
                                                <NavDropdown.Divider />
                                                <NavDropdown.Item >
                                                    <span onClick={() => handleLogout()}> Đăng xuất </span>
                                                </NavDropdown.Item>
                                            </NavDropdown>
                                        </>
                                        :
                                        <Link className='nav-link' to='/login'>
                                            Đăng nhập
                                        </Link>
                                    }

                                </Nav>
                            </Navbar.Collapse>
                        </Container>
                    </Navbar>
                </div >

            </>
        );
    }
    else {
        return <>
        </>
    }
}

export default NavHeader;