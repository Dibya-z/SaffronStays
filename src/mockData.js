const { addDays, format } = require('date-fns');

function generateRoomData(roomId) {
  const today = new Date();
  const bookings = [];
  const rates = [];
  

  for (let i = 0; i < 150; i++) {      //This is to Generate 150 days of data (5 months)
    const currentDate = addDays(today, i);
    const formattedDate = format(currentDate, 'yyyy-MM-dd');
    
    //This is to generate random booking (70% chance of being booked)
    if (Math.random() < 0.7) {
      bookings.push({
        date: formattedDate,
        isBooked: true
      });
    }
    
    // Here -  random rate between $100 and $300
    rates.push({
      date: formattedDate,
      price: Math.floor(Math.random() * (300 - 100 + 1) + 100)
    });
  }
  
  return {
    roomId,
    bookings,
    rates
  };
}

module.exports = {
  generateRoomData
};