import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import DatePicker from 'react-datepicker';
import { OverviewProps, Service, NewEvent } from '@/interfaces/interface';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = { 'en-US': require('date-fns/locale/en-US') };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales
});

const services: Service[] = [
  {
    id: 1,
    name: 'Hand Service',
    duration: 60,
    serviceId: null
  },
  {
    id: 2,
    name: 'Feet Service',
    duration: 30,
    serviceId: null
  },
  {
    id: 3,
    name: 'Other Service',
    duration: 45,
    serviceId: null
  }
];

const events = [
  {
    title: `${services[0].name} - Book 1`,
    start: new Date(2023, 7, 10, 12),
    duration: 60,
    end: new Date(2023, 7, 10, 1)
  },
  {
    title: `${services[1].name} - Book 2`,
    start: new Date(2023, 7, 11, 1),
    duration: 60,
    end: new Date(2023, 7, 11, 2)
  },
  {
    title: `${services[2].name} - Book 3`,
    start: new Date(2023, 7, 12, 3),
    duration: 60,
    end: new Date(2023, 7, 12, 4)
  }
];

const EventComponent: React.FC<{ event: NewEvent }> = ({ event }) => (
  <div>
    <strong>{event.title}</strong>
    <br />
    {event.start && <>{format(event.start, 'MMMM d, yyyy hh:mm a')} - </>}
  </div>
);

const Overview: React.FC<OverviewProps> = () => {
  const [event, setEvent] = useState<NewEvent>({
    title: '',
    start: null,
    end: null
  });
  const [allEvents, setAllEvents] = useState<NewEvent[]>(events);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const handleServiceChange = (serviceId: number) => {
    const service = services.find((s) => s.id === serviceId);
    setSelectedService(service || null);
  };

  const handleAddEvent = () => {
    if (event.title && event.start && selectedService) {
      const newEvent: NewEvent = {
        title: `${selectedService.name} - ${event.title}`,
        start: event.start,
        end: event.end
      };
      console.log(newEvent);
      setAllEvents([...allEvents, newEvent]);
      console.log(allEvents);
      setEvent({ title: '', start: null, end: null });
    }
  };
  useEffect(() => {
    console.log(allEvents);
  }, [allEvents]);

  return (
    <div className="myCustomHeight">
      <h1>Calendar</h1>
      <Calendar
        localizer={localizer}
        events={allEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, margin: '50px' }}
        components={{
          event: EventComponent
        }}
      />
      <div className="book-form">
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
            selected={event.start}
            onChange={(start) => setEvent({ ...event, start })}
          />
          <select
            value={selectedService?.id || 0}
            onChange={(e) => handleServiceChange(Number(e.target.value))}
          >
            <option value={0}>Select a service</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
          {selectedService && (
            <div>Service Duration: {selectedService.duration} minutes</div>
          )}
          <button type="submit" onClick={handleAddEvent}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Overview;
