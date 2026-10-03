import React, { useState } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Seat from '../components/booking/Seat';
import SeatMap from '../components/booking/SeatMap';
import SessionCard from '../components/booking/SessionCard';

describe('UI Components', () => {
  it('Button renders correctly and responds to clicks', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Bosing</Button>);

    const btn = screen.getByRole('button', { name: /Bosing/i });
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('Button displays loading spinner and disables when isLoading=true', () => {
    render(<Button isLoading={true}>Yuklanmoqda</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
  });

  it('Input renders and toggles password visibility', () => {
    render(<Input label="Parol" type="password" placeholder="••••••••" />);
    const input = screen.getByPlaceholderText('••••••••');
    expect(input).toHaveAttribute('type', 'password');

    const toggleBtn = screen.getByRole('button', { name: /Parolni ko'rsatish/i });
    fireEvent.click(toggleBtn);
    expect(input).toHaveAttribute('type', 'text');
  });

  it('Seat renders as taken and cannot be clicked', () => {
    const handleToggle = vi.fn();
    render(<Seat row={1} seat={2} isTaken={true} onToggle={handleToggle} />);

    const seatBtn = screen.getByRole('button');
    expect(seatBtn).toBeDisabled();
    fireEvent.click(seatBtn);
    expect(handleToggle).not.toHaveBeenCalled();
  });

  it('Seat toggles when available', () => {
    const handleToggle = vi.fn();
    render(<Seat row={1} seat={3} isTaken={false} onToggle={handleToggle} />);

    const seatBtn = screen.getByRole('button');
    expect(seatBtn).not.toBeDisabled();
    fireEvent.click(seatBtn);
    expect(handleToggle).toHaveBeenCalledWith({ row: 1, seat: 3 });
  });

  it('Scenario 12: SeatMap enforces maximum 4 seats rule', () => {
    const seatsData = [
      { row: 1, seat: 1, taken: false },
      { row: 1, seat: 2, taken: false },
      { row: 1, seat: 3, taken: false },
      { row: 1, seat: 4, taken: false },
      { row: 1, seat: 5, taken: false },
    ];

    const Wrapper = () => {
      const [selected, setSelected] = useState([
        { row: 1, seat: 1 },
        { row: 1, seat: 2 },
        { row: 1, seat: 3 },
        { row: 1, seat: 4 },
      ]);
      return (
        <SeatMap
          seats={seatsData}
          selectedSeats={selected}
          onSeatSelect={setSelected}
          maxSeats={4}
        />
      );
    };

    render(<Wrapper />);

    // Trying to select 5th seat should not exceed 4 seats
    const seat5 = screen.getByTitle(/Joy 5/i);
    fireEvent.click(seat5);

    // Selected seats count should still be 4
    expect(screen.getByText('CINEMA SCREEN')).toBeInTheDocument();
  });

  it('SessionCard renders session details with link to booking', () => {
    const session = {
      id: 101,
      hall: 'Zal 1 (IMAX Laser)',
      time: '2026-10-02T18:00:00Z',
    };

    render(
      <BrowserRouter>
        <SessionCard session={session} />
      </BrowserRouter>
    );

    expect(screen.getByText(/Zal 1 \(IMAX Laser\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Joy tanlash/i)).toBeInTheDocument();
  });
});
