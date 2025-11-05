import React, { useEffect, useState, useContext } from 'react';
import './Nav.scss';
import { Link, NavLink, useLocation, useHistory } from 'react-router-dom';
import { UserContext } from "../../context/UserContext";
import { NewsContext } from "../../context/NewsContext";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { logoutUser } from '../../services/userService'
import { toast } from 'react-toastify';
import { fetchCategories } from '../../services/newsService';

const NavHeader = () => {
    const { user, logoutContext } = useContext(UserContext);
    const { categoryId, keyword, updateFilters } = useContext(NewsContext);
    const location = useLocation();
    const history = useHistory();

    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState(keyword || '');
    const [selectedMain, setSelectedMain] = useState(null);

    const isAdmin = (() => {
        const gw = user?.account?.groupWithRoles;
        try {
            if (!gw) {
                const uname = user?.account?.username || '';
                const mail = user?.account?.email || '';
                return (uname && uname.toLowerCase().includes('admin')) || (mail && mail.toLowerCase().includes('admin'));
            }
            if (typeof gw === 'string') return gw.toLowerCase().includes('admin');
            if (Array.isArray(gw)) {
                for (const g of gw) {
                    if (!g) continue;
                    if (typeof g === 'string' && g.toLowerCase().includes('admin')) return true;
                    if (g.name && typeof g.name === 'string' && g.name.toLowerCase().includes('admin')) return true;
                    const roles = g.roles || g.roleList || g.rolesName || g.Roles;
                    if (roles && Array.isArray(roles)) {
                        for (const r of roles) {
                            if (!r) continue;
                            if (typeof r === 'string' && r.toLowerCase().includes('admin')) return true;
                            if (r.name && typeof r.name === 'string' && r.name.toLowerCase().includes('admin')) return true;
                        }
                    }
                }
            } else if (typeof gw === 'object') {
                const s = JSON.stringify(gw).toLowerCase();
                if (s.includes('admin')) return true;
            }

            const uname = user?.account?.username || '';
            const mail = user?.account?.email || '';
            return (uname && uname.toLowerCase().includes('admin')) || (mail && mail.toLowerCase().includes('admin'));
        } catch (e) {
            return false;
        }
    })();

    useEffect(() => {
        const init = async () => {
            const cat = await fetchCategories();
            if (cat && cat.EC === 0) setCategories(cat.DT || []);
        }
        init();
    }, []);

    const handleLogout = async () => {
        let data = await logoutUser();
        localStorage.removeItem('jwt');
        logoutContext();

        if (data && +data.EC === 0) {
            toast.success('Đăng xuất thành công.');
            history.push('/login');
            // setTimeout(() => window.location.reload(), 200);
        } else {
            toast.error(data.EM);
        }
    }

    const handleCategoryClick = (id) => {
        setSelectedMain(prev => prev === id ? null : id);
        updateFilters({ categoryId: id });
        if (location.pathname !== '/') history.push('/');
    }

    const handleSubcategoryClick = (id, parentId) => {
        setSelectedMain(parentId);
        updateFilters({ categoryId: id });
        if (location.pathname !== '/') history.push('/');
    }

    const handleSearch = () => {
        updateFilters({ keyword: search });
        if (location.pathname !== '/') history.push('/');
    }

    const handleHomeClick = () => {
        setSelectedMain(null);
        setSearch('');
        updateFilters({ categoryId: '', keyword: '' });
        if (location.pathname !== '/') history.push('/');
    }

    if (!((user && user.isAuthenticated) || location.pathname === "/" || location.pathname === '/about')) return null;

    return (
        <div className='nav-header'>
            <Navbar expand="lg" className="bg-header">
                <Container>
                    <Navbar.Brand as={Link} to="/">Tin tức nhanh</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <NavLink
                                to="/"
                                exact
                                className={location.pathname === '/' && !categoryId ? 'nav-link active' : 'nav-link'}
                                onClick={handleHomeClick}
                            >
                                Trang chủ
                            </NavLink>
                            {/* <NavLink to="/about" className='nav-link'>About</NavLink> */}
                            {categories.filter(c => !c.parentId).map(c => (
                                <button
                                    key={c.id}
                                    className={`btn btn-link nav-link ${(categoryId === c.id && location.pathname === '/') ? 'active' : ''}`}
                                    onClick={() => handleCategoryClick(c.id)}
                                >
                                    {c.name}
                                </button>
                            ))}
                        </Nav>

                        <Nav className="align-items-center">
                            <input
                                className="form-control me-2"
                                style={{ width: '200px' }}
                                placeholder="Tìm kiếm..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
                            />
                            <button className="btn btn-primary me-3" onClick={handleSearch}>Tìm</button>

                            {user && user.isAuthenticated ?
                                <>
                                    <Nav.Item className='nav-link'>Xin chào {user.account.username}!</Nav.Item>
                                    <NavDropdown title="Cài đặt" id="basic-nav-dropdown">
                                        {isAdmin && (
                                            <>
                                                <NavDropdown.Item as={Link} to="/admin/news">Quản lý Tin tức</NavDropdown.Item>
                                                <NavDropdown.Divider />
                                            </>
                                        )}
                                        <NavDropdown.Item as={Link} to="/users">Quản lý tài khoản</NavDropdown.Item>
                                        {isAdmin && (
                                            <>
                                                <NavDropdown.Item as={Link} to="/roles">Quyền hạn</NavDropdown.Item>
                                                <NavDropdown.Item as={Link} to="/group-role">Group-Roles</NavDropdown.Item>
                                            </>
                                        )}
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item><span onClick={handleLogout}>Đăng xuất</span></NavDropdown.Item>
                                    </NavDropdown>
                                </>
                                :
                                <Link className='nav-link' to='/login'>Đăng nhập</Link>
                            }
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container>
                {selectedMain && (() => {
                    const subs = categories.filter(sc => sc.parentId === selectedMain);
                    if (!subs || subs.length === 0) return null;
                    return (
                        <div className="subcategory-bar">
                            {subs.map(s => (
                                <button
                                    key={s.id}
                                    className={`sub-item btn ${categoryId === s.id ? 'active' : ''}`}
                                    onClick={() => handleSubcategoryClick(s.id, s.parentId)}
                                >
                                    {s.name}
                                </button>
                            ))}
                        </div>
                    )
                })()}
            </Container>
        </div>
    );
};

export default NavHeader;
