
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth.ts';
import { LogIn, ChevronDown, School, ShieldCheck } from 'lucide-react';

export const LoginView: React.FC = () => {
  const [grade, setGrade] = useState('1');
  const [classNum, setClassNum] = useState('1');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      alert('비밀번호를 입력해주세요.');
      return;
    }
    if (!/^\d{4}$/.test(password)) {
      alert('비밀번호는 숫자 4자리입니다.');
      return;
    }
    login(grade, classNum, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200 p-10 border border-slate-100">
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white mb-6 shadow-xl shadow-indigo-100">
              <LogIn size={40} />
            </div>
            <h1 className="text-3xl font-black text-slate-800 mb-2">School-Link</h1>
            <p className="text-slate-400 text-sm font-medium leading-relaxed px-6">
              교직원 전용 업무 간소화 플랫폼입니다.<br/>소속 학년과 반으로 로그인하세요.
            </p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-xs font-black text-slate-400 mb-2 uppercase ml-1">학년</label>
                <select 
                  value={grade}
                  onChange={e => setGrade(e.target.value)}
                  className="w-full border-2 border-slate-50 bg-slate-50 rounded-2xl p-4 text-sm font-bold appearance-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all cursor-pointer text-slate-700"
                >
                  {[1, 2, 3, 4, 5, 6].map(g => (
                    <option key={g} value={g}>{g}학년</option>
                  ))}
                </select>
                <ChevronDown size={18} className="absolute right-4 bottom-4 text-slate-400 pointer-events-none" />
              </div>
              <div className="relative">
                <label className="block text-xs font-black text-slate-400 mb-2 uppercase ml-1">반</label>
                <select 
                  value={classNum}
                  onChange={e => setClassNum(e.target.value)}
                  className="w-full border-2 border-slate-50 bg-slate-50 rounded-2xl p-4 text-sm font-bold appearance-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all cursor-pointer text-slate-700"
                >
                  {Array.from({ length: 15 }, (_, i) => i + 1).map(c => (
                    <option key={c} value={c}>{c}반</option>
                  ))}
                </select>
                <ChevronDown size={18} className="absolute right-4 bottom-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 mb-2 uppercase ml-1">비밀번호 (초기: 0000)</label>
              <input 
                type="password" 
                inputMode="numeric"
                maxLength={4}
                placeholder="숫자 4자리"
                value={password}
                onChange={e => setPassword(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full border-2 border-slate-50 bg-slate-50 rounded-2xl p-4 text-sm font-bold text-center tracking-[1em] focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-slate-700"
                required
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 mt-4 active:scale-95"
            >
              대시보드 입장
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-slate-50 flex items-center justify-center gap-6">
            <div className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <School size={16} />
              </div>
              <span className="text-[10px] font-bold text-slate-400">교직원 전용</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <ShieldCheck size={16} />
              </div>
              <span className="text-[10px] font-bold text-slate-400">데이터 암호화</span>
            </div>
          </div>
        </div>
        <p className="mt-8 text-center text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
          Powered by School-Link Project Group
        </p>
      </div>
    </div>
  );
};
