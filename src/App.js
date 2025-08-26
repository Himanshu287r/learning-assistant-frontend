import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  IconButton,
  Typography,
  Paper,
  Avatar,
  Tooltip,
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
    const listElement = messagesListRef.current;
    if (!listElement) return;

    const canScrollTo = typeof listElement.scrollTo === 'function';
    if (canScrollTo) {
      listElement.scrollTo({
        top: listElement.scrollHeight,
        behavior: 'smooth',
      });
    } else {
      listElement.scrollTop = listElement.scrollHeight;
    }
  }, [messages, typing]);

  if (!browserSupportsSpeechRecognition) {
    return <Typography>Browser doesn't support speech recognition. Try Chrome.</Typography>;
  }

  return (
    <Grid container justifyContent="center" alignItems="center" sx={{
      height: '100vh',
      background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
      px: 2,
    }}>
      <Card sx={{
        width: '100%',
        maxWidth: 640,
        height: { xs: '96vh', sm: '90vh' },
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 4,
        boxShadow: 8,
        overflow: 'hidden',
      }}>
         
        {/* Header */}
        <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ bgcolor: 'white', color: 'primary.main', width: 32, height: 32 }}>LA</Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ lineHeight: 1 }}>Learning Assistant</Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>{listening ? '🎤 Listening…' : (typing ? '⌨️ Typing…' : 'Online')}</Typography>
          </Box>
          <Tooltip title={isSpeaking ? 'Stop speech' : 'Read last message'}>
            <IconButton onClick={() => toggleSpeak(messages[messages.length - 1]?.content || '')} color={isSpeaking ? 'error' : 'inherit'} sx={{ color: 'inherit' }}>
              <VolumeUpIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Chat Area */}
        <CardContent sx={{ flex: 1, overflowY: 'auto', background: 'linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.9) 100%)' }} ref={messagesListRef}>
          {messages.map((msg, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'flex-end', gap: 1.25, justifyContent: msg.isUser ? 'flex-end' : 'flex-start', mb: 1.25 }}>
              {!msg.isUser && (
                <Avatar sx={{ width: 28, height: 28, bgcolor: 'primary.light' }}>AI</Avatar>
              )}
              <Paper
                elevation={3}
                sx={{
                  px: 2,
                  py: 1.25,
                  borderRadius: 3,
                  maxWidth: '75%',
                  bgcolor: msg.isUser ? 'primary.main' : 'background.paper',
                  color: msg.isUser ? 'common.white' : 'text.primary',
                }}
              >
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{msg.content}</Typography>
              </Paper>
              {msg.isUser && (
                <Avatar sx={{ width: 28, height: 28, bgcolor: 'secondary.light' }}>You</Avatar>
              )}
            </Box>
          ))}
          {typing && (
            <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', ml: 1 }}>
              AI is typing…
            </Typography>
          )}
        </CardContent>

        {/* Input Bar */}
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', alignItems: 'center', p: 2, gap: 1.25, borderTop: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
          <TextField
            fullWidth
            variant="outlined"
            size="medium"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type your message…"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 999,
                backgroundColor: 'background.default',
              },
            }}
          />
          <Tooltip title={isSpeaking ? 'Stop speech' : 'Read last message'}>
            <IconButton onClick={() => toggleSpeak(messages[messages.length - 1]?.content || '')} color={isSpeaking ? 'error' : 'primary'}>
              <VolumeUpIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Send message">
            <span>
              <IconButton type="submit" color="primary" disabled={!messageInput.trim()}>
                <SendIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title={listening ? 'Stop listening' : 'Start voice input'}>
            <IconButton onClick={toggleListening} color={listening ? 'secondary' : 'default'}>
              {listening ? <MicOffIcon /> : <MicIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Clear voice transcript">
            <IconButton onClick={() => resetTranscript()}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Card>
    </Grid>
  );
};

export default App;
