import { motion, AnimatePresence } from 'framer-motion'
import './ConfirmModal.css'

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="modal-overlay">
        <motion.div 
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
        <motion.div 
          className="modal-content glass-card"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
        >
          <div className="modal-header">
            <h3>{title || 'Confirm Action'}</h3>
          </div>
          <p className="modal-message">
            {message || 'Are you sure you want to proceed?'}
          </p>
          <div className="modal-actions">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={() => { onConfirm(); onClose() }}>
              Delete
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
