import { useEffect, useState, useContext } from "react";
import './Users.scss'
import { fetchAllUser, deleteUser } from "../../services/userService"
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import ModalDelete from './ModalDelete';
import ModalUser from "./ModalUser";
import { UserContext } from '../../context/UserContext';


const Users = (props) => {
    const [listUsers, setListUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit, setCurrentLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    //modal delete
    const [isShowModalDelete, setIsShowModalDelete] = useState(false);
    const [dataModal, setDataModal] = useState({});

    //modal edit/create user
    const [isShowModalUser, setIsShowModalUser] = useState(false);
    const [actionModalUser, setActionModalUser] = useState("CREATE");
    const [dataModalUser, setDataModalUser] = useState({});

    const { user } = useContext(UserContext);

    // Determine if current user is an admin (robust checks across possible shapes)
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
        fetchUsers();

    }, [currentPage])

    const fetchUsers = async () => {
        let response = await fetchAllUser(currentPage, currentLimit);
        if (response && response.EC === 0) {
            // setListUsers(response.DT);
            setTotalPages(response.DT.totalPages);
            let users = response.DT.users || [];
            // If current user is not admin, only show that user's own record
            if (user && user.isAuthenticated && !isAdmin) {
                const me = users.find(u => (u.username && user.account?.username && u.username === user.account.username) || (u.email && user.account?.email && u.email === user.account.email));
                users = me ? [me] : [];
                // adjust total pages to 1 or 0
                setTotalPages(users.length > 0 ? 1 : 0);
            }
            setListUsers(users);
        }

    }
    const handlePageClick = (event) => {
        setCurrentPage(+event.selected + 1);

    };

    const handleDeleteUser = async (user) => {
        setDataModal(user);
        setIsShowModalDelete(true);
    };
    const handleClose = () => {
        setIsShowModalDelete(false);
        setDataModal({});
    }
    const confirmDeleteUser = async () => {
        let response = await deleteUser(dataModal);
        if (response && response.EC === 0) {
            toast.success(response.EM);
            await fetchUsers();
            setIsShowModalDelete(false);
        } else {
            toast.error(response.EM)
        }

    }
    const onHideModalUser = async () => {
        setIsShowModalUser(false);
        setDataModalUser({});
        await fetchUsers();
    }

    const handleEditUser = (user) => {
        setActionModalUser("UPDATE");
        setDataModalUser(user);
        setIsShowModalUser(true);
    }

    const handleRefresh = async () => {
        await fetchUsers();
    }

    return (
        <>
            <div className="container"  >

                <div className="manage-users-container" >
                    <div className="user-header">
                        <div className="title mt-3">
                            <h3> Quản lý người dùng</h3>

                        </div>
                        <div className="actions my-3 ">
                            <button
                                className="btn btn-success refresh"
                                onClick={() => handleRefresh()}
                            >
                                <i className="fa fa-refresh"></i> Làm mới </button>
                            {isAdmin && (
                                <button className="btn btn-primary"
                                    onClick={() => {
                                        setIsShowModalUser(true);
                                        setActionModalUser('CREATE');
                                    }}
                                >
                                    <i className="fa fa-user-plus"></i>
                                    Thêm người dùng
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="user-body">
                        <div className="table-responsive">
                            <table className="table table-bordered table-hover">
                                <thead>
                                    <tr>
                                        <th scope="col">Id</th>
                                        <th scope="col">Email</th>
                                        <th scope="col">Username</th>
                                        <th scope="col">Group</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {listUsers && listUsers.length > 0 ?
                                        <>
                                            {listUsers.map((item, index) => {
                                                return (
                                                    <tr key={`row-${index}`}>
                                                        {/* <td>{index + 1} </td> */}
                                                        <td data-label="Id">{item.id}</td>
                                                        <td data-label="Email">{item.email}</td>
                                                        <td data-label="Username">{item.username}</td>
                                                        <td data-label="Group">{item.Group ? item.Group.name : ''}</td>
                                                        <td data-label="Actions">
                                                            <button
                                                                className="btn btn-warning edit mx-3"
                                                                onClick={() => handleEditUser(item)}
                                                            >
                                                                <i className="fa fa-pencil-square" ></i>
                                                                Sửa
                                                            </button>
                                                            <button className="btn btn-danger delete"
                                                                onClick={() => handleDeleteUser(item)}
                                                            >
                                                                <i className="fa fa-trash-o" aria-hidden="true"></i>
                                                                Xóa
                                                            </button>

                                                        </td>
                                                    </tr>
                                                )

                                            })}
                                        </>
                                        :
                                        <>
                                            <tr><td colSpan={5}> Not found users </td></tr>
                                        </>

                                    }
                                </tbody>

                            </table>
                        </div>
                    </div>
                    {totalPages > 0 &&
                        <div className="user-footer">

                            <ReactPaginate
                                nextLabel=">>>"
                                onPageChange={handlePageClick}
                                pageRangeDisplayed={3}
                                marginPagesDisplayed={2}
                                pageCount={totalPages}
                                previousLabel="<<<"
                                pageClassName="page-item"
                                pageLinkClassName="page-link"
                                previousClassName="page-item"
                                previousLinkClassName="page-link"
                                nextClassName="page-item"
                                nextLinkClassName="page-link"
                                breakLabel="..."
                                breakClassName="page-item"
                                breakLinkClassName="page-link"
                                containerClassName="pagination"
                                activeClassName="active"
                                renderOnZeroPageCount={null}
                            />
                        </div>
                    }
                </div>


            </div>
            <ModalDelete
                show={isShowModalDelete}
                handleClose={handleClose}
                confirmDeleteUser={confirmDeleteUser}
                dataModal={dataModal}
                title={"Xóa người dùng"}
                body={`Bạn có chắc chắn xóa người dùng này không: ${dataModal.email || dataModal.username || ''}?`}
                confirmVariant={"danger"}
            />
            <ModalUser
                // title={"Tạo mới người dùng"}
                onHide={onHideModalUser}
                show={isShowModalUser}
                onUserCreated={fetchUsers}
                action={actionModalUser}
                dataModalUser={dataModalUser}
            />
        </>

    )
}

export default Users;