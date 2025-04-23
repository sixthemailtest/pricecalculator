import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './App.css';

function App() {
  // State for basic functionality
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('rooms');
  const [groundFloorExpanded, setGroundFloorExpanded] = useState(true);
  const [firstFloorExpanded, setFirstFloorExpanded] = useState(false);
  const [openCalendar, setOpenCalendar] = useState(null);
  const [roomSchedules, setRoomSchedules] = useState({});
  const [priceUpdateCounter, setPriceUpdateCounter] = useState(0);
  
  // Room data
  const [rooms, setRooms] = useState({
    groundFloor: Array.from({length: 10}, (_, i) => ({
      number: `${101 + i}`,
      type: i % 3 === 0 ? 'jacuzzi' : 'standard',
      beds: i % 4 === 0 ? 'double' : i % 2 === 0 ? 'king' : 'queen',
      status: i % 2 === 0 ? 'available' : 'occupied',
      smoking: i % 3 === 0
    })),
    firstFloor: Array.from({length: 10}, (_, i) => ({
      number: `${201 + i}`,
      type: i % 3 === 0 ? 'jacuzzi' : 'standard',
      beds: i % 4 === 0 ? 'double' : i % 2 === 0 ? 'king' : 'queen',
      status: i % 2 === 0 ? 'available' : 'occupied',
      smoking: i % 3 === 0
    }))
  });

  // Update to support date ranges and price updates
  const handleRoomDateSelect = (roomNumber, date) => {
    // For single date selection
    setRoomSchedules(prev => {
      const current = prev[roomNumber] || {};
      
      // If we already have a startDate but no endDate
      if (current.startDate && !current.endDate && date > current.startDate) {
        // Set the end date
        return {
          ...prev,
          [roomNumber]: {
            ...current,
            endDate: date
          }
        };
      }
      
      // Otherwise, start a new selection
      return {
        ...prev,
        [roomNumber]: {
          ...current,
          startDate: date,
          endDate: null
        }
      };
    });
    
    // Do not close the calendar after date selection
    // The calendar will only close when clicking the calendar icon
  };

  const handleRoomHourAdjustment = (roomNumber, type, change) => {
    setRoomSchedules(prev => {
      const current = prev[roomNumber] || { checkInAdj: 0, checkOutAdj: 0 };
      const updated = {
        ...current,
        [type === 'checkIn' ? 'checkInAdj' : 'checkOutAdj']: 
          (current[type === 'checkIn' ? 'checkInAdj' : 'checkOutAdj'] || 0) + change
      };
      return { ...prev, [roomNumber]: updated };
    });
    
    // Force UI update to recalculate prices immediately
    setPriceUpdateCounter(prev => prev + 1);
  };

  // Format adjusted time
  const formatAdjustedTime = (baseHour, adjustment) => {
    const dt = new Date();
    dt.setHours(baseHour + adjustment, 0, 0, 0);
    return dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };
  
  // Toggle room status
  const toggleRoomStatus = (floor, roomNumber) => {
    setRooms(prevRooms => {
      return {
        ...prevRooms,
        [floor]: prevRooms[floor].map(room => {
          if (room.number === roomNumber) {
            return {
              ...room,
              status: room.status === 'available' ? 'occupied' : 'available'
            };
          }
          return room;
        })
      };
    });
  };
  
  // Calculate room price
  const calculateRoomPrice = (room) => {
    // Simplified pricing logic
    const basePrice = room.type === 'jacuzzi' ? 120 : 100;
    const tax = basePrice * 0.15;
    
    // Get schedule for the room
    const schedule = roomSchedules[room.number];
    
    // Calculate extra hours costs
    const checkInAdj = schedule?.checkInAdj || 0;
    const checkOutAdj = schedule?.checkOutAdj || 0;
    const extraRate = 15; // $15 per hour
    
    const extraHoursCheckIn = checkInAdj !== 0 ? Math.abs(checkInAdj) * extraRate : 0;
    const extraHoursCheckOut = checkOutAdj > 0 ? checkOutAdj * extraRate : 0;
    
    // Calculate nights
    let nights = 1;
    if (schedule?.startDate && schedule?.endDate) {
      const oneDay = 24 * 60 * 60 * 1000;
      nights = Math.max(1, Math.round(Math.abs((schedule.endDate - schedule.startDate) / oneDay)) + 1);
    }
    
    // Calculate total
    const total = basePrice + tax + extraHoursCheckIn + extraHoursCheckOut;
    
    return {
      basePrice,
      tax,
      extraHoursCheckIn,
      extraHoursCheckOut,
      nights,
      total
    };
  };
  
  return (
    <div className="App">
      <div className="hotel-calculator">
        <div className="header">
          <h1>
            Price Calculator
            <span style={{ 
              marginLeft: '10px', 
              fontSize: '16px', 
              backgroundColor: '#f0f0f0', 
              padding: '4px 8px', 
              borderRadius: '4px',
              display: 'inline-flex',
              alignItems: 'center',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              📅 {currentDateTime.toLocaleDateString()}
            </span>
          </h1>
        </div>
        
        <div className="stay-tabs">
          <button 
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './App.css';

function App() {
  // Short stay state
  const [currentDay, setCurrentDay] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [checkoutTime, setCheckoutTime] = useState('');
  const [extraHours, setExtraHours] = useState(0);
  const [hasJacuzzi, setHasJacuzzi] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [extraHourRate, setExtraHourRate] = useState(15);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isSmoking, setIsSmoking] = useState(false);
  const [dayStyle, setDayStyle] = useState({});
  
  // Rooms state
  const [roomFilter, setRoomFilter] = useState('all');
  const [groundFloorExpanded, setGroundFloorExpanded] = useState(true);
  const [firstFloorExpanded, setFirstFloorExpanded] = useState(false);
  const [rooms, setRooms] = useState({
    groundFloor: Array.from({length: 19}, (_, i) => ({
      number: `${101 + i}`,
      type: i % 3 === 0 ? 'jacuzzi' : 'standard',
      beds: i % 4 === 0 ? 'double' : i % 2 === 0 ? 'king' : 'queen',
      status: i % 2 === 0 ? 'available' : 'occupied',
      smoking: i % 3 === 0,
      isHandicap: (101 + i) === 108
    })),
    firstFloor: Array.from({length: 26}, (_, i) => ({
      number: `${200 + i}`,
      type: i % 3 === 0 ? 'jacuzzi' : 'standard',
      beds: i % 4 === 0 ? 'double' : i % 2 === 0 ? 'king' : 'queen',
      status: i % 2 === 0 ? 'available' : 'occupied',
      smoking: i % 3 === 0
    }))
  });
  
  // UI state
  const [activeTab, setActiveTab] = useState('short');
  
  // Overnight stay state
  const [overnightSmoking, setOvernightSmoking] = useState(false);
  const [overnightPayment, setOvernightPayment] = useState('cash');
  const [overnightExtraRate, setOvernightExtraRate] = useState(15);
  const [overnightExtraHours, setOvernightExtraHours] = useState(0);
  const [overnightCheckoutExtraHours, setOvernightCheckoutExtraHours] = useState(0);
  const [hasJacuzziOvernight, setHasJacuzziOvernight] = useState(false);
  const [bedType, setBedType] = useState('queen');
  
  // Multiple overnight stays management
  const [savedStays, setSavedStays] = useState([]);
  const [totalStaysPrice, setTotalStaysPrice] = useState(0);
  
  // Default check-in date (today at 3 PM)
  const defaultCheckIn = new Date();
  defaultCheckIn.setHours(15, 0, 0, 0);
  
  // Default checkout date (tomorrow at 11 AM)
  const defaultCheckOut = new Date(defaultCheckIn);
  defaultCheckOut.setDate(defaultCheckOut.getDate() + 1);
  defaultCheckOut.setHours(11, 0, 0, 0);
  
  const [checkInDate, setCheckInDate] = useState(defaultCheckIn);
  const [checkOutDate, setCheckOutDate] = useState(defaultCheckOut);
  
  // Initialize state variables with default prices from overnight stay logic
  const [prices, setPrices] = useState({
    weekday: { withoutJacuzzi: 105, withJacuzzi: 120 },
    friday: { withoutJacuzzi: 139, withJacuzzi: 159 },
    weekend: { withoutJacuzzi: 139, withJacuzzi: 169 }
  });
  
  // Add state for tracking when prices are updated
  const [priceUpdateCounter, setPriceUpdateCounter] = useState(0);
  // Confirmation message visibility
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  // State for room reminders: stores { reminderTime: Date, triggered: boolean }
  const [reminders, setReminders] = useState({});

  // Inline reminder edit state
  const [editingRoom, setEditingRoom] = useState(null);
  const [tempHour, setTempHour] = useState('12');
  const [tempMinute, setTempMinute] = useState('00');
  const [tempPeriod, setTempPeriod] = useState('AM');
  // Helper to format reminder time in 12-hour format
  const formatTime = (date) => new Date(date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  // Updated handler to open inline editor or dismiss triggered reminders
  const handleReminderClick = (roomNumber) => {
    const existing = reminders[roomNumber];
    // If reminder already triggered, dismiss it
    if (existing?.triggered) {
      const updated = { ...reminders };
      delete updated[roomNumber];
      setReminders(updated);
      return;
    }
    // Toggle editor for this room
    if (editingRoom === roomNumber) {
      setEditingRoom(null);
    } else {
      // Prepopulate with existing time or current time
      let dt = existing?.reminderTime || new Date();
      let h = dt.getHours();
      let m = dt.getMinutes();
      let period = h >= 12 ? 'PM' : 'AM';
      let h12 = h % 12 || 12;
      setTempHour(String(h12).padStart(2, '0'));
      setTempMinute(String(m).padStart(2, '0'));
      setTempPeriod(period);
      setEditingRoom(roomNumber);
    }
  };

  // Check reminders on each clock tick (currentTime updates every second)
  useEffect(() => {
    const now = new Date();
    Object.entries(reminders).forEach(([roomNumber, { reminderTime, triggered }]) => {
      if (!triggered && reminderTime <= now) {
        setReminders((prev) => ({
          ...prev,
          [roomNumber]: { ...prev[roomNumber], triggered: true }
        }));
      }
    });
  }, [currentTime, reminders]);
  
  // Initialize date and time on component mount and set up timer
  useEffect(() => {
    updateCurrentDateTime(); // Initial update
    
    // Set up timer to update every second
    const timer = setInterval(() => {
      updateCurrentDateTime();
    }, 1000);
    
    // Cleanup timer on component unmount
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update calculations when relevant state changes
  useEffect(() => {
    calculateCheckoutTime();
    calculatePrice();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extraHours, hasJacuzzi, paymentMethod, extraHourRate, isSmoking, currentTime]);
  
  // Update overnight calculations when relevant state changes
  useEffect(() => {
    calculateOvernightPrice();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overnightSmoking, overnightPayment, hasJacuzziOvernight, checkInDate, checkOutDate, 
      overnightExtraHours, overnightExtraRate, overnightCheckoutExtraHours, bedType, priceUpdateCounter]);
  
  const updateCurrentDateTime = () => {
    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let dayName = days[now.getDay()];
    let style = {};
    
    // Format current day based on weekday type
    let formattedDay;
    if (now.getDay() === 5) { // Friday
      formattedDay = `Friday`;
      style = { fontWeight: '900' };
    } else if (now.getDay() === 0 || now.getDay() === 6) { // Weekend
      formattedDay = `${dayName}`;
      style = { color: '#00308F', fontWeight: 'bold' };
    } else { // Weekday
      formattedDay = ` ${dayName}`;
    }
    
    setCurrentDay(formattedDay);
    setDayStyle(style);
    
    // Format date
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(now.toLocaleDateString('en-US', options));
    
    // Format time
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    const timeString = now.toLocaleTimeString('en-US', timeOptions);
    setCurrentTime(timeString);

    // Also update checkout time when current time changes
    calculateCheckoutTime(now);
  };
  
  const calculateCheckoutTime = (currentTimeDate = null) => {
    const now = currentTimeDate || new Date();
    const checkoutDate = new Date(now.getTime() + ((4 + extraHours) * 60 * 60 * 1000));
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    setCheckoutTime(checkoutDate.toLocaleTimeString('en-US', timeOptions));
  };
  
  const calculatePrice = () => {
    // Base price for first 4 hours (without tax)
    let basePrice;
    let tax = 0;
    
    if (hasJacuzzi) {
      basePrice = paymentMethod === 'cash' ? 90 : 90; // Same base price, tax calculated separately
    } else {
      basePrice = paymentMethod === 'cash' ? 60 : 60; // Same base price, tax calculated separately
    }
    
    // Extra hours cost
    const extraHoursCost = extraHours * extraHourRate;
    
    // Calculate tax only for credit card and only on base price
    if (paymentMethod === 'credit') {
      tax = basePrice * 0.15;
    }
    
    // Total
    let total = basePrice + extraHoursCost + tax;
    
    // Round for credit card payments with jacuzzi
    if (paymentMethod === 'credit' && hasJacuzzi) {
      total = Math.round(total);
    }
    
    setTotalPrice(total);
    return { basePrice, extraHoursCost, tax, total };
  };
  
  const calculateOvernightPrice = () => {
    if (!checkInDate || !checkOutDate) return 0;

    // Calculate total days
    const oneDay = 24 * 60 * 60 * 1000;
    const totalNights = Math.round(Math.abs((checkOutDate - checkInDate) / oneDay));
    
    // Initialize pricing variables
    let totalBasePrice = 0;
    let calculatedTotalPrice = 0;
    let daysBreakdown = [];
    
    // Special pricing for 7-night stays
    if (totalNights === 7) {
      // Flat rate for 7 nights
      totalBasePrice = hasJacuzziOvernight ? 695 : 675;
      
      // Add bed type adjustment for 7 nights
      if (bedType === 'king') {
        totalBasePrice += (5 * 7); // $5 extra per night for King
      } else if (bedType === 'double') {
        totalBasePrice += (10 * 7); // $10 extra per night for Double
      }
    } else {
      // Regular pricing for non-7-night stays
      totalBasePrice = calculateRegularPricing(totalNights, daysBreakdown);
    }
    
    // Calculate tax (15%) for all payments if stay is less than 7 nights
    let taxAmount = 0;
    if (totalNights < 7) {
      taxAmount = totalBasePrice * 0.15;
    }
    
    // Calculate extra hours cost for check-in
    let extraHoursCheckInCost = 0;
    if (overnightExtraHours !== 0) {
      extraHoursCheckInCost = Math.abs(overnightExtraHours) * overnightExtraRate;
    }
    
    // Calculate extra hours cost for checkout
    let extraHoursCheckOutCost = 0;
    if (overnightCheckoutExtraHours > 0) {
      extraHoursCheckOutCost = overnightCheckoutExtraHours * overnightExtraRate;
    }
    
    // Calculate total price
    calculatedTotalPrice = totalBasePrice + taxAmount + extraHoursCheckInCost + extraHoursCheckOutCost;
    
    return {
      nights: totalNights,
      totalBasePrice,
      taxAmount,
      extraHoursCheckInCost,
      extraHoursCheckOutCost,
      totalPrice: calculatedTotalPrice,
      daysBreakdown
    };
  };
  
  // Helper function to calculate regular pricing (non-7-night stays)
  const calculateRegularPricing = (totalNights, daysBreakdown) => {
    let totalBasePrice = 0;
    
    // Create pricing for each day of stay
    for (let i = 0; i < totalNights; i++) {
      const currentDate = new Date(checkInDate);
      currentDate.setDate(currentDate.getDate() + i);
      const dayOfWeek = currentDate.getDay();
      
      let dayBasePrice = 0;
      let dayName = '';
      
      // Set day name based on day of week
      if (dayOfWeek === 0) {
        dayName = 'Sunday';
      } else if (dayOfWeek === 6) {
        dayName = 'Saturday';
      } else if (dayOfWeek === 5) {
        dayName = 'Friday';
      } else {
        dayName = ['Monday', 'Tuesday', 'Wednesday', 'Thursday'][dayOfWeek - 1];
      }
      
      // Set base prices based on day of week and jacuzzi using the updated prices
      if (dayOfWeek === 5) { // Friday
        dayBasePrice = hasJacuzziOvernight ? prices.friday.withJacuzzi : prices.friday.withoutJacuzzi;
      } else if (dayOfWeek === 0 || dayOfWeek === 6) { // Weekend (Sunday or Saturday)
        dayBasePrice = hasJacuzziOvernight ? prices.weekend.withJacuzzi : prices.weekend.withoutJacuzzi;
      } else { // Weekday (Mon-Thu)
        dayBasePrice = hasJacuzziOvernight ? prices.weekday.withJacuzzi : prices.weekday.withoutJacuzzi;
      }

      // Add bed type price adjustment
      if (bedType === 'king') {
        dayBasePrice += 5; // King bed is $5 more
      } else if (bedType === 'double') {
        dayBasePrice += 10; // Double bed is $10 more
      }
      
      // Add to pricing totals
      totalBasePrice += dayBasePrice;
      
      // Add to days breakdown
      daysBreakdown.push({
        day: dayName,
        date: '',
        basePrice: dayBasePrice
      });
    }
    
    return totalBasePrice;
  };
  
  const handleExtraHoursChange = (change) => {
    const newExtraHours = Math.max(0, extraHours + change);
    setExtraHours(newExtraHours);
  };
  
  // Add a handler for overnight extra hours
  const handleOvernightExtraHoursChange = (change) => {
    setOvernightExtraHours(overnightExtraHours + change);
  };
  
  // Add handler for checkout extra hours
  // eslint-disable-next-line no-unused-vars
  const handleCheckoutExtraHoursChange = (change) => {
    setOvernightCheckoutExtraHours(overnightCheckoutExtraHours + change);
  };
  
  // Handler for check-in date changes
  const handleCheckInChange = (date) => {
    // Ensure check-in is before check-out
    if (date >= checkOutDate) {
      // If not, set check-out to a day after check-in
      const newCheckOut = new Date(date);
      newCheckOut.setDate(newCheckOut.getDate() + 1);
      newCheckOut.setHours(11, 0, 0, 0);
      setCheckOutDate(newCheckOut);
    }
    
    // Set check-in time to 3 PM + any hour adjustments
    date.setHours(15 + overnightExtraHours, 0, 0, 0);
    setCheckInDate(date);
  };
  
  // Handler for check-out date changes
  // eslint-disable-next-line no-unused-vars
  const handleCheckOutChange = (date) => {
    // Ensure check-out is after check-in
    if (date <= checkInDate) {
      return; // Prevent setting check-out before check-in
    }
    
    // Set check-out time to 11 AM + any hour adjustments
    date.setHours(11 + overnightCheckoutExtraHours, 0, 0, 0);
    setCheckOutDate(date);
  };

  // Update resetForm function
  const resetForm = () => {
    if (activeTab === 'changePrice') {
      // Reset prices to default values
      setPrices({
        weekday: { withoutJacuzzi: 105, withJacuzzi: 120 },
        friday: { withoutJacuzzi: 139, withJacuzzi: 159 },
        weekend: { withoutJacuzzi: 139, withJacuzzi: 169 }
      });
      // Update all calculations with new prices
      handlePriceUpdate();
      return;
    }

    // Reset short stay options
    setExtraHours(0);
    setHasJacuzzi(false);
    setPaymentMethod('cash');
    setExtraHourRate(15);
    setIsSmoking(false);
    
    // Reset overnight stay options
    setOvernightSmoking(false);
    setOvernightPayment('cash');
    setOvernightExtraRate(15);
    setOvernightExtraHours(0);
    setOvernightCheckoutExtraHours(0);
    setHasJacuzziOvernight(false);
    setBedType('queen');
    
    // Reset dates to defaults
    const defaultCheckIn = new Date();
    defaultCheckIn.setHours(15, 0, 0, 0);
    
    const defaultCheckOut = new Date(defaultCheckIn);
    defaultCheckOut.setDate(defaultCheckOut.getDate() + 1);
    defaultCheckOut.setHours(11, 0, 0, 0);
    
    setCheckInDate(defaultCheckIn);
    setCheckOutDate(defaultCheckOut);
    
    // Clear saved stays
    setSavedStays([]);
    setTotalStaysPrice(0);
    
    // Update current time
    updateCurrentDateTime();
  };
  
  // Reset overnight stay
  const resetOvernightStay = () => {
    // Save current selection before resetting
    const pricing = calculateOvernightPrice();
    if (pricing && pricing.totalPrice > 0) {
      const checkInDay = new Date(checkInDate).toLocaleDateString('en-US', { weekday: 'long' });
      const checkOutDay = new Date(checkOutDate).toLocaleDateString('en-US', { weekday: 'long' });
      
      const newStay = {
        id: Date.now(),
        checkIn: new Date(checkInDate),
        checkOut: new Date(checkOutDate),
        hasJacuzzi: hasJacuzziOvernight,
        smoking: overnightSmoking,
        payment: overnightPayment,
        extraRate: overnightExtraRate,
        checkInAdjustment: overnightExtraHours,
        checkOutAdjustment: overnightCheckoutExtraHours,
        nights: pricing.nights,
        basePrice: pricing.totalBasePrice,
        tax: pricing.taxAmount,
        extraHoursCheckIn: pricing.extraHoursCheckInCost,
        extraHoursCheckOut: pricing.extraHoursCheckOutCost,
        price: pricing.totalPrice,
        checkInDay,
        checkOutDay,
        details: pricing,
        bedType: bedType
      };
      
      const updatedStays = [...savedStays, newStay];
      setSavedStays(updatedStays);
      
      // Calculate total price of all stays
      const newTotalPrice = updatedStays.reduce((sum, stay) => sum + stay.price, 0);
      setTotalStaysPrice(newTotalPrice);
    }
    
    // Reset all selections including bed type
    setOvernightPayment('cash');
    setOvernightExtraHours(0);
    setOvernightCheckoutExtraHours(0);
    setHasJacuzziOvernight(false);
    setOvernightSmoking(false);
    setBedType('queen');
    
    // Reset dates to defaults
    const today = new Date();
    const checkInDefault = new Date(today);
    checkInDefault.setHours(15, 0, 0, 0); // 3:00 PM
    setCheckInDate(checkInDefault);
    
    const checkOutDefault = new Date(today);
    checkOutDefault.setDate(checkOutDefault.getDate() + 1);
    checkOutDefault.setHours(11, 0, 0, 0); // 11:00 AM
    setCheckOutDate(checkOutDefault);
  };
  
  // Remove a saved stay
  const removeSavedStay = (stayId) => {
    const updatedStays = savedStays.filter(stay => stay.id !== stayId);
    setSavedStays(updatedStays);
    
    // Recalculate total price
    const newTotalPrice = updatedStays.reduce((sum, stay) => sum + stay.price, 0);
    setTotalStaysPrice(newTotalPrice);
  };
  
  // Price summary section for overnight stays
  const renderOvernightStayPriceSummary = () => {
    if (activeTab === 'multiple') {
      const currentPricing = calculateOvernightPrice();
      
      return (
        <div className="price-summary" style={{ 
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          margin: '20px 0'
        }}>
          <h3 style={{ 
            color: '#001f5c',
            borderBottom: '2px solid #001f5c',
            paddingBottom: '10px',
            marginBottom: '15px'
          }}>Price Summary</h3>

          {/* Saved Stays Section */}
          {savedStays.length > 0 && (
            <div className="saved-stays-section">
              {savedStays.map((stay, index) => (
                <div key={stay.id} className="saved-stay" style={{ 
                  marginBottom: '15px', 
                  padding: '15px', 
                  backgroundColor: '#f8f9fa', 
                  borderRadius: '8px',
                  position: 'relative',
                  border: '1px solid #e0e0e0'
                }}>
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      marginBottom: '8px',
                      borderBottom: '1px solid #e0e0e0',
                      paddingBottom: '8px',
                      '@media (max-width: 375px)': {
                        flexWrap: 'nowrap',
                        gap: '10px'
                      }
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '4px',
                        '@media (max-width: 375px)': {
                          gap: '4px',
                          flex: '0 0 auto',
                          width: '45%'
                        }
                      }}>
                        <span 
                          className="stay-number"
                          style={{ 
                            fontWeight: 'bold', 
                            fontSize: '14px',
                            color: '#001f5c',
                            whiteSpace: 'nowrap',
                            '@media (max-width: 375px)': {
                              fontSize: '11px'
                            }
                          }}
                        >
                          Stay #{index+ 1}
                        </span>
                        <button
                          style={{
                            background: '#001f5c',
                            border: 'none',
                            color: '#fff',
                            cursor: 'pointer',
                            padding: '2px 4px',
                            fontSize: '10px',
                            borderRadius: '3px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            transition: 'all 0.2s',
                            fontWeight: '500',
                            textTransform: 'uppercase',
                            letterSpacing: '0.3px',
                            minWidth: '28px',
                            justifyContent: 'center',
                            '@media (max-width: 375px)': {
                              fontSize: '9px',
                              padding: '1px 3px',
                              minWidth: '24px'
                            }
                          }}
                          onMouseOver={(e) => {
                            e.target.style.background = '#002d85';
                          }}
                          onMouseOut={(e) => {
                            e.target.style.background = '#001f5c';
                          }}
                          onClick={() => {
                            // Set all the form fields to this stay's values
                            setCheckInDate(new Date(stay.checkIn));
                            setCheckOutDate(new Date(stay.checkOut));
                            setHasJacuzziOvernight(stay.hasJacuzzi);
                            setOvernightSmoking(stay.smoking);
                            setOvernightPayment(stay.payment);
                            setOvernightExtraRate(stay.extraRate);
                            setOvernightExtraHours(stay.checkInAdjustment);
                            setOvernightCheckoutExtraHours(stay.checkOutAdjustment);
                            setBedType(stay.bedType);
                            // Remove this stay
                            removeSavedStay(stay.id);
                          }}
                        >
                          Edit
                        </button>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        '@media (max-width: 375px)': {
                          gap: '6px',
                          flex: '1',
                          justifyContent: 'flex-end',
                          width: '55%'
                        }
                      }}>
                        <span 
                          className="stay-price"
                          style={{ 
                            fontWeight: 'bold', 
                            color: '#001f5c',
                            fontSize: '16px',
                            '@media (max-width: 375px)': {
                              fontSize: '12px',
                              marginLeft: 'auto'
                            }
                          }}
                        >
                          ${stay.price.toFixed(2)}
                        </span>
                        <button 
                          className="remove-button"
                          onClick={() => removeSavedStay(stay.id)}
                          style={{
                            background: '#dc3545',
                            border: 'none',
                            color: '#fff',
                            fontSize: '12px',
                            cursor: 'pointer',
                            padding: '3px 6px',
                            borderRadius: '4px',
                            transition: 'all 0.2s',
                            fontWeight: '500',
                            '@media (max-width: 375px)': {
                              fontSize: '10px',
                              padding: '2px 4px',
                              marginLeft: '4px'
                            }
                          }}
                          onMouseOver={(e) => {
                            e.target.style.backgroundColor = '#c82333';
                          }}
                          onMouseOut={(e) => {
                            e.target.style.backgroundColor = '#dc3545';
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <div style={{ fontSize: '14px', color: '#000' }}>
                      {stay.checkInDay} ({stay.checkIn.toLocaleDateString()}) to {stay.checkOutDay} ({stay.checkOut.toLocaleDateString()})
                    </div>
                    <div style={{ fontSize: '14px', color: '#000', marginTop: '4px' }}>
                      {stay.nights} {stay.nights === 1 ? 'night' : 'nights'}
                      {stay.hasJacuzzi ? ' • Jacuzzi' : ''}
                      {' • '}{stay.bedType.charAt(0).toUpperCase() + stay.bedType.slice(1)} Bed
                      {stay.checkInAdjustment !== 0 && ` • Check-in ${stay.checkInAdjustment > 0 ? `+${stay.checkInAdjustment}hrs` : `${stay.checkInAdjustment}hrs`}`}
                      {stay.checkOutAdjustment !== 0 && ` • Check-out ${stay.checkOutAdjustment > 0 ? `+${stay.checkOutAdjustment}hrs` : `${stay.checkOutAdjustment}hrs`}`}
                    </div>
                  </div>
                  <div style={{ 
                    fontSize: '13px', 
                    color: '#000', 
                    backgroundColor: '#f0f0f0',
                    padding: '10px',
                    borderRadius: '6px',
                    marginTop: '8px'
                  }}>
                    <div className="summary-line" style={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      gap: '4px'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        borderBottom: '1px solid #ddd',
                        paddingBottom: '4px',
                        marginBottom: '4px'
                      }}>
                        <span>Base Price ({stay.nights} {stay.nights === 1 ? 'night' : 'nights'}):</span>
                        <span>${stay.basePrice.toFixed(2)}</span>
                      </div>
                      {stay.details.daysBreakdown.map((day, idx) => (
                        <div key={idx} style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          fontSize: '12px',
                          color: '#444'
                        }}>
                          <span>{day.day}:</span>
                          <span>${day.basePrice.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    {stay.tax > 0 && (
                      <div className="summary-line" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', marginTop: '8px' }}>
                        <span>Tax (15%):</span>
                        <span>${stay.tax.toFixed(2)}</span>
                      </div>
                    )}
                    {stay.extraHoursCheckIn > 0 && (
                      <div className="summary-line" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span>Check-in Hours ({stay.checkInAdjustment > 0 ? `Late: +${stay.checkInAdjustment}hrs` : `Early: ${Math.abs(stay.checkInAdjustment)}hrs`}):</span>
                        <span>${stay.extraHoursCheckIn.toFixed(2)}</span>
                      </div>
                    )}
                    {stay.extraHoursCheckOut > 0 && (
                      <div className="summary-line" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span>Check-out Hours ({stay.checkOutAdjustment > 0 ? `Late: +${stay.checkOutAdjustment}hrs` : `Early: ${Math.abs(stay.checkOutAdjustment)}hrs`}):</span>
                        <span>${stay.extraHoursCheckOut.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              <div className="summary-line total" style={{ 
                marginTop: '20px', 
                borderTop: '2px solid #001f5c',
                paddingTop: '15px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '18px',
                fontWeight: 'bold'
              }}>
                <span style={{ color: '#001f5c' }}>Total Price:</span>
                <span style={{ color: '#001f5c', fontSize: '20px' }}>
                  ${totalStaysPrice.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {savedStays.length === 0 && (
            <p style={{ 
              textAlign: 'center', 
              color: '#000', 
              padding: '30px',
              backgroundColor: '#f8f9fa',
              borderRadius: '6px',
              fontSize: '15px'
            }}>
              Select dates and click "Add Stay" to begin adding stays
            </p>
          )}
        </div>
      );
    }

    if (!checkInDate || !checkOutDate) {
      return <p>Please select check-in and check-out dates.</p>;
    }

    const pricing = calculateOvernightPrice();
    const totalPrice = pricing.totalPrice;
    const totalNights = pricing.nights;

    return (
      <div className="price-summary">
        <h3>Price Summary</h3>
        
        {/* Current stay summary */}
        <div className="summary-section">
          <div className="summary-line">
            <span>Stay Duration:</span>
            <span>{pricing.nights}{pricing.nights === 1 ? ' Night' : ' Nights'}</span>
          </div>
          
          {totalNights === 7 && (
            <div className="summary-line">
              <span>Weekly Special Rate:</span>
              <span>${(() => {
                let baseRate = hasJacuzziOvernight ? 695 : 675;
                if (bedType === 'king') {
                  baseRate += (5 * 7); // $5 extra per night for King
                } else if (bedType === 'double') {
                  baseRate += (10 * 7); // $10 extra per night for Double
                }
                return baseRate.toFixed(2);
              })()}</span>
            </div>
          )}
          
          {totalNights !== 7 && (
            <>
              {pricing.daysBreakdown.map((day, index) => (
                <div key={index} className="summary-line">
                  <span>{day.day}:</span>
                  <span>${day.basePrice.toFixed(2)}</span>
                </div>
              ))}
              <div className="summary-line" style={{ borderTop: '1px solid #eee', marginTop: '8px', paddingTop: '8px' }}>
                <span>Total Base Price:</span>
                <span>${pricing.totalBasePrice.toFixed(2)}</span>
              </div>
            </>
          )}
          
          {totalNights < 7 && (
            <div className="summary-line">
              <span>Tax (15%):</span>
              <span>${pricing.taxAmount.toFixed(2)}</span>
            </div>
          )}
          
          {overnightExtraHours !== 0 && (
            <div className="summary-line">
              <span>Check-in Hours ({overnightExtraHours > 0 ? `Late: +${overnightExtraHours}hrs` : `Early: ${Math.abs(overnightExtraHours)}hrs`}):</span>
              <span>${pricing.extraHoursCheckInCost.toFixed(2)}</span>
            </div>
          )}
          
          {overnightCheckoutExtraHours !== 0 && (
            <div className="summary-line">
              <span>Check-out Hours ({overnightCheckoutExtraHours > 0 ? `Late: +${overnightCheckoutExtraHours}hrs` : `Early: ${Math.abs(overnightCheckoutExtraHours)}hrs`}):</span>
              <span>${pricing.extraHoursCheckOutCost.toFixed(2)}</span>
            </div>
          )}
          
          <div className="summary-line total">
            <span>Total Price:</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
    );
  };
  
  // Add a function to handle price updates
  const handlePriceUpdate = () => {
    // Increment the counter to force a UI refresh
    setPriceUpdateCounter(prev => prev + 1);
    
    // Recalculate prices for any saved stays
    const updatedStays = savedStays.map(stay => {
      const checkInDay = new Date(stay.checkIn).getDay();
      let basePrice = 0;
      
      // Update base price based on day and room type
      if (checkInDay === 5) { // Friday
        basePrice = stay.hasJacuzzi ? prices.friday.withJacuzzi : prices.friday.withoutJacuzzi;
      } else if (checkInDay === 0 || checkInDay === 6) { // Weekend
        basePrice = stay.hasJacuzzi ? prices.weekend.withJacuzzi : prices.weekend.withoutJacuzzi;
      } else { // Weekday
        basePrice = stay.hasJacuzzi ? prices.weekday.withJacuzzi : prices.weekday.withoutJacuzzi;
      }
      
      // Add bed type adjustment
      if (stay.bedType === 'king') {
        basePrice += 5;
      } else if (stay.bedType === 'double') {
        basePrice += 10;
      }
      
      // Calculate total price
      const tax = stay.nights < 7 ? basePrice * 0.15 : 0;
      const totalPrice = basePrice + tax + stay.extraHoursCheckIn + stay.extraHoursCheckOut;
      
      return {
        ...stay,
        basePrice,
        tax,
        price: totalPrice
      };
    });
    
    // Update saved stays with new prices
    setSavedStays(updatedStays);
    
    // Update total price of all stays
    const newTotalPrice = updatedStays.reduce((sum, stay) => sum + stay.price, 0);
    setTotalStaysPrice(newTotalPrice);
    // Show confirmation message, hide after 15 seconds
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 15000);
  };
  
  // Add function to toggle room status
  const toggleRoomStatus = (floor, roomNumber) => {
    setRooms(prevRooms => {
      const updatedRooms = {
        ...prevRooms,
        [floor]: prevRooms[floor].map(room => {
          if (room.number === roomNumber) {
            return {
              ...room,
              status: room.status === 'available' ? 'occupied' : 'available'
            };
          }
          return room;
        })
      };
      return updatedRooms;
    });
  };

  // Function to calculate room price with scheduling
  const calculateRoomPrice = (room) => {
    let basePrice = 0;
    const currentDay = new Date().getDay();
    const isWeekend = currentDay === 0 || currentDay === 6;
    const isFriday = currentDay === 5;
    const schedule = roomSchedules[room.number];
    
    // Check if we have scheduled dates
    if (schedule?.startDate && schedule?.endDate) {
      const oneDay = 24 * 60 * 60 * 1000;
      // Add 1 because we count both start and end dates
      const totalNights = Math.max(1, Math.round(Math.abs((schedule.endDate - schedule.startDate) / oneDay)) + 1);
      
      // Calculate base price using logic from overnight stay
      let totalBasePrice = 0;
      
      // Special pricing for 7-night stays
      if (totalNights === 7) {
        totalBasePrice = room.type === 'jacuzzi' ? 695 : 675;
        
        // Add bed type adjustment for 7 nights
        if (room.beds === 'king') {
          totalBasePrice += (5 * 7);
        } else if (room.beds === 'double') {
          totalBasePrice += (10 * 7);
        }
      } else {
        // Regular pricing for each day
        for (let i = 0; i < totalNights; i++) {
          const currentDate = new Date(schedule.startDate);
          currentDate.setDate(currentDate.getDate() + i);
          const dayOfWeek = currentDate.getDay();
          
          let dayBasePrice = 0;
          
          // Set base prices based on day and room type
          if (dayOfWeek === 5) { // Friday
            dayBasePrice = room.type === 'jacuzzi' ? prices.friday.withJacuzzi : prices.friday.withoutJacuzzi;
          } else if (dayOfWeek === 0 || dayOfWeek === 6) { // Weekend
            dayBasePrice = room.type === 'jacuzzi' ? prices.weekend.withJacuzzi : prices.weekend.withoutJacuzzi;
          } else { // Weekday
            dayBasePrice = room.type === 'jacuzzi' ? prices.weekday.withJacuzzi : prices.weekday.withoutJacuzzi;
          }
          
          // Add bed type price adjustment
          if (room.beds === 'king') {
            dayBasePrice += 5;
          } else if (room.beds === 'double') {
            dayBasePrice += 10;
          }
          
          totalBasePrice += dayBasePrice;
        }
      }
      
      // Calculate tax
      const taxAmount = totalNights < 7 ? totalBasePrice * 0.15 : 0;
      
      // Calculate extra hours costs
      const checkInAdj = schedule.checkInAdj || 0;
      const checkOutAdj = schedule.checkOutAdj || 0;
      const extraRate = 15; // Using default rate
      
      const extraHoursCheckInCost = checkInAdj !== 0 ? Math.abs(checkInAdj) * extraRate : 0;
      const extraHoursCheckOutCost = checkOutAdj > 0 ? checkOutAdj * extraRate : 0;
      
      // Calculate total
      const total = totalBasePrice + taxAmount + extraHoursCheckInCost + extraHoursCheckOutCost;
      
      return {
        basePrice: totalBasePrice,
        tax: taxAmount,
        extraHoursCheckIn: extraHoursCheckInCost,
        extraHoursCheckOut: extraHoursCheckOutCost,
        nights: totalNights,
        total
      };
    }
    
    // If no schedule, use original calculation
    if (isFriday) {
      basePrice = room.type === 'jacuzzi' ? prices.friday.withJacuzzi : prices.friday.withoutJacuzzi;
    } else if (isWeekend) {
      basePrice = room.type === 'jacuzzi' ? prices.weekend.withJacuzzi : prices.weekend.withoutJacuzzi;
    } else {
      basePrice = room.type === 'jacuzzi' ? prices.weekday.withJacuzzi : prices.weekday.withoutJacuzzi;
    }

    // Add bed type adjustment
    if (room.beds === 'king') {
      basePrice += 5;
    } else if (room.beds === 'double') {
      basePrice += 10;
    }

    const tax = basePrice * 0.15;
    const total = basePrice + tax;

    return {
      basePrice,
      tax,
      total,
      nights: 1
    };
  };
  
  // Add state for multiple filters
  const [selectedFilters, setSelectedFilters] = useState([]);

  // Update filter handling
  const handleFilterClick = (filter) => {
    setSelectedFilters(prev => {
      if (filter === 'all') {
        return [];
      }
      if (prev.includes(filter)) {
        return prev.filter(f => f !== filter);
      }
      return [...prev, filter];
    });
  };

  // Update room filtering logic
  const filterRoom = (room) => {
    if (selectedFilters.length === 0) return true;
    return selectedFilters.every(filter => {
      switch (filter) {
        case 'non-smoking':
          return !room.smoking;
        case 'smoking':
          return room.smoking;
        case 'queen':
          return room.beds === 'queen';
        case 'king':
          return room.beds === 'king';
        case 'double':
          return room.beds === 'double';
        case 'jacuzzi':
          return room.type === 'jacuzzi';
        default:
          return true;
      }
    });
  };
  
  // Add effect to collapse floors when filters change
  // useEffect(() => {
  //   setGroundFloorExpanded(false);
  //   setFirstFloorExpanded(false);
  // }, [selectedFilters]);

  // Update effect for tab changes to reset to default state
  useEffect(() => {
    if (activeTab === 'rooms') {
      setGroundFloorExpanded(true); // Ground floor open by default
      setFirstFloorExpanded(false); // First floor closed by default
    }
  }, [activeTab]);
  
  // State for room-specific calendar and hour adjustments
  const [openCalendar, setOpenCalendar] = useState(null);
  const [roomSchedules, setRoomSchedules] = useState({});

  // Update to support date ranges and price updates
  const handleRoomDateSelect = (roomNumber, date) => {
    // For single date selection
    setRoomSchedules(prev => {
      const current = prev[roomNumber] || {};
      
      // If we already have a startDate but no endDate
      if (current.startDate && !current.endDate && date > current.startDate) {
        // Set the end date
        return {
          ...prev,
          [roomNumber]: {
            ...current,
            endDate: date
          }
        };
      }
      
      // Otherwise, start a new selection
      return {
        ...prev,
        [roomNumber]: {
          ...current,
          startDate: date,
          endDate: null
        }
      };
    });
    
    // Do not close the calendar after date selection
    // The calendar will only close when clicking the calendar icon
  };

  const handleRoomHourAdjustment = (roomNumber, type, change) => {
    setRoomSchedules(prev => {
      const current = prev[roomNumber] || { checkInAdj: 0, checkOutAdj: 0 };
      const updated = {
        ...current,
        [type === 'checkIn' ? 'checkInAdj' : 'checkOutAdj']: 
          (current[type === 'checkIn' ? 'checkInAdj' : 'checkOutAdj'] || 0) + change
      };
      return { ...prev, [roomNumber]: updated };
    });
    
    // Force UI update to recalculate prices immediately
    setPriceUpdateCounter(prev => prev + 1);
  };

  // Format adjusted time
  const formatAdjustedTime = (baseHour, adjustment) => {
    const dt = new Date();
    dt.setHours(baseHour + adjustment, 0, 0, 0);
    return dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };
  
  return (
    <div className="App">
      <div className="hotel-calculator">
        <div className="header">
          <h1>
            Price Calculator
            <span style={{ 
              marginLeft: '10px', 
              fontSize: '16px', 
              backgroundColor: '#f0f0f0', 
              padding: '4px 8px', 
              borderRadius: '4px',
              display: 'inline-flex',
              alignItems: 'center',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              📅 {new Date().toLocaleDateString()} - {currentDay}
            </span>
          </h1>
          <button className="clear-button" onClick={resetForm}>Clear</button>
        </div>
        
        <div className="stay-tabs">
          <button 
            className={`tab-button ${activeTab === 'short' ? 'active' : ''}`} 
            onClick={() => setActiveTab('short')}
            style={{
              backgroundColor: activeTab === 'short' ? '#dbf5db' : '#f0fff0'
            }}
          >
            Short Stay
          </button>
          <button 
            className={`tab-button ${activeTab === 'overnight' ? 'active' : ''}`} 
            onClick={() => setActiveTab('overnight')}
          >
            Overnight Stay
          </button>
          <button 
            className={`tab-button ${activeTab === 'multiple' ? 'active' : ''}`} 
            onClick={() => setActiveTab('multiple')}
            style={{
              backgroundColor: activeTab === 'multiple' ? '#b19cd9' : '#f0e6ff'
            }}
          >
            Multiple Nights
          </button>
          <button 
            className={`tab-button ${activeTab === 'rooms' ? 'active' : ''}`} 
            onClick={() => setActiveTab('rooms')}
            style={{
              backgroundColor: activeTab === 'rooms' ? '#4169E1' : '#E6E6FA'
            }}
          >
            Rooms
          </button>
          <button 
            className={`tab-button ${activeTab === 'changePrice' ? 'active' : ''}`} 
            onClick={() => setActiveTab('changePrice')}
            style={{
              backgroundColor: activeTab === 'changePrice' ? '#ffd700' : '#fff3b0'
            }}
          >
            Change Price
          </button>
        </div>
        
        <div className="stay-sections">
          <div className={`short-stay-section ${activeTab === 'short' ? 'active' : ''}`}
            style={{ backgroundColor: '#f0fff0' }}>
            <h2 className="section-header">Short Stay</h2>
            
            <div className="option-group" style={{ maxWidth: '500px', margin: '0 auto 20px auto' }}>
              <label className="section-subheader">Check-in & Check-out Times</label>
              <div className="time-section">
                <div className="check-time">
                  <label>Check-in Time:</label>
                  <span>{currentTime}</span>
                </div>
                
                <div className="check-time">
                  <label>Check-out Time:</label>
                  <span>{checkoutTime}</span>
                </div>
                
                <div className="extra-hours">
                  <label>Extra Hours:</label>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                    <div className="hours-control">
                      <button className="minus-btn" onClick={() => handleExtraHoursChange(-1)}>-</button>
                      <span>{extraHours}</span>
                      <button className="plus-btn" onClick={() => handleExtraHoursChange(1)}>+</button>
                    </div>
                    <span className="hours-note" style={{ color: '#00308F', fontWeight: 'bold' }}>Total: {4 + extraHours} hours</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="room-options">
              <div className="option-group">
                <label>Room Type:</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      checked={!hasJacuzzi}
                      onChange={() => setHasJacuzzi(false)}
                    />
                    No Jacuzzi
                  </label>
                  <label>
                    <input
                      type="radio"
                      checked={hasJacuzzi}
                      onChange={() => setHasJacuzzi(true)}
                    />
                    With Jacuzzi
                  </label>
                </div>
              </div>
              
              <div className="option-group">
                <label>Smoking Preference:</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      checked={!isSmoking}
                      onChange={() => setIsSmoking(false)}
                    />
                    Non-Smoking
                  </label>
                  <label>
                    <input
                      type="radio"
                      checked={isSmoking}
                      onChange={() => setIsSmoking(true)}
                    />
                    Smoking
                  </label>
                </div>
              </div>
              
              <div className="option-group">
                <label>Payment Method:</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      checked={paymentMethod === 'cash'}
                      onChange={() => setPaymentMethod('cash')}
                    />
                    Cash
                  </label>
                  <label>
                    <input
                      type="radio"
                      checked={paymentMethod === 'credit'}
                      onChange={() => setPaymentMethod('credit')}
                    />
                    Credit Card
                  </label>
                </div>
              </div>
              
              <div className="option-group">
                <label>Extra Hour Rate:</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      checked={extraHourRate === 15}
                      onChange={() => setExtraHourRate(15)}
                    />
                    $15/hour
                  </label>
                  <label>
                    <input
                      type="radio"
                      checked={extraHourRate === 10}
                      onChange={() => setExtraHourRate(10)}
                    />
                    $10/hour
                  </label>
                </div>
              </div>
            </div>
            
            <div className="price-summary">
              <div className="summary-line">
                <span>Base Price (4 hours):</span>
                <span>${hasJacuzzi ? '90.00' : '60.00'}</span>
              </div>
              
              {paymentMethod === 'credit' && (
                <div className="summary-line">
                  <span>Tax (15%)</span>
                  <span>${((hasJacuzzi ? 90 : 60) * 0.15).toFixed(2)}</span>
                </div>
              )}
              
              <div className="summary-line">
                <span>Extra Hours Cost:</span>
                <span>${(extraHours * extraHourRate).toFixed(2)}</span>
              </div>
              
              <div className="summary-line total-hours">
                <span>Total Hours:</span>
                <span>4 + {extraHours} = {4 + extraHours} hours</span>
              </div>
              
              <div className="summary-line total">
                <span>Total Price:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className={`overnight-stay-section ${activeTab === 'overnight' ? 'active' : ''}`}>
            <h2 className="section-header">Overnight Stay</h2>
            
            <div className="overnight-dates">
              <div className="date-picker-container">
                <label>Check-in Date:</label>
                <DatePicker
                  selected={checkInDate}
                  onChange={handleCheckInChange}
                  dateFormat="MMMM d, yyyy h:mm aa"
                  minDate={new Date()}
                  className="date-picker"
                  showTimeSelect={false}
                  timeFormat="HH:mm"
                  timeIntervals={60}
                  timeCaption="Time"
                  onFocus={e => e.target.blur()}
                  onKeyDown={e => e.preventDefault()}
                />
                <span className="calendar-icon">📅</span>
                <span className="time-note">Standard check-in: 3:00 PM</span>
                
                <div className="extra-hours-overnight">
                  <label>Hour Adjustment:</label>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                    <div className="hours-control">
                      <button className="minus-btn" onClick={() => handleOvernightExtraHoursChange(-1)}>-</button>
                      <span>{overnightExtraHours}</span>
                      <button className="plus-btn" onClick={() => handleOvernightExtraHoursChange(1)}>+</button>
                    </div>
                    <span className="hours-note" style={{ color: '#00308F', fontWeight: 'bold' }}>
                      {overnightExtraHours < 0 
                        ? `${Math.abs(overnightExtraHours)} hrs before (${new Date(new Date().setHours(15 + overnightExtraHours, 0, 0, 0)).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})})` 
                        : overnightExtraHours > 0 
                        ? `${overnightExtraHours} hrs after (${new Date(new Date().setHours(15 + overnightExtraHours, 0, 0, 0)).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})})` 
                        : 'Standard time (3:00 PM)'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="date-picker-container">
                <label>Check-out Date:</label>
                <DatePicker
                  selected={checkOutDate}
                  onChange={handleCheckOutChange}
                  dateFormat="MMMM d, yyyy h:mm aa"
                  minDate={checkInDate}
                  className="date-picker"
                  showTimeSelect={false}
                  timeFormat="HH:mm"
                  timeIntervals={60}
                  timeCaption="Time"
                  onFocus={e => e.target.blur()}
                  onKeyDown={e => e.preventDefault()}
                />
                <span className="calendar-icon">📅</span>
                <span className="time-note">Standard check-out: 11:00 AM</span>
                
                <div className="extra-hours-overnight">
                  <label>Hour Adjustment:</label>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                    <div className="hours-control">
                      <button className="minus-btn" onClick={() => handleCheckoutExtraHoursChange(-1)}>-</button>
                      <span>{overnightCheckoutExtraHours}</span>
                      <button className="plus-btn" onClick={() => handleCheckoutExtraHoursChange(1)}>+</button>
                    </div>
                    <span className="hours-note" style={{ color: '#00308F', fontWeight: 'bold' }}>
                      {overnightCheckoutExtraHours < 0 
                        ? `${Math.abs(overnightCheckoutExtraHours)} hrs before (${new Date(new Date().setHours(11 + overnightCheckoutExtraHours, 0, 0, 0)).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})})` 
                        : overnightCheckoutExtraHours > 0 
                        ? `${overnightCheckoutExtraHours} hrs after (${new Date(new Date().setHours(11 + overnightCheckoutExtraHours, 0, 0, 0)).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})})` 
                        : 'Standard time (11:00 AM)'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="room-options">
              <div className="option-group">
                <label>Room Type:</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      checked={!hasJacuzziOvernight}
                      onChange={() => setHasJacuzziOvernight(false)}
                    />
                    No Jacuzzi
                  </label>
                  <label>
                    <input
                      type="radio"
                      checked={hasJacuzziOvernight}
                      onChange={() => setHasJacuzziOvernight(true)}
                    />
                    With Jacuzzi
                  </label>
                </div>
              </div>
              
              <div className="option-group">
                <label>Bed Type:</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      checked={bedType === 'queen'}
                      onChange={() => setBedType('queen')}
                    />
                    Queen Bed
                  </label>
                  <label>
                    <input
                      type="radio"
                      checked={bedType === 'king'}
                      onChange={() => setBedType('king')}
                    />
                    King Bed
                  </label>
                  {!hasJacuzziOvernight && (
                    <label>
                      <input
                        type="radio"
                        checked={bedType === 'double'}
                        onChange={() => setBedType('double')}
                      />
                      Double Bed
                    </label>
                  )}
                </div>
              </div>
              
              <div className="option-group">
                <label>Smoking Preference:</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      checked={!overnightSmoking}
                      onChange={() => setOvernightSmoking(false)}
                    />
                    Non-Smoking
                  </label>
                  <label>
                    <input
                      type="radio"
                      checked={overnightSmoking}
                      onChange={() => setOvernightSmoking(true)}
                    />
                    Smoking
                  </label>
                </div>
              </div>
              
              <div className="option-group">
                <label>Payment Method:</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      value="cash"
                      checked={overnightPayment === 'cash'}
                      onChange={() => setOvernightPayment('cash')}
                    />
                    Cash
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="credit"
                      checked={overnightPayment === 'credit'}
                      onChange={() => setOvernightPayment('credit')}
                    />
                    Credit Card
                  </label>
                </div>
              </div>
              
              <div className="option-group">
                <label>Extra Hour Rate:</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      checked={overnightExtraRate === 15}
                      onChange={() => setOvernightExtraRate(15)}
                    />
                    $15/hour
                  </label>
                  <label>
                    <input
                      type="radio"
                      checked={overnightExtraRate === 10}
                      onChange={() => setOvernightExtraRate(10)}
                    />
                    $10/hour
                  </label>
                </div>
              </div>
            </div>
            
            {renderOvernightStayPriceSummary()}
          </div>

          {/* Multiple Nights Section */}
          <div 
            className={`overnight-stay-section ${activeTab === 'multiple' ? 'active' : ''}`}
            style={{
              backgroundColor: '#e6e0f3'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
              <h2 className="section-header">Multiple Nights</h2>
              <button 
                className="add-more-button"
                onClick={() => resetOvernightStay()}
              >
                <span>+</span> Add Stay
              </button>
            </div>
            
            <div className="overnight-dates">
              <div className="date-picker-container">
                <label>Check-in Date:</label>
                <DatePicker
                  selected={checkInDate}
                  onChange={handleCheckInChange}
                  dateFormat="MMMM d, yyyy h:mm aa"
                  minDate={new Date()}
                  className="date-picker"
                  showTimeSelect={false}
                  timeFormat="HH:mm"
                  timeIntervals={60}
                  timeCaption="Time"
                  onFocus={e => e.target.blur()}
                  onKeyDown={e => e.preventDefault()}
                />
                <span className="calendar-icon">📅</span>
                <span className="time-note">Standard check-in: 3:00 PM</span>
                
                <div className="extra-hours-overnight">
                  <label>Hour Adjustment:</label>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                    <div className="hours-control">
                      <button className="minus-btn" onClick={() => handleOvernightExtraHoursChange(-1)}>-</button>
                      <span>{overnightExtraHours}</span>
                      <button className="plus-btn" onClick={() => handleOvernightExtraHoursChange(1)}>+</button>
                    </div>
                    <span className="hours-note" style={{ color: '#00308F', fontWeight: 'bold' }}>
                      {overnightExtraHours < 0 
                        ? `${Math.abs(overnightExtraHours)} hrs before (${new Date(new Date().setHours(15 + overnightExtraHours, 0, 0, 0)).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})})` 
                        : overnightExtraHours > 0 
                        ? `${overnightExtraHours} hrs after (${new Date(new Date().setHours(15 + overnightExtraHours, 0, 0, 0)).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})})` 
                        : 'Standard time (3:00 PM)'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="date-picker-container">
                <label>Check-out Date:</label>
                <DatePicker
                  selected={checkOutDate}
                  onChange={handleCheckOutChange}
                  dateFormat="MMMM d, yyyy h:mm aa"
                  minDate={checkInDate}
                  className="date-picker"
                  showTimeSelect={false}
                  timeFormat="HH:mm"
                  timeIntervals={60}
                  timeCaption="Time"
                  onFocus={e => e.target.blur()}
                  onKeyDown={e => e.preventDefault()}
                />
                <span className="calendar-icon">📅</span>
                <span className="time-note">Standard check-out: 11:00 AM</span>
                
                <div className="extra-hours-overnight">
                  <label>Hour Adjustment:</label>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                    <div className="hours-control">
                      <button className="minus-btn" onClick={() => handleCheckoutExtraHoursChange(-1)}>-</button>
                      <span>{overnightCheckoutExtraHours}</span>
                      <button className="plus-btn" onClick={() => handleCheckoutExtraHoursChange(1)}>+</button>
                    </div>
                    <span className="hours-note" style={{ color: '#00308F', fontWeight: 'bold' }}>
                      {overnightCheckoutExtraHours < 0 
                        ? `${Math.abs(overnightCheckoutExtraHours)} hrs before (${new Date(new Date().setHours(11 + overnightCheckoutExtraHours, 0, 0, 0)).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})})` 
                        : overnightCheckoutExtraHours > 0 
                        ? `${overnightCheckoutExtraHours} hrs after (${new Date(new Date().setHours(11 + overnightCheckoutExtraHours, 0, 0, 0)).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})})` 
                        : 'Standard time (11:00 AM)'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="room-options">
              <div className="option-group">
                <label>Room Type:</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      checked={!hasJacuzziOvernight}
                      onChange={() => setHasJacuzziOvernight(false)}
                    />
                    No Jacuzzi
                  </label>
                  <label>
                    <input
                      type="radio"
                      checked={hasJacuzziOvernight}
                      onChange={() => setHasJacuzziOvernight(true)}
                    />
                    With Jacuzzi
                  </label>
                </div>
              </div>
              
              <div className="option-group">
                <label>Bed Type:</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      checked={bedType === 'queen'}
                      onChange={() => setBedType('queen')}
                    />
                    Queen Bed
                  </label>
                  <label>
                    <input
                      type="radio"
                      checked={bedType === 'king'}
                      onChange={() => setBedType('king')}
                    />
                    King Bed
                  </label>
                  {!hasJacuzziOvernight && (
                    <label>
                      <input
                        type="radio"
                        checked={bedType === 'double'}
                        onChange={() => setBedType('double')}
                      />
                      Double Bed
                    </label>
                  )}
                </div>
              </div>
              
              <div className="option-group">
                <label>Smoking Preference:</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      checked={!overnightSmoking}
                      onChange={() => setOvernightSmoking(false)}
                    />
                    Non-Smoking
                  </label>
                  <label>
                    <input
                      type="radio"
                      checked={overnightSmoking}
                      onChange={() => setOvernightSmoking(true)}
                    />
                    Smoking
                  </label>
                </div>
              </div>
              
              <div className="option-group">
                <label>Payment Method:</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      value="cash"
                      checked={overnightPayment === 'cash'}
                      onChange={() => setOvernightPayment('cash')}
                    />
                    Cash
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="credit"
                      checked={overnightPayment === 'credit'}
                      onChange={() => setOvernightPayment('credit')}
                    />
                    Credit Card
                  </label>
                </div>
              </div>
              
              <div className="option-group">
                <label>Extra Hour Rate:</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      checked={overnightExtraRate === 15}
                      onChange={() => setOvernightExtraRate(15)}
                    />
                    $15/hour
                  </label>
                  <label>
                    <input
                      type="radio"
                      checked={overnightExtraRate === 10}
                      onChange={() => setOvernightExtraRate(10)}
                    />
                    $10/hour
                  </label>
                </div>
              </div>
            </div>
            
            {renderOvernightStayPriceSummary()}
          </div>

          {/* Rooms Section */}
          {activeTab === 'rooms' && (
            <div className="rooms-section" style={{ 
              backgroundColor: '#f5f5f5',
              padding: '20px'
            }}>
              <h2 className="section-header">Room Status</h2>
              
              {/* Room Filters */}
              <div className="room-filters" style={{
                backgroundColor: '#fff',
                padding: '20px',
                borderRadius: '8px',
                marginBottom: '20px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <div className="filter-group" style={{
                  display: 'flex',
                  gap: '10px',
                  justifyContent: 'flex-start',
                  flexWrap: 'wrap'
                }}>
                  <button
                    onClick={() => handleFilterClick('all')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '20px',
                      border: 'none',
                      backgroundColor: selectedFilters.length === 0 ? '#001f5c' : '#f0f0f0',
                      color: selectedFilters.length === 0 ? '#fff' : '#333',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: selectedFilters.length === 0 ? 'bold' : 'normal',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span style={{ fontSize: '16px' }}>🏠</span>
                    All Rooms
                  </button>
                  <button
                    onClick={() => handleFilterClick('jacuzzi')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '20px',
                      border: 'none',
                      backgroundColor: selectedFilters.includes('jacuzzi') ? '#001f5c' : '#f0f0f0',
                      color: selectedFilters.includes('jacuzzi') ? '#fff' : '#333',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: selectedFilters.includes('jacuzzi') ? 'bold' : 'normal',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span style={{ fontSize: '16px' }}>🛁</span>
                    Jacuzzi
                  </button>
                  <button
                    onClick={() => handleFilterClick('non-smoking')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '20px',
                      border: 'none',
                      backgroundColor: selectedFilters.includes('non-smoking') ? '#001f5c' : '#f0f0f0',
                      color: selectedFilters.includes('non-smoking') ? '#fff' : '#333',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: selectedFilters.includes('non-smoking') ? 'bold' : 'normal',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span style={{ fontSize: '16px' }}>🚭</span>
                    Non-Smoking
                  </button>
                  <button
                    onClick={() => handleFilterClick('smoking')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '20px',
                      border: 'none',
                      backgroundColor: selectedFilters.includes('smoking') ? '#001f5c' : '#f0f0f0',
                      color: selectedFilters.includes('smoking') ? '#fff' : '#333',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: selectedFilters.includes('smoking') ? 'bold' : 'normal',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span style={{ fontSize: '16px' }}>🚬</span>
                    Smoking
                  </button>
                  <button
                    onClick={() => handleFilterClick('queen')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '20px',
                      border: 'none',
                      backgroundColor: selectedFilters.includes('queen') ? '#001f5c' : '#f0f0f0',
                      color: selectedFilters.includes('queen') ? '#fff' : '#333',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: selectedFilters.includes('queen') ? 'bold' : 'normal',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span style={{ fontSize: '16px' }}>🛏️</span>
                    Queen Bed
                  </button>
                  <button
                    onClick={() => handleFilterClick('king')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '20px',
                      border: 'none',
                      backgroundColor: selectedFilters.includes('king') ? '#001f5c' : '#f0f0f0',
                      color: selectedFilters.includes('king') ? '#fff' : '#333',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: selectedFilters.includes('king') ? 'bold' : 'normal',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span style={{ fontSize: '16px' }}>👑</span>
                    King Bed
                  </button>
                  <button
                    onClick={() => handleFilterClick('double')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '20px',
                      border: 'none',
                      backgroundColor: selectedFilters.includes('double') ? '#001f5c' : '#f0f0f0',
                      color: selectedFilters.includes('double') ? '#fff' : '#333',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: selectedFilters.includes('double') ? 'bold' : 'normal',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span style={{ fontSize: '16px' }}>👥</span>
                    Queen 2 Beds
                  </button>
                </div>
              </div>

              {/* Ground Floor Accordion */}
              <div className="floor-accordion" style={{
                marginBottom: '20px'
              }}>
                <button
                  onClick={() => setGroundFloorExpanded(!groundFloorExpanded)}
                  style={{
                    width: '100%',
                    padding: '15px',
                    backgroundColor: '#001f5c',
                    color: '#fff',
                    border: 'none',
                    borderRadius: groundFloorExpanded ? '8px 8px 0 0' : '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    transition: 'border-radius 0.3s ease'
                  }}
                >
                  <span>Ground Floor (Rooms 101-119)</span>
                  <span style={{ 
                    transition: 'transform 0.3s ease',
                    transform: groundFloorExpanded ? 'rotate(180deg)' : 'none'
                  }}>▼</span>
                </button>
                
                {groundFloorExpanded && (
                  <div className="rooms-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                    gap: '20px',
                    padding: '20px',
                    backgroundColor: '#fff',
                    borderRadius: '0 0 8px 8px'
                  }}>
                    {rooms.groundFloor
                      .filter(filterRoom)
                      .map(room => (
                        <div key={room.number} 
                            className={`room-card ${room.status === 'available' ? '' : 'occupied'}`}
                            onClick={() => toggleRoomStatus('groundFloor', room.number)}
                          >
                            {/* Rest of room card content */}
                            <div className="room-detail">
                              <div className="room-number">Room {room.number}</div>
                              <div className="room-status">{room.status === 'available' ? 'Available' : 'Occupied'}</div>
                              {room.type === 'jacuzzi' && <div className="room-feature">Jacuzzi</div>}
                              <div className="room-beds">{room.beds === 'queen' ? 'Queen Bed' : room.beds === 'king' ? 'King Bed' : 'Double Beds'}</div>
                              <div className="room-smoking">{room.smoking ? 'Smoking' : 'Non-Smoking'}</div>
                              
                              {/* Display reminder button if occupied */}
                              {room.status === 'occupied' && (
                                <button 
                                  className="reminder-button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleReminderClick(room.number);
                                  }}
                                >
                                  {reminders[room.number]?.reminderTime ? 
                                    `Reminder: ${new Date(reminders[room.number].reminderTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}` : 
                                    "Set Reminder"}
                                </button>
                              )}
                            </div>
                            
                            {/* Remove price summary that was here */}
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                              <span 
                                onClick={(e) => { 
                                  e.stopPropagation(); 
                                  setOpenCalendar(openCalendar === room.number ? null : room.number); 
                                }}
                                style={{ 
                                  cursor: 'pointer', 
                                  display: 'flex', 
                                  alignItems: 'center',
                                  fontSize: '14px',
                                  fontWeight: 'bold'
                                }}
                              >
                                📅 
                                <span style={{ fontSize: '10px', marginLeft: '3px' }}>
                                  {roomSchedules[room.number]?.startDate ? 
                                    (roomSchedules[room.number]?.endDate ? 
                                      `${new Date(roomSchedules[room.number].startDate).toLocaleDateString()} - ${new Date(roomSchedules[room.number].endDate).toLocaleDateString()}` : 
                                      new Date(roomSchedules[room.number].startDate).toLocaleDateString() + " (selecting end date...)") : 
                                    "Select Date Range"}
                                </span>
                              </span>
                            </div>
                            
                            {openCalendar === room.number && (
                              <div onClick={(e) => e.stopPropagation()} style={{ marginBottom: '10px' }}>
                                <DatePicker
                                  selected={roomSchedules[room.number]?.startDate || new Date()}
                                  onChange={(date) => handleRoomDateSelect(room.number, date)}
                                  inline={true}
                                  showTimeSelect={false}
                                />
                              </div>
                            )}
                            
                            {/* Room hour adjustments section */}
                            <div style={{ marginBottom: '10px' }}>
                              {/* Check-in time adjustment */}
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                                <div style={{ fontSize: '12px' }}>
                                  Check-in: {formatAdjustedTime(15, roomSchedules[room.number]?.checkInAdj || 0)}
                                </div>
                                <div style={{ display: 'flex', gap: '4px' }}>
                                  <button 
                                    onClick={(e) => { 
                                      e.stopPropagation(); 
                                      handleRoomHourAdjustment(room.number, 'checkIn', -1);
                                    }}
                                    style={{ 
                                      border: 'none', 
                                      background: '#f1f1f1',
                                      padding: '2px 6px',
                                      borderRadius: '4px',
                                      cursor: 'pointer',
                                      fontSize: '12px',
                                      fontWeight: 'bold'
                                    }}
                                  >-</button>
                                  <button 
                                    onClick={(e) => { 
                                      e.stopPropagation(); 
                                      handleRoomHourAdjustment(room.number, 'checkIn', 1);
                                    }}
                                    style={{ 
                                      border: 'none', 
                                      background: '#f1f1f1',
                                      padding: '2px 6px',
                                      borderRadius: '4px',
                                      cursor: 'pointer',
                                      fontSize: '12px',
                                      fontWeight: 'bold'
                                    }}
                                  >+</button>
                                </div>
                              </div>
                              
                              {/* Check-out time adjustment */}
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ fontSize: '12px' }}>
                                  Check-out: {formatAdjustedTime(11, roomSchedules[room.number]?.checkOutAdj || 0)}
                                </div>
                                <div style={{ display: 'flex', gap: '4px' }}>
                                  <button 
                                    onClick={(e) => { 
                                      e.stopPropagation(); 
                                      handleRoomHourAdjustment(room.number, 'checkOut', -1);
                                    }}
                                    style={{ 
                                      border: 'none', 
                                      background: '#f1f1f1',
                                      padding: '2px 6px',
                                      borderRadius: '4px',
                                      cursor: 'pointer',
                                      fontSize: '12px',
                                      fontWeight: 'bold'
                                    }}
                                  >-</button>
                                  <button 
                                    onClick={(e) => { 
                                      e.stopPropagation(); 
                                      handleRoomHourAdjustment(room.number, 'checkOut', 1);
                                    }}
                                    style={{ 
                                      border: 'none', 
                                      background: '#f1f1f1',
                                      padding: '2px 6px',
                                      borderRadius: '4px',
                                      cursor: 'pointer',
                                      fontSize: '12px',
                                      fontWeight: 'bold'
                                    }}
                                  >+</button>
                                </div>
                              </div>
                            </div>
                            
                            {/* Price Summary */}
                            <div style={{ 
                              marginTop: '10px', 
                              borderTop: '1px solid #ddd',
                              paddingTop: '10px',
                              fontSize: '12px'
                            }}>
                              {(() => {
                                const pricing = calculateRoomPrice(room);
                                return (
                                  <>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                      <span>Base Price{pricing.nights > 1 ? ` (${pricing.nights} nights)` : ''}:</span>
                                      <span>${pricing.basePrice.toFixed(2)}</span>
                                    </div>
                                    
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                      <span>Tax (15%):</span>
                                      <span>${pricing.tax.toFixed(2)}</span>
                                    </div>
                                    
                                    {(roomSchedules[room.number]?.checkInAdj || 0) !== 0 && (
                                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Check-in Hours ({Math.abs(roomSchedules[room.number]?.checkInAdj || 0)} hr{Math.abs(roomSchedules[room.number]?.checkInAdj || 0) !== 1 ? 's' : ''}):</span>
                                        <span>${pricing.extraHoursCheckIn.toFixed(2)}</span>
                                      </div>
                                    )}
                                    
                                    {(roomSchedules[room.number]?.checkOutAdj || 0) !== 0 && (
                                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Check-out Hours ({Math.abs(roomSchedules[room.number]?.checkOutAdj || 0)} hr{Math.abs(roomSchedules[room.number]?.checkOutAdj || 0) !== 1 ? 's' : ''}):</span>
                                        <span>${pricing.extraHoursCheckOut.toFixed(2)}</span>
                                      </div>
                                    )}
                                    
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginTop: '5px', borderTop: '1px solid #ddd', paddingTop: '5px' }}>
                                      <span>Total:</span>
                                      <span>${pricing.total.toFixed(2)}</span>
                                    </div>
                                  </>
                                );
                              })()}
                            </div>
                          </div>
                      ))}
                  </div>
                )}
              </div>

              {/* First Floor Accordion */}
              <div className="floor-accordion">
                <button
                  onClick={() => setFirstFloorExpanded(!firstFloorExpanded)}
                  style={{
                    width: '100%',
                    padding: '15px',
                    backgroundColor: '#001f5c',
                    color: '#fff',
                    border: 'none',
                    borderRadius: firstFloorExpanded ? '8px 8px 0 0' : '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    transition: 'border-radius 0.3s ease'
                  }}
                >
                  <span>First Floor (Rooms 200-225)</span>
                  <span style={{ 
                    transition: 'transform 0.3s ease',
                    transform: firstFloorExpanded ? 'rotate(180deg)' : 'none'
                  }}>▼</span>
                </button>
                
                {firstFloorExpanded && (
                  <div className="rooms-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                    gap: '20px',
                    padding: '20px',
                    backgroundColor: '#fff',
                    borderRadius: '0 0 8px 8px'
                  }}>
                    {rooms.firstFloor
                      .filter(filterRoom)
                      .map(room => (
                        <div key={room.number} 
                            className={`room-card ${room.status === 'available' ? '' : 'occupied'}`}
                            onClick={() => toggleRoomStatus('firstFloor', room.number)}
                          >
                            {/* Rest of room card content */}
                            <div className="room-detail">
                              <div className="room-number">Room {room.number}</div>
                              <div className="room-status">{room.status === 'available' ? 'Available' : 'Occupied'}</div>
                              {room.type === 'jacuzzi' && <div className="room-feature">Jacuzzi</div>}
                              <div className="room-beds">{room.beds === 'queen' ? 'Queen Bed' : room.beds === 'king' ? 'King Bed' : 'Double Beds'}</div>
                              <div className="room-smoking">{room.smoking ? 'Smoking' : 'Non-Smoking'}</div>
                              
                              {/* Display reminder button if occupied */}
                              {room.status === 'occupied' && (
                                <button 
                                  className="reminder-button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleReminderClick(room.number);
                                  }}
                                >
                                  {reminders[room.number]?.reminderTime ? 
                                    `Reminder: ${new Date(reminders[room.number].reminderTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}` : 
                                    "Set Reminder"}
                                </button>
                              )}
                            </div>
                            
                            {/* Remove price summary that was here */}
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                              <span 
                                onClick={(e) => { 
                                  e.stopPropagation(); 
                                  setOpenCalendar(openCalendar === room.number ? null : room.number); 
                                }}
                                style={{ 
                                  cursor: 'pointer', 
                                  display: 'flex', 
                                  alignItems: 'center',
                                  fontSize: '14px',
                                  fontWeight: 'bold'
                                }}
                              >
                                📅 
                                <span style={{ fontSize: '10px', marginLeft: '3px' }}>
                                  {roomSchedules[room.number]?.startDate ? 
                                    (roomSchedules[room.number]?.endDate ? 
                                      `${new Date(roomSchedules[room.number].startDate).toLocaleDateString()} - ${new Date(roomSchedules[room.number].endDate).toLocaleDateString()}` : 
                                      new Date(roomSchedules[room.number].startDate).toLocaleDateString() + " (selecting end date...)") : 
                                    "Select Date Range"}
                                </span>
                              </span>
                            </div>
                            
                            {openCalendar === room.number && (
                              <div onClick={(e) => e.stopPropagation()} style={{ marginBottom: '10px' }}>
                                <DatePicker
                                  selected={roomSchedules[room.number]?.startDate || new Date()}
                                  onChange={(date) => handleRoomDateSelect(room.number, date)}
                                  inline={true}
                                  showTimeSelect={false}
                                />
                              </div>
                            )}
                            
                            {/* Room hour adjustments section */}
                            <div style={{ marginBottom: '10px' }}>
                              {/* Check-in time adjustment */}
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                                <div style={{ fontSize: '12px' }}>
                                  Check-in: {formatAdjustedTime(15, roomSchedules[room.number]?.checkInAdj || 0)}
                                </div>
                                <div style={{ display: 'flex', gap: '4px' }}>
                                  <button 
                                    onClick={(e) => { 
                                      e.stopPropagation(); 
                                      handleRoomHourAdjustment(room.number, 'checkIn', -1);
                                    }}
                                    style={{ 
                                      border: 'none', 
                                      background: '#f1f1f1',
                                      padding: '2px 6px',
                                      borderRadius: '4px',
                                      cursor: 'pointer',
                                      fontSize: '12px',
                                      fontWeight: 'bold'
                                    }}
                                  >-</button>
                                  <button 
                                    onClick={(e) => { 
                                      e.stopPropagation(); 
                                      handleRoomHourAdjustment(room.number, 'checkIn', 1);
                                    }}
                                    style={{ 
                                      border: 'none', 
                                      background: '#f1f1f1',
                                      padding: '2px 6px',
                                      borderRadius: '4px',
                                      cursor: 'pointer',
                                      fontSize: '12px',
                                      fontWeight: 'bold'
                                    }}
                                  >+</button>
                                </div>
                              </div>
                              
                              {/* Check-out time adjustment */}
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ fontSize: '12px' }}>
                                  Check-out: {formatAdjustedTime(11, roomSchedules[room.number]?.checkOutAdj || 0)}
                                </div>
                                <div style={{ display: 'flex', gap: '4px' }}>
                                  <button 
                                    onClick={(e) => { 
                                      e.stopPropagation(); 
                                      handleRoomHourAdjustment(room.number, 'checkOut', -1);
                                    }}
                                    style={{ 
                                      border: 'none', 
                                      background: '#f1f1f1',
                                      padding: '2px 6px',
                                      borderRadius: '4px',
                                      cursor: 'pointer',
                                      fontSize: '12px',
                                      fontWeight: 'bold'
                                    }}
                                  >-</button>
                                  <button 
                                    onClick={(e) => { 
                                      e.stopPropagation(); 
                                      handleRoomHourAdjustment(room.number, 'checkOut', 1);
                                    }}
                                    style={{ 
                                      border: 'none', 
                                      background: '#f1f1f1',
                                      padding: '2px 6px',
                                      borderRadius: '4px',
                                      cursor: 'pointer',
                                      fontSize: '12px',
                                      fontWeight: 'bold'
                                    }}
                                  >+</button>
                                </div>
                              </div>
                            </div>
                            
                            {/* Price Summary */}
                            <div style={{ 
                              marginTop: '10px', 
                              borderTop: '1px solid #ddd',
                              paddingTop: '10px',
                              fontSize: '12px'
                            }}>
                              {(() => {
                                const pricing = calculateRoomPrice(room);
                                return (
                                  <>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                      <span>Base Price{pricing.nights > 1 ? ` (${pricing.nights} nights)` : ''}:</span>
                                      <span>${pricing.basePrice.toFixed(2)}</span>
                                    </div>
                                    
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                      <span>Tax (15%):</span>
                                      <span>${pricing.tax.toFixed(2)}</span>
                                    </div>
                                    
                                    {(roomSchedules[room.number]?.checkInAdj || 0) !== 0 && (
                                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Check-in Hours ({Math.abs(roomSchedules[room.number]?.checkInAdj || 0)} hr{Math.abs(roomSchedules[room.number]?.checkInAdj || 0) !== 1 ? 's' : ''}):</span>
                                        <span>${pricing.extraHoursCheckIn.toFixed(2)}</span>
                                      </div>
                                    )}
                                    
                                    {(roomSchedules[room.number]?.checkOutAdj || 0) !== 0 && (
                                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Check-out Hours ({Math.abs(roomSchedules[room.number]?.checkOutAdj || 0)} hr{Math.abs(roomSchedules[room.number]?.checkOutAdj || 0) !== 1 ? 's' : ''}):</span>
                                        <span>${pricing.extraHoursCheckOut.toFixed(2)}</span>
                                      </div>
                                    )}
                                    
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginTop: '5px', borderTop: '1px solid #ddd', paddingTop: '5px' }}>
                                      <span>Total:</span>
                                      <span>${pricing.total.toFixed(2)}</span>
                                    </div>
                                  </>
                                );
                              })()}
                            </div>
                          </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Change Price Tab */}
          {activeTab === 'changePrice' && (
            <div className={`change-price-section ${activeTab === 'changePrice' ? 'active' : ''}`}
              style={{ backgroundColor: '#f5f5f5' }}>
              {showConfirmation && (
                <div style={{
                  color: 'darkgreen',
                  textAlign: 'center',
                  margin: '10px 0',
                  fontWeight: 'bold',
                  fontSize: '18px'
                }}>
                  Prices updated successfully!
                </div>
              )}
              <h2 className="section-header">Room Price Settings</h2>
              
              <div className="price-summary" style={{ 
                backgroundColor: '#fff',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                margin: '20px 0'
              }}>
                <div style={{ 
                  display: 'flex', 
                  gap: '20px',
                  flexWrap: 'wrap'
                }}>
                  {/* Regular Room Prices Section */}
                  <div className="option-group" style={{ 
                    flex: '1',
                    minWidth: '300px',
                    backgroundColor: '#f8f8f8',
                    padding: '15px',
                    borderRadius: '8px'
                  }}>
                    <h3 style={{ 
                      color: '#001f5c', 
                      borderBottom: '2px solid #001f5c',
                      paddingBottom: '10px',
                      marginBottom: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}>
                      Regular Room Prices 
                      <span style={{ fontSize: '20px' }}>🚭/🚬</span>
                    </h3>
                    <div className="price-input-group" style={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      gap: '10px'
                    }}>
                      <div className="summary-line">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontWeight: 'bold', minWidth: '120px' }}>Weekday:</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ 
                              fontSize: '14px',
                              fontFamily: 'monospace',
                              lineHeight: 1
                            }}>$</span>
                            <input 
                              type="number" 
                              value={prices.weekday.withoutJacuzzi} 
                              onChange={(e) => setPrices({
                                ...prices,
                                weekday: { ...prices.weekday, withoutJacuzzi: parseFloat(e.target.value) }
                              })} 
                              style={{ 
                                width: '80px', 
                                padding: '4px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                fontSize: '14px',
                                fontFamily: 'monospace',
                                lineHeight: 1
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="summary-line">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontWeight: 'bold', minWidth: '120px' }}>Friday:</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ 
                              fontSize: '14px',
                              fontFamily: 'monospace',
                              lineHeight: 1
                            }}>$</span>
                            <input 
                              type="number" 
                              value={prices.friday.withoutJacuzzi} 
                              onChange={(e) => setPrices({
                                ...prices,
                                friday: { ...prices.friday, withoutJacuzzi: parseFloat(e.target.value) }
                              })} 
                              style={{ 
                                width: '80px', 
                                padding: '4px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                fontSize: '14px',
                                fontFamily: 'monospace',
                                lineHeight: 1
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="summary-line">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontWeight: 'bold', minWidth: '120px' }}>Weekend:</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ 
                              fontSize: '14px',
                              fontFamily: 'monospace',
                              lineHeight: 1
                            }}>$</span>
                            <input 
                              type="number" 
                              value={prices.weekend.withoutJacuzzi} 
                              onChange={(e) => setPrices({
                                ...prices,
                                weekend: { ...prices.weekend, withoutJacuzzi: parseFloat(e.target.value) }
                              })} 
                              style={{ 
                                width: '80px', 
                                padding: '4px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                fontSize: '14px',
                                fontFamily: 'monospace',
                                lineHeight: 1
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Jacuzzi Room Prices Section */}
                  <div className="option-group" style={{ 
                    flex: '1',
                    minWidth: '300px',
                    backgroundColor: '#f8f8f8',
                    padding: '15px',
                    borderRadius: '8px'
                  }}>
                    <h3 style={{ 
                      color: '#001f5c', 
                      borderBottom: '2px solid #001f5c',
                      paddingBottom: '10px',
                      marginBottom: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}>
                      Jacuzzi Room Prices 
                      <span style={{ fontSize: '20px' }}>🛁</span>
                    </h3>
                    <div className="price-input-group" style={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      gap: '10px'
                    }}>
                      <div className="summary-line">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontWeight: 'bold', minWidth: '120px' }}>Weekday:</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ 
                              fontSize: '14px',
                              fontFamily: 'monospace',
                              lineHeight: 1
                            }}>$</span>
                            <input 
                              type="number" 
                              value={prices.weekday.withJacuzzi} 
                              onChange={(e) => setPrices({
                                ...prices,
                                weekday: { ...prices.weekday, withJacuzzi: parseFloat(e.target.value) }
                              })} 
                              style={{ 
                                width: '80px', 
                                padding: '4px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                fontSize: '14px',
                                fontFamily: 'monospace',
                                lineHeight: 1
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="summary-line">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontWeight: 'bold', minWidth: '120px' }}>Friday:</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ 
                              fontSize: '14px',
                              fontFamily: 'monospace',
                              lineHeight: 1
                            }}>$</span>
                            <input 
                              type="number" 
                              value={prices.friday.withJacuzzi} 
                              onChange={(e) => setPrices({
                                ...prices,
                                friday: { ...prices.friday, withJacuzzi: parseFloat(e.target.value) }
                              })} 
                              style={{ 
                                width: '80px', 
                                padding: '4px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                fontSize: '14px',
                                fontFamily: 'monospace',
                                lineHeight: 1
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="summary-line">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontWeight: 'bold', minWidth: '120px' }}>Weekend:</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ 
                              fontSize: '14px',
                              fontFamily: 'monospace',
                              lineHeight: 1
                            }}>$</span>
                            <input 
                              type="number" 
                              value={prices.weekend.withJacuzzi} 
                              onChange={(e) => setPrices({
                                ...prices,
                                weekend: { ...prices.weekend, withJacuzzi: parseFloat(e.target.value) }
                              })} 
                              style={{ 
                                width: '80px', 
                                padding: '4px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                fontSize: '14px',
                                fontFamily: 'monospace',
                                lineHeight: 1
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ 
                  textAlign: 'center', 
                  marginTop: '20px',
                  borderTop: '2px solid #001f5c',
                  paddingTop: '20px'
                }}>
                  <button 
                    className="edit-price-btn" 
                    onClick={handlePriceUpdate}
                    style={{ 
                      backgroundColor: '#001f5c',
                      padding: '12px 30px',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      borderRadius: '8px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      color: '#fff',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Update Prices
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;