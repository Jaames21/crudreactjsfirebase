import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from './firebase';
import Recette from './recette';
import { 
  Container, 
  TextField, 
  Button, 
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody,
  Box,
  Typography,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Paper 
} from '@mui/material';
//import axios from 'axios' ;

const RecetteApp = () => {
  const [recettes, setRecettes] = useState([]);
  const [newRecette, setNewRecette] = useState({
    name: '',
    description: '',
    price: '',
    fileUrl:'',
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState('');

  const handleFileTypeChange = (event) => {
    setFileType(event.target.value);
    setSelectedFile(null);
  };
  // Méthode pour le type de fichier acceptables
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (fileType === 'image' && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      setSelectedFile(file);
    } else if (fileType === 'video' && file.type === 'video/mp4') {
      setSelectedFile(file);
    } else {
      alert('Format de fichier non supporté.');
    }
  };

  // Méthode au cas où aucun fichier n'est sélectionné
  // const handleSubmitFile = async (event) => {
  //   event.preventDefault();
  //   if (!selectedFile) {
  //     alert('Veuillez sélectionner un fichier.');
  //     return;
  //   }
    
  //   const fileRef = ref(storage, `files/${selectedFile.name}`);
  //   await uploadBytes(fileRef, selectedFile);
  //   const fileUrl = await getDownloadURL(fileRef);

  //   addRecette(fileUrl);

  //   console.log("fileUrl");
  //   //addRecette(fileUrl);

  // };


  useEffect(() => {
    const fetchRecettes = async () => {
      const recettesCollection = collection(db, "recettes");
      const recettesSnapshot = await getDocs(recettesCollection);
      const recettesList = recettesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecettes(recettesList);
    };

    fetchRecettes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewRecette(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const addRecette = async () => {
    if (newRecette.name.trim() !== '' && newRecette.description.trim() !== '' && newRecette.price.trim() !== '') {

      let fileUrl = '';
      if (selectedFile) {
        const fileRef = ref(storage, `files/${selectedFile.name}`);
        await uploadBytes(fileRef, selectedFile);
        fileUrl = await getDownloadURL(fileRef);
        // alert(fileUrl.toString());
        newRecette.fileUrl = fileUrl;
      }

      const recetteToAdd = { ...newRecette, fileUrl }; // Ajouter l'URL du fichier
      const docRef = await addDoc(collection(db, "recettes"), newRecette);
      setRecettes([...recettes, { id: docRef.id, ...newRecette }]);
      setNewRecette({ name: '', description: '', price: '', fileUrl:'' });
      setSelectedFile(null); // Réinitialiser le fichier sélectionné
      setFileType(''); // Réinitialiser le type de fichier sélectionné
    }
  };

  // Méthode pour suppression recettes
  const deleteRecette = async (id) => {
    await deleteDoc(doc(db, "recettes", id));
    setRecettes(recettes.filter(recette => recette.id !== id));
  };

  // Méthode pour la modification d'une recette
  const updateRecette = async (id, updatedRecette) => {
    const recetteDoc = doc(db, "recettes", id);
    await updateDoc(recetteDoc, updatedRecette);
    setRecettes(recettes.map(recette => recette.id === id ? { ...recette, ...updatedRecette } : recette));
  };

  return (
    <Container>
      <Box sx={{ backgroundColor: 'blue', width: '100%', mb: 3 }}>
        <Typography variant="h2" align="center" color="white">Recettes de Cuisine</Typography>
      </Box>
      <TextField
        label="Nom"
        name="name"
        value={newRecette.name}
        onChange={handleChange}
        margin="normal"
        fullWidth
      />
      <TextField
        label="Description"
        name="description"
        value={newRecette.description}
        onChange={handleChange}
        margin="normal"
        fullWidth
      />
      <TextField
        label="Prix"
        name="price"
        value={newRecette.price}
        onChange={handleChange}
        margin="normal"
        fullWidth
      />
      <Box sx={{ minWidth: 120 }}>
        <FormControl sx={{width: '30%'}}>
          <InputLabel id="demo-simple-select-label">Fichier</InputLabel>
          <Select
            labelId="choix-pj-label"
            id="choix-pj-select"
            value={fileType}
            label="Format de pièce jointe "
            onChange={handleFileTypeChange}
          >
            <MenuItem value="image">Image</MenuItem>
            <MenuItem value="video">Vidéo</MenuItem>
          </Select>
        </FormControl>
      </Box>
      {fileType && (
        <Box sx={{ mt: 3 }}>
          <input
            type="file"
            accept={fileType === 'image' ? 'image/jpeg,image/png' : 'video/mp4'}
            onChange={handleFileSelect}
          />
        </Box>
      )}
      <Button 
        variant="contained" 
        color="primary" 
        onClick={addRecette} 
        style={{ marginTop: '16px' }}
      >
        Ajouter
      </Button>
      <Paper style={{ marginTop: '16px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Prix</TableCell>
              <TableCell>Image/Vidéo</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recettes.map(recette => (
              <Recette
                key={recette.id}
                recette={recette}
                deleteRecette={deleteRecette}
                updateRecette={updateRecette}
              />
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};

export default RecetteApp;
