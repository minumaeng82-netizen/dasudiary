
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth.ts';
import { School, ArrowRight } from 'lucide-react';

export const TenantJoinView: React.FC = () => {
  const [code, setCode] = useState('');
  const { joinTenant } = useAuth();

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white">
      <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center text-white mb-6 shadow-xl">
        <School size={32} />
      </div>
      <h1 className="text-lg font-bold text-gray-900 mb-2 text-center">소속 학교 연결</h1>
      <p className="text-gray-500 text-[11px] mb-8 text-center px-4 leading-relaxed">
        공유 일정을 확인하려면 학교 관리자에게 받은 <br/><span className="font-bold text-amber-600">초대 코드</span>를 입력하세요.
      </p>
      
      <div className="w-full max-w-xs space-y-4">
        <input 
          type="text" 
          placeholder="학교 코드 (예: SCH-1234)"
          value={code}
          onChange={e => setCode(e.target.value.toUpperCase())}
          className="w-full border-gray-200 bg-gray-50 rounded-xl p-3 text-sm font-mono text-center tracking-widest focus:ring-2 focus:ring-amber-500 outline-none transition-all"
        />
        <button 
          onClick={() => joinTenant(code)}
          className="w-full bg-amber-500 text-white py-3 rounded-xl font-bold hover:bg-amber-600 transition-all flex items-center justify-center gap-2"
        >
          참여하기 <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
