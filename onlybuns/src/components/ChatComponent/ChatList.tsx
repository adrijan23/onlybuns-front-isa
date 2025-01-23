import React, { useState, useEffect, useContext } from 'react';
import { List, ListItem, ListItemText, Typography, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from '../../config/axiosConfig';
import { AuthContext } from '../../context/AuthContext';

interface ChatRoom {
    id: string;
    name: string;
}

const ChatList: React.FC = () => {
    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
    const [open, setOpen] = useState(false); //dialog
    const [newRoomName, setNewRoomName] = useState('');
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);
    if (!authContext) throw new Error('AuthContext is undefined!');
    const { auth } = authContext;
    const userId = auth.user?.id;

    // Fetch the list of available chat rooms from the backend
    useEffect(() => {
        const fetchChatRooms = async () => {
            if (!userId) return;
            try {
                const response = await axios.get('/api/chat/chatrooms/' + userId);
                console.log(chatRooms);
                setChatRooms(response.data);
            } catch (error) {
                console.error('Failed to fetch chat rooms:', error);
            }
        };

        fetchChatRooms();
    }, [userId]);

    // Handle clicking on a chat room, updating the URL with the roomId
    const handleChatRoomClick = (roomId: string) => {
        navigate(`/chat/${roomId}`); // Update the URL to reflect the selected chat room
    };

    // Handle opening the dialog to create a new room
    const handleOpenDialog = () => {
        setOpen(true);
    };

    // Handle closing the dialog
    const handleCloseDialog = () => {
        setOpen(false);
        setNewRoomName(''); // Reset the form input
    };

    // Handle creating a new chat room
    const handleCreateRoom = async () => {
        try {
            const response = await axios.post(`/api/chat/create?userId=${userId}&roomName=${newRoomName}`);
            console.log("userID: " + userId);

            const newRoom = response.data;
            setChatRooms([...chatRooms, newRoom]); // Add the new room to the chatRooms list
            handleCloseDialog(); // Close the dialog after successful creation
        } catch (error) {
            console.error('Failed to create chat room:', error);
        }
    };

    return (
        <div>
            <Button variant="contained" color="primary" onClick={handleOpenDialog}>
                Create New Room
            </Button>

            <List>
                {chatRooms.map((chatRoom) => (
                    <ListItem
                        component="div"
                        key={chatRoom.id}
                        onClick={() => handleChatRoomClick(chatRoom.id)}
                        style={{ cursor: 'pointer' }}
                    >
                        <ListItemText
                            primary={<Typography variant="subtitle1">{chatRoom.name}</Typography>}
                        />
                    </ListItem>
                ))}
            </List>

            {/* Dialog for creating a new chat room */}
            <Dialog open={open} onClose={handleCloseDialog}>
                <DialogTitle>Create New Chat Room</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Room Name"
                        fullWidth
                        value={newRoomName}
                        onChange={(e) => setNewRoomName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleCreateRoom} color="primary">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ChatList;
