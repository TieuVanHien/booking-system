import React, { useState, useEffect, useContext } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import DatePicker from 'react-datepicker';
import { Service, NewEvent } from '@/interfaces/interface';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Typography } from '@mui/material';
import { ModalComponent } from '@/components/index';
import { AuthenticationContext } from '@/context/authentication';

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
    {event.start && event.end && (
      <>
        {format(event.start, 'MMMM d, yyyy hh:mm a')} -{' '}
        {format(event.end, 'MMMM d, yyyy hh:mm a')}
      </>
    )}
  </div>
);

const Booking = () => {
  const [event, setEvent] = useState<NewEvent>({
    id: 0,
    title: '',
    service: '',
    duration: 0,
    start: null,
    end: null
  });
  const [allEvents, setAllEvents] = useState<NewEvent[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>();
  const [openModal, setOpenModal] = useState(false);

  const { addBooking, user } = useContext(AuthenticationContext);

  const handleServiceChange = (serviceId: number) => {
    const service = services.find((s) => s.id === serviceId);
    setSelectedService(service || null);
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      const user_id = user?.id;
      if (
        event.title &&
        event.start &&
        selectedService &&
        selectedService.duration !== null
      ) {
        const end = new Date(event.start);
        end.setMinutes(event.start.getMinutes() + selectedService.duration);
        const newEvent: NewEvent = {
          ...event,
          service: selectedService.name,
          duration: selectedService.duration,
          end: new Date(end)
        };
        setAllEvents([...allEvents, newEvent]);
        setEvent({
          id: 0,
          title: '',
          service: '',
          duration: 0,
          start: null,
          end: null
        });
        setSelectedService(null);
        console.log(newEvent, user_id);
        try {
          await addBooking(newEvent, user_id);
        } catch (error) {
          console.log('Error adding booking:', error);
        }
      }
    }
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  useEffect(() => {
    console.log(allEvents);
  }, [allEvents]);

  return (
    <section className="booking flex flex-col justify-center items-center">
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
      <div className="book-form flex flex-col justify-center">
        <button type="button" onClick={handleOpenModal}>
          <h3>Add New Booking</h3>
        </button>
        <ModalComponent open={openModal} onClose={handleCloseModal}>
          <Typography>
            <div className="input-form flex flex-col justify-center">
              <input
                type="text"
                placeholder="Add Title"
                value={event.title}
                onChange={(e) => setEvent({ ...event, title: e.target.value })}
              />
              <DatePicker
                placeholderText="Start Date"
                selected={event.start}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="MMMM d, yyyy HH:mm"
                timeCaption="Time"
                minDate={new Date()}
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
              <button
                className="button bg-yellow-300 hover:bg-yellow-300 text-black font-bold py-2 px-4 border-b-4 border-yellow-600 hover:border-yellow-500 rounded mt-18"
                type="submit"
                onClick={handleAddEvent}
              >
                Submit
              </button>
            </div>
          </Typography>
        </ModalComponent>
      </div>
    </section>
  );
};

export default Booking;
