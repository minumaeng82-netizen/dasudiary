
import React, { useState } from 'react';
import { X, Check, Trash2 } from 'lucide-react';
import { format, addHours, parseISO } from 'date-fns';
import { useEvents } from '../hooks/useEvents.ts';
import { Event, Category, Visibility } from '../types.ts';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDate: Date;
  initialEvent?: Event | null;
}

export const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, initialDate, initialEvent }) => {
  const { addEvent, updateEvent, deleteEvent } = useEvents();
  const [title, setTitle] = useState('');
  const [visibility, setVisibility] = useState<Visibility>('private');
  const [category, setCategory] = useState<Category>('meeting');
  const [location, setLocation] = useState('');
  const [allDay, setAllDay] = useState(true);

  // Start Time State
  const [sDate, setSDate] = useState('');
  const [sAmPm, setSAmPm] = useState('AM');
  const [sHour, setSHour] = useState('12');
  const [sMinute, setSMinute] = useState('00');

  // End Time State
  const [eDate, setEDate] = useState('');
  const [eAmPm, setEAmPm] = useState('AM');
  const [eHour, setEHour] = useState('1'); // Default +1 hour
  const [eMinute, setEMinute] = useState('00');

  const [memo, setMemo] = useState('');

  // Helpers
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString());

  const parseToState = (date: Date, type: 'start' | 'end') => {
    const d = format(date, 'yyyy-MM-dd');
    const h = format(date, 'h');
    const m = format(date, 'mm');
    const a = format(date, 'aa'); // AM or PM

    if (type === 'start') {
      setSDate(d); setSHour(h); setSMinute(m); setSAmPm(a);
    } else {
      setEDate(d); setEHour(h); setEMinute(m); setEAmPm(a);
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      if (initialEvent) {
        setTitle(initialEvent.title);
        setVisibility(initialEvent.visibility);
        setCategory(initialEvent.category);
        setLocation(initialEvent.location || '');
        setAllDay(initialEvent.allDay);
        setMemo(initialEvent.memo || '');

        parseToState(parseISO(initialEvent.startAt), 'start');
        parseToState(parseISO(initialEvent.endAt), 'end');
      } else if (initialDate) {
        setTitle('');
        setVisibility('private');
        setCategory('meeting');
        setLocation('');
        setAllDay(true);
        setMemo('');

        const s = initialDate;
        const e = addHours(initialDate, 1);
        parseToState(s, 'start');
        parseToState(e, 'end');
      }
    }
  }, [isOpen, initialDate, initialEvent]);

  // Auto-sync End Date when Start Date changes
  React.useEffect(() => {
    if (sDate) {
      setEDate(sDate);
    }
  }, [sDate]);

  if (!isOpen) return null;

  const convertToISO = (d: string, h: string, m: string, a: string) => {
    let hour = parseInt(h);
    if (a === 'PM' && hour < 12) hour += 12;
    if (a === 'AM' && hour === 12) hour = 0;
    return `${d}T${hour.toString().padStart(2, '0')}:${m}:00`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (!sDate || !eDate) {
      alert("날짜를 선택해주세요.");
      return;
    }

    // Construct ISO strings
    const startIso = convertToISO(sDate, sHour, sMinute, sAmPm);
    const endIso = convertToISO(eDate, eHour, eMinute, eAmPm);

    try {
      if (initialEvent) {
        await updateEvent(initialEvent.id, {
          title,
          visibility,
          category,
          location,
          allDay,
          memo,
          startAt: new Date(startIso).toISOString(),
          endAt: new Date(endIso).toISOString(),
        });
      } else {
        await addEvent({
          title,
          visibility,
          category,
          location,
          allDay,
          memo,
          startAt: new Date(startIso).toISOString(),
          endAt: new Date(endIso).toISOString(),
        });
      }

      onClose();
    } catch (error) {
      console.error("Failed to save event:", error);
      alert("일정 저장에 실패했습니다.");
    }
  };

  const handleDelete = async () => {
    if (!initialEvent) return;
    if (window.confirm('정말 이 일정을 삭제하시겠습니까?')) {
      await deleteEvent(initialEvent.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-[500px] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-bold text-gray-800 text-sm">{initialEvent ? '일정 수정' : '새 일정 등록'}</h2>
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
          </div>

          <div className="grid grid-cols-1 gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
            {/* Start Time UI */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">시작</label>
              <div className="flex gap-1.5">
                <input
                  type="date"
                  value={sDate}
                  onChange={e => setSDate(e.target.value)}
                  className="flex-[2] text-xs p-2 border rounded-lg bg-white" required
                />
                <select value={sAmPm} onChange={e => setSAmPm(e.target.value)} className="flex-1 text-xs p-2 border rounded-lg bg-white">
                  <option value="AM">오전</option>
                  <option value="PM">오후</option>
                </select>
                <select value={sHour} onChange={e => setSHour(e.target.value)} className="flex-1 text-xs p-2 border rounded-lg bg-white">
                  {hours.map(h => <option key={h} value={h}>{h}시</option>)}
                </select>
                <select value={sMinute} onChange={e => setSMinute(e.target.value)} className="flex-1 text-xs p-2 border rounded-lg bg-white">
                  {minutes.map(m => <option key={m} value={m}>{m}분</option>)}
                </select>
              </div>
            </div>

            {/* End Time UI */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">종료</label>
              <div className="flex gap-1.5">
                <input
                  type="date"
                  value={eDate}
                  onChange={e => setEDate(e.target.value)}
                  className="flex-[2] text-xs p-2 border rounded-lg bg-white" required
                />
                <select value={eAmPm} onChange={e => setEAmPm(e.target.value)} className="flex-1 text-xs p-2 border rounded-lg bg-white">
                  <option value="AM">오전</option>
                  <option value="PM">오후</option>
                </select>
                <select value={eHour} onChange={e => setEHour(e.target.value)} className="flex-1 text-xs p-2 border rounded-lg bg-white">
                  {hours.map(h => <option key={h} value={h}>{h}시</option>)}
                </select>
                <select value={eMinute} onChange={e => setEMinute(e.target.value)} className="flex-1 text-xs p-2 border rounded-lg bg-white">
                  {minutes.map(m => <option key={m} value={m}>{m}분</option>)}
                </select>
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
              <option value="education">교육</option>
              <option value="meeting">회의</option>
              <option value="official">공문</option>
              <option value="service">복무</option>
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

          <div className="flex gap-2 mt-4">
            {initialEvent && (
              <button
                type="button"
                onClick={handleDelete}
                className="flex-[1] py-2.5 bg-red-100 text-red-600 rounded-xl font-bold text-sm hover:bg-red-200 transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 size={16} /> 삭제
              </button>
            )}
            <button
              type="submit"
              className={`flex-[3] py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2`}
            >
              <Check size={16} /> {initialEvent ? '수정 완료' : '저장하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
