import React, { useRef, useState, useCallback } from 'react';
import { HiPhotograph, HiX, HiUpload, HiEye, HiDownload, HiRefresh } from 'react-icons/hi';
import styles from './FileUpload.module.css';
import ImageModal from '../ImageModal/ImageModal';
import type { FileUploadProps } from '../../../types';


const FileUpload: React.FC<FileUploadProps> = ({
  value,
  onChange,
  accept = "image/jpeg,image/jpg,image/png,image/gif,image/webp",
  maxSize = 5 * 1024 * 1024, // 5MB por defecto
  disabled = false,
  error
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Generar preview de la imagen
  React.useEffect(() => {
    if (value && value[0]) {
      const file = value[0];
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
      }
    } else {
      setPreviewUrl(null);
    }
  }, [value]);

  const validateFile = useCallback((file: File): string | null => {
    // Validar tipo
    const acceptedTypes = accept.split(',').map(type => type.trim());
    if (!acceptedTypes.some(type => file.type.match(type.replace('*', '.*')))) {
      return 'Tipo de archivo no permitido';
    }

    // Validar tamaño
    if (file.size > maxSize) {
      const maxMB = Math.round(maxSize / 1024 / 1024);
      return `El archivo es muy grande. Máximo ${maxMB}MB`;
    }

    return null;
  }, [accept, maxSize]);

  const handleFileChange = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) {
      onChange(null);
      return;
    }

    const file = files[0];
    const validationError = validateFile(file);
    
    if (validationError) {
      console.error(validationError);
      return;
    }

    onChange(files);
  }, [onChange, validateFile]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(event.target.files);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;

    const files = event.dataTransfer.files;
    handleFileChange(files);
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemove = (event: React.MouseEvent) => {
    event.stopPropagation();
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleView = (event: React.MouseEvent) => {
    event.stopPropagation();
    setShowModal(true);
  };

  const handleDownload = useCallback((event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    if (value && value[0] && previewUrl) {
      const link = document.createElement('a');
      link.href = previewUrl;
      link.download = value[0].name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [value, previewUrl]);

  const handleDownloadFromModal = useCallback(() => {
    handleDownload();
  }, [handleDownload]);

  const handleReplace = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const currentFile = value && value[0];

  return (
    <>
      <div className={styles.container}>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className={styles.hiddenInput}
          disabled={disabled}
        />

        {/* Área de drop y preview */}
        <div
          className={`${styles.dropZone} ${
            isDragOver ? styles.dragOver : ''
          } ${disabled ? styles.disabled : ''} ${error ? styles.error : ''} ${
            previewUrl ? styles.hasFile : ''
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={previewUrl ? undefined : handleClick}
        >
          {previewUrl ? (
            // Preview con imagen y acciones
            <div className={styles.preview}>
              <div className={styles.imageContainer}>
                <img src={previewUrl} alt="Preview" className={styles.previewImage} />
                <div className={styles.overlay}>
                  <div className={styles.actionButtons}>
                    <button
                      type="button"
                      onClick={handleView}
                      className={`${styles.actionButton} ${styles.viewButton}`}
                      disabled={disabled}
                      title="Ver imagen completa"
                    >
                      <HiEye />
                    </button>
                    <button
                      type="button"
                      onClick={handleDownload}
                      className={`${styles.actionButton} ${styles.downloadButton}`}
                      disabled={disabled}
                      title="Descargar imagen"
                    >
                      <HiDownload />
                    </button>
                    <button
                      type="button"
                      onClick={handleReplace}
                      className={`${styles.actionButton} ${styles.replaceButton}`}
                      disabled={disabled}
                      title="Reemplazar imagen"
                    >
                      <HiRefresh />
                    </button>
                    <button
                      type="button"
                      onClick={handleRemove}
                      className={`${styles.actionButton} ${styles.removeButton}`}
                      disabled={disabled}
                      title="Eliminar imagen"
                    >
                      <HiX />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className={styles.fileInfo}>
                <p className={styles.fileName}>{currentFile?.name}</p>
                <p className={styles.fileSize}>{currentFile && formatFileSize(currentFile.size)}</p>
              </div>

              {/* Botones de acción adicionales para móvil */}
              <div className={styles.mobileActions}>
                <button
                  type="button"
                  onClick={handleView}
                  className={`${styles.mobileButton} ${styles.viewMobile}`}
                  disabled={disabled}
                >
                  <HiEye />
                  Ver
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className={`${styles.mobileButton} ${styles.downloadMobile}`}
                  disabled={disabled}
                >
                  <HiDownload />
                  Descargar
                </button>
                <button
                  type="button"
                  onClick={handleReplace}
                  className={`${styles.mobileButton} ${styles.replaceMobile}`}
                  disabled={disabled}
                >
                  <HiRefresh />
                  Cambiar
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className={`${styles.mobileButton} ${styles.removeMobile}`}
                  disabled={disabled}
                >
                  <HiX />
                  Eliminar
                </button>
              </div>
            </div>
          ) : (
            // Drop zone vacío
            <div className={styles.emptyState}>
              <div className={styles.uploadIcon}>
                {isDragOver ? <HiUpload /> : <HiPhotograph />}
              </div>
              <div className={styles.uploadText}>
                <p className={styles.mainText}>
                  {isDragOver ? 'Suelta el archivo aquí' : 'Arrastra una imagen o haz clic'}
                </p>
                <p className={styles.subText}>
                  Formatos: JPG, PNG, GIF, WebP (máx. {Math.round(maxSize / 1024 / 1024)}MB)
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className={styles.errorMessage}>
            <span>⚠ {error}</span>
          </div>
        )}
      </div>

      {/* Modal para ver imagen completa */}
      <ImageModal
        isOpen={showModal}
        onClose={closeModal}
        imageUrl={previewUrl || ''}
        fileName={currentFile?.name}
        fileSize={currentFile ? formatFileSize(currentFile.size) : undefined}
        fileType={currentFile?.type}
        onDownload={handleDownloadFromModal}
      />
    </>
  );
};

export default FileUpload;