import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { fetchAllRole, deleteRole } from '../../services/roleService'
import { toast } from 'react-toastify';
import ModalDeleteRole from './ModalDeleteRole';

const TableRole = forwardRef((props, ref) => {
    const [listRoles, setListRoles] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [dataModal, setDataModal] = useState(null);

    useEffect(() => {
        getAllRoles()
    }, [])

    useImperativeHandle(ref, () => ({

        fetListRoleAgain() {
            getAllRoles();
        }
    }));

    const getAllRoles = async () => {
        let data = await fetchAllRole();
        if (data && +data.EC === 0) {
            setListRoles(data.DT);
        }
    }
    const handleDeleteRole = async (role) => {
        // open confirmation modal
        setDataModal(role);
        setShowModal(true);
    }

    const handleConfirmDelete = async () => {
        if (!dataModal) return;
        let data = await deleteRole(dataModal);
        if (data && data.EC === 0) {
            toast.success(data.EM);
            await getAllRoles();
        } else if (data) {
            toast.error(data.EM || 'Xóa thất bại');
        }
        setShowModal(false);
        setDataModal(null);
    }

    const handleCloseModal = () => {
        setShowModal(false);
        setDataModal(null);
    }
    return (<>
        <ModalDeleteRole
            show={showModal}
            handleClose={handleCloseModal}
            dataModal={dataModal}
            confirmDeleteRole={handleConfirmDelete}
        />
        <table className="table table-bordered table-hover">
            <thead>
                <tr>
                    <th scope="col">Id</th>
                    <th scope="col">URL</th>
                    <th scope="col">Mô tả</th>
                    <th>Tác vụ</th>
                </tr>
            </thead>

            <tbody>
                {listRoles && listRoles.length > 0 ?
                    <>
                        {listRoles.map((item, index) => {
                            return (
                                <tr key={`row-${index}`}>
                                    {/* <td>{index + 1} </td> */}
                                    <td>{item.id}</td>
                                    <td>{item.url}</td>
                                    <td>{item.description}</td>

                                    <td data-label="Actions">
                                        <button className="btn btn-danger delete"
                                            onClick={() => handleDeleteRole(item)}
                                        >
                                            <i className="fa fa-trash-o" aria-hidden="true"></i>
                                        </button>

                                    </td>
                                </tr>
                            )
                        })}
                    </>
                    :
                    <>
                        <tr><td colSpan={4}>Không tìm thấy </td></tr>
                    </>

                }
            </tbody>

        </table>
    </>)
})

export default TableRole;