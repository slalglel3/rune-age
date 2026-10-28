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
}

export const ResizableDraggableWrapper: React.FC<Props> = ({
  id,
  label,
  layout,
  isEditMode,
  onChange,
  children,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const startPos = useRef<{ x: number; y: number; startX: number; startY: number; startW: number; startH: number }>({
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
      startX: layout.x || 0,
      startY: layout.y || 0,
      startW: layout.w || containerRef.current?.offsetWidth || 120,
      startH: layout.h || containerRef.current?.offsetHeight || 80
    };
  };

  // 리사이즈 시작 (가로/세로 제한 없는 크기 조절)
  const handleResizeStart = (e: React.MouseEvent) => {
    if (!isEditMode) return;
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    startPos.current = {
      x: e.clientX,
      y: e.clientY,
      startX: layout.x || 0,
      startY: layout.y || 0,
      startW: layout.w || containerRef.current?.offsetWidth || 120,
      startH: layout.h || containerRef.current?.offsetHeight || 80
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
      } else if (isResizing) {
        const dx = e.clientX - startPos.current.x;
        const dy = e.clientY - startPos.current.y;
        // 가로·세로 최소 30px 외에는 상한선 없이 무제한 자유 조절!
        onChange({
          ...layout,
          w: Math.max(30, Math.round(startPos.current.startW + dx)),
          h: Math.max(30, Math.round(startPos.current.startH + dy))
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, layout, onChange]);

  // 가로/세로가 지정되어 있을 경우 부모 Flexbox에 의해 찌그러지거나 강제 제한되지 않도록 flex: 'none' 강제 적용
  const style: React.CSSProperties = {
    transform: `translate(${layout.x || 0}px, ${layout.y || 0}px)`,
    width: layout.w ? `${layout.w}px` : undefined,
    height: layout.h ? `${layout.h}px` : undefined,
    flex: layout.w ? 'none' : undefined,
    flexGrow: layout.w ? 0 : undefined,
    flexShrink: 0,
    minWidth: 0,
    maxWidth: 'none',
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
      className={`relative group border-2 border-dashed border-cyan-400 bg-cyan-950/20 rounded-2xl transition-shadow ${
        isDragging ? 'shadow-2xl ring-4 ring-cyan-300 z-50' : 'hover:border-cyan-300'
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
          ({layout.x || 0}, {layout.y || 0}) {layout.w && layout.h ? `[${layout.w}×${layout.h}]` : ''}
        </span>
      </div>

      <div className="w-full h-full overflow-hidden flex flex-col justify-center">
        {children}
      </div>

      {/* 우측 하단 리사이즈 핸들 (대형 눈에 띄는 버튼) */}
      <div
        onMouseDown={handleResizeStart}
        className="absolute -bottom-3 -right-3 w-8 h-8 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-full flex items-center justify-center cursor-nwse-resize shadow-xl z-30 transition transform hover:scale-125"
        title="가로/세로 자유 크기 조절 (드래그)"
      >
        <Maximize2 size={15} className="rotate-90" />
      </div>
    </div>
  );
};
