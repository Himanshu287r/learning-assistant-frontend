import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import { Box, Typography, Link as MuiLink } from '@mui/material';

const components = {
  h1: ({ node, ...props }) => (
    <Typography variant="h5" gutterBottom {...props} />
  ),
  h2: ({ node, ...props }) => (
    <Typography variant="h6" gutterBottom {...props} />
  ),
  h3: ({ node, ...props }) => (
    <Typography variant="subtitle1" gutterBottom {...props} />
  ),
  p: ({ node, ...props }) => (
    <Typography variant="body2" sx={{ lineHeight: 1.6 }} {...props} />
  ),
  a: ({ node, ...props }) => (
    <MuiLink target="_blank" rel="noopener noreferrer" {...props} />
  ),
  ul: ({ node, ...props }) => (
    <Box component="ul" sx={{ pl: 3, my: 1 }} {...props} />
  ),
  ol: ({ node, ...props }) => (
    <Box component="ol" sx={{ pl: 3, my: 1 }} {...props} />
  ),
  li: ({ node, ...props }) => (
    <Box component="li" sx={{ mb: 0.5 }} {...props} />
  ),
  code({ inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '');
    if (inline) {
      return (
        <Box component="code" sx={{
          px: 0.5,
          py: 0.1,
          borderRadius: 0.75,
          bgcolor: 'rgba(0,0,0,0.06)',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          fontSize: '0.9em',
        }} {...props}>
          {children}
        </Box>
      );
    }
    return (
      <Box component="pre" sx={{
        my: 1,
        p: 1.25,
        borderRadius: 1,
        overflowX: 'auto',
        bgcolor: 'rgba(0,0,0,0.75)',
      }}>
        <Box component="code" className={className} {...props}>
          {children}
        </Box>
      </Box>
    );
  },
  blockquote: ({ node, ...props }) => (
    <Box component="blockquote" sx={{
      m: 0,
      my: 1,
      px: 2,
      py: 0.5,
      borderLeft: '3px solid',
      borderColor: 'primary.main',
      bgcolor: 'rgba(25, 118, 210, 0.06)',
      borderRadius: 1,
    }} {...props} />
  ),
  table: ({ node, ...props }) => (
    <Box component="table" sx={{
      width: '100%',
      borderCollapse: 'collapse',
      my: 1,
      '& th, & td': { border: '1px solid', borderColor: 'divider', p: 1 },
      '& th': { bgcolor: 'action.hover' },
    }} {...props} />
  ),
};

const MessageContent = ({ children }) => {
  return (
    <Box sx={{
      '& p + p': { mt: 1 },
      '& pre': { mb: 1 },
    }}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeHighlight, { detect: true, ignoreMissing: true }]]}
        components={components}
      >
        {children}
      </ReactMarkdown>
    </Box>
  );
};

export default MessageContent;