import React, { useRef, useState } from 'react';
import styled from 'styled-components';

const StyledUploadButton = styled.div`
  display: inline-block;
  background-color: #3498db;
  color: #ffffff;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
`;

const FileInput = styled.input`
  display: none;
`;

const ImagePreview = styled.img`
  height: 50px;
  width: 50px;
  object-fit: cover;
  border-radius: 50%;
`;

const FileName = styled.div`
  margin-top: 5px;
`;

const DeleteButton = styled.button`
  background-color: #e74c3c;
  color: #ffffff;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 5px;
`;

const Upload = ({ name, accept, onChange, onFileDelete }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.value = null;
    fileInputRef.current.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    onChange(event);
  };

  const handleDeleteClick = () => {
    setSelectedFile(null);
    fileInputRef.current.value = null;
    onFileDelete();
  };

  return (
    <>
      <StyledUploadButton onClick={handleClick}>
        Sélectionner un fichier
      </StyledUploadButton>
      <FileInput
        type="file"
        name={name}
        accept={accept}
        ref={fileInputRef}
        onChange={handleImageChange}
      />
      {selectedFile && (
        <>
          <ImagePreview src={URL.createObjectURL(selectedFile)} alt="Preview" />
          <FileName>{selectedFile.name}</FileName>
          <DeleteButton onClick={handleDeleteClick}>Supprimer</DeleteButton>
        </>
      )}
    </>
  );
};

export default Upload;
