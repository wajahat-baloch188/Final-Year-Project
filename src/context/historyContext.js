// historyContext.js

import React, { createContext, useContext, useState } from 'react';

const HistoryContext = createContext();

export const HistoryProvider = ({ children }) => {
  const [history, setHistory] = useState([]);

  const addHistory = (imageUri) => {
    const newItem = {
      id: Date.now().toString(),
      uri: imageUri,
      date: new Date().toLocaleDateString(),
    };
    setHistory((prevHistory) => [...prevHistory, newItem]);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <HistoryContext.Provider value={{ history, addHistory, clearHistory }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => useContext(HistoryContext);
