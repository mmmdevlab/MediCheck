import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Description,
} from '@headlessui/react';
import ActionButton from './ActionButton';

const ConfirmDialog = ({
  open,
  title,
  message,
  onConfirm,
  onClose,
  confirmLabel = 'Confirm',
  danger = false,
}) => (
  <Dialog open={open} onClose={onClose} className="relative z-50">
    <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
    <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
      <DialogPanel className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-3">
        {title && (
          <DialogTitle className="font-bold text-lg text-gray-900">
            {title}
          </DialogTitle>
        )}
        {message && (
          <Description className="text-sm text-gray-600">{message}</Description>
        )}
        <div className="flex gap-2 justify-end pt-2">
          {onConfirm ? (
            <>
              <ActionButton
                variant="secondary"
                onClick={onClose}
                className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 font-semibold text-sm hover:bg-gray-200 transition-colors"
              >
                Cancel
              </ActionButton>
              <ActionButton
                variant={danger ? 'danger' : 'primary'}
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
              >
                {confirmLabel}
              </ActionButton>
            </>
          ) : (
            <ActionButton variant="primary" onClick={onClose}>
              OK
            </ActionButton>
          )}
        </div>
      </DialogPanel>
    </div>
  </Dialog>
);

export default ConfirmDialog;
