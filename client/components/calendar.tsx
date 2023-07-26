import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { NewEvent } from '@/interfaces/interface';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';
import moment from 'moment';

const locales = { 'en-US': require('date-fns/locale/en-US') };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales
});

const EventComponent: React.FC<{ event: NewEvent }> = ({ event }) => {
  console.log('Event Start:', event.start);
  console.log('Event End:', event.end);

  const start = format(event.start, 'dd MMMM yyyy HH:mm');
  const end = format(event.end, 'dd MMMM yyyy HH:mm');

  return (
    <div>
      <strong>{event.title}</strong>
      <br />
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

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/api/events');
        const eventsFromServer = response.data;

        // Convert the start and end values from strings to Date objects
        const formattedEvents = eventsFromServer.map((event: NewEvent) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end)
        }));

        setAllEvents(formattedEvents);
      } catch (error: any) {
        console.error('Error fetching events:', error.message);
      }
    };

    fetchEvents();
  }, []);

  return (
    <section className="">
      <h3>Calendar</h3>
      <div className="calendar">
        <Calendar
          localizer={localizer}
          events={allEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500, width: 900, margin: '2em' }}
          components={{
            event: EventComponent
          }}
        />
      </div>
    </section>
  );
};

export default CalendarComponent;
