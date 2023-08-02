import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Service } from '@/interfaces/interface';
import { Typography } from '@mui/material';
import { ModalComponent } from '@/components/index';

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
const BookingUpdateComponent = ({ openModal, onClose, bookingId }: any) => {
  const [startDate, setStartDate] = useState(new Date());
  const [selectedService, setSelectedService] = useState<Service | null>();

  const handleStartDateChange = (date: Date) => {
    setStartDate(date);
  };

  const handleServiceChange = (serviceId: number) => {
    const service = services.find((e) => e.id === serviceId);
    setSelectedService(service || null);
  };

  const handleUpdateBooking = async () => {
    try {
      const data = {
        start: startDate,
        service: selectedService,
        id: bookingId
      };
      console.log(data);
      await axios.put(`/api/bookings/${bookingId}/update/`, data);
      console.log(data);
    } catch (error: any) {
      console.error('Error updating booking:', error.message);
    }
  };

  return (
    <div>
      <ModalComponent open={openModal} onClose={onClose}>
        <div className="input-form flex flex-col justify-between">
          <Typography className="">
            <DatePicker
              selected={startDate}
              onChange={handleStartDateChange}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="MMMM d, yyyy HH:mm"
              timeCaption="Time"
              minDate={new Date()}
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
            <button onClick={handleUpdateBooking}>Update Booking</button>
          </Typography>
        </div>
      </ModalComponent>
    </div>
  );
};

export default BookingUpdateComponent;
