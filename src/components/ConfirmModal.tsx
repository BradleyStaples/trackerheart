'use client';

import {Modal, ModalBody, ModalHeader} from 'flowbite-react';
import {useState} from 'react';
import Button, {type ButtonRole} from './Button';

interface Props {
  buttonLabel: string;
  buttonClasses?: string;
  buttonRole?: ButtonRole;
  message: string;
  onConfirm: () => void;
}

export default function ConfirmModal({
  buttonLabel,
  buttonClasses,
  buttonRole = 'destructive',
  message,
  onConfirm,
}: Props) {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <Button
        role={buttonRole}
        label={buttonLabel}
        onClick={() => setOpenModal(true)}
        className={buttonClasses}
      />
      <Modal
        show={openModal}
        size='md'
        onClose={() => setOpenModal(false)}
        popup
      >
        <ModalHeader />
        <ModalBody>
          <div className='text-center'>
            <h3 className='mb-5 text-lg font-normal text-gray-500 dark:text-gray-400'>
              {message}
            </h3>
            <div className='flex justify-center gap-4'>
              <Button
                role='destructive'
                label="Yes, I'm sure"
                onClick={() => {
                  setOpenModal(false);
                  onConfirm();
                }}
              />
              <Button
                role='secondary'
                label='No, cancel'
                onClick={() => setOpenModal(false)}
              />
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}
