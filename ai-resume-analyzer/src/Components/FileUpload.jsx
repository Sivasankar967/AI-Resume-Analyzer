import { useState, useRef } from "react";
import { Upload, FileCheck, X } from "lucide-react";

export default function FileUpload({ onFileSelect, selectedFile }) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === "application/pdf") {
      onFileSelect(file);
    }
  };

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onFileSelect(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div
      className={`upload-zone ${dragOver ? "drag-over" : ""} ${selectedFile ? "has-file" : ""}`}
      onClick={() => inputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        style={{ display: "none" }}
        onChange={handleChange}
      />

      <div className="upload-icon">
        {selectedFile ? <FileCheck /> : <Upload />}
      </div>

      {selectedFile ? (
        <>
          <p className="upload-text-primary">{selectedFile.name}</p>
          <p className="upload-text-secondary">{formatSize(selectedFile.size)}</p>
          <div className="file-info" onClick={handleRemove}>
            <X size={14} />
            <span>Remove</span>
          </div>
        </>
      ) : (
        <>
          <p className="upload-text-primary">
            Drop your resume PDF here
          </p>
          <p className="upload-text-secondary">
            or click to browse • PDF only
          </p>
        </>
      )}
    </div>
  );
}
