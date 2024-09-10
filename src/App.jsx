import React, { useState, useEffect } from 'react';
import { Sun, Moon, Settings, Play, Pause, RefreshCw, Coffee, Brain, CheckCircle, Volume2, VolumeX, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PomodoroTimer = () => {
  const [time, setTime] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [mode, setMode] = useState('work');
  const [sessions, setSessions] = useState(4);
  const [currentSession, setCurrentSession] = useState(1);
  const [progress, setProgress] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showMotivationalQuote, setShowMotivationalQuote] = useState(false);

  const motivationalQuotes = [
    "The only way to do great work is to love what you do. - Steve Jobs",
    "Believe you can and you're halfway there. - Theodore Roosevelt",
    "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
    "The future depends on what you do today. - Mahatma Gandhi",
    "Don't watch the clock; do what it does. Keep going. - Sam Levenson"
  ];

  useEffect(() => {
    let interval = null;
    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime - 1;
          const totalTime = mode === 'work' ? workDuration * 60 : breakDuration * 60;
          setProgress(((totalTime - newTime) / totalTime) * 100);
          return newTime;
        });
      }, 1000);
    } else if (time === 0) {
      clearInterval(interval);
      if (soundEnabled) {
        playSound();
      }
      if (mode === 'work') {
        if (currentSession < sessions) {
          setMode('break');
          setTime(breakDuration * 60);
          setShowMotivationalQuote(true);
          setTimeout(() => setShowMotivationalQuote(false), 5000);
        } else {
          setIsActive(false);
          setMode('completed');
        }
      } else {
        setMode('work');
        setCurrentSession((prev) => prev + 1);
        setTime(workDuration * 60);
      }
      setProgress(0);
    }
    return () => clearInterval(interval);
  }, [isActive, time, mode, workDuration, breakDuration, currentSession, sessions, soundEnabled]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTime(workDuration * 60);
    setMode('work');
    setCurrentSession(1);
    setProgress(0);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const playSound = () => {
    const audio = new Audio('/clock.mp3');
    audio.play();
  };

  const handleWorkDurationChange = (value) => {
    const newValue = Math.max(20, Math.min(60, value));
    setWorkDuration(newValue);
  };

  const handleBreakDurationChange = (value) => {
    const newValue = Math.max(5, Math.min(30, value));
    setBreakDuration(newValue);
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center bg-cover bg-center transition-all duration-700 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`} 
        //  style={{backgroundImage: "url('/api/placeholder/1920/1080')"}}>
        style={{backgroundImage: "url('https://images.pexels.com/photos/1496373/pexels-photo-1496373.jpeg?auto=compress&cs=tinysrgb&w=600')"}}>

      <div className={`absolute inset-0 ${isDarkMode ? 'bg-black/60' : 'bg-white/20'} backdrop-blur-sm`}></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className={`z-10 ${isDarkMode ? 'bg-gray-800/80' : 'bg-white/80'} p-12 rounded-3xl shadow-2xl backdrop-blur-md transition-all duration-300 relative overflow-hidden w-full max-w-2xl`}
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-500 to-orange-500"></div>
        
        <div className="absolute top-4 right-4 flex space-x-4">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleDarkMode} 
            className={`p-2 rounded-full ${isDarkMode ? 'bg-amber-700 text-orange-100' : 'bg-orange-100 text-amber-700'} hover:bg-orange-200 dark:hover:bg-amber-600 transition-colors duration-300`}
          >
            {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSoundEnabled(!soundEnabled)} 
            className={`p-2 rounded-full ${isDarkMode ? 'bg-amber-700 text-orange-100' : 'bg-orange-100 text-amber-700'} hover:bg-orange-200 dark:hover:bg-amber-600 transition-colors duration-300`}
          >
            {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleSettings} 
            className={`p-2 rounded-full ${isDarkMode ? 'bg-amber-700 text-orange-100' : 'bg-orange-100 text-amber-700'} hover:bg-orange-200 dark:hover:bg-amber-600 transition-colors duration-300`}
          >
            <Settings size={24} />
          </motion.button>
        </div>
        
        <motion.div 
          key={mode}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-center mb-6"
        >
          {mode === 'work' && <Brain size={40} className={`${isDarkMode ? 'text-orange-300' : 'text-amber-600'} mr-3`} />}
          {mode === 'break' && <Coffee size={40} className={`${isDarkMode ? 'text-orange-300' : 'text-amber-600'} mr-3`} />}
          {mode === 'completed' && <CheckCircle size={40} className={`${isDarkMode ? 'text-green-300' : 'text-green-600'} mr-3`} />}
          <h2 className={`text-2xl font-semibold ${isDarkMode ? 'text-orange-200' : 'text-amber-800'}`}>
            {mode === 'work' ? 'Work Time' : mode === 'break' ? 'Break Time' : 'Sessions Completed!'}
          </h2>
        </motion.div>
        
        <motion.div 
          key={time}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          className={`text-9xl font-bold mb-4 text-center ${isDarkMode ? 'text-orange-100' : 'text-amber-800'}`}
        >
          {mode === 'completed' ? 'Done!' : formatTime(time)}
        </motion.div>

        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-2.5 rounded-full transition-all duration-300 ease-out" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <div className={`text-center mb-6 ${isDarkMode ? 'text-orange-200' : 'text-amber-800'}`}>
          Session {currentSession} of {sessions}
        </div>
        
        <div className="flex justify-center space-x-6 mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTimer}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 transition-all duration-300 flex items-center shadow-lg"
            disabled={mode === 'completed'}
          >
            {isActive ? <Pause size={24} className="mr-2" /> : <Play size={24} className="mr-2" />}
            {isActive ? 'Pause' : 'Start'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetTimer}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 transition-all duration-300 flex items-center shadow-lg"
          >
            <RefreshCw size={24} className="mr-2" />
            Reset
          </motion.button>
        </div>

        <AnimatePresence>
          {showMotivationalQuote && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className={`text-center p-4 rounded-lg ${isDarkMode ? 'bg-gray-700 text-orange-200' : 'bg-orange-100 text-amber-800'}`}
            >
              {motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`mt-8 p-6 ${isDarkMode ? 'bg-gray-800/90' : 'bg-white/90'} rounded-lg shadow-lg`}
            >
              <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-orange-100' : 'text-amber-800'}`}>Settings</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="workDuration" className={`block mb-2 ${isDarkMode ? 'text-orange-200' : 'text-amber-700'}`}>Work Duration: {workDuration} minutes</label>
                  <div className="flex items-center">
                    <button onClick={() => handleWorkDurationChange(workDuration - 1)} className="p-2 bg-orange-200 rounded-l"><ChevronLeft /></button>
                    <input
                      id="workDuration"
                      type="range"
                      min="20"
                      max="60"
                      value={workDuration}
                      onChange={(e) => handleWorkDurationChange(parseInt(e.target.value))}
                      className="w-full"
                    />
                    <button onClick={() => handleWorkDurationChange(workDuration + 1)} className="p-2 bg-orange-200 rounded-r"><ChevronRight /></button>
                  </div>
                </div>
                <div>
                  <label htmlFor="breakDuration" className={`block mb-2 ${isDarkMode ? 'text-orange-200' : 'text-amber-700'}`}>Break Duration: {breakDuration} minutes</label>
                  <div className="flex items-center">
                    <button onClick={() => handleBreakDurationChange(breakDuration - 1)} className="p-2 bg-orange-200 rounded-l"><ChevronLeft /></button>
                    <input
                      id="breakDuration"
                      type="range"
                      min="5"
                      max="30"
                      value={breakDuration}
                      onChange={(e) => handleBreakDurationChange(parseInt(e.target.value))}
                      className="w-full"
                    />
                    <button onClick={() => handleBreakDurationChange(breakDuration + 1)} className="p-2 bg-orange-200 rounded-r"><ChevronRight /></button>
                  </div>
                </div>
                <div>
                  <label htmlFor="sessions" className={`block mb-2 ${isDarkMode ? 'text-orange-200' : 'text-amber-700'}`}>Number of Sessions</label>
                  <input
                    id="sessions"
                    type="number"
                    value={sessions}
                    onChange={(e) => setSessions(Math.max(1, parseInt(e.target.value)))}
                    className="w-full px-3 py-2 border border-amber-300 rounded text-amber-800 bg-orange-50 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default PomodoroTimer;