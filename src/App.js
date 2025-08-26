import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  IconButton,
  Typography,
  Paper,
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import SendIcon from '@mui/icons-material/Send';
import RefreshIcon from '@mui/icons-material/Refresh';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import '@fontsource/roboto';

const App = () => {
  const messagesListRef = useRef(null);
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const [isSpeaking, setIsSpeaking] = useState(false);


  async function getBotResponse(userMessage) {
    try {
      setTyping(true); // show typing indicator
      const response = await fetch('https://leaning-assistant-backend.onrender.com/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await response.json();
      return data.reply || "Sorry, I didn’t get that.";
    } catch (error) {
      console.error('Error talking to backend:', error);
      return 'Error: Unable to reach AI server.';
    } finally {
      setTyping(false);
    }
  }

      // Speak bot response
    const toggleSpeak = (text) => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      // Stop speaking
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      // Start speaking
      window.speechSynthesis.cancel(); // clear any queued speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.onend = () => setIsSpeaking(false); // reset when finished
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };



  const sendMessage = async (content) => {
    if (!content.trim()) return;
    setMessages((prev) => [...prev, { content, isUser: true }]);
    setMessageInput('');

    const botReply = await getBotResponse(content);

    setMessages((prev) => [...prev, { content: botReply, isUser: false }]);
    toggleSpeak(botReply);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage(messageInput);
  };

  useEffect(() => {
    if (transcript) {
      setMessageInput(transcript);
    }
  }, [transcript]);

  const toggleListening = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  useEffect(() => {
    const welcome = "👋 Welcome! I'm your learning assistant. Ask me about any topic.";
    setMessages([{ content: welcome, isUser: false }]);
    toggleSpeak(welcome);
  }, []);

  useEffect(() => {
    if (messagesListRef.current) {
      messagesListRef.current.scrollTo({
        top: messagesListRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, typing]);

  if (!browserSupportsSpeechRecognition) {
    return <Typography>Browser doesn't support speech recognition. Try Chrome.</Typography>;
  }

  return (
    <Grid container justifyContent="center" alignItems="center" sx={{ height: '100vh', bgcolor: 'linear-gradient(to right, #e0f7fa, #f1f8e9)' }}>
      <Card sx={{ width: '100%', maxWidth: 500, height: '90vh', display: 'flex', flexDirection: 'column', borderRadius: 3, boxShadow: 4 }}>
        
        {/* Header */}
        <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 2, borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
          <Typography variant="h6">Learning Assistant 🤖</Typography>
          <Typography variant="body2">{listening ? '🎤 Listening...' : ''}</Typography>
        </Box>

        {/* Chat Area */}
        <CardContent sx={{ flex: 1, overflowY: 'auto' }} ref={messagesListRef}>
          {messages.map((msg, index) => (
            <Box key={index} sx={{ display: 'flex', justifyContent: msg.isUser ? 'flex-end' : 'flex-start', mb: 1 }}>
              <Paper
                elevation={3}
                sx={{
                  px: 2,
                  py: 1,
                  borderRadius: 3,
                  maxWidth: '70%',
                  bgcolor: msg.isUser ? 'primary.main' : 'grey.200',
                  color: msg.isUser ? 'white' : 'black',
                }}
              >
                {msg.content}
              </Paper>
            </Box>
          ))}
          {typing && (
            <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic', ml: 1 }}>
              AI is typing...
            </Typography>
          )}
        </CardContent>

        {/* Input Bar */}
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', alignItems: 'center', p: 2, borderTop: '1px solid #ddd' }}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type your message..."
            sx={{ borderRadius: '50px', bgcolor: 'white' }}
          />
          <IconButton 
            onClick={() => toggleSpeak(messages[messages.length - 1]?.content || '')} 
            color={isSpeaking ? 'error' : 'primary'}
          >
            <VolumeUpIcon />
          </IconButton>


          <IconButton type="submit" color="primary">
            <SendIcon />
          </IconButton>
          <IconButton onClick={toggleListening} color={listening ? 'secondary' : 'default'}>
            {listening ? <MicOffIcon /> : <MicIcon />}
          </IconButton>
          <IconButton onClick={() => resetTranscript()}>
            <RefreshIcon />
          </IconButton>
          
        </Box>
      </Card>
    </Grid>
  );
};

export default App;
