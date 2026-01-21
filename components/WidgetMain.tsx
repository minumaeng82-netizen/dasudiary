
import React, { useState } from 'react';
import { Calendar as CalendarIcon, Plus, Settings as SettingsIcon, Users, User, LayoutGrid, ChevronLeft, ChevronRight, Bell, LogOut, Info } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { ko } from 'date-fns/locale';
import { EventModal } from './EventModal.tsx';
import { SettingsModal } from './SettingsModal.tsx';
import { useEvents } from '../hooks/useEvents.ts';
import { useAuth } from '../hooks/useAuth.ts';
import { Visibility } from '../types.ts';

export const WidgetMain: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filter, setFilter] = useState<Visibility | 'all'>('all');
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { events } = useEvents();
  const { user, tenantInfo, logout } = useAuth();

  // 달력 그리드를 위한 날짜 계산 (이전/다음 달 일부 포함하여 7의 배수 격자 생성)
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const filteredEventsForSelectedDate = events.filter(e => {
    const matchesFilter = filter === 'all' || e.visibility === filter;
    const eventDate = new Date(e.startAt);
    return matchesFilter && isSameDay(eventDate, selectedDate);
  });

  const getEventsForDay = (date: Date) => {
    return events.filter(e => isSameDay(new Date(e.startAt), date));
  };

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50 font-sans">
      {/* 상단 네비게이션 */}
      <nav className="bg-white border-b px-8 py-4 flex items-center justify-between shadow-sm z-30">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100 transition-transform hover:scale-105">
            <CalendarIcon size={28} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              School-Link <span className="text-[10px] bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full uppercase tracking-tighter">Web App</span>
            </h1>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{tenantInfo?.schoolName || '학교 정보 없음'}</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs uppercase">
              {user?.displayName?.charAt(0) || 'U'}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black text-slate-700 leading-none">{user?.displayName}</span>
              <span className="text-[9px] text-slate-400 font-bold uppercase mt-1">접속 중</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setIsSettingsOpen(true)} className="p-2.5 hover:bg-slate-100 rounded-xl transition-all text-slate-500 hover:text-indigo-600">
              <SettingsIcon size={22} />
            </button>
            <button onClick={logout} className="p-2.5 hover:bg-red-50 rounded-xl transition-all text-red-400">
              <LogOut size={22} />
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col xl:flex-row p-6 gap-6 overflow-hidden">
        {/* 중앙 큰 달력 섹션 */}
        <section className="flex-[3] flex flex-col bg-white rounded-[32px] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden transition-all">
          <div className="p-8 border-b flex flex-col md:flex-row items-center justify-between gap-6 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center gap-6">
              <h2 className="text-3xl font-black text-slate-800 tabular-nums">
                {format(currentMonth, 'yyyy. MM', { locale: ko })}
              </h2>
              <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all text-slate-500">
                  <ChevronLeft size={24} />
                </button>
                <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all text-slate-500">
                  <ChevronRight size={24} />
                </button>
              </div>
              <button 
                onClick={() => setCurrentMonth(new Date())}
                className="text-xs font-bold text-indigo-600 px-4 py-2 hover:bg-indigo-50 rounded-xl transition-colors border border-indigo-100"
              >
                오늘
              </button>
            </div>

            <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
              {(['all', 'school', 'private'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setFilter(v)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                    filter === v ? 'bg-white text-indigo-600 shadow-md shadow-slate-200 ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {v === 'all' && <LayoutGrid size={14} />}
                  {v === 'school' && <Users size={14} />}
                  {v === 'private' && <User size={14} />}
                  {v === 'all' ? '전체' : v === 'school' ? '학교 공유' : '나의 일정'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 grid grid-cols-7 bg-slate-100/30">
            {/* 요일 헤더 */}
            {['일', '월', '화', '수', '목', '금', '토'].map((day, i) => (
              <div key={day} className={`py-4 text-center text-xs font-black uppercase tracking-widest border-b bg-white ${
                i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-slate-400'
              }`}>
                {day}
              </div>
            ))}

            {/* 날짜 그리드 */}
            {calendarDays.map((day) => {
              const dayEvents = getEventsForDay(day);
              const isSelected = isSameDay(day, selectedDate);
              const isToday = isSameDay(day, new Date());
              const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
              const hasSchoolEvents = dayEvents.some(e => e.visibility === 'school');

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={`relative min-h-[100px] p-2 flex flex-col items-start gap-1 border-b border-r border-slate-100 group transition-all text-left ${
                    isSelected ? 'bg-indigo-50/50 ring-2 ring-inset ring-indigo-500/20 z-10' : 'bg-white hover:bg-slate-50'
                  } ${!isCurrentMonth ? 'opacity-30' : ''}`}
                >
                  <div className="w-full flex justify-between items-start">
                    <span className={`text-sm font-black w-8 h-8 flex items-center justify-center rounded-xl transition-all ${
                      isToday ? 'bg-red-500 text-white shadow-lg shadow-red-200' : 
                      isSelected ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 
                      'text-slate-700'
                    }`}>
                      {format(day, 'd')}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="bg-indigo-100 text-indigo-700 text-[10px] font-black px-1.5 py-0.5 rounded-md">
                        {dayEvents.length}
                      </span>
                    )}
                  </div>
                  
                  {/* 일정이 있는 날짜의 시각적 요약 표시 */}
                  <div className="mt-2 w-full space-y-1 overflow-hidden">
                    {dayEvents.slice(0, 2).map(e => (
                      <div 
                        key={e.id} 
                        className={`text-[9px] font-bold px-2 py-1 rounded-lg truncate ${
                          e.visibility === 'school' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {e.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-[8px] text-slate-400 font-bold px-1 pl-2">
                        외 {dayEvents.length - 2}건...
                      </div>
                    )}
                  </div>

                  {/* 일정이 있는 날짜에만 나타나는 바텀 인디케이터 */}
                  {hasSchoolEvents && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-400/50" title="공유 일정 있음" />
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* 우측 상세 일정 리스트 섹션 */}
        <section className="w-full xl:w-[450px] flex flex-col bg-white rounded-[32px] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
          <div className="p-8 border-b bg-slate-50/50">
            <div className="flex items-center gap-2 text-indigo-600 mb-2">
              <CalendarIcon size={16} />
              <span className="text-xs font-black uppercase tracking-widest">Selected Date Info</span>
            </div>
            <h3 className="text-2xl font-black text-slate-800">
              {format(selectedDate, 'M월 d일 (EEEE)', { locale: ko })}
            </h3>
            <div className="flex items-center gap-2 mt-2 text-slate-400">
              <Info size={14} />
              <p className="text-xs font-bold">{filteredEventsForSelectedDate.length}개의 일정이 있습니다.</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
            {filteredEventsForSelectedDate.length > 0 ? (
              filteredEventsForSelectedDate.map(event => (
                <div 
                  key={event.id}
                  className={`group p-6 rounded-3xl border-2 transition-all hover:scale-[1.02] cursor-pointer shadow-sm ${
                    event.visibility === 'school' 
                      ? 'bg-amber-50/50 border-amber-100 hover:border-amber-300' 
                      : 'bg-indigo-50/20 border-slate-50 hover:border-indigo-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      event.visibility === 'school' ? 'bg-amber-200 text-amber-800' : 'bg-indigo-600 text-white'
                    }`}>
                      {event.visibility === 'school' ? '전직원 공유' : '개인 메모'}
                    </div>
                    <span className="text-slate-400 text-xs font-black bg-slate-100 px-3 py-1 rounded-xl">
                      {event.allDay ? '종일 일정' : format(new Date(event.startAt), 'aa h:mm', { locale: ko })}
                    </span>
                  </div>
                  <h4 className="text-xl font-black text-slate-800 mb-3 group-hover:text-indigo-600 transition-colors">{event.title}</h4>
                  
                  <div className="flex flex-wrap gap-3">
                    {event.location && (
                      <div className="flex items-center gap-2 text-slate-500 text-xs font-bold bg-white/50 px-3 py-1.5 rounded-xl border border-slate-100">
                        <span className="text-lg">📍</span> {event.location}
                      </div>
                    )}
                    {event.category && (
                      <div className="flex items-center gap-2 text-slate-500 text-xs font-bold bg-white/50 px-3 py-1.5 rounded-xl border border-slate-100">
                        <span className="w-2 h-2 rounded-full bg-indigo-400" /> {event.category === 'meeting' ? '회의' : event.category === 'event' ? '행사' : '업무'}
                      </div>
                    )}
                  </div>

                  {event.memo && (
                    <p className="mt-4 text-sm text-slate-500 leading-relaxed bg-white p-4 rounded-2xl italic border border-slate-50">
                      "{event.memo}"
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-6 py-20">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center">
                  <CalendarIcon size={48} strokeWidth={1} />
                </div>
                <div className="text-center">
                  <p className="font-black text-slate-400">등록된 일정이 없습니다.</p>
                  <p className="text-xs font-bold text-slate-300 mt-1">이 날은 업무를 잊고 쉬셔도 좋습니다.</p>
                </div>
              </div>
            )}
          </div>

          <div className="p-8 bg-slate-50/80 border-t backdrop-blur-md">
             <button 
                onClick={() => setIsEventModalOpen(true)}
                className="w-full py-5 bg-indigo-600 text-white rounded-[24px] font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-4 active:scale-95 group"
              >
                <Plus size={28} className="group-hover:rotate-90 transition-transform" /> 일정 등록하기
              </button>
          </div>
        </section>
      </main>

      <EventModal 
        isOpen={isEventModalOpen} 
        onClose={() => setIsEventModalOpen(false)} 
        initialDate={selectedDate}
      />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <footer className="px-8 py-3 bg-white border-t flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        <span>&copy; 2024 School-Link Project Group</span>
        <div className="flex gap-4">
          <span className="hover:text-indigo-600 cursor-pointer">서비스 약관</span>
          <span className="hover:text-indigo-600 cursor-pointer">개인정보 처리방침</span>
        </div>
      </footer>
    </div>
  );
};
