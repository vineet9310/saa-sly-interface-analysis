'use client'

import React from 'react'
import { Modal } from './Modal'
import { AlertTriangle } from 'lucide-react'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  danger?: boolean
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  danger = true,
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex items-start gap-3 my-2">
        <div className={`p-2 rounded-full ${danger ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
          <AlertTriangle size={20} />
        </div>
        <div>
          <p className="text-sm text-gray-600 leading-relaxed">{message}</p>
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onClose}
          className="button button-outline text-xs px-4 py-2"
        >
          {cancelText}
        </button>
        <button
          type="button"
          onClick={() => {
            onConfirm()
            onClose()
          }}
          className={`button text-xs px-4 py-2 text-white ${
            danger ? 'bg-red-600 hover:bg-red-700' : 'button-primary'
          }`}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  )
}
