const express = require('express');
const { addMonths, eachDayOfInterval, addDays, format } = require('date-fns');
const { generateRoomData } = require('./mockData');

const app = express();
const port = 3000;

app.get('/:roomId', (req, res) => {
  const { roomId } = req.params;
  
  try {
    // Generating mock data for the room
    const roomData = generateRoomData(roomId);
    
    // occupancy for next 5 months 
    const today = new Date();
    const monthlyOccupancy = [];
    
    for (let i = 0; i < 5; i++) {
      const monthStart = addMonths(today, i);
      const monthEnd = addMonths(today, i + 1);
      const daysInMonth = eachDayOfInterval({
          start: monthStart, end: monthEnd 
        });
      
      const bookedDays = daysInMonth.filter(date => 
        roomData.bookings.some(booking => 
          format(date, 'yyyy-MM-dd') === format(new Date(booking.date), 'yyyy-MM-dd')
        )
      ).length;
      
      monthlyOccupancy.push({
        month: format(monthStart, 'MMMM yyyy'),
        occupancyPercentage: ((bookedDays / daysInMonth.length) * 100).toFixed(2)
      });
    }
    
    // Calculate rates for next 30 days
    const next30Days = eachDayOfInterval({
      start: today,
      end: addDays(today, 30)
    });
    
    const rates = next30Days.map(date => 
      roomData.rates.find(rate => 
        format(date, 'yyyy-MM-dd') === format(new Date(rate.date), 'yyyy-MM-dd')
      )?.price || 0
    ).filter(price => price > 0);
    
    const averageRate = (rates.reduce((a, b) => a + b, 0) / rates.length).toFixed(2);
    const highestRate = Math.max(...rates);
    const lowestRate = Math.min(...rates);
    
    res.json({
      roomId,
      monthlyOccupancy,
      rateAnalysis: {
        averageRate,
        highestRate,
        lowestRate
      }
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to analyze room data' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});