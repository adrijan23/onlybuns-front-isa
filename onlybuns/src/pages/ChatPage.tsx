import React from 'react';
import Chat from '../components/ChatComponent/Chat';
import { useParams } from 'react-router-dom';
import { Grid } from '@mui/material';
import ChatList from '../components/ChatComponent/ChatList';

const ChatPage: React.FC = () => {
    const { roomId } = useParams<{ roomId: string }>(); // Get roomId from URL params

    return (
        <Grid container>
            {/* Chat List on the left (takes 3/12 of the screen) */}
            <Grid item xs={3} style={{ borderRight: '1px solid #ddd' }}>
                <ChatList />
            </Grid>

            {/* Chat messages on the right (takes 9/12 of the screen) */}
            <Grid item xs={9}>
                {roomId ? <Chat /> : <p>Please select a chat room from the list</p>}
            </Grid>
        </Grid>
    );
};

export default ChatPage;