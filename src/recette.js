import React, { useState } from 'react';
import { TableRow, TableCell, TextField, Button } from '@mui/material';

const Recette = ({ recette, deleteRecette, updateRecette }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedRecette, setUpdatedRecette] = useState({
    name: recette.name,
    description: recette.description,
    price: recette.price
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedRecette(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleUpdate = () => {
    updateRecette(recette.id, updatedRecette);
    setIsEditing(false);
  };

  return (
    <TableRow>
      {isEditing ? (
        <>
          <TableCell>
            <TextField
              name="name"
              value={updatedRecette.name}
              onChange={handleChange}
              fullWidth
            />
          </TableCell>
          <TableCell>
            <TextField
              name="description"
              value={updatedRecette.description}
              onChange={handleChange}
              fullWidth
            />
          </TableCell>
          <TableCell>
            <TextField
              name="price"
              value={updatedRecette.price}
              onChange={handleChange}
              fullWidth
            />
          </TableCell>
          <TableCell>
            <Button onClick={handleUpdate} variant="contained" color="primary">
              Enregistrer
            </Button>
          </TableCell>
        </>
      ) : (
        <>
          <TableCell>{recette.name}</TableCell>
          <TableCell>{recette.description}</TableCell>
          <TableCell>{recette.price}</TableCell>
          <TableCell>
            {recette.fileUrl ? (
              recette.fileUrl.endsWith('.mp4') ? (
                <video width="100" controls>
                  <source src={recette.fileUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img src={recette.fileUrl} alt={recette.name} width="100" />
              )
            ) : (
              'Aucun fichier'
            )}
          </TableCell>
          <TableCell>
            <Button onClick={() => setIsEditing(true)} variant="contained" color="secondary">
              Modifier
            </Button>
            <Button onClick={() => deleteRecette(recette.id)} variant="contained" color="error" style={{ marginLeft: '8px' }}>
              Supprimer
            </Button>
          </TableCell>
        </>
      )}
    </TableRow>
  );
};

export default Recette;
