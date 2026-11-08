import React, { useRef, useState, useEffect } from 'react';
import { ElementLayout } from '../types/layout';
import { Move, Maximize2 } from 'lucide-react';

interface Props {
  id: string;
  label: string;
  layout: ElementLayout;
  isEditMode: boolean;
  onChange: (newLayout: ElementLayout) => void;
  children: React.ReactNode;
  className?: string;
  defaultZIndex?: number;
}

export const ResizableDraggableWrapper: React.FC<Props> = ({
  id,
  label,
  layout,
  isEditMode,
  onChange,
  children,
  className = '',
  defaultZIndex = 10
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [resizeMode, setResizeMode] = useState<'both' | 'width' | 'height' | null>(null);

  const startPos = useRef<{
    x: number;
    y: number;
    startX: number;
    startY: number;
    startW: number;
    startH: number;
  }>({
    x: 0,
    y: 0,
    startX: 0,
    startY: 0,
    startW: 0,
    startH: 0
  });

  // 드래그 시작 (위치 이동)
  const handleDragStart = (e: React.MouseEvent) => {
    if (!isEditMode) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    startPos.current = {
      x: e.clientX,
      y: e.clientY,
      startX: layout.x ?? 0,
      startY: layout.y ?? 0,
      startW: layout.w ?? containerRef.current?.offsetWidth ?? 120,
      startH: layout.h ?? containerRef.current?.offsetHeight ?? 80
    };
  };

  // 리사이즈 시작 (모드: both, width, height)
  const handleResizeStart = (e: React.MouseEvent, mode: 'both' | 'width' | 'height') => {
    if (!isEditMode) return;
    e.preventDefault();
    e.stopPropagation();
    setResizeMode(mode);
    startPos.current = {
      x: e.clientX,
      y: e.clientY,
      startX: layout.x ?? 0,
      startY: layout.y ?? 0,
      startW: layout.w ?? containerRef.current?.offsetWidth ?? 120,
      startH: layout.h ?? containerRef.current?.offsetHeight ?? 80
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const dx = e.clientX - startPos.current.x;
        const dy = e.clientY - startPos.current.y;
        onChange({
          ...layout,
          x: Math.round(startPos.current.startX + dx),
          y: Math.round(startPos.current.startY + dy)
        });
      } else if (resizeMode) {
        const dx = e.clientX - startPos.current.x;
        const dy = e.clientY - startPos.current.y;

        const newW = (resizeMode === 'both' || resizeMode === 'width')
          ? Math.max(30, Math.round(startPos.current.startW + dx))
          : layout.w;

        const newH = (resizeMode === 'both' || resizeMode === 'height')
          ? Math.max(30, Math.round(startPos.current.startH + dy))
          : layout.h;

        onChange({
          ...layout,
          w: newW,
          h: newH
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setResizeMode(null);
    };

    if (isDragging || resizeMode) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, resizeMode, layout, onChange]);

  // 100% 완전 독립 절대 좌표 (Absolute Positioning)
  // 다른 어떤 요소와도 flex/flow 간섭이 일어나지 않으며, 개별 좌표와 크기로만 렌더링됨!
  const zIndex = isDragging || resizeMode
    ? 999
    : (id === 'playerMat' || id === 'enemyMat' ? 1 : defaultZIndex);

  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${layout.x ?? 0}px`,
    top: `${layout.y ?? 0}px`,
    width: layout.w ? `${layout.w}px` : undefined,
    height: layout.h ? `${layout.h}px` : undefined,
    zIndex,
    userSelect: isDragging || resizeMode ? 'none' : undefined,
  };

  if (!isEditMode) {
    return (
      <div ref={containerRef} style={style} className={className}>
        {children}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={style}
      className={`relative group border-2 border-dashed border-cyan-400 bg-cyan-950/25 rounded-2xl transition-shadow ${
        isDragging ? 'shadow-2xl ring-4 ring-cyan-300' : 'hover:border-cyan-300'
      } ${className}`}
    >
      {/* 상단 드래그 핸들 바 */}
      <div
        onMouseDown={handleDragStart}
        className="absolute -top-7 left-0 right-0 bg-cyan-700/95 hover:bg-cyan-600 text-white font-mono font-bold text-[11px] px-2.5 py-0.5 rounded-t-xl flex items-center justify-between cursor-move shadow-md z-30 select-none whitespace-nowrap"
      >
        <span className="flex items-center gap-1">
          <Move size={12} /> {label}
        </span>
        <span className="text-[10px] text-cyan-200">
          ({layout.x ?? 0}, {layout.y ?? 0}) {layout.w && layout.h ? `[${layout.w}×${layout.h}]` : ''}
        </span>
      </div>

      <div className="w-full h-full overflow-hidden flex flex-col justify-center">
        {children}
      </div>

      {/* 1. 우측 가장자리 핸들 (가로 너비만 조절) */}
      <div
        onMouseDown={(e) => handleResizeStart(e, 'width')}
        className="absolute top-2 bottom-2 -right-1.5 w-3 cursor-ew-resize hover:bg-amber-400/80 rounded-full z-30 transition"
        title="가로 너비만 조절 (좌우 드래그)"
      />

      {/* 2. 하단 가장자리 핸들 (세로 높이만 조절) */}
      <div
        onMouseDown={(e) => handleResizeStart(e, 'height')}
        className="absolute left-2 right-2 -bottom-1.5 h-3 cursor-ns-resize hover:bg-amber-400/80 rounded-full z-30 transition"
        title="세로 높이만 조절 (상하 드래그)"
      />

      {/* 3. 우측 하단 모서리 핸들 (가로 + 세로 동시 조절) */}
      <div
        onMouseDown={(e) => handleResizeStart(e, 'both')}
        className="absolute -bottom-3 -right-3 w-8 h-8 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-full flex items-center justify-center cursor-nwse-resize shadow-xl z-40 transition transform hover:scale-125"
        title="가로/세로 동시 크기 조절 (드래그)"
      >
        <Maximize2 size={15} className="rotate-90" />
      </div>
    </div>
  );
};
