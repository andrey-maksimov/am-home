'use client';

import { useState } from 'react';
import PageShell from '@/components/PageShell';
import Card from '@/components/Card';

interface Question {
  question: string;
  options: { label: string; value: string }[];
  correctAnswer: string;
}

const questions: Question[] = [
  {
    question: 'Which is the 3rd planet from the Sun?',
    options: [
      { label: '🔴 Mars', value: 'A' },
      { label: '🌍 Earth', value: 'B' },
      { label: '🪐 Venus', value: 'C' },
    ],
    correctAnswer: 'B',
  },
  {
    question: 'What is the largest land animal?',
    options: [
      { label: '🦒 Giraffe', value: 'A' },
      { label: '🐘 Elephant', value: 'B' },
      { label: '🦏 Rhino', value: 'C' },
    ],
    correctAnswer: 'B',
  },
  {
    question: 'How many emirates are in the UAE?',
    options: [
      { label: '5', value: 'A' },
      { label: '7', value: 'B' },
      { label: '9', value: 'C' },
    ],
    correctAnswer: 'B',
  },
];

export default function TreasurePage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [answeredCorrectly, setAnsweredCorrectly] = useState<boolean[]>([]);
  const [showError, setShowError] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [fullScreenMap, setFullScreenMap] = useState(false);

  const allQuestionsAnswered = answeredCorrectly.length === questions.length;

  const handleAnswerSubmit = () => {
    if (!selectedAnswer) return;

    const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer;

    if (isCorrect) {
      setShowError(false);
      const newAnswered = [...answeredCorrectly, true];
      setAnsweredCorrectly(newAnswered);
      setSelectedAnswer('');

      if (newAnswered.length === questions.length) {
        // All questions answered correctly
        setShowVictory(true);
        setTimeout(() => {
          setShowMap(true);
        }, 2000);
      } else {
        // Move to next question
        setTimeout(() => {
          setCurrentQuestion(currentQuestion + 1);
        }, 500);
      }
    } else {
      setShowError(true);
      setTimeout(() => setShowError(false), 1500);
    }
  };

  if (fullScreenMap) {
    return (
      <div
        className="fixed inset-0 z-50 bg-black flex items-center justify-center cursor-pointer"
        onClick={() => setFullScreenMap(false)}
      >
        <img
          src="/treasure-map.png"
          alt="Treasure Map"
          className="max-w-full max-h-full object-contain"
        />
        <button
          className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300"
          onClick={() => setFullScreenMap(false)}
        >
          ×
        </button>
      </div>
    );
  }

  return (
    <PageShell title="Treasure Hunt">
      <div className="space-y-6 max-w-2xl mx-auto">
        {!allQuestionsAnswered ? (
          <>
            {/* Evil Magician Image - Floating above questions */}
            <div className="flex flex-col items-center space-y-4 animate-float">
              <div className="relative">
                <img
                  src="/evil-magician.png"
                  alt="Evil Magician"
                  className="w-48 h-48 object-contain drop-shadow-2xl animate-bounce-subtle"
                  style={{ background: 'transparent' }}
                />
                {/* Magic aura */}
                <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-3xl animate-pulse pointer-events-none" />
              </div>
              <div className="text-center space-y-2 max-w-md">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400">
                  The Evil Magician&apos;s Challenge
                </h2>
                <p className="text-gray-300 text-sm leading-relaxed">
                  An evil magician has hidden the ancient treasure map! 
                  Only those brave enough to solve his riddles shall claim it. 
                  Answer wisely, hero!
                </p>
              </div>
            </div>

            <Card>
            <div className="space-y-6">
              {/* Progress */}
              <div className="flex items-center justify-center gap-2">
                {questions.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                      idx < answeredCorrectly.length
                        ? 'bg-gradient-to-r from-yellow-500 to-amber-600'
                        : idx === currentQuestion
                        ? 'bg-white/30 animate-pulse'
                        : 'bg-white/10'
                    }`}
                  />
                ))}
              </div>

              {/* Question */}
              <div className="text-center space-y-6">
                <h2 className="text-2xl font-bold text-white">
                  Question {currentQuestion + 1} of {questions.length}
                </h2>
                <p className="text-xl text-gray-200">
                  {questions[currentQuestion].question}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {questions[currentQuestion].options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedAnswer(option.value)}
                    className={`w-full p-4 rounded-lg text-left transition-all duration-300 ${
                      selectedAnswer === option.value
                        ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white scale-105 shadow-lg shadow-yellow-500/50'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    <span className="font-medium">{option.value})</span> {option.label}
                  </button>
                ))}
              </div>

              {/* Error Message */}
              {showError && (
                <div className="text-center animate-shake">
                  <p className="text-red-400 font-medium">
                    Not quite! Try again, adventurer!
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleAnswerSubmit}
                disabled={!selectedAnswer}
                className={`w-full py-4 rounded-lg font-bold text-lg transition-all duration-300 ${
                  selectedAnswer
                    ? 'bg-gradient-to-r from-space-purple to-space-blue text-white hover:scale-105 shadow-lg'
                    : 'bg-white/10 text-gray-500 cursor-not-allowed'
                }`}
              >
                Submit Answer
              </button>
            </div>
          </Card>
          </>
        ) : (
          <>
            {/* Victory Animation */}
            {showVictory && !showMap && (
              <div className="text-center space-y-6 animate-bounce-in">
                <div className="text-8xl animate-spin-slow">🏆</div>
                <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 animate-glow">
                  Victory!
                </h2>
                <p className="text-xl text-gray-300">
                  You&apos;ve proven yourself worthy, brave adventurer!
                </p>
              </div>
            )}

            {/* Treasure Map Reveal */}
            {showMap && (
              <div className="space-y-6 animate-fade-in-up">
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600">
                    Your Reward Awaits
                  </h2>
                  <p className="text-gray-300">
                    Behold the ancient treasure map! Click to examine it closely.
                  </p>
                </div>

                {/* Secret Clue Text */}
                <Card>
                  <div className="text-center space-y-4 py-4">
                    <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 animate-glow">
                      Space Mission Activated!
                    </h3>
                    <div className="space-y-2 text-lg text-gray-200">
                      <p className="font-semibold text-cyan-300">Welcome, Space Cadets.</p>
                      <p className="text-yellow-400 font-medium">This is the map of Planet Garden.</p>
                      <p className="text-amber-300">Your next signal is hidden where fire once slept.</p>
                      <p className="text-red-400 font-semibold">But the message cannot be seen.</p>
                      <p className="text-orange-400 font-bold text-xl">Only heat can reveal it.</p>
                    </div>
                  </div>
                </Card>

                <div
                  className="cursor-pointer transform transition-all duration-500 hover:scale-105 animate-float"
                  onClick={() => setFullScreenMap(true)}
                >
                  <div className="relative rounded-xl overflow-hidden shadow-2xl shadow-yellow-500/30 border-4 border-yellow-600/50">
                    <img
                      src="/treasure-map.png"
                      alt="Ancient Treasure Map"
                      className="w-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center pb-4">
                      <p className="text-white font-medium text-sm bg-black/50 px-4 py-2 rounded-full">
                        Click to view full size
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <a
                    href="/h"
                    className="inline-block px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300"
                  >
                    Return to home
                  </a>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </PageShell>
  );
}
