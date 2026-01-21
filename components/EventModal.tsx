
import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { format } from 'date-fns';
import { useEvents } from '../hooks/useEvents.ts';
import { Category, Visibility } from '../types.ts';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDate: Date;
}

export const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, initialDate }) => {
  const { addEvent } = useEvents();
  const [title, setTitle] = useState('');
  const [visibility, setVisibility] = useState<Visibility>('private');
  const [category, setCategory] = useState<Category>('meeting');
  const [location, setLocation] = useState('');
  const [allDay, setAllDay] = useState(true);
  const [memo, setMemo] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await addEvent({
      title,
      visibility,
      category,
      location,
      allDay,
      memo,
      startAt: initialDate.toISOString(),
      endAt: initialDate.toISOString(),
    });

    // Reset & Close
    setTitle('');
    setVisibility('private');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-[320px] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-bold text-gray-800 text-sm">새 일정 등록</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full text-gray-400">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3 overflow-y-auto max-h-[400px]">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">제목 (필수)</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border-gray-200 rounded-lg text-sm p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="일정 제목을 입력하세요"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">공유 설정</label>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button 
                  type="button"
                  onClick={() => setVisibility('private')}
                  className={`flex-1 text-[10px] py-1.5 rounded-md transition-all ${visibility === 'private' ? 'bg-white shadow-sm text-indigo-600 font-bold' : 'text-gray-500'}`}
                >개인</button>
                <button 
                  type="button"
                  onClick={() => setVisibility('school')}
                  className={`flex-1 text-[10px] py-1.5 rounded-md transition-all ${visibility === 'school' ? 'bg-white shadow-sm text-amber-600 font-bold' : 'text-gray-500'}`}
                >공유</button>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">날짜</label>
              <div className="text-sm font-medium p-2 text-gray-700 bg-gray-50 rounded-lg">
                {format(initialDate, 'yyyy-MM-dd')}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">카테고리</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full border-gray-200 rounded-lg text-sm p-2 bg-white"
            >
              <option value="meeting">회의</option>
              <option value="event">행사</option>
              <option value="deadline">공문마감</option>
              <option value="trip">출장</option>
              <option value="etc">기타</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">장소</label>
            <input 
              type="text" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border-gray-200 rounded-lg text-sm p-2"
              placeholder="회의실, 행사장 등"
            />
          </div>

          <button 
            type="submit"
            className="w-full py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 mt-4"
          >
            <Check size={16} /> 저장하기
          </button>
        </form>
      </div>
    </div>
  );
};
