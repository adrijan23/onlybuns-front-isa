import React, { useState, useEffect, useContext } from 'react';
import { Client, Message } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import axios from '../../config/axiosConfig';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import {
    List, ListItem, ListItemText, Avatar, Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent
} from '@mui/material';

interface ChatMessage {
    username: string;
    content: string;
}

interface User {
    id: number;
    username: string;
}

const Chat: React.FC = () => {
    const { roomId } = useParams<{ roomId: string }>();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [client, setClient] = useState<Client | null>(null);
    const [username, setUsername] = useState<string | null>('');
    const [allUsers, setAllUsers] = useState<User[]>([]); // List of all users
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null); // Selected user ID
    const authContext = useContext(AuthContext);
    if (!authContext) throw new Error('AuthContext is undefined!');
    const { auth } = authContext;
    const userId = auth.user?.id;

    // Establish WebSocket connection and subscribe to topic on mount
    useEffect(() => {
        if (!roomId) return;
        // Get the token from localStorage (same as you do in axios)
        const token = localStorage.getItem('token');
        setUsername(localStorage.getItem('username'));

        const stompClient = new Client({
            brokerURL: 'ws://localhost:8082/socket', // WebSocket URL
            webSocketFactory: () => new SockJS('http://localhost:8082/socket'), // Use SockJS as fallback
            connectHeaders: {
                Authorization: token ? `Bearer ${token}` : '', // Add token to headers if present
            },
            debug: (str) => {
                console.log(str);
            },
            reconnectDelay: 5000,  // Reconnect after 5 seconds if connection is lost
            onConnect: () => {
                console.log(`Connected to WebSocket, subscribing to room: ${roomId}`);
                stompClient.subscribe(`/chat-room/${roomId}`, onMessageReceived);
            },
            onStompError: (error) => {
                console.error('STOMP error: ', error);
            },
        });

        stompClient.activate();

        setClient(stompClient);

        // Cleanup the WebSocket connection on component unmount
        return () => {
            stompClient.deactivate();
        };
    }, [roomId]);

    useEffect(() => {
        if (!userId) return;
        const fetchUsers = async () => {
            try {
                const response = await axios.get<User[]>(`http://localhost:8082/api/${userId}/following`);
                console.log(response.data);
                setAllUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, [userId]);

    // Handle incoming messages
    const onMessageReceived = (message: Message) => {
        console.log('messages: ' + messages);
        const receivedMessage = JSON.parse(message.body);
        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
    };

    // Handle sending a message
    const handleSendMessage = () => {
        console.log('messages: ' + messages.length);
        if (client && client.connected) {
            if (username && message.trim()) {
                const chatMessage: ChatMessage = {
                    username: username,
                    content: message,
                };
                client.publish({
                    destination: `/app/chat/${roomId}`, // STOMP destination for sending messages
                    body: JSON.stringify(chatMessage), // Send message content
                });
                setMessage(''); // Clear input field
            }
        }
    };

    const handleAddUser = async () => {
        if (selectedUserId && roomId) {
            console.log("selectedID: " + selectedUserId);
            try {
                await axios.post(`/api/chat/add-user?userId=${selectedUserId}&roomId=${roomId}`);
                alert('User added to the room successfully');
                setSelectedUserId(null); // Clear selection after adding user
            } catch (error) {
                console.error('Failed to add user to the room:', error);
                alert('Error adding user to the room');
            }
        } else {
            alert('Please select a user');
        }
    };

    // Handle input field change
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(event.target.value);
    };

    const handleUserSelect = (event: SelectChangeEvent<number>) => {
        setSelectedUserId(Number(event.target.value));
    };

    return (
        <div>
            <List>
                {messages.map((msg, index) => (
                    <ListItem key={index}>
                        <Avatar>{msg.username.charAt(0)}</Avatar>
                        <ListItemText
                            primary={<Typography variant="subtitle1" gutterBottom>{msg.username}</Typography>}
                            secondary={msg.content}
                        />
                    </ListItem>
                ))}
            </List>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                    id="standard-basic"
                    label="Message"
                    variant="standard"
                    value={message}
                    onChange={handleInputChange}
                />
                <Button
                    variant="contained"
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                >
                    Send
                </Button>
            </div>

            {/* Dropdown for selecting a user */}
            <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center' }}>
                <FormControl variant="outlined" fullWidth>
                    <InputLabel id="user-select-label">Select User</InputLabel>
                    <Select
                        labelId="user-select-label"
                        id="user-select"
                        value={selectedUserId !== null ? selectedUserId : ""}
                        onChange={handleUserSelect}
                        label="Select User"
                    >
                        {allUsers.map((user) => (
                            <MenuItem key={user.id} value={user.id}>
                                {user.username}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button
                    variant="contained"
                    onClick={handleAddUser}
                    disabled={!selectedUserId}
                    style={{ marginLeft: '10px' }}
                >
                    Add User to Room
                </Button>
            </div>
        </div>
    );
};

export default Chat;
