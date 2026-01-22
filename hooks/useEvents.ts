
import { useState, useEffect } from 'react';
import { Event, Visibility, Category } from '../types.ts';

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = localStorage.getItem('events_cache');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          setEvents(parsed);
        } else {
          setEvents([]);
        }
      } catch (e) {
        console.error("Failed to parse events cache", e);
        setEvents([]);
      }
    }
    setLoading(false);

    const interval = setInterval(() => {
      console.debug('Synchronizing events...');
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const addEvent = async (data: Partial<Event>) => {
    const newEvent: Event = {
      id: Math.random().toString(36).substr(2, 9),
      tenantId: 't1',
      ownerUid: 'u1',
      visibility: data.visibility || 'private',
      title: data.title || '',
      startAt: data.startAt || new Date().toISOString(),
      endAt: data.endAt || new Date().toISOString(),
      allDay: data.allDay ?? true,
      category: data.category || 'etc',
      location: data.location,
      memo: data.memo,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [...events, newEvent];
    setEvents(updated);
    localStorage.setItem('events_cache', JSON.stringify(updated));
    return newEvent;
  };

  const updateEvent = async (id: string, data: Partial<Event>) => {
    const updated = events.map(event =>
      event.id === id ? { ...event, ...data, updatedAt: new Date().toISOString() } : event
    );
    setEvents(updated);
    localStorage.setItem('events_cache', JSON.stringify(updated));
  };

  const deleteEvent = async (id: string) => {
    const updated = events.filter(event => event.id !== id);
    setEvents(updated);
    localStorage.setItem('events_cache', JSON.stringify(updated));
  };

  return { events, loading, addEvent, updateEvent, deleteEvent };
};
