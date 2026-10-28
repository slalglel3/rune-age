import React, { useState, useRef } from 'react';
import { LayoutConfig } from '../types/layout';
import { Copy, RotateCcw, Check, Sliders, X, Eye, Save, Download, Upload } from 'lucide-react';

interface Props {
  config: LayoutConfig;
  onUpdateTilt: (angle: number) => void;
  onReset: () => void;
  onClose: () => void;
  onSaveServer: () => Promise<boolean>;
  onImportLayout: (config: LayoutConfig) => void;
}

export const LayoutEditorToolbar: React.FC<Props> = ({
  config,
  onUpdateTilt,
  onReset,
  onClose,
  onSaveServer,
  onImportLayout
}) => {
  const [copied, setCopied] = useState(false);
  const [serverSaved, setServerSaved] = useState(false);
  const [showJsonModal, setShowJsonModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const jsonString = JSON.stringify(config, null, 2);

  // 서버에 영구 파일로 저장
  const handleSaveToServer = async () => {
    const success = await onSaveServer();
    if (success) {
      setServerSaved(true);
      setTimeout(() => setServerSaved(false), 2500);
    }
  };

  // 편집 완료 클릭 시: 즉시 백엔드에 자동 영구 저장 후 편집창 닫기!
  const handleFinishEditing = async () => {
    await onSaveServer();
    onClose();
  };

  // 클립보드 복사
  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 파일 다운로드 (.json)
  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rune_age_layout_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 파일 업로드 (.json)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.elements) {
          onImportLayout(parsed);
          await onSaveServer();
          alert('레이아웃 JSON 파일을 성공적으로 불러오고 서버에 저장했습니다!');
        }
      } catch (err) {
        alert('유효하지 않은 JSON 파일입니다.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <>
      <div className="bg-slate-900/98 border-b-2 border-cyan-400 px-4 py-2 flex items-center justify-between shadow-2xl z-50 text-white shrink-0 backdrop-blur-md flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-cyan-400 font-black text-xs uppercase tracking-wider">
            <Sliders size={16} />
            <span>UI 배치 편집 모드</span>
          </div>

          {/* 3D 틸트 각도 슬라이더 */}
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1 rounded-xl border border-slate-700">
            <span className="text-xs font-bold text-slate-300">3D 원근 틸트:</span>
            <input
              type="range"
              min="0"
              max="45"
              value={config.tiltAngle}
              onChange={(e) => onUpdateTilt(Number(e.target.value))}
              className="w-24 accent-cyan-400 cursor-pointer"
            />
            <span className="text-xs font-mono font-black text-cyan-300 w-8">{config.tiltAngle}°</span>
          </div>

          <span className="text-[11px] text-slate-400 hidden xl:inline">
            💡 상단 핸들 드래그(이동), 우하단 핸들(⤡)로 가로/세로 무제한 리사이즈
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* 서버에 자동 영구 저장 버튼 */}
          <button
            onClick={handleSaveToServer}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-lg shadow-emerald-600/30 transition transform hover:scale-105 active:scale-95"
            title="서버의 src/data/userLayout.json 파일로 즉시 영구 저장합니다"
          >
            {serverSaved ? <Check size={14} className="text-amber-300" /> : <Save size={14} />}
            <span>{serverSaved ? '서버 저장 완료!' : '💾 서버에 즉시 저장'}</span>
          </button>

          {/* JSON 파일 다운로드 */}
          <button
            onClick={handleDownload}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-600 transition"
            title="내 컴퓨터에 layout.json 파일로 다운로드"
          >
            <Download size={13} />
            <span>다운로드</span>
          </button>

          {/* JSON 파일 업로드 */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-600 transition"
            title="저장해둔 layout.json 파일 불러오기"
          >
            <Upload size={13} />
            <span>JSON 업로드</span>
          </button>

          {/* JSON 보기 & 복사 */}
          <button
            onClick={() => setShowJsonModal(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-600 transition"
          >
            <Eye size={13} />
            <span>JSON 보기</span>
          </button>

          {/* 초기화 */}
          <button
            onClick={onReset}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-300 text-xs font-bold border border-slate-700 transition"
          >
            <RotateCcw size={13} />
            <span>기본 초기화</span>
          </button>

          {/* 편집 완료 (누르면 자동 저장 후 닫기) */}
          <button
            onClick={handleFinishEditing}
            className="flex items-center gap-1 px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-black shadow-lg shadow-cyan-600/30 transition transform hover:scale-105 active:scale-95 ml-1"
            title="현재 배치를 서버에 영구 저장하고 편집 모드를 종료합니다"
          >
            <Check size={14} />
            <span>편집 완료 (자동 저장)</span>
          </button>
        </div>
      </div>

      {/* JSON 모달 팝업 */}
      {showJsonModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-cyan-500 rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
              <span className="font-black text-white text-sm">📋 현재 생성된 레이아웃 좌표 JSON</span>
              <button onClick={() => setShowJsonModal(false)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 flex-1 overflow-y-auto">
              <p className="text-xs text-slate-300 mb-2">
                <strong>[편집 완료]</strong> 또는 <strong>[💾 서버에 즉시 저장]</strong>을 누르시면 복사/붙여넣기 없이도 서버에 즉시 영구 저장됩니다:
              </p>
              <textarea
                readOnly
                value={jsonString}
                className="w-full h-80 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-cyan-300 select-all"
                onClick={(e) => (e.target as HTMLTextAreaElement).select()}
              />
            </div>
            <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end gap-2">
              <button
                onClick={handleCopy}
                className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs"
              >
                {copied ? '복사 완료!' : '클립보드에 복사'}
              </button>
              <button
                onClick={() => setShowJsonModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
