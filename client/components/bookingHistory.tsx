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

const BookingHistory = () => {
  const [allEvents, setAllEvents] = useState<NewEvent[]>([]);
  const [user, setUser] = useState<UserProps | null>(null);
  const [eventStatus, setEvenStatus] = useState('');

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

  return (
    <section className="booking-history">
      <h2 className="mt-8 mb-4">Booking History</h2>
      <div className="p-8" style={{ height: '700px', overflow: 'auto' }}>
        <TableContainer component={Paper}>
          <Table sx={{ maxWidth: 1400 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">Title</TableCell>
                <TableCell align="center">Service</TableCell>
                <TableCell align="center">Duration</TableCell>
                <TableCell align="center">Start</TableCell>
                <TableCell align="center">End</TableCell>
                <TableCell align="center">Status</TableCell>
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
                  <TableCell align="center">Status: {event.status}</TableCell>
                  <TableCell align="center">
                    {event.status === 'active' ? (
                      <>
                        <Button>Edit</Button>
                        <Button>Cancel</Button>
                      </>
                    ) : (
                      <Button>Cancel</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </section>
  );
};

export default BookingHistory;
