import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './App.css';
import LoginModal from './LoginModal';

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
  
  // Short stay price settings
  const [shortStayPrices, setShortStayPrices] = useState({
    baseRate: { withoutJacuzzi: 60, withJacuzzi: 90 },
    extraHourRate: { regular: 15, discounted: 10 }
  });
  
  // Rooms state
  const [roomFilter, setRoomFilter] = useState('all');
  const [groundFloorExpanded, setGroundFloorExpanded] = useState(true);
  const [firstFloorExpanded, setFirstFloorExpanded] = useState(false);
  const [rooms, setRooms] = useState(() => {
    // Try to load rooms from localStorage
    const savedRooms = localStorage.getItem('roomsData');
    if (savedRooms) {
      return JSON.parse(savedRooms);
    }
    
    // Default initial state if nothing in localStorage
    return {
      groundFloor: [
        { number: "101", type: "standard", beds: "Queen", status: "available", smoking: false, handicap: false },
        { number: "102", type: "standard", beds: "Queen", status: "available", smoking: true, handicap: false },
        { number: "103", type: "standard", beds: "Queen 2 Beds", status: "available", smoking: false, handicap: false },
        { number: "104", type: "standard", beds: "Queen", status: "available", smoking: true, handicap: false },
        { number: "105", type: "standard", beds: "Queen 2 Beds", status: "available", smoking: false, handicap: false },
        { number: "106", type: "standard", beds: "Queen", status: "available", smoking: false, handicap: false },
        { number: "107", type: "standard", beds: "Queen 2 Beds", status: "available", smoking: false, handicap: false },
        { number: "108", type: "standard", beds: "Queen", status: "available", smoking: false, handicap: true },
        { number: "109", type: "jacuzzi", beds: "Queen", status: "available", smoking: false, handicap: false },
        { number: "110", type: "jacuzzi", beds: "Queen", status: "available", smoking: true, handicap: false },
        { number: "111", type: "jacuzzi", beds: "Queen", status: "available", smoking: false, handicap: false },
        { number: "112", type: "jacuzzi", beds: "Queen", status: "available", smoking: true, handicap: false },
        { number: "114", type: "standard", beds: "Queen", status: "available", smoking: false},
        { number: "119", type: "jacuzzi", beds: "Queen", status: "available", smoking: true, handicap: false, onlineBookingOnly: true }
      ],
      firstFloor: [
        { number: "200", type: "standard", beds: "Queen", status: "available", smoking: false, handicap: false },
        { number: "201", type: "standard", beds: "Queen 2 Beds", status: "available", smoking: false, handicap: false },
        { number: "202", type: "standard", beds: "Queen", status: "available", smoking: false, handicap: false },
        { number: "203", type: "standard", beds: "Queen 2 Beds", status: "available", smoking: false, handicap: false },
        { number: "204", type: "standard", beds: "Queen", status: "available", smoking: true, handicap: true },
        { number: "205", type: "standard", beds: "Queen 2 Beds", status: "available", smoking: false, handicap: false },
        { number: "206", type: "standard", beds: "Queen", status: "available", smoking: true, handicap: false },
        { number: "207", type: "standard", beds: "Queen 2 Beds", status: "available", smoking: true, handicap: false },
        { number: "208", type: "jacuzzi", beds: "King", status: "available", smoking: false, handicap: false },
        { number: "209", type: "standard", beds: "Queen", status: "available", smoking: false, handicap: false },
        { number: "210", type: "jacuzzi", beds: "King", status: "available", smoking: true, handicap: false },
        { number: "211", type: "standard", beds: "King", status: "available", smoking: true, handicap: false },
        { number: "212", type: "standard", beds: "King", status: "available", smoking: false, handicap: false },
        { number: "214", type: "jacuzzi", beds: "King", status: "available", smoking: false, handicap: false },
        { number: "215", type: "standard", beds: "Queen 2 Beds", status: "available", smoking: false, handicap: true },
        { number: "216", type: "standard", beds: "Queen", status: "available", smoking: false, handicap: false },
        { number: "217", type: "standard", beds: "Queen 2 Beds", status: "available", smoking: false, handicap: false },
        { number: "218", type: "standard", beds: "Queen 2 Beds", status: "available", smoking: false, handicap: false },
        { number: "219", type: "standard", beds: "Queen 2 Beds", status: "available", smoking: true, handicap: false },
        { number: "220", type: "standard", beds: "Queen", status: "available", smoking: false, handicap: false },
        { number: "221", type: "standard", beds: "King", status: "available", smoking: false, handicap: false },
        { number: "222", type: "standard", beds: "King", status: "available", smoking: false, handicap: false },
        { number: "223", type: "standard", beds: "King", status: "available", smoking: false, handicap: false },
        { number: "224", type: "standard", beds: "Queen", status: "available", smoking: false, handicap: false },
        { number: "225", type: "standard", beds: "King", status: "available", smoking: false, handicap: false }
      ]
    };
  });
  
  // UI state
  const [activeTab, setActiveTab] = useState('short');
  const [showPriceChangeModal, setShowPriceChangeModal] = useState(false);
  
  // Overnight stay state
  const [overnightSmoking, setOvernightSmoking] = useState(false);
  const [overnightPayment, setOvernightPayment] = useState('cash');
  const [overnightExtraRate, setOvernightExtraRate] = useState(15);
  const [overnightExtraHours, setOvernightExtraHours] = useState(0);
  const [overnightCheckoutExtraHours, setOvernightCheckoutExtraHours] = useState(0);
  const [hasJacuzziOvernight, setHasJacuzziOvernight] = useState(false);
  const [bedType, setBedType] = useState('Queen');
  
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
  
  // Initialize date and time on component mount and set up timer
  useEffect(() => {
    // Clear localStorage for rooms data to force reset
    localStorage.removeItem('roomsData');
    
    // Reset rooms with the updated configuration
    const updatedRooms = {
      groundFloor: [
        { number: "101", type: "standard", beds: "Queen", status: "available", smoking: false, handicap: false },
        { number: "102", type: "standard", beds: "Queen", status: "available", smoking: true, handicap: false },
        { number: "103", type: "standard", beds: "Queen 2 Beds", status: "available", smoking: false, handicap: false },
        { number: "104", type: "standard", beds: "Queen", status: "available", smoking: true, handicap: false },
        { number: "105", type: "standard", beds: "Queen 2 Beds", status: "available", smoking: false, handicap: false },
        { number: "106", type: "standard", beds: "Queen", status: "available", smoking: false, handicap: false },
        { number: "107", type: "standard", beds: "Queen 2 Beds", status: "available", smoking: false, handicap: false },
        { number: "108", type: "standard", beds: "Queen", status: "available", smoking: false, handicap: true },
        { number: "109", type: "jacuzzi", beds: "Queen", status: "available", smoking: false, handicap: false },
        { number: "110", type: "jacuzzi", beds: "Queen", status: "available", smoking: true, handicap: false },
        { number: "111", type: "jacuzzi", beds: "Queen", status: "available", smoking: false, handicap: false },
        { number: "112", type: "jacuzzi", beds: "Queen", status: "available", smoking: true, handicap: false },
        { number: "114", type: "standard", beds: "Queen", status: "available", smoking: false},
        { number: "119", type: "jacuzzi", beds: "Queen", status: "available", smoking: true, handicap: false, onlineBookingOnly: true }
      ],
      firstFloor: [
        { number: "200", type: "standard", beds: "Queen", status: "available", smoking: false, handicap: false },
        { number: "201", type: "standard", beds: "Queen 2 Beds", status: "available", smoking: false, handicap: false },
        { number: "202", type: "standard", beds: "Queen", status: "available", smoking: false, handicap: false },
        { number: "203", type: "standard", beds: "Queen 2 Beds", status: "available", smoking: false, handicap: false },
        { number: "204", type: "standard", beds: "Queen", status: "available", smoking: true, handicap: true },
        { number: "205", type: "standard", beds: "Queen 2 Beds", status: "available", smoking: false, handicap: false },
        { number: "206", type: "standard", beds: "Queen", status: "available", smoking: true, handicap: false },
        { number: "207", type: "standard", beds: "Queen 2 Beds", status: "available", smoking: true, handicap: false },
        { number: "208", type: "jacuzzi", beds: "King", status: "available", smoking: false, handicap: false },
        { number: "209", type: "standard", beds: "Queen", status: "available", smoking: false, handicap: false },
        { number: "210", type: "jacuzzi", beds: "King", status: "available", smoking: true, handicap: false },
        { number: "211", type: "standard", beds: "King", status: "available", smoking: true, handicap: false },
        { number: "212", type: "standard", beds: "King", status: "available", smoking: false, handicap: false },
        { number: "214", type: "jacuzzi", beds: "King", status: "available", smoking: false, handicap: false },
        { number: "215", type: "standard", beds: "Queen 2 Beds", status: "available", smoking: false, handicap: true },
        { number: "216", type: "standard", beds: "Queen", status: "available", smoking: false, handicap: false },
        { number: "217", type: "standard", beds: "Queen 2 Beds", status: "available", smoking: false, handicap: false },
        { number: "218", type: "standard", beds: "Queen 2 Beds", status: "available", smoking: false, handicap: false },
        { number: "219", type: "standard", beds: "Queen 2 Beds", status: "available", smoking: true, handicap: false },
        { number: "220", type: "standard", beds: "Queen", status: "available", smoking: false, handicap: false },
        { number: "221", type: "standard", beds: "King", status: "available", smoking: false, handicap: false },
        { number: "222", type: "standard", beds: "King", status: "available", smoking: false, handicap: false },
        { number: "223", type: "standard", beds: "King", status: "available", smoking: false, handicap: false },
        { number: "224", type: "standard", beds: "Queen", status: "available", smoking: false, handicap: false },
        { number: "225", type: "standard", beds: "King", status: "available", smoking: false, handicap: false }
      ]
    };
    
    // Update state
    setRooms(updatedRooms);
    
    // Save to localStorage
    localStorage.setItem('roomsData', JSON.stringify(updatedRooms));
    
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
  }, [extraHours, hasJacuzzi, paymentMethod, extraHourRate, isSmoking, currentTime, shortStayPrices]);
  
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
    
    // Use shortStayPrices for base rate
    basePrice = hasJacuzzi ? shortStayPrices.baseRate.withJacuzzi : shortStayPrices.baseRate.withoutJacuzzi;
    
    // Use shortStayPrices for extra hour rate
    const hourlyRate = extraHourRate === 15 ? shortStayPrices.extraHourRate.regular : shortStayPrices.extraHourRate.discounted;
    const extraHoursCost = extraHours * hourlyRate;
    
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
      } else if (bedType === 'Queen 2 Beds') {
        totalBasePrice += (10 * 7); // $10 extra per night for Queen 2 Beds
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
      } else if (bedType === 'Queen 2 Beds') {
        dayBasePrice += 10; // Queen 2 Beds bed is $10 more
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
    setCheckInDate(date);
    
    // If check-out date is before new check-in date, update it
    if (checkOutDate && date > checkOutDate) {
      // Set checkout to same day as check-in for now
      setCheckOutDate(new Date(date.getTime()));
    }
    
    // Reset extra hours when changing date
    setOvernightExtraHours(0);
    
    // Calculate price after state updates
    setTimeout(() => {
      handlePriceUpdate();
    }, 0);
  };
  
  const handleCheckOutChange = (date) => {
    setCheckOutDate(date);
    
    // Reset extra hours when changing date
    setOvernightCheckoutExtraHours(0);
    
    // Calculate price after state updates
    setTimeout(() => {
      handlePriceUpdate();
    }, 0);
  };

  // Update resetForm function
  const resetForm = () => {
      // Reset prices to default values
      setPrices({
        weekday: { withoutJacuzzi: 105, withJacuzzi: 120 },
        friday: { withoutJacuzzi: 139, withJacuzzi: 159 },
        weekend: { withoutJacuzzi: 139, withJacuzzi: 169 }
      });
    
    // Reset short stay prices to default values
    setShortStayPrices({
      baseRate: { withoutJacuzzi: 45, withJacuzzi: 55 },
      extraHourRate: { regular: 15, discounted: 10 }
    });
    
    // Clear localStorage for room data if needed
    if (window.confirm("Do you want to reset all room statuses?")) {
      localStorage.removeItem('roomsData');
      window.location.reload();
      return;
    }

    // Reset short stay options
    setExtraHours(0);
    setHasJacuzzi(false);
    setPaymentMethod('cash');
    setExtraHourRate(15);
    
    // Reset overnight stay options
    setOvernightPayment('cash');
    setOvernightExtraRate(15);
    setOvernightExtraHours(0);
    setOvernightCheckoutExtraHours(0);
    setHasJacuzziOvernight(false);
    setBedType('Queen');
    
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
    
    // Update all calculations with new prices
    handlePriceUpdate();
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
    setBedType('Queen');
    
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
    // If check-in and check-out dates are not set, show basic message
    if (!checkInDate || !checkOutDate) {
      return <p style={{ fontSize: '14px' }}>Please select check-in and check-out dates.</p>;
    }

    const pricing = calculateOvernightPrice();
    
      return (
        <div className="price-summary" style={{ 
          backgroundColor: '#fff',
        padding: '15px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        margin: '15px 0'
        }}>
          <h3 style={{ 
            color: '#001f5c',
            borderBottom: '2px solid #001f5c',
            paddingBottom: '10px',
                marginBottom: '15px',
          fontSize: '16px'
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
                        flexWrap: 'nowrap',
                        gap: '10px'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '4px',
                            flex: '0 0 auto'
                      }}>
                        <span 
                          className="stay-number"
                          style={{ 
                            fontWeight: 'bold', 
                          fontSize: '14px',
                            color: '#001f5c',
                                whiteSpace: 'nowrap'
                          }}
                        >
                        Stay #{index+1}
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
                            fontWeight: '500',
                            textTransform: 'uppercase',
                            minWidth: '28px',
                                justifyContent: 'center'
                          }}
                          onClick={() => {
                            // Set all the form fields to this stay's values
                            setCheckInDate(new Date(stay.checkIn));
                            setCheckOutDate(new Date(stay.checkOut));
                            setHasJacuzziOvernight(stay.hasJacuzzi);
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
                          flex: '1',
                            justifyContent: 'flex-end'
                      }}>
                        <span 
                          className="stay-price"
                          style={{ 
                            fontWeight: 'bold', 
                            color: '#001f5c',
                          fontSize: '16px',
                              marginLeft: 'auto'
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
                            fontWeight: '500',
                              marginLeft: '4px'
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
                    {stay.checkInAdjustment !== 0 && ` • CI ${stay.checkInAdjustment > 0 ? `+${stay.checkInAdjustment}h` : `${stay.checkInAdjustment}h`}`}
                    {stay.checkOutAdjustment !== 0 && ` • CO ${stay.checkOutAdjustment > 0 ? `+${stay.checkOutAdjustment}h` : `${stay.checkOutAdjustment}h`}`}
                    </div>
                  </div>
                  <div style={{ 
                  fontSize: '13px',
                    color: '#000', 
                    backgroundColor: '#f0f0f0',
                  padding: '8px',
                    borderRadius: '6px',
                    marginTop: '8px'
                  }}>
                    <div className="summary-line" style={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                    gap: '3px'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        borderBottom: '1px solid #ddd',
                      paddingBottom: '3px',
                      marginBottom: '3px'
                      }}>
                      <span>Base ({stay.nights}n):</span>
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
                    <div className="summary-line" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px', marginTop: '6px' }}>
                        <span>Tax (15%):</span>
                        <span>${stay.tax.toFixed(2)}</span>
                      </div>
                    )}
                    {stay.extraHoursCheckIn > 0 && (
                    <div className="summary-line" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <span>CI Hours ({stay.checkInAdjustment > 0 ? `+${stay.checkInAdjustment}h` : `${Math.abs(stay.checkInAdjustment)}h`}):</span>
                        <span>${stay.extraHoursCheckIn.toFixed(2)}</span>
                      </div>
                    )}
                    {stay.extraHoursCheckOut > 0 && (
                    <div className="summary-line" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <span>CO Hours ({stay.checkOutAdjustment > 0 ? `+${stay.checkOutAdjustment}h` : `${Math.abs(stay.checkOutAdjustment)}h`}):</span>
                        <span>${stay.extraHoursCheckOut.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              <div className="summary-line total" style={{ 
              marginTop: '15px',
                borderTop: '2px solid #001f5c',
              paddingTop: '10px',
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

        {savedStays.length === 0 && pricing && (
          <>
            <div className="summary-line" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span>Duration:</span>
              <span>{pricing.nights} {pricing.nights === 1 ? 'Night' : 'Nights'}</span>
          </div>
          
            {pricing.nights === 7 && (
              <div className="summary-line" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>Weekly Rate:</span>
              <span>${(() => {
                let baseRate = hasJacuzziOvernight ? 695 : 675;
                if (bedType === 'king') {
                    baseRate += (5 * 7); 
                } else if (bedType === 'Queen 2 Beds') {
                    baseRate += (10 * 7);
                }
                return baseRate.toFixed(2);
              })()}</span>
            </div>
          )}
          
            {pricing.nights !== 7 && (
            <>
              {pricing.daysBreakdown.map((day, index) => (
                  <div key={index} className="summary-line" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '12px', color: '#444' }}>
                  <span>{day.day}:</span>
                  <span>${day.basePrice.toFixed(2)}</span>
                </div>
              ))}
                <div className="summary-line" style={{ borderTop: '1px solid #eee', marginTop: '8px', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Total Base:</span>
                <span>${pricing.totalBasePrice.toFixed(2)}</span>
              </div>
            </>
          )}
          
            {pricing.nights < 7 && pricing.taxAmount > 0 && (
              <div className="summary-line" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span>Tax (15%):</span>
              <span>${pricing.taxAmount.toFixed(2)}</span>
            </div>
          )}
          
            {overnightExtraHours !== 0 && pricing.extraHoursCheckInCost > 0 && (
              <div className="summary-line" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>CI Hours ({overnightExtraHours > 0 ? `+${overnightExtraHours}h` : `${Math.abs(overnightExtraHours)}h`}):</span>
              <span>${pricing.extraHoursCheckInCost.toFixed(2)}</span>
            </div>
          )}
          
            {overnightCheckoutExtraHours !== 0 && pricing.extraHoursCheckOutCost > 0 && (
              <div className="summary-line" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>CO Hours ({overnightCheckoutExtraHours > 0 ? `+${overnightCheckoutExtraHours}h` : `${Math.abs(overnightCheckoutExtraHours)}h`}):</span>
              <span>${pricing.extraHoursCheckOutCost.toFixed(2)}</span>
            </div>
          )}
          
            <div className="summary-line total" style={{ borderTop: '1px solid #aaa', marginTop: '8px', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '16px' }}>
            <span>Total Price:</span>
              <span>${pricing.totalPrice.toFixed(2)}</span>
          </div>
          </>
        )}
        
        {savedStays.length === 0 && !pricing && (
          <p style={{ 
            textAlign: 'center', 
            color: '#000', 
            padding: '20px', 
            backgroundColor: '#f8f9fa',
            borderRadius: '6px',
            fontSize: '14px'
          }}>
            Select dates and click "Add Stay" to begin adding stays
          </p>
        )}
      </div>
    );
  };
  
  // Add a function to handle price updates
  const handlePriceUpdate = () => {
    // Increment the counter to force a UI refresh
    setPriceUpdateCounter(prev => prev + 1);
    
    // Update short stay calculations
    calculatePrice();
    
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
      } else if (stay.bedType === 'Queen 2 Beds') {
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
            // Cycle through the three statuses: available -> occupied -> cleared -> available
            let newStatus;
            if (room.status === 'available') {
              newStatus = 'occupied';
            } else if (room.status === 'occupied') {
              newStatus = 'cleared';
            } else {
              newStatus = 'available';
            }
            
            return {
              ...room,
              status: newStatus
            };
          }
          return room;
        })
      };
      
      // Save updated rooms to localStorage
      saveRoomsToStorage(updatedRooms);
      
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
    
    // Check if we have selected dates
    if (schedule?.selectedDates && schedule.selectedDates.length > 0) {
      // Sort dates in ascending order
      const sortedDates = [...schedule.selectedDates].sort((a, b) => new Date(a) - new Date(b));
      
      // Total nights is the number of selected dates
      const totalNights = sortedDates.length;
      
      // Calculate base price using logic from overnight stay
      let totalBasePrice = 0;
      
      // Special pricing for 7-night stays
      if (totalNights === 7) {
        totalBasePrice = room.type === 'jacuzzi' ? 695 : 675;
        
        // Add bed type adjustment for 7 nights
        if (room.beds === 'king') {
          totalBasePrice += (5 * 7);
        } else if (room.beds === 'Queen 2 Beds') {
          totalBasePrice += (10 * 7);
        }
      } else {
        // Regular pricing for each selected date
        for (const selectedDate of sortedDates) {
          const dateObj = new Date(selectedDate);
          const dayOfWeek = dateObj.getDay();
          
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
          } else if (room.beds === 'Queen 2 Beds') {
            dayBasePrice += 10;
          }
          
          totalBasePrice += dayBasePrice;
        }
      }
      
      // Calculate tax
      const taxAmount = totalNights < 7 ? totalBasePrice * 0.15 : 0;
      
      // Calculate extra hour charges
      const extraHourRate = schedule.hourRate || 15; // Use room-specific hourly rate or default to $15
      const checkInAdj = schedule.checkInAdj || 0;
      const checkOutAdj = schedule.checkOutAdj || 0;
      
      const extraHoursCheckIn = checkInAdj < 0 ? Math.abs(checkInAdj) * extraHourRate : 0;
      const extraHoursCheckOut = checkOutAdj > 0 ? checkOutAdj * extraHourRate : 0;
      
      return {
        basePrice: totalBasePrice,
        tax: taxAmount,
        extraHoursCheckIn,
        extraHoursCheckOut,
        nights: totalNights,
        total: totalBasePrice + taxAmount + extraHoursCheckIn + extraHoursCheckOut
      };
    } else if (schedule?.startDate && schedule?.endDate) {
      // Fallback to original date range logic for backward compatibility
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
        } else if (room.beds === 'Queen 2 Beds') {
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
          } else if (room.beds === 'Queen 2 Beds') {
            dayBasePrice += 10;
          }
          
          totalBasePrice += dayBasePrice;
        }
      }
      
      // Calculate tax
      const taxAmount = totalNights < 7 ? totalBasePrice * 0.15 : 0;
      
      // Calculate extra hour charges
      const extraHourRate = schedule.hourRate || 15; // Use room-specific hourly rate or default to $15
      const checkInAdj = schedule.checkInAdj || 0;
      const checkOutAdj = schedule.checkOutAdj || 0;
      
      const extraHoursCheckIn = checkInAdj < 0 ? Math.abs(checkInAdj) * extraHourRate : 0;
      const extraHoursCheckOut = checkOutAdj > 0 ? checkOutAdj * extraHourRate : 0;
      
      return {
        basePrice: totalBasePrice,
        tax: taxAmount,
        extraHoursCheckIn,
        extraHoursCheckOut,
        nights: totalNights,
        total: totalBasePrice + taxAmount + extraHoursCheckIn + extraHoursCheckOut
      };
    } else {
      // Simple default pricing if no dates are selected
      // Use prices state based on current day
      let basicPrice;
      const currentDayOfWeek = new Date().getDay();
      
      if (currentDayOfWeek === 5) { // Friday
        basicPrice = room.type === 'jacuzzi' ? prices.friday.withJacuzzi : prices.friday.withoutJacuzzi;
      } else if (currentDayOfWeek === 0 || currentDayOfWeek === 6) { // Weekend
        basicPrice = room.type === 'jacuzzi' ? prices.weekend.withJacuzzi : prices.weekend.withoutJacuzzi;
      } else { // Weekday
        basicPrice = room.type === 'jacuzzi' ? prices.weekday.withJacuzzi : prices.weekday.withoutJacuzzi;
      }

      // Add bed type adjustment
      if (room.beds === 'king') {
        basicPrice += 5;
      } else if (room.beds === 'Queen 2 Beds') {
        basicPrice += 10;
      }

      const taxAmount = basicPrice * 0.15;
      
      // Calculate extra hour charges
      const extraHourRate = schedule?.hourRate || 15; // Use room-specific hourly rate or default to $15
      const checkInAdj = schedule?.checkInAdj || 0;
      const checkOutAdj = schedule?.checkOutAdj || 0;
      
      const extraHoursCheckIn = checkInAdj < 0 ? Math.abs(checkInAdj) * extraHourRate : 0;
      const extraHoursCheckOut = checkOutAdj > 0 ? checkOutAdj * extraHourRate : 0;

    return {
        basePrice: basicPrice,
        tax: taxAmount,
        extraHoursCheckIn,
        extraHoursCheckOut,
        nights: 1,
        total: basicPrice + taxAmount + extraHoursCheckIn + extraHoursCheckOut
      };
    }
  };
  
  // Add state for multiple filters
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [changeStatusMode, setChangeStatusMode] = useState(false);
  const [showChangeStatusModal, setShowChangeStatusModal] = useState(false);
  // const [openBookingModal, setOpenBookingModal] = useState(null); // Disabled - No longer using booking modal
  
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingRoomAction, setPendingRoomAction] = useState(null);
  
  // Check if user is authenticated on component mount
  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);
  
  // Handle successful login
  const handleLogin = (success) => {
    if (success) {
      setIsAuthenticated(true);
      localStorage.setItem('isAuthenticated', 'true');
      
      // Execute pending room action if any
      if (pendingRoomAction) {
        const { floor, roomNumber } = pendingRoomAction;
        toggleRoomStatus(floor, roomNumber);
        setPendingRoomAction(null);
      }
    }
  };
  
  // Handle room card click with authentication check
  const handleRoomCardClick = (floor, roomNumber) => {
    // If already authenticated, allow the action
    if (isAuthenticated) {
      toggleRoomStatus(floor, roomNumber);
    } else {
      // Store the pending action and show login modal
      setPendingRoomAction({ floor, roomNumber });
      setShowLoginModal(true);
    }
  };

  // Update filter handling
  const handleFilterClick = (filter) => {
    if (filter === 'change-status') {
      // Check authentication before showing change status modal
      if (isAuthenticated) {
        setShowChangeStatusModal(true);
      } else {
        setShowLoginModal(true);
      }
      return;
    }
    
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
        case 'Queen':
          return room.beds === 'Queen';
        case 'King':
          return room.beds === 'King';
        case 'Queen 2 Beds':
          return room.beds === 'Queen 2 Beds';
        case 'jacuzzi':
          return room.type === 'jacuzzi';
        case 'available':
          return room.status === 'available';
        case 'occupied':
          return room.status === 'occupied';
        case 'cleared':
          return room.status === 'cleared';
        case 'handicap':
          return room.handicap === true;
        case 'online-booking-only':
          return room.onlineBookingOnly === true;
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
  const [roomSchedules, setRoomSchedules] = useState(() => {
    // Try to load room schedules from localStorage
    const savedSchedules = localStorage.getItem('roomSchedules');
    if (savedSchedules) {
      const parsedSchedules = JSON.parse(savedSchedules);
      
      // Convert date strings back to Date objects
      for (const roomNumber in parsedSchedules) {
        if (parsedSchedules[roomNumber].selectedDates) {
          parsedSchedules[roomNumber].selectedDates = parsedSchedules[roomNumber].selectedDates.map(
            dateStr => new Date(dateStr)
          );
        }
        if (parsedSchedules[roomNumber].startDate) {
          parsedSchedules[roomNumber].startDate = new Date(parsedSchedules[roomNumber].startDate);
        }
        if (parsedSchedules[roomNumber].endDate) {
          parsedSchedules[roomNumber].endDate = new Date(parsedSchedules[roomNumber].endDate);
        }
        if (parsedSchedules[roomNumber].checkoutTime) {
          parsedSchedules[roomNumber].checkoutTime = new Date(parsedSchedules[roomNumber].checkoutTime);
        }
      }
      
      return parsedSchedules;
    }
    return {};
  });
  const [checkoutAlerts, setCheckoutAlerts] = useState(() => {
    // Try to load checkout alerts from localStorage
    const savedAlerts = localStorage.getItem('checkoutAlerts');
    return savedAlerts ? JSON.parse(savedAlerts) : {};
  });
  const [openTimePickerRoom, setOpenTimePickerRoom] = useState(null);
  const [manualTimeInput, setManualTimeInput] = useState('');

  // Helper function to save room data to localStorage
  const saveRoomsToStorage = (roomsData) => {
    localStorage.setItem('roomsData', JSON.stringify(roomsData));
  };

  // Helper function to save room schedules to localStorage
  const saveRoomSchedulesToStorage = (schedules) => {
    localStorage.setItem('roomSchedules', JSON.stringify(schedules));
  };

  // Helper function to save checkout alerts to localStorage
  const saveCheckoutAlertsToStorage = (alerts) => {
    localStorage.setItem('checkoutAlerts', JSON.stringify(alerts));
  };

  // Update to support multiple date selection
  const handleRoomDateSelect = (roomNumber, date) => {
    // Verify user is authenticated
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    
    const today = new Date();
    const isClickedDateToday = date.getDate() === today.getDate() &&
                             date.getMonth() === today.getMonth() &&
                             date.getFullYear() === today.getFullYear();
                           
    setRoomSchedules(prev => {
      const current = prev[roomNumber] || {};
      const selectedDates = current.selectedDates || [];
      let updatedDates;

      // Check if the date is already selected by comparing day, month, and year
      const dateExistsIndex = selectedDates.findIndex(selectedDate => 
        selectedDate.getDate() === date.getDate() &&
        selectedDate.getMonth() === date.getMonth() &&
        selectedDate.getFullYear() === date.getFullYear()
      );
      
      if (dateExistsIndex !== -1) {
        // Date exists, remove it (toggle off)
        updatedDates = selectedDates.filter((_, index) => index !== dateExistsIndex);
      } else {
        // Date doesn't exist, add it
        if (selectedDates.length === 0 && !isClickedDateToday) {
          // Special case: This is the FIRST date clicked for this room, AND it's NOT today.
          // Include today's date (normalized to start of day) along with the clicked date.
          const todayNormalized = new Date();
          todayNormalized.setHours(0, 0, 0, 0);
          updatedDates = [todayNormalized, date];
        } else {
          // Normal case: Add the clicked date to the existing selections, or add today if it's the first click.
          updatedDates = [...selectedDates, date];
        }
      }
        
      // Sort dates chronologically
      updatedDates.sort((a, b) => new Date(a) - new Date(b));
          
      const updatedSchedules = {
          ...prev,
          [roomNumber]: {
            ...current,
          selectedDates: updatedDates,
          // Keep the existing startDate/endDate for backward compatibility/display
          startDate: updatedDates.length > 0 ? updatedDates[0] : null,
          endDate: updatedDates.length > 0 ? updatedDates[updatedDates.length - 1] : null,
          hourRate: current.hourRate || 15 // Ensure hourRate is preserved/defaulted
        }
      };
      
      // Save to localStorage
      saveRoomSchedulesToStorage(updatedSchedules);
      
      return updatedSchedules;
    });
    
    // Do not close the calendar after date selection
    // The calendar will only close when clicking the calendar icon
  };

  // Add function to handle hourly rate change
  const handleRoomHourRateChange = (roomNumber, rate) => {
    // Verify user is authenticated
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    setRoomSchedules(prev => {
      const current = prev[roomNumber] || {};
      const updatedSchedules = {
        ...prev,
        [roomNumber]: {
          ...current,
          hourRate: rate
        }
      };
      
      // Save to localStorage
      saveRoomSchedulesToStorage(updatedSchedules);
      
      return updatedSchedules;
    });
    
    // Force UI update to recalculate prices immediately
    setPriceUpdateCounter(prev => prev + 1);
    
    // Recalculate room price
    setTimeout(() => {
      const roomPrice = calculateRoomPrice({ 
        number: roomNumber, 
        schedule: roomSchedules[roomNumber]
      });
      
      // Update room price display
      setRooms(prev => {
        const updatedRooms = { ...prev };
        
        // Find the room in either floor
        for (const floor of ['groundFloor', 'firstFloor']) {
          const roomIndex = updatedRooms[floor].findIndex(r => r.number === roomNumber);
          if (roomIndex !== -1) {
            updatedRooms[floor][roomIndex].calculatedPrice = roomPrice;
            break;
          }
        }
        
        // Save updated rooms to localStorage
        saveRoomsToStorage(updatedRooms);
        
        return updatedRooms;
      });
    }, 50); // Small delay to ensure state has updated
  };

  // Handle room hour adjustment
  const handleRoomHourAdjustment = (roomNumber, type, change) => {
    // Verify user is authenticated
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    setRoomSchedules(prev => {
      const current = prev[roomNumber] || { checkInAdj: 0, checkOutAdj: 0 };
      const updated = {
        ...current,
        [type === 'checkIn' ? 'checkInAdj' : 'checkOutAdj']: 
          (current[type === 'checkIn' ? 'checkInAdj' : 'checkOutAdj'] || 0) + change
      };
      
      const updatedSchedules = { ...prev, [roomNumber]: updated };
      
      // Save to localStorage
      saveRoomSchedulesToStorage(updatedSchedules);
      
      return updatedSchedules;
    });
    
    // Force UI update to recalculate prices immediately
    setPriceUpdateCounter(prev => prev + 1);
    
    // Calculate and update the price for this room
    setTimeout(() => {
      const roomPrice = calculateRoomPrice({ 
        number: roomNumber, 
        schedule: roomSchedules[roomNumber]
      });
      
      // Update room price display
      setRooms(prev => {
        const updatedRooms = { ...prev };
        
        // Find the room in either floor
        for (const floor of ['groundFloor', 'firstFloor']) {
          const roomIndex = updatedRooms[floor].findIndex(r => r.number === roomNumber);
          if (roomIndex !== -1) {
            updatedRooms[floor][roomIndex].calculatedPrice = roomPrice;
            break;
          }
        }
        
        // Save updated rooms to localStorage
        saveRoomsToStorage(updatedRooms);
        
        return updatedRooms;
      });
    }, 50); // Small delay to ensure state has updated
  };

  // Format adjusted time
  const formatAdjustedTime = (baseHour, adjustment) => {
    const dt = new Date();
    dt.setHours(baseHour + adjustment, 0, 0, 0);
    return dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };
  
  // Function to handle setting checkout time
  const handleSetCheckoutTime = (roomNumber, time) => {
    // Verify user is authenticated
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    
    setRoomSchedules(prev => {
      const current = prev[roomNumber] || {};
      const updatedSchedules = {
        ...prev,
        [roomNumber]: {
          ...current,
          checkoutTime: time
        }
      };
      
      // Save to localStorage
      saveRoomSchedulesToStorage(updatedSchedules);
      
      return updatedSchedules;
    });
    
    // Force UI update
    setPriceUpdateCounter(prev => prev + 1);
  };

  // Function to dismiss checkout alert
  const dismissCheckoutAlert = (roomNumber) => {
    // Verify user is authenticated
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    
    setCheckoutAlerts(prev => {
      const newAlerts = {...prev};
      delete newAlerts[roomNumber];
      
      // Save to localStorage
      saveCheckoutAlertsToStorage(newAlerts);
      
      return newAlerts;
    });
  };

  // Function to reset room price
  const resetRoomPrice = (e, roomNumber) => {
    e.stopPropagation();
    
    // Verify user is authenticated
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    
    // Reset room price calculation state
    setRoomSchedules(prev => {
      const updated = { ...prev };
      if (updated[roomNumber]) {
        delete updated[roomNumber];
      }
      
      // Save to localStorage
      saveRoomSchedulesToStorage(updated);
      
      return updated;
    });
    
    // Also clear any checkout alerts for this room
    setCheckoutAlerts(prev => {
      const updated = { ...prev };
      if (updated[roomNumber]) {
        delete updated[roomNumber];
      }
      
      // Save to localStorage
      saveCheckoutAlertsToStorage(updated);
      
      return updated;
    });
  };
  
  // Update time every minute
  useEffect(() => {
    updateCurrentDateTime();
    const intervalId = setInterval(updateCurrentDateTime, 60000);
    return () => clearInterval(intervalId);
  }, []);
  
  // Check for rooms with checkout time matching current time
  useEffect(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // Check all rooms for checkout time match
    Object.entries(roomSchedules).forEach(([roomNumber, schedule]) => {
      if (schedule.checkoutTime) {
        const checkoutDate = new Date(schedule.checkoutTime);
        const checkoutHour = checkoutDate.getHours();
        const checkoutMinute = checkoutDate.getMinutes();
        
        // Only match exact hour and minute (not within 5 minutes)
        if (checkoutHour === currentHour && checkoutMinute === currentMinute) {
          setCheckoutAlerts(prev => ({
            ...prev,
            [roomNumber]: true
          }));
        }
      }
    });
  }, [currentTime, roomSchedules]);

  // Function to handle manual time input for checkout
  const handleManualTimeInput = (e, roomNumber) => {
    e.stopPropagation();
    
    // Verify user is authenticated
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    
    setManualTimeInput(e.target.value);
  };

  // Function to set checkout time from manual input
  const setCheckoutTimeFromInput = (e, roomNumber) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Verify user is authenticated
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    
    // Parse time from input (12-hour format)
    const timeRegex = /^(0?[1-9]|1[0-2]):([0-5][0-9])\s?(AM|PM|am|pm)$/i;
    const match = manualTimeInput.match(timeRegex);
    
    if (match) {
      const hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      const period = match[3].toUpperCase();
      
      // Convert to 24-hour format
      let hour24 = hours;
      if (period === 'PM' && hours < 12) hour24 += 12;
      if (period === 'AM' && hours === 12) hour24 = 0;
      
      const now = new Date();
      now.setHours(hour24, minutes, 0, 0);
      
      handleSetCheckoutTime(roomNumber, now);
      setOpenTimePickerRoom(null);
      setManualTimeInput('');
    } else {
      // Show error if format is incorrect
      alert('Please enter time in format: HH:MM AM/PM (e.g. 11:30 AM)');
    }
  };
  
  const handleRoomSelection = (roomNumber) => {
    setSelectedRooms(prev => {
      if (prev.includes(roomNumber)) {
        return prev.filter(num => num !== roomNumber);
      } else {
        return [...prev, roomNumber];
      }
    });
  };
  
  // Add function to change status of selected rooms
  const changeSelectedRoomsStatus = () => {
    // Verify user is authenticated
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    
    setRooms(prevRooms => {
      const updatedRooms = { ...prevRooms };
      
      // Update ground floor rooms
      updatedRooms.groundFloor = prevRooms.groundFloor.map(room => ({
        ...room,
        status: selectedRooms.includes(room.number) ? 'available' : 'occupied'
      }));
      
      // Update first floor rooms
      updatedRooms.firstFloor = prevRooms.firstFloor.map(room => ({
        ...room,
        status: selectedRooms.includes(room.number) ? 'available' : 'occupied'
      }));
      
      // Save updated rooms to localStorage
      saveRoomsToStorage(updatedRooms);
      
      return updatedRooms;
    });
    
    // Reset selected rooms and exit change status mode
    setSelectedRooms([]);
    setChangeStatusMode(false);
    setShowChangeStatusModal(false);
  };
  
  // Add function to clear all room statuses
  const clearAllRoomStatus = () => {
    // Verify user is authenticated
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    
    setRooms(prevRooms => {
      const updatedRooms = { ...prevRooms };
      
      // Update ground floor rooms
      updatedRooms.groundFloor = prevRooms.groundFloor.map(room => ({
        ...room,
        status: 'cleared'
      }));
      
      // Update first floor rooms
      updatedRooms.firstFloor = prevRooms.firstFloor.map(room => ({
        ...room,
        status: 'cleared'
      }));
      
      // Save updated rooms to localStorage
      saveRoomsToStorage(updatedRooms);
      
      return updatedRooms;
    });
  };
  
  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  };
  
  // Function to clear only the Short Stay section
  const clearShortStay = () => {
    // Reset short stay options
    setExtraHours(0);
    setHasJacuzzi(false);
    setPaymentMethod('cash');
    setExtraHourRate(15);
    
    // Update current time
    updateCurrentDateTime();
  };
  
  // Function to clear only the Multiple Nights section
  const clearMultipleNights = () => {
    // Reset overnight stay options
    setOvernightPayment('cash');
    setOvernightExtraRate(15);
    setOvernightExtraHours(0);
    setOvernightCheckoutExtraHours(0);
    setHasJacuzziOvernight(false);
    setBedType('Queen');
    
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
  };
  
  // Add style element for room cards
  useEffect(() => {
    // Add custom styles for room cards
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      .room-card {
        padding: 10px !important;
        border-radius: 6px !important;
        text-align: center !important;
        cursor: pointer !important;
        color: white !important;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
        transition: all 0.2s ease !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: center !important;
        align-items: center !important;
      }
      
      .room-card.available {
        background-color: #4CAF50 !important; /* Nicer green */
      }
      
      .room-card.occupied {
        background-color: #E53935 !important; /* Red */
      }
      
      .room-card.cleared {
        background-color: #FFA726 !important; /* Orange */
      }
      
      .room-card:hover {
        transform: scale(1.05) !important;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2) !important;
      }
    `;
    document.head.appendChild(styleElement);
    
    // Clean up on component unmount
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  
  return (
    <div className="App">
      <div className="hotel-calculator">
        <div className="header" style={{
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px', // Reduced gap to bring elements closer to title
          padding: '10px 20px', 
          borderBottom: '1px solid #eee' 
        }}>
          <h1 style={{ margin: 0, fontSize: '24px', whiteSpace: 'nowrap' }}> 
            Price Calculator
          </h1>
          
          {/* Calendar Display */}
          <span style={{ 
            fontSize: '16px', 
            backgroundColor: '#f0f0f0', 
            padding: '6px 12px', 
            borderRadius: '6px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            whiteSpace: 'nowrap' // Prevent calendar text wrapping
          }}>
            📅 {currentDate} <span style={{...dayStyle, marginLeft: '3px'}}>{currentDay}</span>
          </span>
          
          {/* Price Display - Re-added background and border */}
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: '#fffbe5', // Light yellow background
            padding: '6px 12px', 
            borderRadius: '6px', 
            gap: '15px', 
            border: '1px solid #e0cfa4' // Subtle border
          }}>
            {/* Standard Price Section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '12px', color: '#555', marginBottom: '2px' }}>Standard</div>
                {
                  // Calculate Standard prices
                  (() => {
                    const now = new Date();
                    const day = now.getDay();
                    let basePrice;
                    if (day === 5) basePrice = prices.friday.withoutJacuzzi;
                    else if (day === 0 || day === 6) basePrice = prices.weekend.withoutJacuzzi;
                    else basePrice = prices.weekday.withoutJacuzzi;
                    const tax = basePrice * 0.15;
                    const total = basePrice + tax;
                    return (
                      <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#001f5c', whiteSpace: 'nowrap' }}> {/* Added nowrap */}
                        ${total.toFixed(2)}
                        <span style={{ fontSize: '10px', fontWeight: 'normal', color: '#666', marginLeft: '4px' }}>
                          (Base ${basePrice.toFixed(2)} + Tax ${tax.toFixed(2)})
                        </span>
                      </span>
                    );
                  })()
                }
              </div>
            </div>

            {/* Divider */}
            <div style={{ borderLeft: '1px solid #d0d9e3', height: '30px' }}></div>

            {/* Jacuzzi Price Section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>🛁</span> {/* Jacuzzi Icon */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '12px', color: '#555', marginBottom: '2px' }}>Jacuzzi</div>
                {
                  // Calculate Jacuzzi prices
                  (() => {
                    const now = new Date();
                    const day = now.getDay();
                    let basePrice;
                    if (day === 5) basePrice = prices.friday.withJacuzzi;
                    else if (day === 0 || day === 6) basePrice = prices.weekend.withJacuzzi;
                    else basePrice = prices.weekday.withJacuzzi;
                    const tax = basePrice * 0.15;
                    const total = basePrice + tax;
                    return (
                       <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#001f5c', whiteSpace: 'nowrap' }}> {/* Added nowrap */}
                        ${total.toFixed(2)}
                        <span style={{ fontSize: '10px', fontWeight: 'normal', color: '#666', marginLeft: '4px' }}>
                          (Base ${basePrice.toFixed(2)} + Tax ${tax.toFixed(2)})
                        </span>
                      </span>
                    );
                  })()
                }
              </div>
            </div>
          </span>
          
          {/* Price Change Button */}
          <button
            onClick={() => setShowPriceChangeModal(true)}
            style={{
              backgroundColor: '#001f5c',
              color: 'white',
              border: 'none',
              borderRadius: '6px', 
              padding: '8px 15px', 
              cursor: 'pointer',
              fontSize: '14px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              marginLeft: 'auto' // Push button to the far right
            }}
          >
            <span>💰</span> Price Change
          </button>
        </div>
        
        {/* Replace tabs and conditional rendering with grid layout */}
        <div className="full-page-layout" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: 'auto auto',
          gap: '15px',
          gridTemplateAreas: `
            "shortstay multinight"
            "groundfloor firstfloor"
          `
        }}>
          {/* Short Stay Section - Top Left */}
          <div style={{ 
  gridArea: 'shortstay', 
  backgroundColor: '#e6f2ff',
  padding: '8px 12px 5px 12px', // Minimal bottom padding
  borderRadius: '8px', 
  display: 'flex', 
  flexDirection: 'column', 
  gap: '8px' // Keep main gap small
}}>
  {/* Header */} 
  <div style={{ 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: '#001f5c',
    padding: '8px 8px', 
    borderRadius: '6px',
    color: 'white',
    marginBottom: '5px' // Further reduced margin
  }}>
    <h2 className="section-header" style={{ margin: 0, borderBottom: 'none', color: 'white', fontSize: '16px' }}>Short Stay</h2>
    <button 
      onClick={clearShortStay}
      style={{ 
        backgroundColor: '#f44336',
        padding: '4px 10px', 
        fontSize: '12px', 
        color: 'white',
        border: 'none',
        borderRadius: '4px', 
        cursor: 'pointer'
       }} 
    >
      Clear
    </button>
  </div>
  
  {/* Row 1: Time and Extra Hours */} 
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '5px', marginBottom: '5px' /* Reduced margin */ }}> {/* Check-in & Check-out Group */} 
    <div style={{ display: 'flex', gap: '10px' }}> {/* Reduced gap */} 
      <div className="check-time" style={{ textAlign: 'left' }}>
        <label style={{ color: '#0606f5', fontSize: '11px', display: 'block', marginBottom: '0px' }}>Check-in @</label> {/* No margin */} 
        <span style={{ color: '#0606f5', fontSize: '12px', fontWeight: '500', lineHeight: '1.2' }}>{currentTime}</span> {/* Reduced line height */} 
      </div>
      <div className="check-time" style={{ textAlign: 'left' }}>
        <label style={{ color: '#0606f5', fontSize: '11px', display: 'block', marginBottom: '0px' }}>Check-out @</label> {/* No margin */} 
        <span style={{ color: '#0606f5', fontSize: '12px', fontWeight: '500', lineHeight: '1.2' }}>{checkoutTime}</span> {/* Reduced line height */} 
      </div>
    </div>
    
    {/* Extra Hours */} 
    <div className="extra-hours" style={{ textAlign: 'center' }}> 
      <label style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '2px' }}>Extra Hours:</label> 
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '2px' }}> 
        <button 
          className="minus-btn" 
          onClick={() => handleExtraHoursChange(-1)} 
          style={{ 
            padding: '0', // Remove padding for exact sizing
            width: '24px', 
            height: '24px', 
            borderRadius: '50%', 
            border: 'none', 
            backgroundColor: '#E53935', 
            color: 'white', 
            fontSize: '16px', 
            fontWeight: 'bold', 
            cursor: 'pointer',
            lineHeight: '24px' // Center symbol vertically
          }}
        >-</button> 
        <span style={{ fontSize: '16px', fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>{extraHours}</span> 
        <button 
          className="plus-btn" 
          onClick={() => handleExtraHoursChange(1)} 
          style={{ 
            padding: '0',
            width: '24px', 
            height: '24px', 
            borderRadius: '50%', 
            border: 'none', 
            backgroundColor: '#4CAF50', 
            color: 'white', 
            fontSize: '16px', 
            fontWeight: 'bold', 
            cursor: 'pointer',
            lineHeight: '24px'
          }}
        >+</button> 
      </div>
      <span className="hours-note" style={{ color: '#00308F', fontWeight: 'bold', fontSize: '10px', lineHeight: '1.1' }}>(Total: {4 + extraHours}hr)</span> {/* Smaller font/line height */} 
    </div>
  </div>

  {/* Row 2: Options */} 
  <div style={{ 
    display: 'flex', 
    justifyContent: 'space-around', 
    alignItems: 'flex-start', 
    gap: '8px', // Reduced gap 
    borderTop: '1px solid #ccc', 
    borderBottom: '1px solid #ccc', 
    padding: '5px 0' // Reduced padding
  }}>
    {/* Room Type Box */} 
    <div style={{ 
      backgroundColor: 'white', 
      padding: '5px 10px', // Reduced padding 
      borderRadius: '8px', 
      border: '1px solid #ccc', 
      textAlign: 'center', 
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    }}>
      <label style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '3px' }}>Room Type</label> 
      <div style={{ display: 'inline-flex', borderRadius: '4px', overflow: 'hidden', border: '1px solid #001f5c' }}>
        <button onClick={() => setHasJacuzzi(false)} style={{ padding: '4px 10px', fontSize: '12px', border: 'none', backgroundColor: !hasJacuzzi ? '#001f5c' : 'white', color: !hasJacuzzi ? 'white' : '#001f5c', cursor: 'pointer' }}>No Jacuzzi</button>
        <button onClick={() => setHasJacuzzi(true)} style={{ padding: '4px 10px', fontSize: '12px', border: 'none', borderLeft: '1px solid #001f5c', backgroundColor: hasJacuzzi ? '#001f5c' : 'white', color: hasJacuzzi ? 'white' : '#001f5c', cursor: 'pointer' }}>Jacuzzi</button>
      </div>
    </div>
    {/* Payment Box */} 
    <div style={{ 
      backgroundColor: 'white', 
      padding: '5px 10px', // Reduced padding
      borderRadius: '8px', 
      border: '1px solid #ccc', 
      textAlign: 'center', 
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    }}>
      <label style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '3px' }}>Payment</label> 
      <div style={{ display: 'inline-flex', borderRadius: '4px', overflow: 'hidden', border: '1px solid #001f5c' }}>
        <button onClick={() => setPaymentMethod('cash')} style={{ padding: '4px 10px', fontSize: '12px', border: 'none', backgroundColor: paymentMethod === 'cash' ? '#001f5c' : 'white', color: paymentMethod === 'cash' ? 'white' : '#001f5c', cursor: 'pointer' }}>Cash</button>
        <button onClick={() => setPaymentMethod('credit')} style={{ padding: '4px 10px', fontSize: '12px', border: 'none', borderLeft: '1px solid #001f5c', backgroundColor: paymentMethod === 'credit' ? '#001f5c' : 'white', color: paymentMethod === 'credit' ? 'white' : '#001f5c', cursor: 'pointer' }}>Credit</button>
      </div>
    </div>
    {/* Extra Rate Box */} 
    <div style={{ 
      backgroundColor: 'white', 
      padding: '5px 10px', // Reduced padding
      borderRadius: '8px', 
      border: '1px solid #ccc', 
      textAlign: 'center', 
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    }}>
      <label style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '3px' }}>Extra Rate</label> 
      <div style={{ display: 'inline-flex', borderRadius: '4px', overflow: 'hidden', border: '1px solid #001f5c' }}>
        <button onClick={() => setExtraHourRate(15)} style={{ padding: '4px 10px', fontSize: '12px', border: 'none', backgroundColor: extraHourRate === 15 ? '#001f5c' : 'white', color: extraHourRate === 15 ? 'white' : '#001f5c', cursor: 'pointer' }}>$15/hr</button>
        <button onClick={() => setExtraHourRate(10)} style={{ padding: '4px 10px', fontSize: '12px', border: 'none', borderLeft: '1px solid #001f5c', backgroundColor: extraHourRate === 10 ? '#001f5c' : 'white', color: extraHourRate === 10 ? 'white' : '#001f5c', cursor: 'pointer' }}>$10/hr</button>
      </div>
    </div>
  </div>

  {/* Price Summary */} 
  <div className="price-summary" style={{ marginTop: '5px', padding: '5px', backgroundColor: '#f8f9fa', borderRadius: '4px', border: '1px solid #eee' }}> {/* Reduced margin/padding */} 
     {/* Summary Lines - Ensure minimal margins/padding */} 
     <div className="summary-line" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '1px' }}>
        <span>Base (4hr):</span>
        <span>${(hasJacuzzi ? shortStayPrices.baseRate.withJacuzzi : shortStayPrices.baseRate.withoutJacuzzi).toFixed(2)}</span>
      </div>
      {paymentMethod === 'credit' && (
        <div className="summary-line" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '1px' }}>
          <span>Tax (15%):</span>
          <span>${((hasJacuzzi ? shortStayPrices.baseRate.withJacuzzi : shortStayPrices.baseRate.withoutJacuzzi) * 0.15).toFixed(2)}</span>
        </div>
      )}
      <div className="summary-line" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '1px' }}>
        <span>Extra Hrs ({extraHours}):</span>
        <span>${(extraHours * (extraHourRate === 15 ? shortStayPrices.extraHourRate.regular : shortStayPrices.extraHourRate.discounted)).toFixed(2)}</span>
      </div>
      <div className="summary-line total" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 'bold', color: '#001f5c', borderTop: '1px solid #ccc', marginTop: '3px', paddingTop: '3px' }}> {/* Reduced font/margins/padding */}
        <span>Total Price:</span>
        <span>${totalPrice.toFixed(2)}</span>
      </div>
  </div>
</div>
          
          {/* Multiple Nights Section - Top Right */}
          <div style={{ 
  gridArea: 'multinight', 
  backgroundColor: '#e6f2ff', // Light blue background
  padding: '10px 15px', // Reduced padding
  borderRadius: '8px',
  display: 'flex',
  flexDirection: 'column'
}}>
  {/* Header */} 
  <div style={{ 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: '10px',
    backgroundColor: '#001f5c',
    padding: '6px 10px', // Reduced header padding
    borderRadius: '6px',
    color: 'white' 
  }}>
    <h2 className="section-header" style={{ margin: 0, color: 'white', fontSize: '16px' }}>Multiple Nights</h2> {/* Smaller font */} 
    <button 
      className="add-more-button"
      onClick={() => resetOvernightStay()}
      style={{ /* Existing styles */ padding: '4px 8px', fontSize: '12px' }} /* Reduced padding/font */
    >
      <span style={{ fontSize: '14px' }}>+</span> Add Stay
    </button>
  </div>
  
  {/* Dates and Hour Adjustments - Using Grid */} 
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
    {/* Check-in Column */}
    <div className="date-picker-container" style={{ display: 'flex', flexDirection: 'column' }}>
      <label style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '2px' }}>Check-in Date:</label>
      <DatePicker
        selected={checkInDate}
        onChange={handleCheckInChange}
        dateFormat="MM/dd/yy"
        className="date-picker compact-datepicker" // Added class for potential CSS targeting
        showTimeSelect={false}
        popperPlacement="bottom-start"
        calendarClassName="compact-calendar" // Added class for potential CSS targeting
      />
      <div className="extra-hours-overnight" style={{ marginTop: '5px' }}>
        <label style={{ fontSize: '12px', marginBottom: '2px', display: 'block' }}>Hour Adj:</label> 
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}> 
          <div className="hours-control" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}> 
            <button className="minus-btn" onClick={() => handleOvernightExtraHoursChange(-1)} style={{ padding: '2px 6px'}}>-</button> 
            <span style={{ fontSize: '13px', fontWeight: 'bold', minWidth: '15px', textAlign: 'center' }}>{overnightExtraHours}</span> 
            <button className="plus-btn" onClick={() => handleOvernightExtraHoursChange(1)} style={{ padding: '2px 6px'}}>+</button> 
          </div>
          <span className="hours-note" style={{ color: '#00308F', fontSize: '11px', whiteSpace: 'nowrap' }}> 
            {/* Time calculation - kept compact */}
            {overnightExtraHours !== 0 ? `(${new Date(new Date().setHours(15 + overnightExtraHours, 0, 0, 0)).toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'})})` : '(3PM)'}
          </span>
        </div>
      </div>
    </div>
    
    {/* Check-out Column */} 
    <div className="date-picker-container" style={{ display: 'flex', flexDirection: 'column' }}>
      <label style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '2px' }}>Check-out Date:</label>
      <DatePicker
        selected={checkOutDate}
        onChange={handleCheckOutChange}
        dateFormat="MM/dd/yy"
        className="date-picker compact-datepicker"
        showTimeSelect={false}
        popperPlacement="bottom-start"
        calendarClassName="compact-calendar"
      />
      <div className="extra-hours-overnight" style={{ marginTop: '5px' }}>
        <label style={{ fontSize: '12px', marginBottom: '2px', display: 'block' }}>Hour Adj:</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}> 
          <div className="hours-control" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}> 
            <button className="minus-btn" onClick={() => handleCheckoutExtraHoursChange(-1)} style={{ padding: '2px 6px'}}>-</button> 
            <span style={{ fontSize: '13px', fontWeight: 'bold', minWidth: '15px', textAlign: 'center' }}>{overnightCheckoutExtraHours}</span> 
            <button className="plus-btn" onClick={() => handleCheckoutExtraHoursChange(1)} style={{ padding: '2px 6px'}}>+</button> 
          </div>
          <span className="hours-note" style={{ color: '#00308F', fontSize: '11px', whiteSpace: 'nowrap' }}> 
            {/* Time calculation - kept compact */}
            {overnightCheckoutExtraHours !== 0 ? `(${new Date(new Date().setHours(11 + overnightCheckoutExtraHours, 0, 0, 0)).toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'})})` : '(11AM)'}
          </span>
        </div>
      </div>
    </div>
  </div>
  
  {/* Options - Using Grid */}
  <div style={{ 
    display: 'grid', 
    gridTemplateColumns: 'repeat(2, 1fr)', // Two columns for options
    gap: '10px 15px',
    borderTop: '1px solid #ccc',
    paddingTop: '10px'
  }}>
    {/* Column 1: Room Type & Bed Type */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div className="option-group"> 
        <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Room Type:</label> 
        <div className="radio-group" style={{ display: 'flex', flexDirection: 'column', gap: '2px'}}> 
          <label style={{ fontSize: '12px' }}><input type="radio" style={{ marginRight: '3px' }} checked={!hasJacuzziOvernight} onChange={() => setHasJacuzziOvernight(false)} /> No Jacuzzi</label>
          <label style={{ fontSize: '12px' }}><input type="radio" style={{ marginRight: '3px' }} checked={hasJacuzziOvernight} onChange={() => setHasJacuzziOvernight(true)} /> With Jacuzzi</label>
        </div>
      </div>
      <div className="option-group"> 
        <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Bed Type:</label> 
        <div className="radio-group" style={{ display: 'flex', flexDirection: 'column', gap: '2px'}}> 
          <label style={{ fontSize: '12px' }}><input type="radio" style={{ marginRight: '3px' }} checked={bedType === 'Queen'} onChange={() => setBedType('Queen')} /> Queen</label>
          <label style={{ fontSize: '12px' }}><input type="radio" style={{ marginRight: '3px' }} checked={bedType === 'King'} onChange={() => setBedType('King')} /> King</label>
          {!hasJacuzziOvernight && (
            <label style={{ fontSize: '12px' }}><input type="radio" style={{ marginRight: '3px' }} checked={bedType === 'Queen 2 Beds'} onChange={() => setBedType('Queen 2 Beds')} /> Queen 2 Beds</label>
          )}
        </div>
      </div>
    </div>
    
    {/* Column 2: Payment & Extra Rate */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div className="option-group"> 
        <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Payment:</label> 
        <div className="radio-group" style={{ display: 'flex', flexDirection: 'column', gap: '2px'}}> 
          <label style={{ fontSize: '12px' }}><input type="radio" style={{ marginRight: '3px' }} value="cash" checked={overnightPayment === 'cash'} onChange={() => setOvernightPayment('cash')} /> Cash</label>
          <label style={{ fontSize: '12px' }}><input type="radio" style={{ marginRight: '3px' }} value="credit" checked={overnightPayment === 'credit'} onChange={() => setOvernightPayment('credit')} /> Credit Card</label>
        </div>
      </div>
      <div className="option-group"> 
        <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Extra Rate:</label> 
        <div className="radio-group" style={{ display: 'flex', flexDirection: 'column', gap: '2px'}}> 
          <label style={{ fontSize: '12px' }}><input type="radio" style={{ marginRight: '3px' }} checked={overnightExtraRate === 15} onChange={() => setOvernightExtraRate(15)} /> $15/hr</label>
          <label style={{ fontSize: '12px' }}><input type="radio" style={{ marginRight: '3px' }} checked={overnightExtraRate === 10} onChange={() => setOvernightExtraRate(10)} /> $10/hr</label>
        </div>
      </div>
    </div>
  </div>
  
  {/* Render Price Summary - Takes remaining space */}
  <div style={{ marginTop: 'auto', paddingTop: '10px' }}> {/* Pushes summary down */}
     {renderOvernightStayPriceSummary()} 
  </div> 
</div>

          {/* Ground Floor Section - Bottom Left */}
          <div style={{ gridArea: 'groundfloor', backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px' }}>
            <h2 className="section-header">Ground Floor</h2>
              
              {/* Admin status and logout */}
              {isAuthenticated && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: '10px'
                }}>
                  <span style={{ 
                    color: '#28a745',
                    fontWeight: 'bold',
                    marginRight: '10px'
                  }}>
                    Admin Mode Active
                  </span>
                  <button
                    onClick={handleLogout}
                    style={{
                      padding: '5px 10px',
                      borderRadius: '4px',
                      border: 'none',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      fontSize: '13px',
                      cursor: 'pointer'
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
              
              {/* Room Filters */}
            <div className="room-filters" style={{
              display: 'flex',
              gap: '6px', // Further reduced gap
              marginBottom: '15px',
              padding: '8px', // Slightly reduced container padding
              backgroundColor: '#f0f0f0',
              borderRadius: '6px',
              justifyContent: 'flex-start', // Align to start
              flexWrap: 'nowrap', 
              overflowX: 'auto' 
            }}>
              {/* All Button */}
              <button 
                onClick={() => handleFilterClick('all')}
                style={{
                  backgroundColor: selectedFilters.length === 0 ? '#001f5c' : '#ffffff',
                  color: selectedFilters.length === 0 ? '#ffffff' : '#333333',
                  border: selectedFilters.length === 0 ? 'none' : '1px solid #cccccc',
                  borderRadius: '20px',
                  padding: '4px 10px', // Further reduced padding
                  fontWeight: selectedFilters.length === 0 ? 'bold' : 'normal',
                  cursor: 'pointer',
                  fontSize: '12px', // Further reduced font size
                  transition: 'all 0.2s ease',
                  boxShadow: selectedFilters.length === 0 ? '0 2px 4px rgba(0,0,0,0.2)' : 'none'
                }}
              >
                All
              </button>
              {/* Available Button */}
              <button 
                onClick={() => handleFilterClick('available')}
                style={{
                  backgroundColor: selectedFilters.includes('available') ? '#4CAF50' : '#ffffff',
                  color: selectedFilters.includes('available') ? '#ffffff' : '#333333',
                  border: selectedFilters.includes('available') ? 'none' : '1px solid #cccccc',
                  borderRadius: '20px',
                  padding: '4px 10px', // Further reduced padding
                  fontWeight: selectedFilters.includes('available') ? 'bold' : 'normal',
                  cursor: 'pointer',
                  fontSize: '12px', // Further reduced font size
                  transition: 'all 0.2s ease',
                  boxShadow: selectedFilters.includes('available') ? '0 2px 4px rgba(0,0,0,0.2)' : 'none'
                }}
              >
                Available
              </button>
              {/* Jacuzzi Button */}
              <button 
                onClick={() => handleFilterClick('jacuzzi')}
                style={{
                  backgroundColor: selectedFilters.includes('jacuzzi') ? '#2196F3' : '#ffffff',
                  color: selectedFilters.includes('jacuzzi') ? '#ffffff' : '#333333',
                  border: selectedFilters.includes('jacuzzi') ? 'none' : '1px solid #cccccc',
                  borderRadius: '20px',
                  padding: '4px 10px', // Further reduced padding
                  fontWeight: selectedFilters.includes('jacuzzi') ? 'bold' : 'normal',
                  cursor: 'pointer',
                  fontSize: '12px', // Further reduced font size
                  transition: 'all 0.2s ease',
                  boxShadow: selectedFilters.includes('jacuzzi') ? '0 2px 4px rgba(0,0,0,0.2)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px' // Further reduced icon gap
                }}
              >
                <span style={{ fontSize: selectedFilters.includes('jacuzzi') ? '14px' : '12px' }}>🛁</span> Jacuzzi
              </button>
              {/* Smoking Button */}
              <button 
                onClick={() => handleFilterClick('smoking')}
                style={{
                  backgroundColor: selectedFilters.includes('smoking') ? '#FF9800' : '#ffffff',
                  color: selectedFilters.includes('smoking') ? '#ffffff' : '#333333',
                  border: selectedFilters.includes('smoking') ? 'none' : '1px solid #cccccc',
                  borderRadius: '20px',
                  padding: '4px 10px', // Further reduced padding
                  fontWeight: selectedFilters.includes('smoking') ? 'bold' : 'normal',
                  cursor: 'pointer',
                  fontSize: '12px', // Further reduced font size
                  transition: 'all 0.2s ease',
                  boxShadow: selectedFilters.includes('smoking') ? '0 2px 4px rgba(0,0,0,0.2)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px' // Further reduced icon gap
                }}
              >
                <span style={{ fontSize: selectedFilters.includes('smoking') ? '14px' : '12px' }}>🚬</span> Smoking
              </button>
              {/* Non-Smoking Button */}
              <button 
                onClick={() => handleFilterClick('non-smoking')}
                style={{
                  backgroundColor: selectedFilters.includes('non-smoking') ? '#78909C' : '#ffffff', // Blue Gray
                  color: selectedFilters.includes('non-smoking') ? '#ffffff' : '#333333',
                  border: selectedFilters.includes('non-smoking') ? 'none' : '1px solid #cccccc',
                  borderRadius: '20px',
                  padding: '4px 10px', // Further reduced padding
                  fontWeight: selectedFilters.includes('non-smoking') ? 'bold' : 'normal',
                  cursor: 'pointer',
                  fontSize: '12px', // Further reduced font size
                  transition: 'all 0.2s ease',
                  boxShadow: selectedFilters.includes('non-smoking') ? '0 2px 4px rgba(0,0,0,0.2)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px' // Further reduced icon gap
                }}
              >
                <span style={{ fontSize: selectedFilters.includes('non-smoking') ? '14px' : '12px' }}>🚭</span> Non-Smoking
              </button>
              {/* Handicap Button */}
              <button 
                onClick={() => handleFilterClick('handicap')}
                style={{
                  backgroundColor: selectedFilters.includes('handicap') ? '#9C27B0' : '#ffffff',
                  color: selectedFilters.includes('handicap') ? '#ffffff' : '#333333',
                  border: selectedFilters.includes('handicap') ? 'none' : '1px solid #cccccc',
                  borderRadius: '20px',
                  padding: '4px 10px', // Further reduced padding
                  fontWeight: selectedFilters.includes('handicap') ? 'bold' : 'normal',
                  cursor: 'pointer',
                  fontSize: '12px', // Further reduced font size
                  transition: 'all 0.2s ease',
                  boxShadow: selectedFilters.includes('handicap') ? '0 2px 4px rgba(0,0,0,0.2)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px' // Further reduced icon gap
                }}
              >
                <span style={{ fontSize: selectedFilters.includes('handicap') ? '14px' : '12px' }}>♿</span> Handicap
              </button>
              {/* Queen Button */}
              <button 
                onClick={() => handleFilterClick('Queen')}
                style={{
                  backgroundColor: selectedFilters.includes('Queen') ? '#03A9F4' : '#ffffff', // Light Blue
                  color: selectedFilters.includes('Queen') ? '#ffffff' : '#333333',
                  border: selectedFilters.includes('Queen') ? 'none' : '1px solid #cccccc',
                  borderRadius: '20px',
                  padding: '4px 10px', // Further reduced padding
                  fontWeight: selectedFilters.includes('Queen') ? 'bold' : 'normal',
                  cursor: 'pointer',
                  fontSize: '12px', // Further reduced font size
                  transition: 'all 0.2s ease',
                  boxShadow: selectedFilters.includes('Queen') ? '0 2px 4px rgba(0,0,0,0.2)' : 'none'
                }}
              >
                Queen
              </button>
              {/* King Button */}
              <button 
                onClick={() => handleFilterClick('King')}
                style={{
                  backgroundColor: selectedFilters.includes('King') ? '#673AB7' : '#ffffff', // Deep Purple
                  color: selectedFilters.includes('King') ? '#ffffff' : '#333333',
                  border: selectedFilters.includes('King') ? 'none' : '1px solid #cccccc',
                  borderRadius: '20px',
                  padding: '4px 10px', // Further reduced padding
                  fontWeight: selectedFilters.includes('King') ? 'bold' : 'normal',
                  cursor: 'pointer',
                  fontSize: '12px', // Further reduced font size
                  transition: 'all 0.2s ease',
                  boxShadow: selectedFilters.includes('King') ? '0 2px 4px rgba(0,0,0,0.2)' : 'none'
                }}
              >
                King
              </button>
              {/* Queen 2 Beds Button */}
              <button 
                onClick={() => handleFilterClick('Queen 2 Beds')}
                style={{
                  backgroundColor: selectedFilters.includes('Queen 2 Beds') ? '#009688' : '#ffffff', // Teal
                  color: selectedFilters.includes('Queen 2 Beds') ? '#ffffff' : '#333333',
                  border: selectedFilters.includes('Queen 2 Beds') ? 'none' : '1px solid #cccccc',
                  borderRadius: '20px',
                  padding: '4px 10px', // Further reduced padding
                  fontWeight: selectedFilters.includes('Queen 2 Beds') ? 'bold' : 'normal',
                  cursor: 'pointer',
                  fontSize: '12px', // Further reduced font size
                  transition: 'all 0.2s ease',
                  boxShadow: selectedFilters.includes('Queen 2 Beds') ? '0 2px 4px rgba(0,0,0,0.2)' : 'none',
                  whiteSpace: 'nowrap', // Prevent wrapping
                }}
              >
                Queen 2 Beds
              </button>
            </div>

            {/* Ground Floor Rooms */}
            <div className="rooms-grid">
                    {rooms.groundFloor
                      .filter(filterRoom)
                      .map(room => (
                        <div key={room.number} 
                    className={`room-card ${room.status === 'available' ? 'available' : room.status === 'cleared' ? 'cleared' : 'occupied'}`}
                            onClick={() => handleRoomCardClick('groundFloor', room.number)}
                  >
                    <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Room {room.number}</div>
                    <div>{room.beds}</div>
                    {room.type === 'jacuzzi' && <span>🛁</span>}
                    {room.smoking ? <span>🚬</span> : <span>🚭</span>}
                    {room.handicap && <span>♿</span>}
                          </div>
                      ))}
                  </div>
              </div>

          {/* First Floor Section - Bottom Right */}
          <div style={{ gridArea: 'firstfloor', backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px' }}>
            <h2 className="section-header">First Floor</h2>
            
            {/* First Floor Rooms */}
            <div className="rooms-grid">
                    {rooms.firstFloor
                      .filter(filterRoom)
                      .map(room => (
                        <div key={room.number} 
                    className={`room-card ${room.status === 'available' ? 'available' : room.status === 'cleared' ? 'cleared' : 'occupied'}`}
                            onClick={() => handleRoomCardClick('firstFloor', room.number)}
                  >
                    <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Room {room.number}</div>
                    <div>{room.beds}</div>
                    {room.type === 'jacuzzi' && <span>🛁</span>}
                    {room.smoking ? <span>🚬</span> : <span>🚭</span>}
                    {room.handicap && <span>♿</span>}
                              </div>
                ))}
                                  </div>
                                </div>
                                </div>
                              </div>
                              
      {/* Add Price Change Modal (already added) */}

      {/* Change Status Modal */}
      {showChangeStatusModal && (
                                      <div style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                        display: 'flex', 
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
                                      <div style={{ 
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '500px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
          }}>
            <h2 style={{
              color: '#001f5c',
              borderBottom: '2px solid #001f5c',
              paddingBottom: '10px',
              marginBottom: '15px'
            }}>
              Change Room Status
            </h2>
            
                                      <div style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between',
              borderTop: '1px solid #eee',
              paddingTop: '15px'
            }}>
              <div>
                <span style={{ fontWeight: 'bold' }}>{selectedRooms.length}</span> rooms selected
                                      </div>
              <div>
                <button
                  onClick={() => {
                    setShowChangeStatusModal(false);
                    setSelectedRooms([]);
                  }}
                                  style={{
                    padding: '8px 16px',
                                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    backgroundColor: '#f5f5f5',
                    marginRight: '10px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                                  <button
                  onClick={() => {
                    changeSelectedRoomsStatus();
                    setShowChangeStatusModal(false);
                                    }}
                                    style={{
                    padding: '8px 16px',
                    borderRadius: '4px',
                                      border: 'none',
                    backgroundColor: '#28a745',
                    color: 'white',
                    cursor: 'pointer'
                  }}
                >
                  Change status to available
                                  </button>
                                </div>
                              </div>
                          </div>
                  </div>
                )}
      
      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => {
          setShowLoginModal(false);
          setPendingRoomAction(null);
        }}
        onLogin={handleLogin}
      />

      {/* Price Change Modal */}
      {showPriceChangeModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '950px', // Increased width for more space
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '10px'
            }}>
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>Price Change</h2>
              <button 
                onClick={() => setShowPriceChangeModal(false)}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '24px',
                  fontWeight: 'bold'
                }}
              >
                ×
              </button>
            </div>
            
            <div style={{ borderBottom: '1px solid #001f5c', marginBottom: '20px' }}></div>
            
            {showConfirmation && (
              <div style={{ 
                color: 'darkgreen',
                textAlign: 'center',
                margin: '10px 0 20px',
                fontWeight: 'bold',
                fontSize: '16px',
                backgroundColor: '#d4edda',
                padding: '10px',
                borderRadius: '4px'
              }}>
                Prices updated successfully!
              </div>
            )}
            
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '20px',
              marginBottom: '20px'
            }}>
              {/* Short Stay Prices */}
              <div style={{ 
                backgroundColor: '#f5f5f5',
                padding: '20px',
                borderRadius: '8px'
              }}>
                <h3 style={{ 
                  textAlign: 'center',
                  color: '#001f5c',
                  borderBottom: '2px solid #001f5c',
                  paddingBottom: '10px',
                  marginTop: '0',
                  marginBottom: '20px',
                  fontSize: '20px'
                }}>Short Stay Prices</h3>

                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0' }}> {/* Changed vertical spacing from 25px to 0 */}
                  <tbody>
                    <tr>
                      {/* Increased width for label column */}
                      <td style={{ fontWeight: 'bold', width: '130px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>Base Rate:</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span style={{ whiteSpace: 'nowrap', minWidth: '80px' }}>Regular: $</span>
                          <input 
                            type="number" 
                            value={shortStayPrices.baseRate.withoutJacuzzi} 
                            onChange={(e) => setShortStayPrices({
                              ...shortStayPrices,
                              baseRate: { ...shortStayPrices.baseRate, withoutJacuzzi: parseFloat(e.target.value) }
                            })} 
                            style={{ 
                              width: '80px', // Adjusted width slightly
                              padding: '8px',
                              border: '1px solid #ccc',
                              borderRadius: '4px',
                              fontSize: '16px',
                              marginLeft: '5px'
                            }}
                          />
                        </div>
                      </td>
                      {/* Added paddingLeft for spacing */}
                      <td style={{ paddingLeft: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span style={{ whiteSpace: 'nowrap', minWidth: '80px' }}>Jacuzzi: $</span>
                          <input 
                            type="number" 
                            value={shortStayPrices.baseRate.withJacuzzi} 
                            onChange={(e) => setShortStayPrices({
                              ...shortStayPrices,
                              baseRate: { ...shortStayPrices.baseRate, withJacuzzi: parseFloat(e.target.value) }
                            })} 
                            style={{ 
                              width: '80px', // Adjusted width slightly
                              padding: '8px',
                              border: '1px solid #ccc',
                              borderRadius: '4px',
                              fontSize: '16px',
                              marginLeft: '5px'
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                    <tr>
                      {/* Increased width for label column */}
                      <td style={{ fontWeight: 'bold', width: '130px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>Extra Hour:</td>
                      {/* Added paddingLeft to this cell */}
                      <td style={{ paddingLeft: '6px' }}> 
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span style={{ whiteSpace: 'nowrap', minWidth: '80px' }}>Regular: $</span>
                          <input 
                            type="number" 
                            value={shortStayPrices.extraHourRate.regular} 
                            onChange={(e) => setShortStayPrices({
                              ...shortStayPrices,
                              extraHourRate: { ...shortStayPrices.extraHourRate, regular: parseFloat(e.target.value) }
                            })} 
                            style={{ 
                              width: '80px', // Adjusted width slightly
                              padding: '8px',
                              border: '1px solid #ccc',
                              borderRadius: '4px',
                              fontSize: '16px',
                              marginLeft: '5px'
                            }}
                          />
                        </div>
                      </td>
                      {/* Added paddingLeft for spacing */}
                      <td style={{ paddingLeft: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span style={{ whiteSpace: 'nowrap', minWidth: '95px' }}>Discounted: $</span>
                          <input 
                            type="number" 
                            value={shortStayPrices.extraHourRate.discounted} 
                            onChange={(e) => setShortStayPrices({
                              ...shortStayPrices,
                              extraHourRate: { ...shortStayPrices.extraHourRate, discounted: parseFloat(e.target.value) }
                            })} 
                            style={{ 
                              width: '80px', // Adjusted width slightly
                              padding: '8px',
                              border: '1px solid #ccc',
                              borderRadius: '4px',
                              fontSize: '16px',
                              marginLeft: '5px'
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Regular Room Prices */}
              <div style={{
                backgroundColor: '#f5f5f5',
                padding: '20px',
                borderRadius: '8px'
              }}>
                <h3 style={{ 
                  textAlign: 'center',
                  color: '#001f5c', 
                  borderBottom: '2px solid #001f5c',
                  paddingBottom: '10px',
                  marginTop: '0',
                  marginBottom: '20px',
                  fontSize: '20px'
                }}>
                  Regular Room
                </h3>
                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 15px' }}>
                  <tbody>
                    <tr>
                      <td style={{ fontWeight: 'bold', width: '120px', verticalAlign: 'middle' }}>Weekday:</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span style={{ marginRight: '8px' }}>$</span>
                          <input 
                            type="number" 
                            value={prices.weekday.withoutJacuzzi} 
                            onChange={(e) => setPrices({
                              ...prices,
                              weekday: { ...prices.weekday, withoutJacuzzi: parseFloat(e.target.value) }
                            })} 
                            style={{ 
                              width: '100px',
                              padding: '8px',
                              border: '1px solid #ccc',
                              borderRadius: '4px',
                              fontSize: '16px'
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 'bold', width: '120px', verticalAlign: 'middle' }}>Friday:</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span style={{ marginRight: '8px' }}>$</span>
                          <input 
                            type="number" 
                            value={prices.friday.withoutJacuzzi} 
                            onChange={(e) => setPrices({
                              ...prices,
                              friday: { ...prices.friday, withoutJacuzzi: parseFloat(e.target.value) }
                            })} 
                            style={{ 
                              width: '100px',
                              padding: '8px',
                              border: '1px solid #ccc',
                              borderRadius: '4px',
                              fontSize: '16px'
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 'bold', width: '120px', verticalAlign: 'middle' }}>Weekend:</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span style={{ marginRight: '8px' }}>$</span>
                          <input 
                            type="number" 
                            value={prices.weekend.withoutJacuzzi} 
                            onChange={(e) => setPrices({
                              ...prices,
                              weekend: { ...prices.weekend, withoutJacuzzi: parseFloat(e.target.value) }
                            })} 
                            style={{ 
                              width: '100px',
                              padding: '8px',
                              border: '1px solid #ccc',
                              borderRadius: '4px',
                              fontSize: '16px'
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Jacuzzi Room Prices */}
            <div style={{ 
              backgroundColor: '#f5f5f5',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '30px'
            }}>
              <h3 style={{ 
                textAlign: 'center',
                color: '#001f5c', 
                borderBottom: '2px solid #001f5c',
                paddingBottom: '10px',
                marginTop: '0',
                marginBottom: '20px',
                fontSize: '20px'
              }}>
                Jacuzzi Room
              </h3>
              <table style={{ width: '100%', tableLayout: 'fixed' }}> {/* Use fixed table layout */} 
                <tbody>
                  <tr>
                    {/* Adjusted padding and label width */}
                    <td style={{ width: '33.33%', padding: '0 5px 0 0' }}> 
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontWeight: 'bold', width: '90px', whiteSpace: 'nowrap' }}>Weekday:</span>
                        <span style={{ marginRight: '8px' }}>$</span>
                        <input 
                          type="number" 
                          value={prices.weekday.withJacuzzi} 
                          onChange={(e) => setPrices({
                            ...prices,
                            weekday: { ...prices.weekday, withJacuzzi: parseFloat(e.target.value) }
                          })} 
                          style={{ 
                            width: '100%', // Use full width within cell
                            padding: '8px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            fontSize: '16px'
                          }}
                        />
                      </div>
                    </td>
                    {/* Adjusted padding and label width */}
                    <td style={{ width: '33.33%', padding: '0 5px' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontWeight: 'bold', width: '90px', whiteSpace: 'nowrap' }}>Friday:</span>
                        <span style={{ marginRight: '8px' }}>$</span>
                        <input 
                          type="number" 
                          value={prices.friday.withJacuzzi} 
                          onChange={(e) => setPrices({
                            ...prices,
                            friday: { ...prices.friday, withJacuzzi: parseFloat(e.target.value) }
                          })} 
                          style={{ 
                            width: '100%', // Use full width within cell
                            padding: '8px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            fontSize: '16px'
                          }}
                        />
                      </div>
                    </td>
                    {/* Adjusted padding and label width */}
                    <td style={{ width: '33.33%', padding: '0 0 0 5px' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontWeight: 'bold', width: '90px', whiteSpace: 'nowrap' }}>Weekend:</span>
                        <span style={{ marginRight: '8px' }}>$</span>
                        <input 
                          type="number" 
                          value={prices.weekend.withJacuzzi} 
                          onChange={(e) => setPrices({
                            ...prices,
                            weekend: { ...prices.weekend, withJacuzzi: parseFloat(e.target.value) }
                          })} 
                          style={{ 
                            width: '100%', // Use full width within cell
                            padding: '8px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            fontSize: '16px'
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ 
              textAlign: 'center'
            }}>
              <button 
                onClick={() => {
                  handlePriceUpdate();
                  setShowPriceChangeModal(false);
                }}
                style={{ 
                  backgroundColor: '#001f5c',
                  padding: '12px 30px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  borderRadius: '5px',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  width: '200px'
                }}
              >
                Update Prices
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to render the rooms section
const renderRoomsSection = () => (
  <div className="rooms-section" style={{ 
    backgroundColor: '#f5f5f5',
            padding: '20px',
  }}>
    {/* ... Content of the rooms section (Header, Filters, Accordions) ... */}
    {/* This includes the h2, filters, ground floor, first floor divs */}
    </div>
  );

export default App;