import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Typography } from '@mui/material';
import { ModalComponent } from '@/components/index';
import { Service } from '@/interfaces/interface';
import { format } from 'date-fns';

const services: Service[] = [
  {
    id: 1,
    name: 'Hand Service',
    duration: 60
  },
  {
    id: 2,
    name: 'Feet Service',
    duration: 30
  },
  {
    id: 3,
    name: 'Other Service',
    duration: 45
  }
];
const BookingUpdateComponent = ({ openModal, onClose, bookingId }: any) => {
  const [startDate, setStartDate] = useState(new Date());
  const [title, setTitle] = useState('');
  const [selectedService, setSelectedService] = useState<Service>();
  const phone = '15879175931';
  const status = 'Active';
  const handleStartDateChange = (date: Date) => {
    setStartDate(date);
  };
  const handleServiceChange = (serviceId: number) => {
    const service = services.find((e) => e.id === serviceId);
    setSelectedService(service);
  };
  const handleUpdateBooking = async () => {
    if (selectedService && startDate && title) {
      console.log('clicked');
      const formattedStartDate = format(startDate, 'dd MMMM yyyy HH:mm');
      const endDate = new Date(startDate);
      endDate.setMinutes(startDate.getMinutes() + selectedService.duration);
      const formattedEndDate = format(endDate, 'dd MMMM yyyy HH:mm');
      const updatedData = {
        title: title,
        start: formattedStartDate,
        service: selectedService?.name,
        duration: selectedService?.duration,
        end: formattedEndDate,
        phone: phone,
        status: status,
        id: bookingId
      };
      const data = {
        ...updatedData
      };
      try {
        console.log('triggered', data);
        await axios.post('/api/update', data);
      } catch (error: any) {
        console.error('Error updating booking:', error.message);
      }
    }
  };

  return (
    <div>
      <ModalComponent open={openModal} onClose={onClose}>
        <div className="input-form flex flex-col justify-between">
          <Typography className="">
            <input
              type="text"
              placeholder="New title"
              value={title}
              required
              onChange={(e) => setTitle(e.target.value)}
            />
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
