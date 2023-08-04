import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { NewEvent, UserProps } from '@/interfaces/interface';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';
import moment from 'moment';

const locales = { 'en-US': require('date-fns/locale/en-US') };
const localizer = dateFnsLocalizer({
  parse,
  startOfWeek,
  format,
  getDay,
  locales
});

const EventComponent: React.FC<{ event: NewEvent }> = ({ event }) => {
  const start = event.start;
  const end = event.end;

  return (
    <div className="flex flex-col">
      <p>Title: {event.title}</p>
      <p>Request Service: {event.service}</p>
      <p>Phone: {event.phone}</p>
      {start && end && (
        <>
          {moment(start).format('MMMM D, YYYY hh:mm a')} -{' '}
          {moment(end).format('MMMM D, YYYY hh:mm a')}
        </>
      )}
    </div>
  );
};

const CalendarComponent = () => {
  const [allEvents, setAllEvents] = useState<NewEvent[]>([]);
  const [user, setUser] = useState<UserProps | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user', {});
        const data = await response.json();
        setUser(data.user);
        console.log(data.user);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserData();
  }, []);
  useEffect(() => {
    if (user) {
      const fetchEvents = async () => {
        if (user.is_staff === true) {
          try {
            const response = await axios.get('/api/events');
            const fetchedEvents = response.data;
            const formattedEvents = fetchedEvents.map((event: any) => ({
              ...event,
              start: new Date(event.start),
              end: new Date(event.end)
            }));
            setAllEvents(formattedEvents);
            console.log(formattedEvents);
          } catch (error) {
            console.error('Error fetching events:', error);
          }
        }
        if (user.is_staff === false) {
          try {
            const response = await axios.get('/api/events');
            const eventsFromServer = response.data;
            const filteredEvents = eventsFromServer.filter(
              (event: any) => event.user?.id === user.id
            );
            const formattedEvents = filteredEvents.map((event: any) => ({
              ...event,
              start: new Date(event.start),
              end: new Date(event.end)
            }));
            setAllEvents(formattedEvents);
          } catch (error: any) {
            console.error('Error fetching events:', error.message);
          }
        }
      };
      fetchEvents();
    }
  }, [user]);
  return (
    <section className="">
      <h3>Calendar</h3>
      <div className="calendar">
        <Calendar
          localizer={localizer}
          events={allEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 550, width: 900, margin: '2em' }}
          components={{
            event: EventComponent
          }}
        />
      </div>
    </section>
  );
};

export default CalendarComponent;
