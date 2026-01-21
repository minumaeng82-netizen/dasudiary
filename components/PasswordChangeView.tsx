
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth.ts';
import { KeyRound, ShieldCheck } from 'lucide-react';

export const PasswordChangeView: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { changePassword } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!/^\d{4}$/.test(newPassword)) {
      alert('비밀번호는 숫자 4자리여야 합니다.');
      return;
    }
    
    if (newPassword === '0000') {
      alert('초기 비밀번호는 사용할 수 없습니다.');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    changePassword(newPassword);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white">
      <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center text-white mb-6 shadow-xl">
        <KeyRound size={32} />
      </div>
      <h1 className="text-xl font-extrabold text-gray-900 mb-1 text-center">비밀번호 변경</h1>
      <p className="text-gray-500 text-[10px] mb-8 text-center leading-tight">
        보안을 위해 초기 비밀번호(0000)를<br/>새로운 <strong>숫자 4자리</strong>로 변경해주세요.
      </p>
      
      <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-4">
        <div>
          <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase ml-1">새 비밀번호 (숫자 4자리)</label>
          <input 
            type="password" 
            inputMode="numeric"
            maxLength={4}
            placeholder="숫자 4자리"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value.replace(/[^0-9]/g, ''))}
            className="w-full border-gray-200 bg-gray-50 rounded-xl p-3 text-sm text-center tracking-widest focus:ring-2 focus:ring-amber-500 outline-none transition-all font-bold"
            required
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase ml-1">비밀번호 확인</label>
          <input 
            type="password" 
            inputMode="numeric"
            maxLength={4}
            placeholder="한 번 더 입력"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value.replace(/[^0-9]/g, ''))}
            className="w-full border-gray-200 bg-gray-50 rounded-xl p-3 text-sm text-center tracking-widest focus:ring-2 focus:ring-amber-500 outline-none transition-all font-bold"
            required
          />
        </div>

        <button 
          type="submit"
          className="w-full bg-amber-500 text-white py-3.5 rounded-xl font-bold hover:bg-amber-600 transition-all shadow-md shadow-amber-100 flex items-center justify-center gap-2 mt-2"
        >
          <ShieldCheck size={18} /> 변경 및 시작하기
        </button>
      </form>
    </div>
  );
};
