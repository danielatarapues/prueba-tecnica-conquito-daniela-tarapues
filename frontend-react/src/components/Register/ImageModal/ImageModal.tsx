import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { HiX, HiDownload } from 'react-icons/hi';
import styles from './ImageModal.module.css';

interface ImageModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageUrl: string;
    fileName?: string;
    fileSize?: string;
    fileType?: string;
    onDownload?: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({
    isOpen,
    onClose,
    imageUrl,
    fileName = 'Imagen',
    fileSize,
    fileType,
    onDownload
}) => {
    // Bloquear scroll del body cuando el modal está abierto
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        // Cleanup al desmontar
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Cerrar modal con tecla Escape
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const modalContent = (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                {/* Header del modal */}
                <div className={styles.modalHeader}>
                    <div className={styles.headerInfo}>
                        <h3 className={styles.modalTitle}>{fileName}</h3>
                        {(fileSize || fileType) && (
                            <div className={styles.fileDetails}>
                                {fileSize && <span>{fileSize}</span>}
                                {fileType && <span>{fileType}</span>}
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className={styles.closeButton}
                        aria-label="Cerrar modal"
                    >
                        <HiX />
                    </button>
                </div>

                {/* Cuerpo del modal con la imagen */}
                <div className={styles.modalBody}>
                    <div className={styles.imageContainer}>
                        <img
                            src={imageUrl}
                            alt={fileName}
                            className={styles.modalImage}
                            loading="lazy"
                        />
                    </div>
                </div>

                {/* Footer con acciones */}
                <div className={styles.modalFooter}>
                    <div className={styles.footerActions}>
                        {onDownload && (
                            <button
                                type="button"
                                onClick={onDownload}
                                className={styles.downloadButton}
                            >
                                <HiDownload />
                                Descargar
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    // Usar portal para renderizar el modal a nivel de body
    return createPortal(modalContent, document.body);
};

export default ImageModal;