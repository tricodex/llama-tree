import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { motion } from 'framer-motion';
import './App.css';
import yggdrasilTree from './assets/svg/yggdrasil-world-tree-svg.svg';
import llamaWalkingLeft from './assets/svg/llama-walking-left-leg-up-svg.svg';
import llamaWalkingRight from './assets/svg/llama-walking-right-leg-up-svg.svg';
import playerLlamaLeft from './assets/svg/player-llama-walking-left-leg-up-svg.svg';
import playerLlamaRight from './assets/svg/player-llama-walking-right-leg-up-svg.svg';
import speechBubble from './assets/svg/speech-bubble-svg.svg';

const LlamaTreeGame = () => {
  const [documentUploaded, setDocumentUploaded] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedLlama, setSelectedLlama] = useState(null);
  const [llamaChat, setLlamaChat] = useState([]);
  const [showMiniGame, setShowMiniGame] = useState(false);
  const [miniGameScore, setMiniGameScore] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState({});

  const llamas = [
    { id: 'llama1', name: 'History Llama', specialty: 'History' },
    { id: 'llama2', name: 'Science Llama', specialty: 'Science' },
  ];

  const uploadDocument = () => {
    setDocumentUploaded(true);
    setDialogContent({
      title: "Document Uploaded",
      description: "Your document has been successfully uploaded and processed. You can now start the quiz!",
      action: "Start Quiz"
    });
    setShowDialog(true);
  };

  const startQuiz = () => {
    setCurrentQuiz({
      questions: [
        { id: 1, text: "What is the capital of France?", options: ["London", "Berlin", "Paris", "Madrid"], correctAnswer: "Paris" },
        { id: 2, text: "What is the largest planet in our solar system?", options: ["Mars", "Jupiter", "Saturn", "Earth"], correctAnswer: "Jupiter" },
      ],
      currentQuestion: 0
    });
  };

  const answerQuestion = (answer) => {
    if (answer === currentQuiz.questions[currentQuiz.currentQuestion].correctAnswer) {
      setQuizScore(prevScore => prevScore + 1);
    }
    if (currentQuiz.currentQuestion < currentQuiz.questions.length - 1) {
      setCurrentQuiz(prevQuiz => ({
        ...prevQuiz,
        currentQuestion: prevQuiz.currentQuestion + 1
      }));
    } else {
      setDialogContent({
        title: "Quiz Completed",
        description: `You scored ${quizScore + 1} out of ${currentQuiz.questions.length}!`,
        action: "Continue"
      });
      setShowDialog(true);
      setCurrentQuiz(null);
    }
  };

  const chatWithLlama = (message) => {
    setLlamaChat(prevChat => [...prevChat, { sender: 'user', message }]);
    setTimeout(() => {
      setLlamaChat(prevChat => [...prevChat, { sender: 'llama', message: `${selectedLlama.name} response to "${message}"` }]);
    }, 1000);
  };

  const startMiniGame = () => {
    setShowMiniGame(true);
  };

  const endMiniGame = (score) => {
    setMiniGameScore(score);
    setShowMiniGame(false);
    setDialogContent({
      title: "Mini-Game Completed",
      description: `You scored ${score} points in the mini-game!`,
      action: "Continue"
    });
    setShowDialog(true);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto bg-gradient-to-b from-green-100 to-blue-100 rounded-xl shadow-md overflow-hidden">
      <h1 className="text-4xl font-bold mb-4 text-center text-green-800">Llama Tree</h1>
      
      <div className="tree-container mb-4">
        <img src={yggdrasilTree} alt="Yggdrasil Tree" className="w-full" />
      </div>
      
      {!documentUploaded && (
        <Card className="mb-4">
          <CardContent>
            <Button onClick={uploadDocument}>Upload Document</Button>
          </CardContent>
        </Card>
      )}
      
      {documentUploaded && !currentQuiz && (
        <Card className="mb-4">
          <CardContent>
            <Button onClick={startQuiz}>Start Quiz</Button>
          </CardContent>
        </Card>
      )}
      
      {currentQuiz && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Question {currentQuiz.currentQuestion + 1}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{currentQuiz.questions[currentQuiz.currentQuestion].text}</p>
            {currentQuiz.questions[currentQuiz.currentQuestion].options.map(option => (
              <Button key={option} onClick={() => answerQuestion(option)} className="mr-2 mt-2">{option}</Button>
            ))}
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        {llamas.map(llama => (
          <Card key={llama.id} className={`cursor-pointer ${selectedLlama?.id === llama.id ? 'border-4 border-blue-500' : ''}`} onClick={() => setSelectedLlama(llama)}>
            <CardHeader>
              <CardTitle>{llama.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Specialty: {llama.specialty}</p>
              <img src={llamaWalkingLeft} alt={`${llama.name} walking`} className="w-10 h-10 inline-block" />
            </CardContent>
          </Card>
        ))}
      </div>
      
      {selectedLlama && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Chat with {selectedLlama.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-40 overflow-y-auto mb-2">
              {llamaChat.map((msg, index) => (
                <div key={index} className={`${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  {msg.sender === 'llama' && (
                    <img src={speechBubble} alt="Speech bubble" className="w-6 h-6 inline-block mr-2" />
                  )}
                  <span>{msg.message}</span>
                </div>
              ))}
            </div>
            <input
              type="text"
              placeholder="Type your message..."
              className="w-full p-2 border rounded"
              onKeyPress={(e) => e.key === 'Enter' && chatWithLlama(e.target.value)}
            />
          </CardContent>
        </Card>
      )}
      
      {!showMiniGame && (
        <Button onClick={startMiniGame} className="mb-4">Start Mini-Game</Button>
      )}
      
      {showMiniGame && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Mini-Game</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mini-game-container">
              <img src={playerLlamaLeft} alt="Player Llama" className="w-10 h-10 inline-block" />
              {/* Implement your mini-game here */}
              <Button onClick={() => endMiniGame(Math.floor(Math.random() * 100))}>End Mini-Game</Button>
              <img src={playerLlamaRight} alt="Player Llama" className="w-10 h-10 inline-block" />
            </div>
          </CardContent>
        </Card>
      )}
      
      <Dialog open={showDialog} onClose={() => setShowDialog(false)}>
        <DialogTitle>{dialogContent.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogContent.description}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDialog(false)}>{dialogContent.action}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default LlamaTreeGame;
