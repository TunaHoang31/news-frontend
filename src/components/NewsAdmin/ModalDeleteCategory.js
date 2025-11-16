import React from 'react';
import ModalDelete from '../manageUsers/ModalDelete';

const ModalDeleteCategory = ({ show, handleClose, confirmDeleteCategory, dataModal }) => {
    return (
        <ModalDelete
            show={show}
            handleClose={handleClose}
            confirmDeleteUser={confirmDeleteCategory}
            dataModal={dataModal}
            title={"Xóa danh mục"}
            body={`Bạn có chắc chắn xóa danh mục này không: ${dataModal.name || dataModal.id || ''}?`}
            confirmVariant={"danger"}
        />
    );
}

export default ModalDeleteCategory;
