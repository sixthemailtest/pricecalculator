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
        { number: "101", type: "standard", beds: "queen", status: "available", smoking: false, handicap: false },
        { number: "102", type: "standard", beds: "queen", status: "available", smoking: true, handicap: false },
        { number: "103", type: "standard", beds: "double", status: "available", smoking: false, handicap: false },
        { number: "104", type: "standard", beds: "queen", status: "available", smoking: true, handicap: false },
        { number: "105", type: "standard", beds: "double", status: "available", smoking: false, handicap: false },
        { number: "106", type: "standard", beds: "queen", status: "available", smoking: false, handicap: false },
        { number: "107", type: "standard", beds: "double", status: "available", smoking: false, handicap: false },
        { number: "108", type: "standard", beds: "queen", status: "available", smoking: false, handicap: true },
        { number: "109", type: "jacuzzi", beds: "queen", status: "available", smoking: false, handicap: false },
        { number: "110", type: "jacuzzi", beds: "queen", status: "available", smoking: true, handicap: false },
        { number: "111", type: "jacuzzi", beds: "queen", status: "available", smoking: false, handicap: false },
        { number: "112", type: "jacuzzi", beds: "queen", status: "available", smoking: true, handicap: false },
        { number: "114", type: "standard", beds: "queen", status: "available", smoking: false},
        { number: "119", type: "jacuzzi", beds: "queen", status: "available", smoking: true, handicap: false, onlineBookingOnly: true }
      ],
      firstFloor: [
        { number: "200", type: "standard", beds: "queen", status: "available", smoking: false, handicap: false },
        { number: "201", type: "standard", beds: "double", status: "available", smoking: false, handicap: false },
        { number: "202", type: "standard", beds: "queen", status: "available", smoking: false, handicap: false },
        { number: "203", type: "standard", beds: "double", status: "available", smoking: false, handicap: false },
        { number: "204", type: "standard", beds: "queen", status: "available", smoking: true, handicap: true },
        { number: "205", type: "standard", beds: "double", status: "available", smoking: false, handicap: false },
        { number: "206", type: "standard", beds: "queen", status: "available", smoking: true, handicap: false },
        { number: "207", type: "standard", beds: "double", status: "available", smoking: true, handicap: false },
        { number: "208", type: "jacuzzi", beds: "king", status: "available", smoking: false, handicap: false },
        { number: "209", type: "standard", beds: "queen", status: "available", smoking: false, handicap: false },
        { number: "210", type: "jacuzzi", beds: "king", status: "available", smoking: true, handicap: false },
        { number: "211", type: "standard", beds: "king", status: "available", smoking: true, handicap: false },
        { number: "212", type: "standard", beds: "king", status: "available", smoking: false, handicap: false },
        { number: "214", type: "jacuzzi", beds: "king", status: "available", smoking: false, handicap: false },
        { number: "215", type: "standard", beds: "double", status: "available", smoking: false, handicap: true },
        { number: "216", type: "standard", beds: "queen", status: "available", smoking: false, handicap: false },
        { number: "217", type: "standard", beds: "double", status: "available", smoking: false, handicap: false },
        { number: "218", type: "standard", beds: "double", status: "available", smoking: false, handicap: false },
        { number: "219", type: "standard", beds: "double", status: "available", smoking: true, handicap: false },
        { number: "220", type: "standard", beds: "queen", status: "available", smoking: false, handicap: false },
        { number: "221", type: "standard", beds: "king", status: "available", smoking: false, handicap: false },
        { number: "222", type: "standard", beds: "king", status: "available", smoking: false, handicap: false },
        { number: "223", type: "standard", beds: "king", status: "available", smoking: false, handicap: false },
        { number: "224", type: "standard", beds: "queen", status: "available", smoking: false, handicap: false },
        { number: "225", type: "standard", beds: "king", status: "available", smoking: false, handicap: false }
      ]
    };
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
  
  // Initialize date and time on component mount and set up timer
  useEffect(() => {
    // Clear localStorage for rooms data to force reset
    localStorage.removeItem('roomsData');
    
    // Reset rooms with the updated configuration
    const updatedRooms = {
      groundFloor: [
        { number: "101", type: "standard", beds: "queen", status: "available", smoking: false, handicap: false },
        { number: "102", type: "standard", beds: "queen", status: "available", smoking: true, handicap: false },
        { number: "103", type: "standard", beds: "double", status: "available", smoking: false, handicap: false },
        { number: "104", type: "standard", beds: "queen", status: "available", smoking: true, handicap: false },
        { number: "105", type: "standard", beds: "double", status: "available", smoking: false, handicap: false },
        { number: "106", type: "standard", beds: "queen", status: "available", smoking: false, handicap: false },
        { number: "107", type: "standard", beds: "double", status: "available", smoking: false, handicap: false },
        { number: "108", type: "standard", beds: "queen", status: "available", smoking: false, handicap: true },
        { number: "109", type: "jacuzzi", beds: "queen", status: "available", smoking: false, handicap: false },
        { number: "110", type: "jacuzzi", beds: "queen", status: "available", smoking: true, handicap: false },
        { number: "111", type: "jacuzzi", beds: "queen", status: "available", smoking: false, handicap: false },
        { number: "112", type: "jacuzzi", beds: "queen", status: "available", smoking: true, handicap: false },
        { number: "114", type: "standard", beds: "queen", status: "available", smoking: false},
        { number: "119", type: "jacuzzi", beds: "queen", status: "available", smoking: true, handicap: false, onlineBookingOnly: true }
      ],
      firstFloor: [
        { number: "200", type: "standard", beds: "queen", status: "available", smoking: false, handicap: false },
        { number: "201", type: "standard", beds: "double", status: "available", smoking: false, handicap: false },
        { number: "202", type: "standard", beds: "queen", status: "available", smoking: false, handicap: false },
        { number: "203", type: "standard", beds: "double", status: "available", smoking: false, handicap: false },
        { number: "204", type: "standard", beds: "queen", status: "available", smoking: true, handicap: true },
        { number: "205", type: "standard", beds: "double", status: "available", smoking: false, handicap: false },
        { number: "206", type: "standard", beds: "queen", status: "available", smoking: true, handicap: false },
        { number: "207", type: "standard", beds: "double", status: "available", smoking: true, handicap: false },
        { number: "208", type: "jacuzzi", beds: "king", status: "available", smoking: false, handicap: false },
        { number: "209", type: "standard", beds: "queen", status: "available", smoking: false, handicap: false },
        { number: "210", type: "jacuzzi", beds: "king", status: "available", smoking: true, handicap: false },
        { number: "211", type: "standard", beds: "king", status: "available", smoking: true, handicap: false },
        { number: "212", type: "standard", beds: "king", status: "available", smoking: false, handicap: false },
        { number: "214", type: "jacuzzi", beds: "king", status: "available", smoking: false, handicap: false },
        { number: "215", type: "standard", beds: "double", status: "available", smoking: false, handicap: true },
        { number: "216", type: "standard", beds: "queen", status: "available", smoking: false, handicap: false },
        { number: "217", type: "standard", beds: "double", status: "available", smoking: false, handicap: false },
        { number: "218", type: "standard", beds: "double", status: "available", smoking: false, handicap: false },
        { number: "219", type: "standard", beds: "double", status: "available", smoking: true, handicap: false },
        { number: "220", type: "standard", beds: "queen", status: "available", smoking: false, handicap: false },
        { number: "221", type: "standard", beds: "king", status: "available", smoking: false, handicap: false },
        { number: "222", type: "standard", beds: "king", status: "available", smoking: false, handicap: false },
        { number: "223", type: "standard", beds: "king", status: "available", smoking: false, handicap: false },
        { number: "224", type: "standard", beds: "queen", status: "available", smoking: false, handicap: false },
        { number: "225", type: "standard", beds: "king", status: "available", smoking: false, handicap: false }
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
    
    // If in rooms tab, reload the page to force refresh room data
    if (activeTab === 'rooms') {
      // Clear localStorage
      localStorage.removeItem('roomsData');
      window.location.reload();
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
    if (activeTab === 'multiple' || openBookingModal) { // Added check for openBookingModal
      const currentPricing = calculateOvernightPrice();
      
      // Define compact styles conditionally
      const isModal = !!openBookingModal;
      const summaryPadding = isModal ? '10px' : '20px';
      const headerFontSize = isModal ? '14px' : '18px';
      const itemFontSize = isModal ? '12px' : '14px';
      const subItemFontSize = isModal ? '11px' : '12px';
      const totalFontSize = isModal ? '14px' : '18px';
      const sectionMargin = isModal ? '10px 0' : '20px 0';
      const savedStayPadding = isModal ? '10px' : '15px';
      const savedStayMargin = isModal ? '10px' : '15px';
      const savedStayFontSize = isModal ? '12px' : '14px';
      const savedStaySubFontSize = isModal ? '11px' : '13px';
      const savedStayPriceFontSize = isModal ? '14px' : '16px';
      const buttonFontSize = isModal ? '9px' : '10px';
      const removeButtonFontSize = isModal ? '10px' : '12px';
      const totalSectionFontSize = isModal ? '16px' : '18px';
      const totalValueFontSize = isModal ? '18px' : '20px';

      if (activeTab === 'multiple' && !isModal) { // Logic for the main multiple stays tab
          return (
            <div className="price-summary" style={{ 
              backgroundColor: '#fff',
              padding: summaryPadding,
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              margin: sectionMargin
            }}>
              <h3 style={{ 
                color: '#001f5c',
                borderBottom: '2px solid #001f5c',
                paddingBottom: '10px',
                marginBottom: '15px',
                fontSize: headerFontSize
              }}>Price Summary</h3>

              {/* Saved Stays Section */}
              {savedStays.length > 0 && (
                <div className="saved-stays-section">
                  {savedStays.map((stay, index) => (
                    <div key={stay.id} className="saved-stay" style={{ 
                      marginBottom: savedStayMargin, 
                      padding: savedStayPadding, 
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
                                fontSize: savedStayFontSize, // Adjusted
                                color: '#001f5c',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              Stay #{index+ 1}
                            </span>
                            <button
                              style={{ // Adjusted button styles
                                background: '#001f5c',
                                border: 'none',
                                color: '#fff',
                                cursor: 'pointer',
                                padding: '2px 4px',
                                fontSize: buttonFontSize,
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
                            flex: '1',
                            justifyContent: 'flex-end'
                          }}>
                            <span 
                              className="stay-price"
                              style={{ 
                                fontWeight: 'bold', 
                                color: '#001f5c',
                                fontSize: savedStayPriceFontSize, // Adjusted
                                marginLeft: 'auto'
                              }}
                            >
                              ${stay.price.toFixed(2)}
                            </span>
                            <button 
                              className="remove-button"
                              onClick={() => removeSavedStay(stay.id)}
                              style={{ // Adjusted button styles
                                background: '#dc3545',
                                border: 'none',
                                color: '#fff',
                                fontSize: removeButtonFontSize,
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
                        <div style={{ fontSize: savedStayFontSize, color: '#000' }}> {/* Adjusted */}
                          {stay.checkInDay} ({stay.checkIn.toLocaleDateString()}) to {stay.checkOutDay} ({stay.checkOut.toLocaleDateString()})
                        </div>
                        <div style={{ fontSize: savedStayFontSize, color: '#000', marginTop: '4px' }}> {/* Adjusted */}
                          {stay.nights} {stay.nights === 1 ? 'night' : 'nights'}
                          {stay.hasJacuzzi ? ' • Jacuzzi' : ''}
                          {' • '}{stay.bedType.charAt(0).toUpperCase() + stay.bedType.slice(1)} Bed
                          {stay.checkInAdjustment !== 0 && ` • CI ${stay.checkInAdjustment > 0 ? `+${stay.checkInAdjustment}h` : `${stay.checkInAdjustment}h`}`} {/* Shortened */} 
                          {stay.checkOutAdjustment !== 0 && ` • CO ${stay.checkOutAdjustment > 0 ? `+${stay.checkOutAdjustment}h` : `${stay.checkOutAdjustment}h`}`} {/* Shortened */} 
                        </div>
                      </div>
                      <div style={{ 
                        fontSize: savedStaySubFontSize, // Adjusted
                        color: '#000', 
                        backgroundColor: '#f0f0f0',
                        padding: '8px', // Adjusted
                        borderRadius: '6px',
                        marginTop: '8px'
                      }}>
                        <div className="summary-line" style={{ 
                          display: 'flex', 
                          flexDirection: 'column',
                          gap: '3px' // Adjusted
                        }}>
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            borderBottom: '1px solid #ddd',
                            paddingBottom: '3px', // Adjusted
                            marginBottom: '3px' // Adjusted
                          }}>
                            <span>Base ({stay.nights}n):</span> {/* Shortened */} 
                            <span>${stay.basePrice.toFixed(2)}</span>
                          </div>
                          {stay.details.daysBreakdown.map((day, idx) => (
                            <div key={idx} style={{ 
                              display: 'flex', 
                              justifyContent: 'space-between',
                              fontSize: subItemFontSize, // Adjusted
                              color: '#444'
                            }}>
                              <span>{day.day}:</span>
                              <span>${day.basePrice.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                        {stay.tax > 0 && (
                          <div className="summary-line" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px', marginTop: '6px' }}> {/* Adjusted */}
                            <span>Tax (15%):</span>
                            <span>${stay.tax.toFixed(2)}</span>
                          </div>
                        )}
                        {stay.extraHoursCheckIn > 0 && (
                          <div className="summary-line" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}> {/* Adjusted */}
                            <span>CI Hours ({stay.checkInAdjustment > 0 ? `+${stay.checkInAdjustment}h` : `${Math.abs(stay.checkInAdjustment)}h`}):</span> {/* Shortened */} 
                            <span>${stay.extraHoursCheckIn.toFixed(2)}</span>
                          </div>
                        )}
                        {stay.extraHoursCheckOut > 0 && (
                          <div className="summary-line" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}> {/* Adjusted */}
                            <span>CO Hours ({stay.checkOutAdjustment > 0 ? `+${stay.checkOutAdjustment}h` : `${Math.abs(stay.checkOutAdjustment)}h`}):</span> {/* Shortened */} 
                            <span>${stay.extraHoursCheckOut.toFixed(2)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  <div className="summary-line total" style={{ 
                    marginTop: '15px', // Adjusted
                    borderTop: '2px solid #001f5c',
                    paddingTop: '10px', // Adjusted
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: totalSectionFontSize, // Adjusted
                    fontWeight: 'bold'
                  }}>
                    <span style={{ color: '#001f5c' }}>Total Price:</span>
                    <span style={{ color: '#001f5c', fontSize: totalValueFontSize }}> {/* Adjusted */} 
                      ${totalStaysPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              {savedStays.length === 0 && (
                <p style={{ 
                  textAlign: 'center', 
                  color: '#000', 
                  padding: '20px', // Adjusted
                  backgroundColor: '#f8f9fa',
                  borderRadius: '6px',
                  fontSize: itemFontSize // Adjusted
                }}>
                  Select dates and click "Add Stay" to begin adding stays
                </p>
              )}
            </div>
          );
      }

      // Logic for single overnight stay (used in modal and potentially old overnight tab)
      if (!checkInDate || !checkOutDate) {
        return <p style={{ fontSize: itemFontSize }}>Please select check-in and check-out dates.</p>;
      }

      const pricing = calculateOvernightPrice();
      const totalPrice = pricing.totalPrice;
      const totalNights = pricing.nights;

      return (
        <div className="price-summary" style={{ 
          padding: isModal ? '5px 0' : '15px', // Reduced padding for modal
          fontSize: itemFontSize 
        }}>
          <h3 style={{ 
            fontSize: headerFontSize, 
            color: '#001f5c', 
            borderBottom: isModal ? '1px solid #ccc' : '2px solid #001f5c', 
            paddingBottom: isModal ? '5px' : '10px', 
            marginBottom: isModal ? '8px' : '15px'
          }}>
            Price Summary
          </h3>
          
          <div className="summary-section">
            <div className="summary-line" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: isModal ? '3px' : '4px' }}>
              <span>Duration:</span>
              <span>{pricing.nights} {pricing.nights === 1 ? 'Night' : 'Nights'}</span>
            </div>
            
            {totalNights === 7 && (
              <div className="summary-line" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: isModal ? '3px' : '4px' }}>
                <span>Weekly Rate:</span>
                <span>${(() => {
                  let baseRate = hasJacuzziOvernight ? 695 : 675;
                  if (bedType === 'king') {
                    baseRate += (5 * 7); 
                  } else if (bedType === 'double') {
                    baseRate += (10 * 7);
                  }
                  return baseRate.toFixed(2);
                })()}</span>
              </div>
            )}
            
            {totalNights !== 7 && (
              <>
                {pricing.daysBreakdown.map((day, index) => (
                  <div key={index} className="summary-line" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: isModal ? '2px' : '4px', fontSize: subItemFontSize, color: '#444' }}>
                    <span>{day.day}:</span>
                    <span>${day.basePrice.toFixed(2)}</span>
                  </div>
                ))}
                <div className="summary-line" style={{ borderTop: '1px solid #eee', marginTop: isModal ? '4px' : '8px', paddingTop: isModal ? '4px' : '8px', display: 'flex', justifyContent: 'space-between', marginBottom: isModal ? '3px' : '4px' }}>
                  <span>Total Base:</span>
                  <span>${pricing.totalBasePrice.toFixed(2)}</span>
                </div>
              </>
            )}
            
            {totalNights < 7 && pricing.taxAmount > 0 && (
              <div className="summary-line" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: isModal ? '3px' : '4px' }}>
                <span>Tax (15%):</span>
                <span>${pricing.taxAmount.toFixed(2)}</span>
              </div>
            )}
            
            {overnightExtraHours !== 0 && pricing.extraHoursCheckInCost > 0 && (
              <div className="summary-line" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: isModal ? '3px' : '4px' }}>
                <span>CI Hours ({overnightExtraHours > 0 ? `+${overnightExtraHours}h` : `${Math.abs(overnightExtraHours)}h`}):</span>
                <span>${pricing.extraHoursCheckInCost.toFixed(2)}</span>
              </div>
            )}
            
            {overnightCheckoutExtraHours !== 0 && pricing.extraHoursCheckOutCost > 0 && (
              <div className="summary-line" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: isModal ? '3px' : '4px' }}>
                <span>CO Hours ({overnightCheckoutExtraHours > 0 ? `+${overnightCheckoutExtraHours}h` : `${Math.abs(overnightCheckoutExtraHours)}h`}):</span>
                <span>${pricing.extraHoursCheckOutCost.toFixed(2)}</span>
              </div>
            )}
            
            <div className="summary-line total" style={{ borderTop: '1px solid #aaa', marginTop: isModal ? '6px' : '8px', paddingTop: isModal ? '6px' : '8px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: totalFontSize }}>
              <span>Total Price:</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      );
    }
    return null; // Return null if not the right tab and modal isn't open
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
        } else if (room.beds === 'double') {
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
          } else if (room.beds === 'double') {
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
      } else if (room.beds === 'double') {
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
  const [openBookingModal, setOpenBookingModal] = useState(null); // Track which room has booking modal open
  
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
        case 'queen':
          return room.beds === 'queen';
        case 'king':
          return room.beds === 'king';
        case 'double':
          return room.beds === 'double';
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
              backgroundColor: activeTab === 'short' ? '#6495ED' : '#001f5c',
              color: '#ffffff'
            }}
          >
            Short Stay
          </button>
          <button 
            className={`tab-button ${activeTab === 'multiple' ? 'active' : ''}`} 
            onClick={() => setActiveTab('multiple')}
            style={{
              backgroundColor: activeTab === 'multiple' ? '#6495ED' : '#001f5c',
              color: '#ffffff'
            }}
          >
            Multiple Nights
          </button>
          <button 
            className={`tab-button ${activeTab === 'rooms' ? 'active' : ''}`} 
            onClick={() => setActiveTab('rooms')}
            style={{
              backgroundColor: activeTab === 'rooms' ? '#6495ED' : '#001f5c',
              color: '#ffffff'
            }}
          >
            Rooms
          </button>
          <button 
            className={`tab-button ${activeTab === 'changePrice' ? 'active' : ''}`} 
            onClick={() => setActiveTab('changePrice')}
            style={{
              backgroundColor: activeTab === 'changePrice' ? '#6495ED' : '#001f5c',
              color: '#ffffff'
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
              
              {/* Daily Room Prices */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                marginBottom: '15px', 
                gap: '15px',
                backgroundColor: '#fffbe5', /* Light yellow background */
                padding: '8px 15px',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '5px', 
                  fontWeight: 'bold',
                  color: '#333'
                }}>
                  <span>Standard - ${(() => {
                    const now = new Date();
                    const day = now.getDay(); // 0 is Sunday, 6 is Saturday
                    if (day === 5) { // Friday
                      return prices.friday.withoutJacuzzi.toFixed(2);
                    } else if (day === 0 || day === 6) { // Weekend (Sunday or Saturday)
                      return prices.weekend.withoutJacuzzi.toFixed(2);
                    } else { // Weekday
                      return prices.weekday.withoutJacuzzi.toFixed(2);
                    }
                  })()}</span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '5px', 
                  fontWeight: 'bold',
                  color: '#333'
                }}>
                  <span>Jacuzzi - ${(() => {
                    const now = new Date();
                    const day = now.getDay(); // 0 is Sunday, 6 is Saturday
                    if (day === 5) { // Friday
                      return prices.friday.withJacuzzi.toFixed(2);
                    } else if (day === 0 || day === 6) { // Weekend (Sunday or Saturday)
                      return prices.weekend.withJacuzzi.toFixed(2);
                    } else { // Weekday
                      return prices.weekday.withJacuzzi.toFixed(2);
                    }
                  })()}</span>
                </div>
              </div>
              
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
                      Queen 2 Beds
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
                        ? `${Math.abs(overnightExtraHours)} hrs before (${new Date(new Date().setHours(15 + overnightExtraHours, 0, 0, 0)).toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'})})` 
                        : overnightExtraHours > 0 
                        ? `${overnightExtraHours} hrs after (${new Date(new Date().setHours(15 + overnightExtraHours, 0, 0, 0)).toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'})})` 
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
                        ? `${Math.abs(overnightCheckoutExtraHours)} hrs before (${new Date(new Date().setHours(11 + overnightCheckoutExtraHours, 0, 0, 0)).toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'})})` 
                        : overnightCheckoutExtraHours > 0 
                        ? `${overnightCheckoutExtraHours} hrs after (${new Date(new Date().setHours(11 + overnightCheckoutExtraHours, 0, 0, 0)).toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'})})` 
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
                      Queen 2 Beds
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
                      backgroundColor: selectedFilters.length === 0 && !changeStatusMode ? '#001f5c' : '#f0f0f0',
                      color: selectedFilters.length === 0 && !changeStatusMode ? '#fff' : '#333',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: selectedFilters.length === 0 && !changeStatusMode ? 'bold' : 'normal',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span style={{ fontSize: '16px' }}>🏠</span>
                    All Rooms
                  </button>
                  
                  {/* Change Status Filter */}
                  <button
                    onClick={() => handleFilterClick('change-status')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '20px',
                      border: 'none',
                      backgroundColor: '#9ee589',
                      color: '#333',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 'normal',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span style={{ fontSize: '16px' }}>🔄</span>
                    Change Room Status
                  </button>
                  
                  {/* Clear All Rooms Status Button */}
                  <button
                    onClick={(e) => {
                      // Check authentication before clearing all rooms
                      if (isAuthenticated) {
                        clearAllRoomStatus();
                      } else {
                        setShowLoginModal(true);
                      }
                    }}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '20px',
                      border: 'none',
                      backgroundColor: '#f0f0f0',
                      color: '#333',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 'normal',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span style={{ fontSize: '16px' }}>🗑️</span>
                    Clear all rooms status
                  </button>
                  
                  {/* Status Filters */}
                  <button
                    onClick={() => handleFilterClick('available')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '20px',
                      border: 'none',
                      backgroundColor: selectedFilters.includes('available') ? '#001f5c' : '#f0f0f0',
                      color: selectedFilters.includes('available') ? '#fff' : '#333',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: selectedFilters.includes('available') ? 'bold' : 'normal',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span style={{ fontSize: '16px' }}>✅</span>
                    Available
                  </button>
                  <button
                    onClick={() => handleFilterClick('occupied')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '20px',
                      border: 'none',
                      backgroundColor: selectedFilters.includes('occupied') ? '#001f5c' : '#f0f0f0',
                      color: selectedFilters.includes('occupied') ? '#fff' : '#333',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: selectedFilters.includes('occupied') ? 'bold' : 'normal',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span style={{ fontSize: '16px' }}>🚫</span>
                    Occupied
                  </button>
                  
                  {/* Room Type Filters */}
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
                  
                  {/* Handicap Accessible Filter */}
                  <button
                    onClick={() => handleFilterClick('handicap')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '20px',
                      border: 'none',
                      backgroundColor: selectedFilters.includes('handicap') ? '#001f5c' : '#f0f0f0',
                      color: selectedFilters.includes('handicap') ? '#fff' : '#333',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: selectedFilters.includes('handicap') ? 'bold' : 'normal',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span style={{ fontSize: '16px' }}>♿</span>
                    Handicap
                  </button>
                  
                  {/* Online Booking Only Filter */}
                  <button
                    onClick={() => handleFilterClick('online-booking-only')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '20px',
                      border: 'none',
                      backgroundColor: selectedFilters.includes('online-booking-only') ? '#001f5c' : '#f0f0f0',
                      color: selectedFilters.includes('online-booking-only') ? '#fff' : '#333',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: selectedFilters.includes('online-booking-only') ? 'bold' : 'normal',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span style={{ fontSize: '16px' }}>🌐</span>
                    Online Booking Only
                  </button>
                  
                  {/* Smoking Filters */}
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
                  
                  {/* Bed Type Filters */}
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
                            className={`room-card ${room.status === 'available' ? '' : room.status === 'cleared' ? 'cleared' : 'occupied'}`}
                            onClick={() => handleRoomCardClick('groundFloor', room.number)}
                            style={{
                              backgroundColor: room.status === 'cleared' ? '#e0e0e0' : undefined,
                              borderColor: room.status === 'cleared' ? '#c0c0c0' : undefined,
                              padding: '8px', // Reduced padding
                              minHeight: 'auto' // Remove minimum height
                            }}
                          >
                            {/* Room details - restructured as flex layout */}
                            <div className="room-detail" style={{ display: 'flex' }}>
                              {/* Left side - Room information */}
                              <div style={{ 
                                flex: '1', 
                                minWidth: '0', 
                                paddingBottom: '10px' 
                              }}>
                              <div className="room-number">
                                Room {room.number}
                                <span 
                                  className={`clock-icon ${checkoutAlerts[room.number] ? 'shaking' : ''}`}
                                  style={{ 
                                    marginLeft: '8px', 
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center'
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                      // Verify user is authenticated before setting time or dismissing alerts
                                      if (!isAuthenticated) {
                                        setShowLoginModal(true);
                                        return;
                                      }
                                    if (checkoutAlerts[room.number]) {
                                      dismissCheckoutAlert(room.number);
                                    } else {
                                      setOpenTimePickerRoom(openTimePickerRoom === room.number ? null : room.number);
                                    }
                                  }}
                                >
                                    <span role="img" aria-label="clock" style={{ fontSize: '16px' }}>⏰</span>
                                  {roomSchedules[room.number]?.checkoutTime && (
                                    <span style={{ 
                                        fontSize: '11px', 
                                        marginLeft: '3px',
                                      color: '#007bff',
                                      fontWeight: 'bold'
                                    }}>
                                      {new Date(roomSchedules[room.number].checkoutTime).toLocaleTimeString([], {
                                        hour: 'numeric',
                                        minute: '2-digit',
                                        hour12: true
                                      })}
                                    </span>
                                  )}
                                </span>
                                  
                                  {/* Book button - small, dark blue */}
                                  {room.status === 'available' && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation(); // Prevent triggering the room card click
                                        setOpenBookingModal(room.number);
                                      }}
                                      style={{
                                        backgroundColor: '#001f5c', // Dark blue
                                        color: 'white',
                                        border: 'none',
                                        padding: '3px 7px', // Smaller
                                        borderRadius: '3px',
                                        cursor: 'pointer',
                                        marginLeft: '6px',
                                        fontSize: '9px',
                                        fontWeight: 'bold'
                                      }}
                                    >
                                      Book
                                    </button>
                                  )}
                                  
                                <button 
                                  className="reset-button"
                                    onClick={(e) => {
                                      // Check authentication before resetting room price
                                      if (isAuthenticated) {
                                        resetRoomPrice(e, room.number);
                                      } else {
                                        e.stopPropagation();
                                        setShowLoginModal(true);
                                      }
                                    }}
                                  style={{
                                      marginLeft: '6px',
                                      fontSize: '9px',
                                      padding: '1px 5px',
                                      borderRadius: '3px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  Clear
                                </button>
                              </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', marginTop: '3px', marginBottom: '5px' }}>
                                  <div className="room-status" style={{
                                    display: 'inline-block',
                                    padding: '1px 5px',
                                    borderRadius: '3px',
                                    fontSize: '11px',
                                    backgroundColor: room.status === 'available' ? '#90ee90' : 
                                            room.status === 'cleared' ? '#c0c0c0' : '#ffb6c1',
                                    color: room.status === 'available' ? '#006400' : 
                                          room.status === 'cleared' ? '#505050' : '#8b0000'
                                  }}>
                                    {room.status === 'available' ? 'Available' : 
                                     room.status === 'cleared' ? 'Cleared' : 'Occupied'}
                                  </div>
                                  {room.type === 'jacuzzi' && <div style={{ padding: '1px 5px', borderRadius: '3px', fontSize: '11px', backgroundColor: '#e0f7fa', color: '#006064' }}>🛁 Jacuzzi</div>}
                                </div>
                                <div style={{ fontSize: '11px', marginTop: '3px' }}>
                                  {room.beds === 'queen' ? '👑 Queen Bed' : room.beds === 'king' ? '👑 King Bed' : '🛏️ Queen 2 Beds'}
                                  {room.handicap && <span style={{ marginLeft: '5px' }}>♿ Handicap</span>}
                                  {room.smoking ? 
                                    <span style={{ marginLeft: '5px', padding: '1px 5px', borderRadius: '3px', backgroundColor: '#ffebee', color: '#b71c1c', fontSize: '10px' }}>🚬 Smoking</span> : 
                                    <span style={{ marginLeft: '5px', padding: '1px 5px', borderRadius: '3px', backgroundColor: '#e8f5e9', color: '#1b5e20', fontSize: '10px' }}>🚭 Non-Smoking</span>
                                  }
                                  {room.onlineBookingOnly && <span style={{ marginLeft: '5px', backgroundColor: '#ffd700', color: '#000', padding: '0px 3px', borderRadius: '3px', fontSize: '10px', fontWeight: 'bold' }}>🌐 Online</span>}
                                </div>
                              </div>
                              
                              {/* Right side - Price information */}
                              <div style={{ 
                                width: '80px',
                                borderLeft: '1px solid #e0e0e0',
                                marginLeft: '5px',
                                paddingLeft: '5px',
                                paddingTop: '8px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center'
                              }}>
                                {(() => {
                                  // Determine today's pricing based on day of week
                                  const now = new Date();
                                  const day = now.getDay(); // 0 is Sunday, 6 is Saturday
                                  
                                  let basePrice;
                                  if (day === 5) { // Friday
                                    basePrice = room.type === 'jacuzzi' ? prices.friday.withJacuzzi : prices.friday.withoutJacuzzi;
                                  } else if (day === 0 || day === 6) { // Weekend (Sunday or Saturday)
                                    basePrice = room.type === 'jacuzzi' ? prices.weekend.withJacuzzi : prices.weekend.withoutJacuzzi;
                                  } else { // Weekday
                                    basePrice = room.type === 'jacuzzi' ? prices.weekday.withJacuzzi : prices.weekday.withoutJacuzzi;
                                  }
                                  
                                  const taxAmount = basePrice * 0.15;
                                  const totalPrice = basePrice + taxAmount;
                                  
                                  return (
                                    <>
                                      <div style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between',
                                        fontWeight: 'bold',
                                        fontSize: '11px',
                                      }}>
                                        <span>Rate:</span>
                                        <span>${basePrice.toFixed(2)}</span>
                                      </div>
                                      <div style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between',
                                        fontSize: '10px',
                                        color: '#666'
                                      }}>
                                        <span>Tax:</span>
                                        <span>${taxAmount.toFixed(2)}</span>
                                      </div>
                                      <div style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between',
                                        marginTop: '2px',
                                        paddingTop: '2px',
                                        borderTop: '1px dashed #ddd',
                                        fontWeight: 'bold',
                                        fontSize: '12px',
                                        color: '#001f5c'
                                      }}>
                                        <span>Total:</span>
                                        <span>${totalPrice.toFixed(2)}</span>
                                      </div>
                                    </>
                                  );
                                })()}
                              </div>
                            </div>
                              
                              {/* Checkout Alert Message */}
                              {checkoutAlerts[room.number] && (
                                <div 
                                  className="checkout-alert"
                                  style={{
                                    backgroundColor: '#ff6b6b',
                                    color: 'white',
                                  padding: '8px 10px',
                                    borderRadius: '4px',
                                  marginTop: '6px',
                                    fontWeight: 'bold',
                                    animation: 'shake 0.82s cubic-bezier(.36,.07,.19,.97) both infinite',
                                    transform: 'translate3d(0, 0, 0)',
                                    backfaceVisibility: 'hidden',
                                    perspective: '1000px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    boxShadow: '0 3px 6px rgba(0,0,0,0.2)',
                                  border: '1px solid #ff4d4d',
                                  fontSize: '11px'
                                  }}
                                >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <span style={{ fontSize: '16px' }}>⏰</span>
                                    <span>Checkout time for Room {room.number}</span>
                                  </div>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                    // Check authentication before dismissing alert
                                    if (isAuthenticated) {
                                      dismissCheckoutAlert(room.number);
                                    } else {
                                      setShowLoginModal(true);
                                    }
                                    }}
                                    style={{
                                      backgroundColor: 'white',
                                      color: '#ff6b6b',
                                      border: 'none',
                                      borderRadius: '50%',
                                    width: '18px',
                                    height: '18px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                    fontSize: '12px',
                                      cursor: 'pointer',
                                      fontWeight: 'bold'
                                    }}
                                  >
                                    ✕
                                  </button>
                                </div>
                              )}
                            
                            {/* Time Picker for Checkout - Manual Input */}
                            {openTimePickerRoom === room.number && (
                              <div 
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                  marginBottom: '8px',
                                  padding: '10px',
                                  backgroundColor: '#f0f0f0',
                                  borderRadius: '6px',
                                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                                }}
                              >
                                {/* Time picker content kept as is */}
                              </div>
                            )}
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
                            className={`room-card ${room.status === 'available' ? '' : room.status === 'cleared' ? 'cleared' : 'occupied'}`}
                            onClick={() => handleRoomCardClick('firstFloor', room.number)}
                            style={{
                              backgroundColor: room.status === 'cleared' ? '#e0e0e0' : undefined,
                              borderColor: room.status === 'cleared' ? '#c0c0c0' : undefined,
                              padding: '8px', // Reduced padding
                              minHeight: 'auto' // Remove minimum height
                            }}
                          >
                            {/* Room details - restructured as flex layout */}
                            <div className="room-detail" style={{ display: 'flex' }}>
                              {/* Left side - Room information */}
                              <div style={{ 
                                flex: '1', 
                                minWidth: '0', 
                                paddingBottom: '10px' 
                              }}>
                              <div className="room-number">
                                Room {room.number}
                                <span 
                                  className={`clock-icon ${checkoutAlerts[room.number] ? 'shaking' : ''}`}
                                  style={{ 
                                    marginLeft: '8px', 
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center'
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                      // Verify user is authenticated before setting time or dismissing alerts
                                      if (!isAuthenticated) {
                                        setShowLoginModal(true);
                                        return;
                                      }
                                    if (checkoutAlerts[room.number]) {
                                      dismissCheckoutAlert(room.number);
                                    } else {
                                      setOpenTimePickerRoom(openTimePickerRoom === room.number ? null : room.number);
                                    }
                                  }}
                                >
                                    <span role="img" aria-label="clock" style={{ fontSize: '16px' }}>⏰</span>
                                  {roomSchedules[room.number]?.checkoutTime && (
                                    <span style={{ 
                                        fontSize: '11px', 
                                        marginLeft: '3px',
                                      color: '#007bff',
                                      fontWeight: 'bold'
                                    }}>
                                      {new Date(roomSchedules[room.number].checkoutTime).toLocaleTimeString([], {
                                        hour: 'numeric',
                                        minute: '2-digit',
                                        hour12: true
                                      })}
                                    </span>
                                  )}
                                </span>
                                  
                                  {/* Book button - now before Clear button */}
                                  {room.status === 'available' && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation(); // Prevent triggering the room card click
                                        setOpenBookingModal(room.number);
                                      }}
                                      style={{
                                        backgroundColor: '#001f5c', // Dark blue
                                        color: 'white',
                                        border: 'none',
                                        padding: '1px 5px', // Smaller
                                        borderRadius: '3px',
                                        cursor: 'pointer',
                                        marginLeft: '6px',
                                        fontSize: '9px',
                                        fontWeight: 'bold'
                                      }}
                                    >
                                      Book
                                    </button>
                                  )}
                                  
                                <button 
                                  className="reset-button"
                                    onClick={(e) => {
                                      // Check authentication before resetting room price
                                      if (isAuthenticated) {
                                        resetRoomPrice(e, room.number);
                                      } else {
                                        e.stopPropagation();
                                        setShowLoginModal(true);
                                      }
                                    }}
                                  style={{
                                      marginLeft: '6px',
                                      fontSize: '9px',
                                      padding: '1px 5px',
                                      borderRadius: '3px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  Clear
                                </button>
                              </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', marginTop: '3px', marginBottom: '5px' }}>
                                  <div className="room-status" style={{
                                    display: 'inline-block',
                                    padding: '1px 5px',
                                    borderRadius: '3px',
                                    fontSize: '11px',
                                    backgroundColor: room.status === 'available' ? '#90ee90' : 
                                            room.status === 'cleared' ? '#c0c0c0' : '#ffb6c1',
                                    color: room.status === 'available' ? '#006400' : 
                                          room.status === 'cleared' ? '#505050' : '#8b0000'
                                  }}>
                                    {room.status === 'available' ? 'Available' : 
                                     room.status === 'cleared' ? 'Cleared' : 'Occupied'}
                                  </div>
                                  {room.type === 'jacuzzi' && <div style={{ padding: '1px 5px', borderRadius: '3px', fontSize: '11px', backgroundColor: '#e0f7fa', color: '#006064' }}>🛁 Jacuzzi</div>}
                                </div>
                                <div style={{ fontSize: '11px', marginTop: '3px' }}>
                                  {room.beds === 'queen' ? '👑 Queen Bed' : room.beds === 'king' ? '👑 King Bed' : '🛏️ Queen 2 Beds'}
                                  {room.handicap && <span style={{ marginLeft: '5px' }}>♿ Handicap</span>}
                                  {room.smoking ? 
                                    <span style={{ marginLeft: '5px', padding: '1px 5px', borderRadius: '3px', backgroundColor: '#ffebee', color: '#b71c1c', fontSize: '10px' }}>🚬 Smoking</span> : 
                                    <span style={{ marginLeft: '5px', padding: '1px 5px', borderRadius: '3px', backgroundColor: '#e8f5e9', color: '#1b5e20', fontSize: '10px' }}>🚭 Non-Smoking</span>
                                  }
                                  {room.onlineBookingOnly && <span style={{ marginLeft: '5px', backgroundColor: '#ffd700', color: '#000', padding: '0px 3px', borderRadius: '3px', fontSize: '10px', fontWeight: 'bold' }}>🌐 Online</span>}
                                </div>
                              </div>
                              
                              {/* Right side - Price information */}
                              <div style={{ 
                                width: '80px',
                                borderLeft: '1px solid #e0e0e0',
                                marginLeft: '5px',
                                paddingLeft: '5px',
                                paddingTop: '15px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center'
                              }}>
                                {(() => {
                                  // Determine today's pricing based on day of week
                                  const now = new Date();
                                  const day = now.getDay(); // 0 is Sunday, 6 is Saturday
                                  
                                  let basePrice;
                                  if (day === 5) { // Friday
                                    basePrice = room.type === 'jacuzzi' ? prices.friday.withJacuzzi : prices.friday.withoutJacuzzi;
                                  } else if (day === 0 || day === 6) { // Weekend (Sunday or Saturday)
                                    basePrice = room.type === 'jacuzzi' ? prices.weekend.withJacuzzi : prices.weekend.withoutJacuzzi;
                                  } else { // Weekday
                                    basePrice = room.type === 'jacuzzi' ? prices.weekday.withJacuzzi : prices.weekday.withoutJacuzzi;
                                  }
                                  
                                  const taxAmount = basePrice * 0.15;
                                  const totalPrice = basePrice + taxAmount;
                                  
                                  return (
                                    <>
                                      <div style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between',
                                        fontWeight: 'bold',
                                        fontSize: '11px',
                                      }}>
                                        <span>Rate:</span>
                                        <span>${basePrice.toFixed(2)}</span>
                                      </div>
                                      <div style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between',
                                        fontSize: '10px',
                                        color: '#666'
                                      }}>
                                        <span>Tax:</span>
                                        <span>${taxAmount.toFixed(2)}</span>
                                      </div>
                                      <div style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between',
                                        marginTop: '2px',
                                        paddingTop: '2px',
                                        borderTop: '1px dashed #ddd',
                                        fontWeight: 'bold',
                                        fontSize: '12px',
                                        color: '#001f5c'
                                      }}>
                                        <span>Total:</span>
                                        <span>${totalPrice.toFixed(2)}</span>
                                      </div>
                                    </>
                                  );
                                })()}
                              </div>
                            </div>
                              
                              {/* Checkout Alert Message */}
                              {checkoutAlerts[room.number] && (
                                <div 
                                  className="checkout-alert"
                                  style={{
                                    backgroundColor: '#ff6b6b',
                                    color: 'white',
                                  padding: '8px 10px',
                                    borderRadius: '4px',
                                  marginTop: '6px',
                                    fontWeight: 'bold',
                                    animation: 'shake 0.82s cubic-bezier(.36,.07,.19,.97) both infinite',
                                    transform: 'translate3d(0, 0, 0)',
                                    backfaceVisibility: 'hidden',
                                    perspective: '1000px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    boxShadow: '0 3px 6px rgba(0,0,0,0.2)',
                                  border: '1px solid #ff4d4d',
                                  fontSize: '11px'
                                  }}
                                >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <span style={{ fontSize: '16px' }}>⏰</span>
                                    <span>Checkout time for Room {room.number}</span>
                                  </div>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                    // Check authentication before dismissing alert
                                    if (isAuthenticated) {
                                      dismissCheckoutAlert(room.number);
                                    } else {
                                      setShowLoginModal(true);
                                    }
                                    }}
                                    style={{
                                      backgroundColor: 'white',
                                      color: '#ff6b6b',
                                      border: 'none',
                                      borderRadius: '50%',
                                    width: '18px',
                                    height: '18px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                    fontSize: '12px',
                                      cursor: 'pointer',
                                      fontWeight: 'bold'
                                    }}
                                  >
                                    ✕
                                  </button>
                                </div>
                              )}
                            
                            {/* Time Picker for Checkout - Manual Input */}
                            {openTimePickerRoom === room.number && (
                              <div 
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                  marginBottom: '8px',
                                  padding: '10px',
                                  backgroundColor: '#f0f0f0',
                                  borderRadius: '6px',
                                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                                }}
                              >
                                {/* Time picker content kept as is */}
                              </div>
                            )}
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
            borderRadius: '8px',
            padding: '20px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 style={{ margin: 0 }}>Change Room Status</h2>
              <button 
                onClick={() => {
                  setShowChangeStatusModal(false);
                  setSelectedRooms([]);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer'
                }}
              >
                &times;
              </button>
    </div>
            
            <div style={{
              overflowY: 'auto',
              flex: 1,
              marginBottom: '20px'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                gap: '10px'
              }}>
                {/* Ground Floor Rooms */}
                {rooms.groundFloor.map(room => (
                  <div key={`modal-${room.number}`} style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    cursor: 'pointer',
                    backgroundColor: selectedRooms.includes(room.number) ? '#e6f7ff' : 'white',
                  }} onClick={() => handleRoomSelection(room.number)}>
                    <div style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      border: '2px solid #001f5c',
                      marginRight: '10px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: selectedRooms.includes(room.number) ? '#001f5c' : 'white'
                    }}>
                      {selectedRooms.includes(room.number) && (
                        <div style={{ 
                          width: '10px', 
                          height: '10px', 
                          borderRadius: '50%', 
                          backgroundColor: 'white' 
                        }}></div>
                      )}
                    </div>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{room.number}</div>
                      <div style={{ 
                        fontSize: '12px',
                        color: room.status === 'available' ? 'green' : 
                               room.status === 'cleared' ? '#505050' : 'red'
                      }}>
                        {room.status === 'available' ? 'Available' : 
                         room.status === 'cleared' ? 'Cleared' : 'Occupied'}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* First Floor Rooms */}
                {rooms.firstFloor.map(room => (
                  <div key={`modal-${room.number}`} style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    cursor: 'pointer',
                    backgroundColor: selectedRooms.includes(room.number) ? '#e6f7ff' : 'white',
                  }} onClick={() => handleRoomSelection(room.number)}>
                    <div style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      border: '2px solid #001f5c',
                      marginRight: '10px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: selectedRooms.includes(room.number) ? '#001f5c' : 'white'
                    }}>
                      {selectedRooms.includes(room.number) && (
                        <div style={{ 
                          width: '10px', 
                          height: '10px', 
                          borderRadius: '50%', 
                          backgroundColor: 'white' 
                        }}></div>
                      )}
                    </div>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{room.number}</div>
                      <div style={{ 
                        fontSize: '12px',
                        color: room.status === 'available' ? 'green' : 
                               room.status === 'cleared' ? '#505050' : 'red'
                      }}>
                        {room.status === 'available' ? 'Available' : 
                         room.status === 'cleared' ? 'Cleared' : 'Occupied'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
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

      {/* Booking Modal */}
      {openBookingModal && (
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
            borderRadius: '8px',
            padding: '15px', // Reduced padding
            maxWidth: '700px', // Slightly reduced max width
            width: '90%',
            maxHeight: '90vh', // Increased max height slightly
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px', // Reduced margin
              borderBottom: '1px solid #eee',
              paddingBottom: '8px' // Reduced padding
            }}>
              <h2 style={{ margin: 0, fontSize: '18px' }}> {/* Reduced font size */}
                Book Room {openBookingModal}
                {(() => {
                  // Find room info
                  let roomInfo = null;
                  const groundFloorRoom = rooms.groundFloor.find(room => room.number === openBookingModal);
                  const firstFloorRoom = rooms.firstFloor.find(room => room.number === openBookingModal);
                  roomInfo = groundFloorRoom || firstFloorRoom;
                  
                  if (roomInfo) {
                    return (
                      <span style={{ 
                        fontSize: '12px', // Reduced font size
                        fontWeight: 'normal', 
                        backgroundColor: '#f0f0f0',
                        padding: '2px 6px', // Reduced padding
                        borderRadius: '4px',
                        marginLeft: '8px' // Reduced margin
                      }}>
                        {/* Room Type and Bed Type Before Smoking Status */} 
                        {roomInfo.type === 'jacuzzi' ? '🛁 Jacuzzi' : '🛏️ Standard'} • 
                        {roomInfo.beds === 'king' ? ' 👑 King' : roomInfo.beds === 'double' ? ' 👥 Double Queen' : ' 👤 Queen'} • 
                        {roomInfo.smoking ? ' 🚬 Smoking' : ' 🚭 Non-Smoking'}
                        {roomInfo.handicap ? ' • ♿ Handicap' : ''}
                      </span>
                    );
                  }
                  return null;
                })()}
              </h2>
              <button 
                onClick={() => setOpenBookingModal(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '20px', // Reduced font size
                  cursor: 'pointer'
                }}
              >
                &times;
              </button>
            </div>
            
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '0 5px' // Reduced padding
            }}>
              {/* Multiple Nights Tab Content */}
              <div style={{ backgroundColor: '#e6e0f3', padding: '10px', borderRadius: '8px' }}> {/* Reduced padding */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '10px' }}> {/* Reduced gap/margin */}
                  <h3 className="section-header" style={{ margin: 0, fontSize: '16px' }}>Book Multiple Nights</h3> {/* Reduced font size */}
                </div>
                
                <div className="overnight-dates" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}> {/* Reduced gap */}
                  <div className="date-picker-container" style={{ flex: 1, minWidth: '280px' }}>
                    <label style={{ fontSize: '13px', marginBottom: '3px' }}>Check-in Date:</label> {/* Reduced font size/margin */}
                    <DatePicker
                      selected={checkInDate}
                      onChange={handleCheckInChange}
                      dateFormat="MM/dd/yy h:mm aa"
                      minDate={new Date()}
                      className="date-picker compact-datepicker" // Added class for specific styling
                      showTimeSelect={false}
                      timeFormat="HH:mm"
                      timeIntervals={60}
                      timeCaption="Time"
                      onFocus={e => e.target.blur()}
                      onKeyDown={e => e.preventDefault()}
                    />
                    <span className="calendar-icon" style={{ fontSize: '14px' }}>📅</span> {/* Reduced font size */}
                    <span className="time-note" style={{ fontSize: '11px' }}>Std: 3 PM</span> {/* Reduced font size */}
                    
                    <div className="extra-hours-overnight" style={{ marginTop: '5px' }}>
                      <label style={{ fontSize: '12px' }}>Hour Adj:</label> {/* Reduced font size */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}> {/* Reduced gap */}
                        <div className="hours-control">
                          <button className="minus-btn compact-btn" onClick={() => handleOvernightExtraHoursChange(-1)}>-</button> {/* Added class */} 
                          <span style={{ fontSize: '12px' }}>{overnightExtraHours}</span> {/* Reduced font size */}
                          <button className="plus-btn compact-btn" onClick={() => handleOvernightExtraHoursChange(1)}>+</button> {/* Added class */} 
                        </div>
                        <span className="hours-note" style={{ fontSize: '11px', color: '#00308F', fontWeight: 'bold' }}> {/* Reduced font size */}
                          {overnightExtraHours < 0 
                            ? `${Math.abs(overnightExtraHours)}hr early (${new Date(new Date().setHours(15 + overnightExtraHours, 0, 0, 0)).toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'})})` 
                            : overnightExtraHours > 0 
                            ? `${overnightExtraHours}hr late (${new Date(new Date().setHours(15 + overnightExtraHours, 0, 0, 0)).toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'})})` 
                            : 'Standard'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="date-picker-container" style={{ flex: 1, minWidth: '280px' }}>
                    <label style={{ fontSize: '13px', marginBottom: '3px' }}>Check-out Date:</label> {/* Reduced font size/margin */}
                    <DatePicker
                      selected={checkOutDate}
                      onChange={handleCheckOutChange}
                      dateFormat="MM/dd/yy h:mm aa"
                      minDate={checkInDate}
                      className="date-picker compact-datepicker" // Added class
                      showTimeSelect={false}
                      timeFormat="HH:mm"
                      timeIntervals={60}
                      timeCaption="Time"
                      onFocus={e => e.target.blur()}
                      onKeyDown={e => e.preventDefault()}
                    />
                    <span className="calendar-icon" style={{ fontSize: '14px' }}>📅</span> {/* Reduced font size */}
                    <span className="time-note" style={{ fontSize: '11px' }}>Std: 11 AM</span> {/* Reduced font size */}
                    
                    <div className="extra-hours-overnight" style={{ marginTop: '5px' }}>
                      <label style={{ fontSize: '12px' }}>Hour Adj:</label> {/* Reduced font size */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}> {/* Reduced gap */}
                        <div className="hours-control">
                          <button className="minus-btn compact-btn" onClick={() => handleCheckoutExtraHoursChange(-1)}>-</button> {/* Added class */} 
                          <span style={{ fontSize: '12px' }}>{overnightCheckoutExtraHours}</span> {/* Reduced font size */}
                          <button className="plus-btn compact-btn" onClick={() => handleCheckoutExtraHoursChange(1)}>+</button> {/* Added class */} 
                        </div>
                        <span className="hours-note" style={{ fontSize: '11px', color: '#00308F', fontWeight: 'bold' }}> {/* Reduced font size */}
                          {overnightCheckoutExtraHours < 0 
                            ? `${Math.abs(overnightCheckoutExtraHours)}hr early (${new Date(new Date().setHours(11 + overnightCheckoutExtraHours, 0, 0, 0)).toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'})})` 
                            : overnightCheckoutExtraHours > 0 
                            ? `${overnightCheckoutExtraHours}hr late (${new Date(new Date().setHours(11 + overnightCheckoutExtraHours, 0, 0, 0)).toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'})})` 
                            : 'Standard'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="room-options" style={{ marginBottom: '10px', marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '10px 15px' }}> {/* Reduced margin/gap */}
                  {/* Room Type Option Group */}
                  <div className="option-group">
                    <label style={{ fontSize: '13px' }}>Room Type:</label>
                    <div className="radio-group compact-radio-group">
                      <label>
                        <input
                          type="radio"
                          checked={!hasJacuzziOvernight}
                          onChange={() => setHasJacuzziOvernight(false)}
                        />
                        Std
                      </label>
                      <label>
                        <input
                          type="radio"
                          checked={hasJacuzziOvernight}
                          onChange={() => setHasJacuzziOvernight(true)}
                        />
                        Jacuzzi
                      </label>
                    </div>
                  </div>
                  
                  {/* Bed Type Option Group */}
                  <div className="option-group">
                    <label style={{ fontSize: '13px' }}>Bed Type:</label>
                    <div className="radio-group compact-radio-group">
                      <label>
                        <input
                          type="radio"
                          checked={bedType === 'queen'}
                          onChange={() => setBedType('queen')}
                        />
                        Queen
                      </label>
                      <label>
                        <input
                          type="radio"
                          checked={bedType === 'king'}
                          onChange={() => setBedType('king')}
                        />
                        King
                      </label>
                      <label>
                        <input
                          type="radio"
                          checked={bedType === 'double'}
                          onChange={() => setBedType('double')}
                        />
                        Double
                      </label>
                    </div>
                  </div>
                  
                  <div className="option-group">
                    <label style={{ fontSize: '13px' }}>Smoking:</label>
                    <div className="radio-group compact-radio-group">
                      <label>
                        <input
                          type="radio"
                          checked={!overnightSmoking}
                          onChange={() => setOvernightSmoking(false)}
                        />
                        Non
                      </label>
                      <label>
                        <input
                          type="radio"
                          checked={overnightSmoking}
                          onChange={() => setOvernightSmoking(true)}
                        />
                        Yes
                      </label>
                    </div>
                  </div>
                  
                  <div className="option-group">
                    <label style={{ fontSize: '13px' }}>Payment:</label>
                    <div className="radio-group compact-radio-group">
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
                        Credit
                      </label>
                    </div>
                  </div>
                  
                  <div className="option-group">
                    <label style={{ fontSize: '13px' }}>Extra Hr Rate:</label>
                    <div className="radio-group compact-radio-group">
                      <label>
                        <input
                          type="radio"
                          checked={overnightExtraRate === 15}
                          onChange={() => setOvernightExtraRate(15)}
                        />
                        $15
                      </label>
                      <label>
                        <input
                          type="radio"
                          checked={overnightExtraRate === 10}
                          onChange={() => setOvernightExtraRate(10)}
                        />
                        $10
                      </label>
                    </div>
                  </div>
                </div>
                
                {/* Price Summary (now uses compact styles via render function) */}
                <div className="compact-price-summary"> 
                  {renderOvernightStayPriceSummary()} 
                </div>
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: '15px', // Reduced margin
              gap: '8px' // Reduced gap
            }}>
              <button
                onClick={() => setOpenBookingModal(null)}
                style={{
                  padding: '6px 12px', // Reduced padding
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  backgroundColor: '#f5f5f5',
                  cursor: 'pointer',
                  fontSize: '13px' // Reduced font size
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle booking confirmation
                  alert(`Room ${openBookingModal} booked successfully!`);
                  setOpenBookingModal(null);
                  
                  // Optionally: Update room status to occupied
                  // ... (existing commented out logic) ...
                }}
                style={{
                  padding: '6px 12px', // Reduced padding
                  borderRadius: '4px',
                  border: 'none',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '13px' // Reduced font size
                }}
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;