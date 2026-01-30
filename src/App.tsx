import { useState } from 'react';
import './App.css';
import { Home, NightRoutineApp } from './components';

type AppPage = 'home' | 'night-routine';

function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>('home');

  const handleSelectApp = (appId: string) => {
    setCurrentPage(appId as AppPage);
  };

  const handleBack = () => {
    setCurrentPage('home');
  };

  return (
    <>
      {currentPage === 'home' && <Home onSelectApp={handleSelectApp} />}
      {/* {currentPage === 'night-task' && <NightTaskManager onBack={handleBack} />} */}
      {currentPage === 'night-routine' && <NightRoutineApp onBack={handleBack} />}
    </>
  );
}

export default App
