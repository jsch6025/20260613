import React, { useState, useEffect, useRef } from 'react';
import { Transformer } from 'markmap-lib';
import { Markmap } from 'markmap-view';
import './index.css';

const transformer = new Transformer();

const defaultTemplate = `# 🗺️ 나의 마인드맵
## 🚀 시작하기
- 왼쪽 창에 **Markdown** 형식으로 입력하세요.
- 코드가 실시간으로 오른쪽에 시각화됩니다!

## 🛠️ 작성 문법
- \`#\` 기호로 핵심 주제를 만듭니다.
- \`##\`, \`###\` 등으로 하위 가지를 뻗어 나갑니다.
- \`-\` 이나 \`*\` 로 상세 항목 리스트를 더할 수도 있어요.

## 🎨 조작 방법
- **마우스 드래그**: 마인드맵 위치 이동
- **마우스 휠**: 확대 및 축소(Zoom)
- **노드 클릭**: 하위 가지 접기 / 펴기

## 🔗 Obsidian 커뮤니티
- 본 도구는 오픈소스 \`Markmap\` 라이브러리를 사용합니다.
- Obsidian 내부에서도 똑같은 감성으로 활용 가능해요!`;

function App() {
  const [value, setValue] = useState(defaultTemplate);
  
  // UI States
  const [isEditorOpen, setIsEditorOpen] = useState(true);
  const [editorWidth, setEditorWidth] = useState(400); // 초기 넓이 400px
  const isResizing = useRef(false);

  const svgRef = useRef(null);
  const markmapRef = useRef(null);

  // Initialize and update markmap
  useEffect(() => {
    if (!svgRef.current) return;

    if (!markmapRef.current) {
      markmapRef.current = Markmap.create(svgRef.current);
    }

    const { root } = transformer.transform(value);
    markmapRef.current.setData(root);
    markmapRef.current.fit();

  }, [value]);

  // 창 크기 조절 (Resizer) 로직
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing.current) return;
      // 화면 분할 비율에 따라 최소 200px, 최대 800px 제한
      let newWidth = e.clientX;
      if (newWidth < 200) newWidth = 200;
      if (newWidth > 800) newWidth = 800;
      setEditorWidth(newWidth);
    };

    const handleMouseUp = () => {
      if (isResizing.current) {
        isResizing.current = false;
        document.body.style.cursor = 'default';
        // 드래그가 끝난 후 SVG 위치 재조정
        setTimeout(() => {
          if (markmapRef.current) markmapRef.current.fit();
        }, 50);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handleMouseDown = (e) => {
    e.preventDefault();
    isResizing.current = true;
    document.body.style.cursor = 'col-resize';
  };

  const toggleEditor = () => {
    setIsEditorOpen((prev) => !prev);
    // 에디터 열림/닫힘 후 SVG 크기 재계산
    setTimeout(() => {
      if (markmapRef.current) markmapRef.current.fit();
    }, 100);
  };

  const handleReset = () => {
    if (window.confirm("작성 중인 내용이 사라집니다. 초기화하시겠습니까?")) {
      setValue(defaultTemplate);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([value], { type: 'text/markdown;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'my-obsidian-mindmap.md';
    link.click();
  };

  return (
    <div className="app-wrapper">
      <header>
        <h1>🗺️ Obsidian 스타일 라이브 마인드맵</h1>
        <div className="btn-container">
          <button onClick={toggleEditor}>
            {isEditorOpen ? "📝 에디터 닫기" : "📝 에디터 열기"}
          </button>
          <button onClick={handleReset}>초기화</button>
          <button onClick={handleDownload}>Markdown 다운로드</button>
        </div>
      </header>

      <div className="container">
        {isEditorOpen && (
          <>
            <div className="editor-container" style={{ width: editorWidth }}>
              <textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="이곳에 마크다운을 입력하세요..."
              />
            </div>
            <div 
              className="resizer" 
              onMouseDown={handleMouseDown}
              title="크기 조절"
            />
          </>
        )}
        <div className="viewer-container">
          <svg ref={svgRef} id="mindmap"></svg>
        </div>
      </div>
    </div>
  );
}

export default App;
