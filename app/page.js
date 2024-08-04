'use client';
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import { AppBar, Box, Modal, Stack, TextField, Toolbar, Typography, Button } from "@mui/material";
import { collection, deleteDoc, getDocs, query, setDoc, getDoc, doc } from "firebase/firestore";

export default function Home() {
  const [pantry, setPantry] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemname, setItemname] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPantry, setFilteredPantry] = useState([]);

  const updatePantry = async () => {
    const snapshot = query(collection(firestore, 'pantry'));
    const docs = await getDocs(snapshot);
    const pantryList = [];
    docs.forEach((doc) => {
      pantryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setPantry(pantryList);
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    await updatePantry();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updatePantry();
  };

  useEffect(() => {
    updatePantry();
  }, []);

  useEffect(() => {
    setFilteredPantry(
      pantry.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, pantry]);

  const fetchRecipes = async () => {
    const ingredients = pantry.map(item => item.name).join(', ');
    try {
      const response = await fetch('https://api.edamam.com/search', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          q: ingredients,
          app_id: 'YOUR_APP_ID', // Replace with your App ID
          app_key: 'YOUR_APP_KEY', // Replace with your App Key
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setRecipes(data.hits.map(hit => hit.recipe));
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={2}
      sx={{ backgroundColor: '#d3d6cf', padding: 2 }}
    >
      <AppBar position="fixed" color="primary" sx={{ top: 0, left: 0, right: 0, bgcolor: '#591814' }}>
        <Toolbar>
          <Typography
            variant="h5"
            sx={{ flexGrow: 1 }}
            style={{ fontFamily: 'Butler, Playfair Display, serif' }}
          >
            Pantry Tracker
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        marginTop="64px" // Adjust for AppBar height
        width="100vw"
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={2}
      >
        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
          <TextField
            variant="outlined"
            placeholder="Search items..."
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ backgroundColor: '#bea175', borderRadius: 25 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpen}
            sx={{ borderRadius: 25, bgcolor: '#bb7266', '&:hover': { bgcolor: '#815236' } }}
          >
            Add New Item
          </Button>
        </Stack>

        <Modal open={open} onClose={handleClose}>
          <Box
            position="absolute"
            top="50%"
            left="50%"
            width={400}
            bgcolor="#bea175"
            border="2px solid #591814"
            boxShadow={24}
            p={4}
            display="flex"
            flexDirection="column"
            gap={3}
            sx={{ transform: "translate(-50%, -50%)", borderRadius: 8 }}
          >
            <Typography variant="h6">Add Item</Typography>
            <Stack width="100%" direction="row" spacing={2}>
              <TextField
                variant='outlined'
                fullWidth
                value={itemname}
                onChange={(e) => setItemname(e.target.value)}
                sx={{ borderRadius: 25 }}
              />
              <Button
                variant='contained'
                color='primary'
                onClick={() => {
                  addItem(itemname);
                  setItemname('');
                  handleClose();
                }}
                sx={{ borderRadius: 25, bgcolor: '#bb7266', '&:hover': { bgcolor: '#815236' } }}
              >
                Add
              </Button>
            </Stack>
          </Box>
        </Modal>

        <Box
          width="800px"
          bgcolor="#fff"
          borderRadius="12px"
          boxShadow="0px 4px 12px rgba(0, 0, 0, 0.15)"
          p={2}
          border="1px solid #ddd"
        >
          <Box
            height="100px"
            bgcolor="#591814"
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius="12px 12px 0 0"
            mb={2}
          >
            <Typography variant='h4' color='#fff'>
              Pantry Tracker
            </Typography>
          </Box>

          <Stack width="100%" spacing={2} overflow="auto">
            {filteredPantry.map(({ name, quantity }) => (
              <Box
                key={name}
                width="100%"
                minHeight="60px"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                bgcolor="#f9f9f9"
                padding={2}
                borderRadius="8px"
                border="1px solid #ddd"
                boxShadow="0px 2px 4px rgba(0, 0, 0, 0.1)"
              >
                <Typography variant='h6' color="#333">
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant='h6' color="#333">
                  {quantity}
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => addItem(name)}
                    sx={{ borderRadius: 25, bgcolor: '#bb7266', '&:hover': { bgcolor: '#815236' } }}
                  >
                    Add
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => removeItem(name)}
                    sx={{ borderRadius: 25, borderColor: '#591814', color: '#591814', '&:hover': { borderColor: '#bb7266', color: '#bb7266' } }}
                  >
                    Remove
                  </Button>
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
