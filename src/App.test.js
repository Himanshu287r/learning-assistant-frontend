import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('react-speech-recognition', () => ({
  __esModule: true,
  default: {
    startListening: jest.fn(),
    stopListening: jest.fn(),
  },
  useSpeechRecognition: () => ({
    transcript: '',
    listening: false,
    resetTranscript: jest.fn(),
    browserSupportsSpeechRecognition: true,
  }),
}));

jest.mock('./components/MessageContent', () => ({
  __esModule: true,
  default: (props) => props.children,
}));

test('renders header title', () => {
  render(<App />);
  const title = screen.getByRole('heading', { name: /Learning Assistant/i });
  expect(title).toBeInTheDocument();
});
