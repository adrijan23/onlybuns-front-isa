import React, { useState, useEffect, useContext, useRef } from 'react';
import { Client, Message } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import axios from '../../config/axiosConfig';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext'; import {
    Avatar,
    Button,
    TextField,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    type SelectChangeEvent,
} from "@mui/material"

interface ChatMessage {
    username: string;
    content: string;
}

interface User {
    id: number;
    username: string;
}

interface ChatUser {
    id: number;
    chatRoomId: number;
    user: User;
}

interface ChatRoom {
    id: string;
    name: string;
    chatAdminId: string;
    createdAt: string;
}

const Chat: React.FC = () => {
    const { roomId } = useParams<{ roomId: string }>();
    const { roomName } = useParams<{ roomName: string }>();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [client, setClient] = useState<Client | null>(null);
    const [username, setUsername] = useState<string | null>('');
    const [allUsers, setAllUsers] = useState<User[]>([]); // List of all users
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null); // Selected user ID
    const [currentRoom, setCurrentRoom] = useState<ChatRoom | null>(null); // Current room info
    const [roomUsers, setRoomUsers] = useState<ChatUser[]>([]); // Users currently in the room
    const authContext = useContext(AuthContext);
    if (!authContext) throw new Error('AuthContext is undefined!');
    const { auth } = authContext;
    const userId = auth.user?.id;
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const messagesContainerRef = useRef<HTMLDivElement | null>(null);

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
                setLoading(true);
                const response = await axios.get<User[]>(`http://localhost:8082/api/${userId}/following`);
                console.log(response.data);
                setAllUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [userId]);

    useEffect(() => {
        if (!roomId) return;
        const fetchRoomInfo = async () => {
            try {
                const response = await axios.get(`/api/chat/room/${roomId}`);
                setCurrentRoom(response.data);
            } catch (error) {
                console.error('Error fetching room info:', error);
            }
        };

        const fetchRoomUsers = async () => {
            try {
                const response = await axios.get(`/api/chat/room/${roomId}/users`);
                setRoomUsers(response.data);
            } catch (error) {
                console.error('Error fetching room users:', error);
            }
        };

        fetchRoomInfo();
        fetchRoomUsers();
    }, [roomId]);

    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, []);
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const getLastMessages = async () => {
        try {
            const response = await axios.get(`/api/chat/messages/${roomId}/${userId}`);
            var responseData = response.data;
            // responseData = responseData.reverse();
            setMessages(responseData);
        } catch (err) {
            console.error('Error fetching old messages:', err);
            setError('Failed to fetch old messages.');
        }
    }

    useEffect(() => {
        setMessages([]);
        getLastMessages();
    }, [roomId]);

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
                // Refresh room users list
                const response = await axios.get(`/api/chat/room/${roomId}/users`);
                setRoomUsers(response.data);
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

    const handleUserSelect = (event: SelectChangeEvent<string>) => {
        setSelectedUserId(Number(event.target.value));
    };

    const handleDeleteUser = async (userIdToDelete: number) => {
        if (currentRoom && roomId) {
            try {
                await axios.delete(`/api/chat/delete-user?id=${userIdToDelete}`);
                alert('User removed from the room successfully');
                // Refresh room users list
                const response = await axios.get(`/api/chat/room/${roomId}/users`);
                setRoomUsers(response.data);
            } catch (error) {
                console.error('Failed to remove user from the room:', error);
                alert('Error removing user from the room');
            }
        }
    };

    const isAdmin = currentRoom && String(currentRoom.chatAdminId) === String(userId);

    if (loading) {
        return <p>Loading chat...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
            {/* Room name header */}
            <Typography variant="h6" style={{ padding: "16px" }}>
                {roomName}
            </Typography>

            {/* Scrollable message list */}
            <div
                ref={messagesContainerRef}
                style={{ height: "40%", overflowY: "auto", padding: "0 16px", marginBottom: "16px" }}
            >
                {messages.length === 0 ? <p>No messages yet</p> :
                    <List>
                        {messages.map((msg, index) => (
                            <ListItem key={index}>
                                <ListItemAvatar>
                                    <Avatar>{msg.username.charAt(0)}</Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={<Typography variant="subtitle1">{msg.username == username ? "You" : msg.username}</Typography>}
                                    secondary={msg.content}
                                />
                            </ListItem>
                        ))}
                        {/* This div will ensure we scroll to the bottom */}
                        <div ref={messagesEndRef} />
                    </List>
                }
            </div>

            {/* Fixed bottom bar for message input and user selection */}
            <div style={{ borderTop: "1px solid #ddd", padding: "16px", position: "sticky", bottom: 0, background: "#fff", width: "100%" }}>
                {/* Message input and send button */}
                <div style={{ display: "flex", marginBottom: "16px" }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        value={message}
                        onChange={handleInputChange}
                        placeholder="Type your message..."
                        onKeyPress={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                            }
                        }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSendMessage}
                        disabled={!message.trim()}
                        style={{ marginLeft: "8px" }}
                    >
                        Send
                    </Button>
                </div>

                {/* Admin controls for user management */}
                {isAdmin && (
                    <div style={{ marginBottom: "16px" }}>
                        <Typography variant="h6" style={{ marginBottom: "8px" }}>Room Management (Admin)</Typography>

                        {/* Current room users */}
                        <div style={{ marginBottom: "16px" }}>
                            <Typography variant="subtitle2" style={{ marginBottom: "8px" }}>Current Users:</Typography>
                            <List dense>
                                {roomUsers.map((user) => (
                                    <ListItem key={user.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <ListItemText
                                            primary={
                                                <span>
                                                    {user.user.username}
                                                    {user.user.id === userId && <em> (You)</em>}
                                                    {String(currentRoom?.chatAdminId) === String(user.id) && <strong> (Admin)</strong>}
                                                </span>
                                            }
                                        />
                                        {user.user.id !== userId && (
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                color="error"
                                                onClick={() => handleDeleteUser(user.id)}
                                            >
                                                Remove
                                            </Button>
                                        )}
                                    </ListItem>
                                ))}
                            </List>
                        </div>

                        {/* User selection for adding */}
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <FormControl variant="outlined" fullWidth style={{ marginRight: "8px" }}>
                                <InputLabel id="user-select-label">Select User to Add</InputLabel>
                                <Select
                                    labelId="user-select-label"
                                    value={selectedUserId ? String(selectedUserId) : ''}
                                    onChange={handleUserSelect}
                                    label="Select User to Add"
                                >
                                    {allUsers.filter(user => !roomUsers.some(ru => ru.id === user.id)).map((user) => (
                                        <MenuItem key={user.id} value={user.id}>
                                            {user.username}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Button variant="contained" color="primary" onClick={handleAddUser} disabled={!selectedUserId}>
                                Add User
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat;
