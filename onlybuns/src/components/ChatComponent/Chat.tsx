import React, { useState, useEffect } from 'react';
import { Client, Message } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { List, ListItem, Avatar, ListItemText, Typography, TextField, Button } from '@mui/material';

interface ChatMessage {
    username: string;
    content: string;
}

const Chat: React.FC = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [client, setClient] = useState<Client | null>(null);
    const [username, setUsername] = useState<string | null>('');

    // Establish WebSocket connection and subscribe to topic on mount
    useEffect(() => {
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
                console.log('Connected to WebSocket');
                stompClient.subscribe('/topic/messages', onMessageReceived);
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
    }, []);

    // Handle incoming messages
    const onMessageReceived = (message: Message) => {
        const receivedMessage = JSON.parse(message.body);
        setMessages((prevMessages) => [...prevMessages, receivedMessage.content]);
    };

    // Handle sending a message
    const handleSendMessage = () => {
        if (client && client.connected) {
            if (username && message.trim()) {
                const chatMessage: ChatMessage = {
                    username: username,
                    content: message,
                };
                client.publish({
                    destination: '/app/chat', // STOMP destination for sending messages
                    body: JSON.stringify(chatMessage), // Send message content
                });
                setMessage(''); // Clear input field
            }
        }
    };

    // Handle input field change
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(event.target.value);
    };

    return (
        <div>
            <List>
                {messages.map((msg, index) => (
                    <ListItem key={index}>
                        <Avatar>{username?.charAt(0)}</Avatar>
                        <ListItemText
                            primary={<Typography variant='subtitle1' gutterBottom>{msg.username}</Typography>}
                            secondary={msg.content}
                        />
                    </ListItem>
                ))}
            </List>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <TextField id='standard-basic' label='message' variant='standard' value={message} onChange={handleInputChange} />
                <Button variant='contained' onClick={handleSendMessage} disabled={!message.trim()}>Send</Button>
            </div>
        </div>
    );
};

export default Chat;
