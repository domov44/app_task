import React from 'react';
import { createPortal } from 'react-dom';
import Dialog from '../ui/popup/Dialog';
import Title from '../ui/textual/Title';
import Text from '../ui/textual/Text';
import IconButton from '../ui/button/IconButton';
import Overlay from '../ui/popup/Overlay';
import { CiTrash } from "react-icons/ci";

function ConfirmDialog({
  variant,
  open,
  title,
  content,
  confirmLabel,
  onConfirm,
  onCancel,
}) {
  const appContainer = document.getElementById('root');

  if (!appContainer) {
    return null;
  }

  return createPortal(
    <>
      {open && <Overlay />}

      <Dialog open={open} onCancel={onCancel} variant={variant}>
        <form className="dialog-content" onSubmit={onConfirm} method="dialog">
          <Title level={3}>{title || "Confirmation"}</Title>
          <Text>{content || "Voulez-vous vraiment effectuer cette action ?"}</Text>
          <div className='button-container'>
          <IconButton width="fit-content" variant="basique" onClick={onCancel}>Pas maintenant</IconButton>
          <IconButton type='submit' width="fit-content" variant="danger"><CiTrash />{confirmLabel || 'Oui, je confirme'}</IconButton>
          </div>
        </form>
      </Dialog>
    </>,
    appContainer // Use the 'app' div as the target container
  );
}

export default ConfirmDialog;

