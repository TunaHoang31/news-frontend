import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const ModalDelete = (props) => {
    const title = props.title || 'Xóa';

    const body = props.body || `Bạn có chắc chắn xóa người dùng này không:${props.dataModal?.email || props.dataModal?.name || 'mục này'}?`;
    const cancelText = props.cancelText || 'Đóng';
    const confirmText = props.confirmText || 'Xóa';
    const confirmVariant = props.confirmVariant || 'primary';
    const handleConfirm = props.confirmDeleteUser || props.onConfirm;

    return (
        <>
            <Modal show={props.show} onHide={props.handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{body}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.handleClose}>
                        {cancelText}
                    </Button>
                    <Button variant={confirmVariant} onClick={handleConfirm}>
                        {confirmText}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ModalDelete;