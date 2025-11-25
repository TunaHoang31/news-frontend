import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const ModalDeleteRole = (props) => {
    const title = props.title || 'Xóa quyền';

    const body = props.body || `Bạn có chắc chắn xóa quyền này không: ${props.dataModal?.url || props.dataModal?.description || 'mục này'}?`;
    const cancelText = props.cancelText || 'Đóng';
    const confirmText = props.confirmText || 'Xóa';
    const confirmVariant = props.confirmVariant || 'danger';
    const handleConfirm = props.confirmDeleteRole || props.onConfirm;

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

export default ModalDeleteRole;
