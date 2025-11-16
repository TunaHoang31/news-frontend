import React from 'react';
import ModalDelete from '../manageUsers/ModalDelete';

const ModalDeleteArticle = ({ show, handleClose, confirmDeleteArticle, dataModal }) => {
    return (
        <ModalDelete
            show={show}
            handleClose={handleClose}
            confirmDeleteUser={confirmDeleteArticle}
            dataModal={dataModal}
            title={"Xóa bài viết"}
            body={`Bạn có chắc chắn xóa bài viết này không: ${dataModal.title || dataModal.id || ''}?`}
            confirmVariant={"danger"}
        />
    );
}

export default ModalDeleteArticle;
