import React, { useState, useEffect } from 'react';
import { NewEvent, UserProps } from '@/interfaces/interface';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper
} from '@mui/material';
import { BookingUpdateComponent } from '@/components';

const BookingHistory = () => {
  const [allEvents, setAllEvents] = useState<NewEvent[]>([]);
  const [user, setUser] = useState<UserProps | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [currentBookingId, setCurrentBookingId] = useState<number | null>(null);
  const [filteredDate, setFilterDate] = useState<Date | null>(new Date());

  const handleOpenModal = async (bookingId: number) => {
    setOpenModal(true);
    setCurrentBookingId(bookingId);
    console.log(`Booking :${bookingId}`);
  };
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
            let filteredEvents = formattedEvents;
            if (filteredDate) {
              filteredEvents = formattedEvents.filter(
                (event: any) =>
                  new Date(event.start).toLocaleDateString() ===
                  filteredDate.toLocaleDateString()
              );
            }
            setAllEvents(filteredEvents);
            console.log(filteredEvents);
          } catch (error) {
            console.error('Error fetching events:', error);
          }
        } else {
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
            let filteredEventWithDate = formattedEvents;
            if (filteredDate) {
              filteredEventWithDate = formattedEvents.filter(
                (event: any) =>
                  new Date(event.start).toLocaleDateString() ===
                  filteredDate.toLocaleDateString()
              );
            }
            setAllEvents(filteredEventWithDate);
            console.log(filteredEventWithDate);
          } catch (error: any) {
            console.error('Error fetching events:', error.message);
          }
        }
      };
      fetchEvents();
    }
  }, [user, filteredDate]);
  const cancelBooking = async (bookingId: number) => {
    try {
      await axios.post('/api/deleteBooking', { bookingId });
      setAllEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== bookingId)
      );
    } catch (error: any) {
      console.error('Error cancelling booking:', error.message);
    }
  };

  return (
    <section className="booking-history flex flex-col justify-center items-center">
      <div className="flex justify-center items center">
        <h2 className="mt-4 mb-4">Booking History</h2>
        <div className="flex justify-center items-center ml-6">
          <DatePicker
            selected={filteredDate}
            onChange={(date: Date | null) => setFilterDate(date)}
            dateFormat="yyyy-MM-dd"
            placeholderText="Select a date"
          />
        </div>
      </div>
      <div
        className="history-table flex justify-center"
        style={{ height: '500px', overflow: 'auto' }}
      >
        <TableContainer component={Paper}>
          <Table sx={{ maxWidth: 1400, border: '0.1px solid #888' }}>
            <TableHead>
              <TableRow>
                {user?.is_staff === true ? (
                  <>
                    <TableCell align="center">
                      <h5>First Name</h5>
                    </TableCell>
                    <TableCell align="center">
                      <h5>Last Name</h5>
                    </TableCell>
                  </>
                ) : (
                  ''
                )}
                <TableCell align="left">
                  <h5>Title</h5>
                </TableCell>
                <TableCell align="center">
                  <h5>Service</h5>
                </TableCell>
                <TableCell align="center">
                  <h5>Duration</h5>
                </TableCell>
                <TableCell align="center">
                  <h5>Start</h5>
                </TableCell>
                <TableCell align="center">
                  <h5>End</h5>
                </TableCell>
                <TableCell align="center">
                  <h5>Status</h5>
                </TableCell>
                <TableCell align="center"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allEvents.map((event) => (
                <TableRow
                  key={event.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  {user?.is_staff === true ? (
                    <>
                      <TableCell align="center">
                        <h5> {event?.user.first_name}</h5>
                      </TableCell>
                      <TableCell align="center">
                        <h5> {event?.user.last_name}</h5>
                      </TableCell>
                    </>
                  ) : (
                    ''
                  )}
                  <TableCell
                    className="ml-16"
                    align="left"
                    component="th"
                    scope="row"
                  >
                    {event.title}
                  </TableCell>
                  <TableCell align="center">{event.service}</TableCell>
                  <TableCell align="center">{event.duration}</TableCell>
                  <TableCell align="center">
                    {event.start.toLocaleString()}
                  </TableCell>
                  <TableCell align="center">
                    {event.end.toLocaleString()}
                  </TableCell>
                  <TableCell align="center">
                    <h5>{event.status}</h5>
                  </TableCell>
                  <TableCell align="center">
                    {event.status === 'Upcoming' && user?.is_staff == true ? (
                      <>
                        <Button onClick={() => handleOpenModal(event.id)}>
                          Edit
                        </Button>
                        <Button onClick={() => cancelBooking(event.id)}>
                          Cancel
                        </Button>
                      </>
                    ) : event.status == 'Upcoming' ? (
                      <>
                        <Button onClick={() => cancelBooking(event.id)}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      'N/A'
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {openModal && (
          <BookingUpdateComponent
            bookingId={currentBookingId}
            openModal={openModal}
            onClose={() => setOpenModal(false)}
          />
        )}
      </div>
    </section>
  );
};

export default BookingHistory;
