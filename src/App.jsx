import React, { useState } from 'react';
import MindmapApp from './MindmapApp';
import './Portal.css';

function App() {
  const [currentView, setCurrentView] = useState('portal');

  if (currentView === 'mindmap') {
    return (
      <div style={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column' }}>
        <button 
          onClick={() => setCurrentView('portal')}
          style={{ 
            padding: '12px 20px', 
            background: '#2f3136', 
            color: '#fff', 
            border: 'none', 
            borderBottom: '1px solid #202225',
            cursor: 'pointer',
            textAlign: 'left',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          ⬅ 포탈로 돌아가기
        </button>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <MindmapApp />
        </div>
      </div>
    );
  }

  const shortcuts = [
    { id: 'mindmap', title: 'React 마인드맵 (현재 기능)', type: 'react', image: '🗺️' },
    { id: 'test', title: 'HTML 마인드맵', type: 'link', url: '/test.html', image: '📄' },
    { id: 'subpage', title: 'Subpage', type: 'link', url: '/subpage.html', image: '🔗' },
    { id: 'dummy1', title: '준비중 1', type: 'dummy', image: '⏳' },
    { id: 'dummy2', title: '준비중 2', type: 'dummy', image: '⏳' },
    { id: 'dummy3', title: '준비중 3', type: 'dummy', image: '⏳' },
    { id: 'dummy4', title: '준비중 4', type: 'dummy', image: '⏳' },
  ];

  const handleShortcutClick = (shortcut) => {
    if (shortcut.type === 'react') {
      setCurrentView(shortcut.id);
    } else if (shortcut.type === 'link') {
      window.location.href = shortcut.url;
    } else {
      alert('준비 중인 기능입니다.');
    }
  };

  return (
    <div className="portal-container">
      <header className="portal-header">
        <h1>🚀 My Portal</h1>
        <p>원하시는 기능을 선택해주세요</p>
      </header>
      <div className="portal-grid">
        {shortcuts.map((sc) => (
          <div key={sc.id} className="portal-card" onClick={() => handleShortcutClick(sc)}>
            <div className="portal-thumbnail">
              <span className="portal-emoji">{sc.image}</span>
            </div>
            <div className="portal-title">{sc.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
