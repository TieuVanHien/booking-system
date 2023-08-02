import React, { useState, useEffect, useContext } from 'react';
import DatePicker from 'react-datepicker';
import { Service, NewEvent } from '@/interfaces/interface';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Typography } from '@mui/material';
import { ModalComponent } from '@/components/index';
import { AuthenticationContext } from '@/context/authentication';
import { UserProps } from '@/interfaces/interface';
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
    id: 0,
    title: '',
    service: '',
    duration: 0,
    phone: '',
    start: new Date(),
    end: new Date(),
    status: ''
  });
  const [allEvents, setAllEvents] = useState<NewEvent[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>();
  const [openModal, setOpenModal] = useState(false);
  const [user, setUserData] = useState<UserProps | null>(null);
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [error, setError] = useState('');
  const { accessToken } = useContext(AuthenticationContext);
  const phoneRegex =
    /^\+?\d{1,3}?[-.\s]?\(?\d{2,3}\)?[-.\s]?\d{2,4}[-.\s]?\d{4}$/;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user', {});
        const data = await response.json();
        setUserData(data.user);
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
  const handlePhoneNumberChange = (value: string) => {
    setEvent({ ...event, phone: value });
    setIsPhoneValid(phoneRegex.test(value));
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      const userId = user?.id;
      if (
        event.title &&
        event.start &&
        selectedService &&
        event.phone &&
        selectedService.duration !== null
      ) {
        if (!isPhoneValid) {
          setError('Please enter a valid phone number!');
          return error;
        }
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
          phone: '',
          start: new Date(),
          end: new Date(),
          status: ''
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
          console.log('Booking added successfully!');
        } catch (error) {
          console.log('Error adding booking:', error);
        }
      } else {
        setError('Please enter all booking details');
      }
    }
  };
  useEffect(() => {
    setError(isPhoneValid ? '' : 'Please enter a valid phone number!');
  }, [isPhoneValid]);

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
        <ModalComponent open={openModal} onClose={handleCloseModal}>
          <Typography>
            <div className="input-form flex flex-col justify-between">
              <input
                type="text"
                placeholder="Add Title"
                required
                value={event.title}
                onChange={(e) => setEvent({ ...event, title: e.target.value })}
              />
              <input
                type="text"
                placeholder="Enter your phone number"
                value={event.phone}
                required
                onChange={(e) => handlePhoneNumberChange(e.target.value)}
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
                minTime={new Date(0, 0, 0, 10, 0)}
                maxTime={new Date(0, 0, 0, 18, 45)}
                onChange={handleStartDateChange}
              />
              <select
                required
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
                className={`button ${
                  isPhoneValid
                    ? 'bg-yellow-300 hover:bg-yellow-300 text-black font-bold py-2 px-4 border-b-4 border-yellow-600 hover:border-yellow-500 rounded mt-18'
                    : 'disabled-button'
                } `}
                type="submit"
                disabled={!isPhoneValid}
                onClick={handleAddEvent}
              >
                Submit
              </button>
              {error && (
                <p className="mt-4 flex justify-center items-center">{error}</p>
              )}
            </div>
          </Typography>
        </ModalComponent>
      </div>
    </section>
  );
};

export default Booking;
