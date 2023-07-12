import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = { 'en-US': require('date-fns/locale/en-US') };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales
});

const events = [
  {
    title: 'Book for hands',
    start: new Date(2023, 7, 10),
    end: new Date(2023, 7, 12)
  },
  {
    title: 'Book for feet',
    start: new Date(2023, 7, 10),
    end: new Date(2023, 7, 12)
  },
  {
    title: 'Book for massage',
    start: new Date(2023, 7, 10),
    end: new Date(2023, 7, 12)
  }
];

interface OverviewProps {
  start: Date | null;
  end: Date | null;
}

const Overview: React.FC<OverviewProps> = () => {
  const [event, setEvent] = useState({
    title: '',
    start: null as Date | null,
    end: null as Date | null
  });
  const [allEvents, setAllEvents] = useState(events);

  const handleAddEvent = () => {
    if (event.title && event.start && event.end) {
      const newEvent = {
        title: event.title,
        start: event.start,
        end: event.end
      };
      setAllEvents([...allEvents, newEvent]);
      setEvent({ title: '', start: null, end: null });
    }
  };

  return (
    <div className="myCustomHeight">
      <h1>Calendar</h1>
      <h3>Add New Booking</h3>
      <div>
        <input
          type="text"
          placeholder="Add Title"
          value={event.title}
          onChange={(e) => setEvent({ ...event, title: e.target.value })}
        />
        <DatePicker
          placeholderText="Start Date"
          selected={event.start || null}
          onChange={(start) => setEvent({ ...event, start })}
        />
        <DatePicker
          placeholderText="End Date"
          selected={event.end || null}
          onChange={(end: Date | null) => setEvent({ ...event, end })}
        />
        <button type="submit" onClick={handleAddEvent}>
          Submit
        </button>
      </div>
      <Calendar
        localizer={localizer}
        events={allEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, margin: '50px' }}
      />
    </div>
  );
};

export default Overview;
