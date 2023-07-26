import React, { useState, useEffect, useContext } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import DatePicker from 'react-datepicker';
import { Service, NewEvent } from '@/interfaces/interface';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Typography } from '@mui/material';
import { ModalComponent } from '@/components/index';
import { AuthenticationContext } from '@/context/authentication';
import { UserProps } from '@/interfaces/interface';
import shortid from 'shortid';
import { CalendarComponent } from '@/components';
import axios from 'axios';

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

const Booking = () => {
  const [event, setEvent] = useState<NewEvent>({
    id: shortid.generate(),
    title: '',
    service: '',
    duration: 0,
    start: new Date(),
    end: new Date()
  });
  const [allEvents, setAllEvents] = useState<NewEvent[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>();
  const [openModal, setOpenModal] = useState(false);
  const [user, setUserData] = useState<UserProps | null>(null);
  const { accessToken } = useContext(AuthenticationContext);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user', {});
        const data = await response.json();
        setUserData(data.user);
        console.log(data.user);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserData();
  }, []);
  const handleServiceChange = (serviceId: number) => {
    const service = services.find((s) => s.id === serviceId);
    setSelectedService(service || null);
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      const userId = user?.id;
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
          id: shortid.generate(),
          title: '',
          service: '',
          duration: 0,
          start: new Date(),
          end: new Date()
        });
        setSelectedService(null);
        console.log(userId);
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          };
          const body = {
            ...newEvent,
            userId
          };
          await axios.post(`/api/booking`, body, config);
          console.log(newEvent);
          console.log('Booking added successfully!');
        } catch (error) {
          console.log('Error adding booking:', error);
        }
      }
    }
  };
  const handleStartDateChange = (start: Date | null) => {
    if (start !== null) {
      setEvent({ ...event, start });
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
      <CalendarComponent />
      <div className="book-form flex flex-col justify-center">
        <button type="button" onClick={handleOpenModal}>
          <h3>Add New Booking</h3>
        </button>
        {/* <form onSubmit={handleAddEvent}> */}
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
                onChange={handleStartDateChange}
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
        {/* </form> */}
      </div>
    </section>
  );
};

export default Booking;
