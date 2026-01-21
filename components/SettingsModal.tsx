
import React from 'react';
import { X, LogOut, Monitor, Bell, ExternalLink, User } from 'lucide-react';
import { useSettings } from '../context/SettingsContext.tsx';
import { useAuth } from '../hooks/useAuth.ts';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings } = useSettings();
  const { logout, user, tenantInfo } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="bg-white w-full max-w-[280px] rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between bg-gray-50">
          <h2 className="font-bold text-gray-800 text-sm">위젯 설정</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full text-gray-400 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-4 space-y-6">
          <div className="bg-indigo-50 p-3 rounded-xl flex items-center gap-3 border border-indigo-100">
             <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
               <User size={20} />
             </div>
             <div className="overflow-hidden">
               <p className="text-xs font-bold text-indigo-900 truncate">
                 {user?.displayName || '사용자'}
               </p>
               <p className="text-[10px] text-indigo-600 font-medium truncate">
                 {tenantInfo?.schoolName || '학교 정보 없음'}
               </p>
             </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-700">
                <Monitor size={14} />
                <span className="text-xs font-medium">항상 위에 표시</span>
              </div>
              <button 
                onClick={() => updateSettings({ alwaysOnTop: !settings.alwaysOnTop })}
                className={`w-8 h-4 rounded-full transition-all relative ${settings.alwaysOnTop ? 'bg-indigo-600' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${settings.alwaysOnTop ? 'left-4.5' : 'left-0.5'}`} />
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase">
                <span>투명도</span>
                <span>{settings.opacity}%</span>
              </div>
              <input 
                type="range" 
                min="20" 
                max="100" 
                value={settings.opacity}
                onChange={(e) => updateSettings({ opacity: parseInt(e.target.value) })}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-700">
                <Bell size={14} />
                <span className="text-xs font-medium">알림 사용</span>
              </div>
              <button 
                onClick={() => updateSettings({ notifications: !settings.notifications })}
                className={`w-8 h-4 rounded-full transition-all relative ${settings.notifications ? 'bg-indigo-600' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${settings.notifications ? 'left-4.5' : 'left-0.5'}`} />
              </button>
            </div>
          </div>

          <div className="pt-4 border-t space-y-2">
            <button className="w-full text-left p-2 text-[10px] text-gray-500 hover:bg-gray-50 rounded-lg flex items-center gap-2 transition-colors">
              <ExternalLink size={12} /> 도움말 및 지원
            </button>
            <button 
              onClick={() => logout()}
              className="w-full text-left p-2 text-[10px] text-red-500 hover:bg-red-50 rounded-lg flex items-center gap-2 font-bold transition-colors"
            >
              <LogOut size={12} /> 로그아웃
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
