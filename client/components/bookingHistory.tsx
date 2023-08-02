import React, { useState, useEffect } from 'react';
import { NewEvent, UserProps } from '@/interfaces/interface';
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
          console.log(formattedEvents);
        } catch (error: any) {
          console.error('Error fetching events:', error.message);
        }
      };
      fetchEvents();
    }
  }, [user]);
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
    <section className="booking-history">
      <h2 className="mt-8 mb-4">Booking History</h2>
      <div className="p-8" style={{ height: '700px', overflow: 'auto' }}>
        <TableContainer component={Paper}>
          <Table sx={{ maxWidth: 1400 }} aria-label="simple table">
            <TableHead>
              <TableRow>
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
                    {event.status === 'Active' ? (
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
