import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './App.css';
import LoginModal from './LoginModal';

function App() {
  // Define filter button styles
  const filterButtonStyles = {
    all: {
      selected: {
        backgroundColor: '#BDE0FE', // Light Blue
        color: '#000000', // Black text for light blue
        border: '2px solid #A0C4FF', // Adjusted border
        fontWeight: 700,
        boxShadow: '0 4px 10px rgba(189, 224, 254, 0.35)', // Adjusted shadow
        transform: 'translateY(-2px)'
      },
      unselected: {
        backgroundColor: '#eef2ff',
        color: '#000000', // Black
        border: '2px solid #c7d2fe'
      }
    },
    available: {
      selected: {
        backgroundColor: '#BDE0FE', // Light Blue
        color: '#000000', // Black text for light blue
        border: '2px solid #A0C4FF', // Adjusted border
        fontWeight: 700,
        boxShadow: '0 4px 10px rgba(189, 224, 254, 0.35)', // Adjusted shadow
        transform: 'translateY(-2px)'
      },
      unselected: {
        backgroundColor: '#dcfce7',
        color: '#000000', // Black
        border: '2px solid #86efac'
      }
    },
    jacuzzi: {
      selected: {
        backgroundColor: '#BDE0FE', // Light Blue
        color: '#000000', // Black text for light blue
        border: '2px solid #A0C4FF', // Adjusted border
        fontWeight: 700,
        boxShadow: '0 4px 10px rgba(189, 224, 254, 0.35)', // Adjusted shadow
        transform: 'translateY(-2px)'
      },
      unselected: {
        backgroundColor: '#e0f2fe',
        color: '#000000', // Black
        border: '2px solid #7dd3fc'
      }
    },
    nonJacuzzi: {
      selected: {
        backgroundColor: '#BDE0FE', // Light Blue
        color: '#000000', // Black text for light blue
        border: '2px solid #A0C4FF', // Adjusted border
        fontWeight: 700,
        boxShadow: '0 4px 10px rgba(189, 224, 254, 0.35)', // Adjusted shadow
        transform: 'translateY(-2px)'
      },
      unselected: {
        backgroundColor: '#ede9fe',
        color: '#000000', // Black
        border: '2px solid #c4b5fd'
      }
    },
    smoking: {
      selected: {
        backgroundColor: '#BDE0FE', // Light Blue
        color: '#000000', // Black text for light blue
        border: '2px solid #A0C4FF', // Adjusted border
        fontWeight: 700,
        boxShadow: '0 4px 10px rgba(189, 224, 254, 0.35)', // Adjusted shadow
        transform: 'translateY(-2px)'
      },
      unselected: {
        backgroundColor: '#fff7ed',
        color: '#000000', // Black
        border: '2px solid #fdba74'
      }
    },
    nonSmoking: {
      selected: {
        backgroundColor: '#BDE0FE', // Light Blue
        color: '#000000', // Black text for light blue
        border: '2px solid #A0C4FF', // Adjusted border
        fontWeight: 700,
        boxShadow: '0 4px 10px rgba(189, 224, 254, 0.35)', // Adjusted shadow
        transform: 'translateY(-2px)'
      },
      unselected: {
        backgroundColor: '#f1f5f9',
        color: '#000000', // Black
        border: '2px solid #cbd5e1'
      }
    },
    handicap: {
      selected: {
        backgroundColor: '#BDE0FE', // Light Blue
        color: '#000000', // Black text for light blue
        border: '2px solid #A0C4FF', // Adjusted border
        fontWeight: 700,
        boxShadow: '0 4px 10px rgba(189, 224, 254, 0.35)', // Adjusted shadow
        transform: 'translateY(-2px)'
      },
      unselected: {
        backgroundColor: '#f5f3ff',
        color: '#000000', // Black
        border: '2px solid #c4b5fd'
      }
    },
    queen: {
      selected: {
        backgroundColor: '#BDE0FE', // Light Blue
        color: '#000000', // Black text for light blue
        border: '2px solid #A0C4FF', // Adjusted border
        fontWeight: 700,
        boxShadow: '0 4px 10px rgba(189, 224, 254, 0.35)', // Adjusted shadow
        transform: 'translateY(-2px)'
      },
      unselected: {
        backgroundColor: '#fdf2f8',
        color: '#000000', // Black
        border: '2px solid #fbcfe8'
      }
    },
    king: {
      selected: {
        backgroundColor: '#BDE0FE', // Light Blue
        color: '#000000', // Black text for light blue
        border: '2px solid #A0C4FF', // Adjusted border
        fontWeight: 700,
        boxShadow: '0 4px 10px rgba(189, 224, 254, 0.35)', // Adjusted shadow
        transform: 'translateY(-2px)'
      },
      unselected: {
        backgroundColor: '#eef2ff',
        color: '#000000', // Black
        border: '2px solid #c7d2fe'
      }
    },
    queen2Beds: {
      selected: {
        backgroundColor: '#BDE0FE', // Light Blue
        color: '#000000', // Black text for light blue
        border: '2px solid #A0C4FF', // Adjusted border
        fontWeight: 700,
        boxShadow: '0 4px 10px rgba(189, 224, 254, 0.35)', // Adjusted shadow
        transform: 'translateY(-2px)'
      },
      unselected: {
        backgroundColor: '#f0f9ff',
        color: '#000000', // Black
        border: '2px solid #bae6fd'
      }
    }
  };
  
  // Filter button base style
  const baseFilterButtonStyle = {
    borderRadius: '50px',
    padding: '10px 16px',
    fontSize: '14px',
    cursor: 'pointer',
    margin: '4px 6px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 5px rgba(0,0,0,0.08)',
    fontWeight: 600
  };
  
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
        { number: "101", type: "standard", beds: "Queen", status: "available", smoking: false, handicap: true },
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
  // Add state for room status modal
  const [showRoomStatusModal, setShowRoomStatusModal] = useState(false);
  const [selectedRoomsForShortStay, setSelectedRoomsForShortStay] = useState(() => {
    const savedRooms = localStorage.getItem('selectedRoomsForShortStay');
    return savedRooms ? JSON.parse(savedRooms) : [];
  });
  
  // Overnight stay state
  const [overnightSmoking, setOvernightSmoking] = useState(false);
  const [overnightPayment, setOvernightPayment] = useState('cash');
  const [overnightRateType, setOvernightRateType] = useState('regular'); // 'regular' or 'discounted'
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
  
  // State for Price Change Modal temporary values
  const [tempPrices, setTempPrices] = useState(prices);
  const [tempShortStayPrices, setTempShortStayPrices] = useState(shortStayPrices);
  
  // Update temp prices whenever main prices change
  useEffect(() => {
    setTempPrices(prices);
    setTempShortStayPrices(shortStayPrices);
  }, [prices, shortStayPrices]);
  
  // Initialize date and time on component mount and set up timer
  useEffect(() => {
    // Load saved prices from localStorage
    const savedPrices = localStorage.getItem('appPrices');
    if (savedPrices) {
      setPrices(JSON.parse(savedPrices));
    }
    const savedShortStayPrices = localStorage.getItem('appShortStayPrices');
    if (savedShortStayPrices) {
      setShortStayPrices(JSON.parse(savedShortStayPrices));
    }

    // Clear localStorage for rooms data to force reset (consider removing if rooms should persist)
    // localStorage.removeItem('roomsData'); 
    
    // Reset rooms with the updated configuration (or load from localStorage if needed)
    const savedRoomsData = localStorage.getItem('roomsData');
    if (savedRoomsData) {
      setRooms(JSON.parse(savedRoomsData));
    } else {
      const defaultRooms = {
      groundFloor: [
          { number: "101", type: "standard", beds: "Queen", status: "available", smoking: false, handicap: true },
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
      setRooms(defaultRooms);
      // Save defaults if nothing was loaded
      localStorage.setItem('roomsData', JSON.stringify(defaultRooms));
    }
    
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
      // Use the appropriate rate from shortStayPrices based on overnightRateType selection
      const hourlyRate = overnightRateType === 'regular' ? 
        shortStayPrices.extraHourRate.regular : 
        shortStayPrices.extraHourRate.discounted;
      extraHoursCheckInCost = Math.abs(overnightExtraHours) * hourlyRate;
    }
    
    // Calculate extra hours cost for checkout
    let extraHoursCheckOutCost = 0;
    if (overnightCheckoutExtraHours > 0) {
      // Use the appropriate rate from shortStayPrices based on overnightRateType selection
      const hourlyRate = overnightRateType === 'regular' ? 
        shortStayPrices.extraHourRate.regular : 
        shortStayPrices.extraHourRate.discounted;
      extraHoursCheckOutCost = overnightCheckoutExtraHours * hourlyRate;
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
        extraRateType: overnightRateType,
        extraRate: overnightExtraRate,
        extraRateValue: overnightRateType === 'regular' ? 
          shortStayPrices.extraHourRate.regular : 
          shortStayPrices.extraHourRate.discounted,
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
          backgroundColor: '#2c3e50',
          background: 'linear-gradient(135deg, #2c3e50, #4776E6)',
          padding: '15px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          margin: '15px 0',
          color: 'white'
        }}>
          <h3 style={{ 
            color: 'white',
            borderBottom: '2px solid rgba(255,255,255,0.3)',
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
                  background: 'linear-gradient(135deg, #304b68, #4776E6)',
                  borderRadius: '8px',
                  position: 'relative',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'white'
                }}>
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      marginBottom: '8px',
                      borderBottom: '1px solid rgba(255,255,255,0.2)',
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
                            color: 'white',
                                whiteSpace: 'nowrap'
                          }}
                        >
                          Stay #{index+1}
                        </span>
                        <button
                          onClick={() => {
                            // Set all the form fields to this stay's values
                            setCheckInDate(new Date(stay.checkIn));
                            setCheckOutDate(new Date(stay.checkOut));
                            setHasJacuzziOvernight(stay.hasJacuzzi);
                            setOvernightPayment(stay.payment);
                            // Set rate type if available, otherwise determine from the rate
                            if (stay.extraRateType) {
                              setOvernightRateType(stay.extraRateType);
                            } else {
                              // For backward compatibility with older saved stays
                              setOvernightRateType(stay.extraRate === shortStayPrices.extraHourRate.regular ? 'regular' : 'discounted');
                            }
                            setOvernightExtraRate(stay.extraRate);
                            setOvernightExtraHours(stay.checkInAdjustment);
                            setOvernightCheckoutExtraHours(stay.checkOutAdjustment);
                            setBedType(stay.bedType);
                            // Remove this stay
                            removeSavedStay(stay.id);
                          }}
                          style={{
                            background: '#dc3545',
                            border: 'none',
                            color: '#fff',
                            fontSize: '12px',
                            cursor: 'pointer',
                            padding: '3px 6px',
                            borderRadius: '4px',
                            fontWeight: '500'
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
                            color: 'white',
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
                    <div style={{ fontSize: '14px', color: 'white' }}>
                      {stay.checkInDay} ({stay.checkIn.toLocaleDateString()}) to {stay.checkOutDay} ({stay.checkOut.toLocaleDateString()})
                    </div>
                    <div style={{ fontSize: '14px', color: 'white', marginTop: '4px' }}>
                      {stay.nights} {stay.nights === 1 ? 'night' : 'nights'}
                      {stay.hasJacuzzi ? ' • Jacuzzi' : ''}
                      {' • '}{stay.bedType.charAt(0).toUpperCase() + stay.bedType.slice(1)} Bed
                      {stay.checkInAdjustment !== 0 && ` • CI ${stay.checkInAdjustment > 0 ? `+${stay.checkInAdjustment}h` : `${stay.checkInAdjustment}h`}`}
                      {stay.checkOutAdjustment !== 0 && ` • CO ${stay.checkOutAdjustment > 0 ? `+${stay.checkOutAdjustment}h` : `${stay.checkOutAdjustment}h`}`}
                    </div>
                  </div>
                  <div style={{ 
                    fontSize: '13px',
                    color: 'white', 
                    backgroundColor: 'rgba(255,255,255,0.1)',
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
                        borderBottom: '1px solid rgba(255,255,255,0.2)',
                        paddingBottom: '3px',
                        marginBottom: '3px'
                      }}>
                        <span style={{ color: 'white' }}>Base ({stay.nights}n):</span>
                        <span style={{ color: 'white', fontWeight: '600' }}>${stay.basePrice.toFixed(2)}</span>
                      </div>
                      {stay.details.daysBreakdown.map((day, idx) => (
                        <div key={idx} style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          fontSize: '12px',
                          color: 'rgba(255,255,255,0.8)'
                        }}>
                          <span style={{ color: 'white' }}>{day.day}:</span>
                          <span style={{ color: 'white' }}>${day.basePrice.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    {stay.tax > 0 && (
                      <div className="summary-line" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px', marginTop: '6px' }}>
                        <span style={{ color: 'white' }}>Tax (15%):</span>
                        <span style={{ color: 'white', fontWeight: '600' }}>${stay.tax.toFixed(2)}</span>
                      </div>
                    )}
                    {stay.extraHoursCheckIn > 0 && (
                      <div className="summary-line" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                        <span style={{ color: 'white' }}>CI Hours ({stay.checkInAdjustment > 0 ? `+${stay.checkInAdjustment}h` : `${Math.abs(stay.checkInAdjustment)}h`}):</span>
                        <span style={{ color: 'white', fontWeight: '600' }}>${stay.extraHoursCheckIn.toFixed(2)}</span>
                      </div>
                    )}
                    {stay.extraHoursCheckOut > 0 && (
                      <div className="summary-line" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                        <span style={{ color: 'white' }}>CO Hours ({stay.checkOutAdjustment > 0 ? `+${stay.checkOutAdjustment}h` : `${Math.abs(stay.checkOutAdjustment)}h`}):</span>
                        <span style={{ color: 'white', fontWeight: '600' }}>${stay.extraHoursCheckOut.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              <div className="summary-line total" style={{ 
                marginTop: '15px',
                borderTop: '2px solid rgba(255,255,255,0.3)',
                paddingTop: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '18px',
                fontWeight: 'bold'
              }}>
                <span style={{ color: 'white' }}>Total Price:</span>
                <span style={{ color: 'white', fontSize: '20px' }}>
                  ${totalStaysPrice.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {savedStays.length === 0 && pricing && (
            <>
              <div className="summary-line" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: 'white' }}>Duration:</span>
                <span style={{ color: 'white' }}>{pricing.nights} {pricing.nights === 1 ? 'Night' : 'Nights'}</span>
        </div>
            
              {pricing.nights === 7 && (
                <div className="summary-line" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: 'white' }}>Weekly Rate:</span>
                  <span style={{ color: 'white', fontWeight: '600' }}>${(() => {
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
                    <div key={index} className="summary-line" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>
                      <span style={{ color: 'white' }}>{day.day}:</span>
                      <span style={{ color: 'white' }}>${day.basePrice.toFixed(2)}</span>
                </div>
              ))}
                  <div className="summary-line" style={{ borderTop: '1px solid rgba(255,255,255,0.3)', marginTop: '8px', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: 'white' }}>Total Base:</span>
                    <span style={{ color: 'white', fontWeight: '600' }}>${pricing.totalBasePrice.toFixed(2)}</span>
              </div>
            </>
          )}
          
              {pricing.nights < 7 && pricing.taxAmount > 0 && (
                <div className="summary-line" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: 'white' }}>Tax (15%):</span>
                  <span style={{ color: 'white', fontWeight: '600' }}>${pricing.taxAmount.toFixed(2)}</span>
            </div>
          )}
          
            {overnightExtraHours !== 0 && pricing.extraHoursCheckInCost > 0 && (
                <div className="summary-line" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: 'white' }}>CI Hours ({overnightExtraHours > 0 ? `+${overnightExtraHours}h` : `${Math.abs(overnightExtraHours)}h`}):</span>
                  <span style={{ color: 'white', fontWeight: '600' }}>${pricing.extraHoursCheckInCost.toFixed(2)}</span>
            </div>
          )}
          
            {overnightCheckoutExtraHours !== 0 && pricing.extraHoursCheckOutCost > 0 && (
                <div className="summary-line" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: 'white' }}>CO Hours ({overnightCheckoutExtraHours > 0 ? `+${overnightCheckoutExtraHours}h` : `${Math.abs(overnightCheckoutExtraHours)}h`}):</span>
                  <span style={{ color: 'white', fontWeight: '600' }}>${pricing.extraHoursCheckOutCost.toFixed(2)}</span>
            </div>
          )}
          
              <div className="summary-line total" style={{ borderTop: '1px solid rgba(255,255,255,0.3)', marginTop: '8px', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '16px' }}>
                <span style={{ color: 'white' }}>Total Price:</span>
                <span style={{ color: 'white', fontWeight: '700' }}>${pricing.totalPrice.toFixed(2)}</span>
          </div>
          </>
        )}
        
        {savedStays.length === 0 && !pricing && (
          <p style={{ 
            textAlign: 'center', 
            color: 'white', 
            padding: '20px', 
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '6px',
            fontSize: '14px'
          }}>
            Select dates and click "Add Stay" to begin adding stays
          </p>
        )}
      </div>
    );
  };
  
  // Add a function to handle price updates and save to localStorage
  const handlePriceUpdate = () => {
    // Save current prices to localStorage
    localStorage.setItem('appPrices', JSON.stringify(prices));
    localStorage.setItem('appShortStayPrices', JSON.stringify(shortStayPrices));
    
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
      
      // Update the hourly rate based on the saved rate type
      const rateType = stay.extraRateType || 
        (stay.extraRate === 15 ? 'regular' : 'discounted');
      
      const hourlyRate = rateType === 'regular' ? 
        shortStayPrices.extraHourRate.regular : 
        shortStayPrices.extraHourRate.discounted;
      
      // Update the extraRate value to match the current rate
      const updatedExtraRate = hourlyRate;
      
      // Calculate extra hours costs using the updated rates
      const extraHoursCheckIn = stay.checkInAdjustment !== 0 ? 
        Math.abs(stay.checkInAdjustment) * hourlyRate : 0;
      
      const extraHoursCheckOut = stay.checkOutAdjustment > 0 ? 
        stay.checkOutAdjustment * hourlyRate : 0;
      
      // Calculate total price
      const tax = stay.nights < 7 ? basePrice * 0.15 : 0;
      const totalPrice = basePrice + tax + extraHoursCheckIn + extraHoursCheckOut;
      
      return {
        ...stay,
        basePrice,
        tax,
        extraRate: updatedExtraRate,
        extraRateValue: hourlyRate,
        extraHoursCheckIn,
        extraHoursCheckOut,
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
    
    // Close the modal after updating
    setShowPriceChangeModal(false);
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
      
      // Handle conflicts between jacuzzi and non-jacuzzi filters
      let newFilters = [...prev];
      
      if (filter === 'jacuzzi') {
        // Remove non-jacuzzi if selecting jacuzzi
        newFilters = newFilters.filter(f => f !== 'non-jacuzzi');
      } else if (filter === 'non-jacuzzi') {
        // Remove jacuzzi if selecting non-jacuzzi
        newFilters = newFilters.filter(f => f !== 'jacuzzi');
      }
      
      return [...newFilters, filter];
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
        case 'non-jacuzzi':
          return room.type !== 'jacuzzi';
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
  
  // Save selected rooms to localStorage when they change
  useEffect(() => {
    localStorage.setItem('selectedRoomsForShortStay', JSON.stringify(selectedRoomsForShortStay));
  }, [selectedRoomsForShortStay]);
  
  // Effect to update temporary prices when the modal opens
  useEffect(() => {
    if (showPriceChangeModal) {
      setTempPrices(prices); // Reset temp state to current main state
      setTempShortStayPrices(shortStayPrices);
    }
  }, [showPriceChangeModal, prices, shortStayPrices]); // Dependencies ensure reset happens correctly
  
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
    // Clear authentication state
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    
    // Reset pending room actions
    setPendingRoomAction(null);
    
    // Force hard refresh to reset all state
    window.location.href = window.location.pathname;
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
  
  // Handler for room selection in the modal
  const handleRoomSelectionForShortStay = (roomNumber) => {
    // Toggle selection of this room (allowing multiple room selection)
    setSelectedRoomsForShortStay(prev => {
      // If room is already selected, remove it
      if (prev.includes(roomNumber)) {
        return prev.filter(room => room !== roomNumber);
      }
      // Otherwise add it to the selection
      return [...prev, roomNumber];
    });
  };
  
  // Function to confirm room selection and close modal
  const confirmRoomSelection = () => {
    // If a room is selected, keep it selected and close modal
    if (selectedRoomsForShortStay.length > 0) {
      // Optionally: Set room properties based on selected room
      const selectedRoom = [...rooms.groundFloor, ...rooms.firstFloor].find(
        room => room.number === selectedRoomsForShortStay[0]
      );
      
      if (selectedRoom) {
        // Set jacuzzi option based on selected room
        setHasJacuzzi(selectedRoom.type === 'jacuzzi');
      }
      
      // Close the modal
      setShowRoomStatusModal(false);
    } else {
      // If no room is selected, show an alert
      alert('Please select a room first');
    }
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
        padding: 15px !important;
        border-radius: 12px !important;
        text-align: center !important;
        cursor: pointer !important;
        color: white !important;
        box-shadow: 0 4px 15px rgba(0,0,0,0.15) !important;
        transition: all 0.3s ease !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: space-between !important;
        align-items: center !important;
        position: relative !important;
        overflow: hidden !important;
        min-height: 110px !important;
      }
      
      .room-card::before {
        content: '' !important;
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        background: rgba(255, 255, 255, 0.1) !important;
        pointer-events: none !important;
        transform: translateX(-100%) !important;
        transition: transform 0.5s ease !important;
      }
      
      .room-card:hover::before {
        transform: translateX(0) !important;
      }
      
      .room-card.available {
        background: linear-gradient(180deg, #2a9d8f, #4ad395) !important;
      }
      
      .room-card.occupied {
        background: linear-gradient(180deg, #d32f2f, #f44336) !important;
      }
      
      .room-card.cleared {
        background: linear-gradient(180deg, #57d8a8, #70e0b8) !important;
      }
      
      .room-card:hover {
        transform: translateY(-5px) !important;
        box-shadow: 0 8px 25px rgba(0,0,0,0.25) !important;
      }
      
      .room-card .room-number {
        font-size: 16px !important;
        font-weight: bold !important;
        margin-bottom: 5px !important;
      }
      
      .room-card .room-features {
        display: flex !important;
        gap: 6px !important;
        margin-top: 2px !important;
        font-size: 14px !important;
      }
      
      .room-card .price-tag {
        margin-top: 8px !important;
        background: rgba(0, 0, 0, 0.25) !important;
        padding: 4px 8px !important;
        border-radius: 4px !important;
        font-size: 10px !important; /* Reduced font size */
        font-weight: 600 !important; /* Adjusted font weight */
        letter-spacing: 0.5px !important; /* Added letter spacing */
        color: white !important;
        text-shadow: 0 1px 1px rgba(0,0,0,0.2) !important;
        line-height: 1.2 !important; /* Adjusted line height for smaller text */
      }
    `;
    document.head.appendChild(styleElement);
    
    // Clean up on component unmount
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  
  const handleClearPrices = () => {
    // Reset prices state to hardcoded defaults
    setPrices({
      weekday: { withoutJacuzzi: 105, withJacuzzi: 120 },
      friday: { withoutJacuzzi: 139, withJacuzzi: 159 },
      weekend: { withoutJacuzzi: 139, withJacuzzi: 169 }
    });
    
    // Reset short stay prices state to hardcoded defaults
    setShortStayPrices({
      baseRate: { withoutJacuzzi: 60, withJacuzzi: 90 }, // Using the default values from useState
      extraHourRate: { regular: 15, discounted: 10 }
    });
  };
  
  // --- Price Change Modal Handlers ---
  // Handle input changes within the modal for overnight prices
  const handleModalPriceChange = (day, type, value) => {
    setTempPrices(prev => ({ 
      ...prev, 
      [day]: { ...prev[day], [type]: Number(value) || 0 } 
    }));
  };
  
  // Handle input changes within the modal for short stay prices
  const handleModalShortStayPriceChange = (category, type, value) => {
    setTempShortStayPrices(prev => ({
      ...prev,
      [category]: { ...prev[category], [type]: Number(value) || 0 }
    }));
  };
  
  // Handler for the modal's Update Prices button
  const handleModalUpdate = () => {
    setPrices(tempPrices); // Update main state with temp prices
    setShortStayPrices(tempShortStayPrices);
    handlePriceUpdate(); // Trigger save and recalculations
    setShowPriceChangeModal(false); // Close modal
  };
  
  // Handler for the modal's Clear Prices button (using existing handleClearPrices)
  const handleModalClearPrices = () => {
     // Reset temp prices to hardcoded defaults directly
      const defaultPrices = {
        weekday: { withoutJacuzzi: 105, withJacuzzi: 120 },
        friday: { withoutJacuzzi: 139, withJacuzzi: 159 },
        weekend: { withoutJacuzzi: 139, withJacuzzi: 169 }
      };
      
      const defaultShortStayPrices = {
        baseRate: { withoutJacuzzi: 60, withJacuzzi: 90 }, 
        extraHourRate: { regular: 15, discounted: 10 }
      };
      
      // Update the temp states used in the modal
      setTempPrices(defaultPrices);
      setTempShortStayPrices(defaultShortStayPrices);
      
      // Also update the main price states
      setPrices(defaultPrices);
      setShortStayPrices(defaultShortStayPrices);
      
      // Save to localStorage
      localStorage.setItem('appPrices', JSON.stringify(defaultPrices));
      localStorage.setItem('appShortStayPrices', JSON.stringify(defaultShortStayPrices));
      
      // Increment the counter to force a UI refresh
      setPriceUpdateCounter(prev => prev + 1);
      
      // Update calculations
      calculatePrice();
  };
  // --- End Price Change Modal Handlers ---
  
  return (
    <div className="App">
      <div className="hotel-calculator">
        <div className="header" style={{
          display: 'flex', 
          alignItems: 'center', 
          gap: '15px', 
          padding: '20px 25px', 
          borderRadius: '16px',
          background: 'linear-gradient(145deg, #001f5c, #1a447b)',
          boxShadow: '0 8px 32px rgba(0, 31, 92, 0.25)',
          marginBottom: '20px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Background pattern */}
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 15%), radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.1) 0%, transparent 15%)',
            opacity: 0.8
          }}></div>
          
          <h1 style={{ 
            margin: 0, 
            fontSize: '28px', 
            whiteSpace: 'nowrap',
            color: 'white',
            fontWeight: '700',
            position: 'relative',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            zIndex: 1
          }}> 
            Price Calculator
          </h1>
          
          {/* Calendar Display */}
            <span style={{ 
              fontSize: '16px', 
            background: 'rgba(255, 255, 255, 0.15)', 
            padding: '10px 16px', 
            borderRadius: '50px',
              display: 'inline-flex',
              alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap',
            backdropFilter: 'blur(5px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white',
            zIndex: 1
          }}>
            <span style={{ fontSize: '20px' }}>📅</span> {currentDate} <span style={{ color: '#FF9F43', fontWeight: '700', marginLeft: '3px', textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>{currentDay}</span>
            </span>
          
          {/* Price Display */}
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.15)',
            padding: '15px 20px', 
            borderRadius: '16px', 
            gap: '20px',
            backdropFilter: 'blur(5px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white',
            zIndex: 1
          }}>
            {/* Standard Price Section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: '600' }}>Standard</div>
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
                      <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#FF9F43', whiteSpace: 'nowrap' }}> {/* Changed color to orange */}
                        ${total.toFixed(2)}
                        <span style={{ fontSize: '11px', fontWeight: 'normal', color: 'rgba(255, 255, 255, 0.7)', marginLeft: '4px' }}>
                          (Base ${basePrice.toFixed(2)} + Tax ${tax.toFixed(2)})
                        </span>
                      </span>
                    );
                  })()
                }
              </div>
        </div>
        
            {/* Divider */}
            <div style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.2)', height: '30px' }}></div>

            {/* Jacuzzi Price Section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '20px' }}>🛁</span> {/* Jacuzzi Icon */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: '600' }}>Jacuzzi</div>
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
                       <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#FF9F43', whiteSpace: 'nowrap' }}> {/* Changed color to orange */}
                        ${total.toFixed(2)}
                        <span style={{ fontSize: '11px', fontWeight: 'normal', color: 'rgba(255, 255, 255, 0.7)', marginLeft: '4px' }}>
                          (Base ${basePrice.toFixed(2)} + Tax ${tax.toFixed(2)})
                        </span>
                      </span>
                    );
                  })()
                }
              </div>
            </div>
          </span>
          
          {/* Room Status Change Button */}
          <button 
            onClick={() => setShowRoomStatusModal(true)}
            style={{
              background: 'linear-gradient(90deg, #3498db, #2980b9)',
              color: 'white',
              border: 'none',
              borderRadius: '50px', 
              padding: '12px 24px', 
              cursor: 'pointer',
              fontSize: '14px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              marginLeft: 'auto',
              marginRight: '10px',
              boxShadow: '0 4px 15px rgba(52, 152, 219, 0.3)',
              transition: 'all 0.2s ease',
              fontWeight: '600',
              zIndex: 1
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(52, 152, 219, 0.5)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(52, 152, 219, 0.3)';
            }}
          >
            <span style={{ fontSize: '16px' }}>🔄</span> Change Room Status
          </button>
          
          {/* Price Change Button */}
          <button 
            onClick={() => setShowPriceChangeModal(true)}
            style={{
              background: 'linear-gradient(90deg, #FF416C, #FF4B2B)',
              color: 'white',
              border: 'none',
              borderRadius: '50px', 
              padding: '12px 24px', 
              cursor: 'pointer',
              fontSize: '14px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 15px rgba(255, 65, 108, 0.3)',
              transition: 'all 0.2s ease',
              fontWeight: '600',
              zIndex: 1
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 65, 108, 0.5)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 65, 108, 0.3)';
            }}
          >
            <span style={{ fontSize: '16px' }}>💰</span> Price Change
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
          <div className="short-stay-section" style={{ 
            gridArea: 'shortstay',
            backgroundImage: 'linear-gradient(120deg, #f6f8fb 0%, #e9f2ff 100%)', 
            backgroundSize: 'cover',
            boxShadow: '0 8px 30px rgba(0, 31, 92, 0.12)',
            border: '1px solid rgba(255, 255, 255, 0.6)',
            position: 'relative',
            overflow: 'hidden'
          }}> 
            {/* Header */} 
                <div style={{ 
                  display: 'flex', 
              justifyContent: 'space-between', 
                  alignItems: 'center', 
              background: 'linear-gradient(90deg, #4776E6, #8E54E9)',
              padding: '12px 15px', 
              borderRadius: '10px',
              color: 'white',
              marginBottom: '15px',
              boxShadow: '0 4px 15px rgba(71, 118, 230, 0.2)'
            }}>
              <h2 className="section-header" style={{ margin: 0, borderBottom: 'none', color: 'white', fontSize: '16px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>Short Stay</h2>
              <button 
                onClick={clearShortStay}
                style={{ 
                  background: 'rgba(255,255,255,0.15)',
                  padding: '6px 12px', 
                  fontSize: '12px', 
                  color: 'white',
                  border: 'none',
                  borderRadius: '20px', 
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backdropFilter: 'blur(5px)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Clear Options
              </button>
                </div>
            
            {/* Row 1: Time and Extra Hours */} 
            <div className="section-controls-row"> 
              {/* Check-in & Check-out Group */} 
              <div className="date-time-display" style={{ width: '68%', display: 'flex', justifyContent: 'space-between', gap: '15px' }}> 
                <div className="check-time" style={{ 
                  width: '48%', 
                  backgroundColor: 'rgba(255, 255, 255, 0.6)',
                  borderRadius: '12px',
                  padding: '10px 15px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                }}> 
                  <label style={{ fontSize: '16px', fontWeight: '600', display: 'block', marginBottom: '5px', color: '#4a5568' }}>Check-in @</label>
                  <span style={{ fontSize: '18px', fontWeight: '700', color: '#2d3748' }}>{currentTime}</span>
                </div>
                <div className="check-time" style={{ 
                  width: '48%', 
                  backgroundColor: 'rgba(255, 255, 255, 0.6)',
                  borderRadius: '12px',
                  padding: '10px 15px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                }}> 
                  <label style={{ fontSize: '16px', fontWeight: '600', display: 'block', marginBottom: '5px', color: '#4a5568' }}>Check-out @</label>
                  <span style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: extraHours > 0 ? '#f92b04' : '#2d3748', // Orange if extra hours > 0
                    transition: 'color 0.3s ease'
                  }}>{checkoutTime}</span>
              </div>
                </div>
                
              {/* Extra Hours */} 
              <div className="extra-hours" style={{ width: '32%' }}> 
                <label style={{ fontSize: '16px', fontWeight: '600' }}>Extra Hours:</label> 
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '2px', marginTop: '5px' }}> 
                  <button 
                    className="minus-btn" 
                    onClick={() => handleExtraHoursChange(-1)} 
                    style={{ 
                      padding: '0',
                      width: '32px', 
                      height: '32px', 
                      borderRadius: '50%', 
                      border: 'none', 
                      backgroundColor: '#E53935', 
                      color: 'white', 
                      fontSize: '18px', 
                      fontWeight: 'bold', 
                      cursor: 'pointer',
                      lineHeight: '32px',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                    }}
                  >-</button> 
                  <span style={{ fontSize: '20px', fontWeight: 'bold', minWidth: '30px', textAlign: 'center' }}>{extraHours}</span> 
                  <button 
                    className="plus-btn" 
                    onClick={() => handleExtraHoursChange(1)} 
                    style={{ 
                      padding: '0',
                      width: '32px', 
                      height: '32px', 
                      borderRadius: '50%', 
                      border: 'none', 
                      backgroundColor: '#4CAF50', 
                      color: 'white', 
                      fontSize: '18px', 
                      fontWeight: 'bold', 
                      cursor: 'pointer',
                      lineHeight: '32px',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                    }}
                  >+</button> 
                </div>
                <span className="hours-note" style={{ color: '#00308F', fontWeight: 'bold', fontSize: '12px', textAlign: 'center', display: 'block', marginTop: '3px' }}>(Total: {4 + extraHours}hr)</span>
              </div>
            </div>
            
            {/* Row 2: Options */} 
            <div className="options-row"> 
              {/* Room Type Box */} 
              <div className="option-box"> 
                <label>Room Type</label> 
                <div className="segmented-control"> 
                  <button onClick={() => setHasJacuzzi(false)} className={!hasJacuzzi ? 'active' : ''}>No Jacuzzi</button>
                  <button onClick={() => setHasJacuzzi(true)} className={hasJacuzzi ? 'active' : ''}>Jacuzzi</button>
                </div>
              </div>
              {/* Payment Box */} 
              <div className="option-box"> 
                <label>Payment</label> 
                <div className="segmented-control"> 
                  <button onClick={() => setPaymentMethod('cash')} className={paymentMethod === 'cash' ? 'active' : ''}>Cash</button>
                  <button onClick={() => setPaymentMethod('credit')} className={paymentMethod === 'credit' ? 'active' : ''}>Credit</button>
                </div>
              </div>
              {/* Extra Rate Box */} 
              <div className="option-box"> 
                <label>Extra Rate</label> 
                <div className="segmented-control"> 
                  <button onClick={() => setExtraHourRate(15)} className={extraHourRate === 15 ? 'active' : ''}>${shortStayPrices.extraHourRate.regular}/hr</button>
                  <button onClick={() => setExtraHourRate(10)} className={extraHourRate === 10 ? 'active' : ''}>${shortStayPrices.extraHourRate.discounted}/hr</button>
                </div>
              </div>
            </div>
            
            {/* Price Summary */} 
            <div className="price-summary" style={{ marginTop: '5px', padding: '5px', backgroundColor: '#2c3e50', borderRadius: '4px', border: '1px solid #eee', background: 'linear-gradient(135deg, #2c3e50, #4776E6)' }}> 
               {/* Summary Lines - Ensure minimal margins/padding */} 
               <div className="summary-line" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '1px' }}>
                  <span style={{ color: 'white' }}>Base (4hr):</span>
                  <span style={{ color: 'white', fontWeight: '600' }}>${(hasJacuzzi ? shortStayPrices.baseRate.withJacuzzi : shortStayPrices.baseRate.withoutJacuzzi).toFixed(2)}</span>
              </div>
              {paymentMethod === 'credit' && (
                  <div className="summary-line" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '1px' }}>
                    <span style={{ color: 'white' }}>Tax (15%):</span>
                    <span style={{ color: 'white', fontWeight: '600' }}>${((hasJacuzzi ? shortStayPrices.baseRate.withJacuzzi : shortStayPrices.baseRate.withoutJacuzzi) * 0.15).toFixed(2)}</span>
                </div>
              )}
                <div className="summary-line" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '1px' }}>
                  <span style={{ color: 'white' }}>Extra Hrs ({extraHours}):</span>
                  <span style={{ color: 'white', fontWeight: '600' }}>${(extraHours * (extraHourRate === 15 ? shortStayPrices.extraHourRate.regular : shortStayPrices.extraHourRate.discounted)).toFixed(2)}</span>
              </div>
                <div className="summary-line total" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 'bold', color: 'white', borderTop: '1px solid rgba(255,255,255,0.3)', marginTop: '3px', paddingTop: '3px' }}> 
                  <span style={{ color: 'white' }}>Total Price:</span>
                  <span style={{ color: 'white', fontWeight: '700' }}>${totalPrice.toFixed(2)}</span>
              </div>
            
            {/* Selected Rooms Display */}
            {selectedRoomsForShortStay.length > 0 && (
              <div className="selected-rooms-container" style={{ 
                marginTop: '15px',
                background: 'rgba(255, 255, 255, 0.6)',
                borderRadius: '10px',
                padding: '12px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}>
                <h3 style={{ 
                  fontSize: '16px', 
                  margin: '0 0 10px 0',
                  color: '#304B82',
                  borderBottom: '1px solid #c7d2fe',
                  paddingBottom: '5px'
                }}>Selected Rooms</h3>
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '10px'
                }}>
                  {selectedRoomsForShortStay.map(roomNumber => {
                    // Find room in either floor
                    const room = [...rooms.groundFloor, ...rooms.firstFloor].find(r => r.number === roomNumber);
                    
                    return room ? (
                      <div key={roomNumber} className={`room-card ${room.status === 'available' ? 'available' : room.status === 'cleared' ? 'cleared' : 'occupied'}`} style={{
                        position: 'relative',
                        minWidth: '140px'
                      }}>
                        <div className="room-number">Room {room.number}</div>
                        <div>{room.beds}</div>
                        <div className="room-features">
                          {room.type === 'jacuzzi' && <span>🛁</span>}
                          {room.smoking ? <span>🚬</span> : <span>🚭</span>}
                          {room.handicap && <span>♿</span>}
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRoomSelectionForShortStay(room.number);
                          }}
                          style={{
                            position: 'absolute',
                            top: '5px',
                            right: '5px',
                            background: 'rgba(255, 255, 255, 0.8)',
                            color: '#e53e3e',
                            border: 'none',
                            borderRadius: '50%',
                            width: '22px',
                            height: '22px',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                            zIndex: 2
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            )}
            </div>
          </div>
          
          {/* Multiple Nights Section - Top Right */}
          <div className="multi-night-section" style={{ 
            gridArea: 'multinight', 
            backgroundImage: 'linear-gradient(120deg, #f6f8fb 0%, #e5f5ef 100%)',
            backgroundSize: 'cover',
            boxShadow: '0 8px 30px rgba(0, 31, 92, 0.12)',
            border: '1px solid rgba(255, 255, 255, 0.6)',
            position: 'relative',
            overflow: 'hidden'
          }}> 
            {/* Header */} 
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '15px',
              background: 'linear-gradient(90deg, #11998e, #38ef7d)',
              padding: '12px 15px',
              borderRadius: '10px',
              color: 'white',
              boxShadow: '0 4px 15px rgba(17, 153, 142, 0.2)'
            }}>
              <h2 className="section-header" style={{ margin: 0, color: 'white', fontSize: '16px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>Multiple Nights</h2>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  className="add-more-button"
                  onClick={() => resetOvernightStay()}
            style={{
                    background: 'rgba(255,255,255,0.15)',
                    padding: '6px 12px', 
                    fontSize: '12px', 
                    color: 'white',
                    border: 'none',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    transition: 'all 0.2s ease',
                    backdropFilter: 'blur(5px)'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <span style={{ fontSize: '14px' }}>+</span> Add Stay
                </button>
                {/* Add Clear Button */}
              <button 
                  onClick={clearMultipleNights}
                  style={{ 
                    background: 'rgba(255,255,255,0.15)',
                    padding: '6px 12px', 
                    fontSize: '12px', 
                    color: 'white',
                    border: 'none',
                    borderRadius: '20px', 
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    backdropFilter: 'blur(5px)'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Clear
              </button>
              </div>
            </div>
            
            {/* Dates and Hour Adjustments - Using Grid */} 
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}> {/* Increased gaps/margin */}
              {/* Check-in Column */} 
              <div className="date-picker-container">
                <label>Check-in Date:</label>
                <DatePicker
                  selected={checkInDate}
                  onChange={handleCheckInChange}
                  dateFormat="MM/dd/yy"
                  className="date-picker compact-datepicker"
                  showTimeSelect={false}
                  popperPlacement="bottom-start"
                  calendarClassName="compact-calendar"
                />
                <div className="extra-hours-overnight">
                  <label>Hour Adj:</label>
                  <div className="extra-hours-controls"> 
                    <div className="hours-control">
                      <button className="minus-btn" onClick={() => handleOvernightExtraHoursChange(-1)}>-</button>
                      <span>{overnightExtraHours}</span>
                      <button className="plus-btn" onClick={() => handleOvernightExtraHoursChange(1)}>+</button>
                    </div>
                    <span className="hours-note"> 
                      {/* Time calculation - kept compact */}
                      {overnightExtraHours !== 0 ? `(${new Date(new Date().setHours(15 + overnightExtraHours, 0, 0, 0)).toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'})})` : '(3.00 PM)'}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Check-out Column */} 
              <div className="date-picker-container">
                <label>Check-out Date:</label>
                <DatePicker
                  selected={checkOutDate}
                  onChange={handleCheckOutChange}
                  dateFormat="MM/dd/yy"
                  className="date-picker compact-datepicker"
                  showTimeSelect={false}
                  popperPlacement="bottom-start"
                  calendarClassName="compact-calendar"
                />
                <div className="extra-hours-overnight">
                  <label>Hour Adj:</label>
                  <div className="extra-hours-controls"> 
                    <div className="hours-control">
                      <button className="minus-btn" onClick={() => handleCheckoutExtraHoursChange(-1)}>-</button> 
                      <span>{overnightCheckoutExtraHours}</span> 
                      <button className="plus-btn" onClick={() => handleCheckoutExtraHoursChange(1)}>+</button> 
                    </div>
                    <span className="hours-note"> 
                      {/* Time calculation - kept compact */}
                      {overnightCheckoutExtraHours !== 0 ? `(${new Date(new Date().setHours(11 + overnightCheckoutExtraHours, 0, 0, 0)).toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'})})` : '(11.00 AM)'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Options - Using Grid */}
            <div className="options-grid"> 
              {/* Column 1: Room Type & Bed Type */}
              <div className="options-column"> 
                {/* Room Type Box */}
                <div className="option-box"> 
                  <label>Room Type</label> 
                  <div className="segmented-control"> 
                    <button onClick={() => setHasJacuzziOvernight(false)} className={!hasJacuzziOvernight ? 'active' : ''}>No Jacuzzi</button> 
                    <button onClick={() => setHasJacuzziOvernight(true)} className={hasJacuzziOvernight ? 'active' : ''}>Jacuzzi</button> 
                </div>
              </div>
                {/* Bed Type Box */}
                <div className="option-box"> 
                  <label>Bed Type</label> 
                  <div className="segmented-control"> 
                    <button onClick={() => setBedType('Queen')} className={bedType === 'Queen' ? 'active' : ''}>Queen</button> 
                    <button onClick={() => setBedType('King')} className={bedType === 'King' ? 'active' : ''}>King</button> 
                  {!hasJacuzziOvernight && (
                      <button onClick={() => setBedType('Queen 2 Beds')} className={bedType === 'Queen 2 Beds' ? 'active' : ''}>Queen 2 Beds</button> /* Added transition */
                  )}
                </div>
                </div>
              </div>
              
              {/* Column 2: Payment & Extra Rate */}
              <div className="options-column"> 
                {/* Payment Box */}
                <div className="option-box"> 
                  <label>Payment</label> 
                  <div className="segmented-control"> 
                    <button onClick={() => setOvernightPayment('cash')} className={overnightPayment === 'cash' ? 'active' : ''}>Cash</button> 
                    <button onClick={() => setOvernightPayment('credit')} className={overnightPayment === 'credit' ? 'active' : ''}>Credit Card</button> 
                </div>
              </div>
                {/* Extra Rate Box */}
                <div className="option-box"> 
                  <label>Extra Rate</label> 
                  <div className="segmented-control"> 
                    <button 
                      onClick={() => {
                        setOvernightRateType('regular');
                        setOvernightExtraRate(shortStayPrices.extraHourRate.regular);
                      }} 
                      className={overnightRateType === 'regular' ? 'active' : ''}
                    >
                      ${shortStayPrices.extraHourRate.regular}/hr
                    </button> 
                    <button 
                      onClick={() => {
                        setOvernightRateType('discounted');
                        setOvernightExtraRate(shortStayPrices.extraHourRate.discounted);
                      }} 
                      className={overnightRateType === 'discounted' ? 'active' : ''}
                    >
                      ${shortStayPrices.extraHourRate.discounted}/hr
                    </button> 
                  </div>
                </div>
              </div>
            </div>
            
            {/* Render Price Summary - Takes remaining space */}
            <div className="price-summary-container"> 
            {renderOvernightStayPriceSummary()}
            </div> 
          </div>

          {/* Ground Floor Section - Bottom Left */}
          <div style={{ 
            gridArea: 'groundfloor', 
            background: 'linear-gradient(135deg, #f9e7e7, #fff1f1)',
            backgroundSize: 'cover',
            padding: '20px', 
            borderRadius: '16px',
            boxShadow: '0 8px 30px rgba(0, 31, 92, 0.12)',
            border: '1px solid rgba(255, 255, 255, 0.6)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ 
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(255, 65, 108, 0.03) 0%, transparent 20%), radial-gradient(circle at 90% 80%, rgba(255, 75, 43, 0.03) 0%, transparent 20%)',
              opacity: 1
            }}></div>
            
            <div style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '6px',
              background: 'linear-gradient(90deg, #FC5C7D, #6A82FB)',
              borderRadius: '16px 16px 0 0'
            }}></div>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              background: 'linear-gradient(90deg, #FC5C7D, #6A82FB)',
              padding: '12px 15px', 
              borderRadius: '12px',
              color: 'white',
              marginBottom: '15px',
              boxShadow: '0 4px 15px rgba(252, 92, 125, 0.2)',
              position: 'relative',
              zIndex: 1
            }}>
              <h2 className="section-header" style={{ margin: 0, borderBottom: 'none', color: 'white', fontSize: '16px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>Ground Floor</h2>
            </div>
              
              {/* Admin status and logout */}
              {isAuthenticated && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '15px',
                  padding: '15px 20px',
                  background: 'white',
                  borderRadius: '15px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                  position: 'relative',
                  zIndex: 5
                }}>
                  <div style={{ 
                    color: '#65B97B',
                    fontWeight: 'bold',
                    fontSize: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ fontSize: '22px' }}>✓</span> Admin Mode Active
                  </div>
                  <button
                    id="logoutButton"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleLogout();
                    }}
                    style={{
                      background: '#E85B65',
                      padding: '8px 20px',
                      borderRadius: '50px',
                      border: 'none',
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      position: 'relative',
                      zIndex: 10
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
              
              {/* Room Filters Title - REMOVED */}
              
              {/* Room Filters */}
              <div className="room-filters" style={{
                  display: 'flex',
                  gap: '10px',
              marginBottom: '15px',
              padding: '15px', 
              background: 'linear-gradient(145deg, rgba(255,255,255,0.85), rgba(255,245,245,0.7))',
              borderRadius: '12px',
                  justifyContent: 'flex-start',
              flexWrap: 'wrap', 
              overflowX: 'auto',
              boxShadow: 'inset 0 1px 5px rgba(0,0,0,0.05), 0 2px 10px rgba(255, 65, 108, 0.1)',
              border: '1px solid rgba(255,255,255,0.6)',
              position: 'relative',
              zIndex: 2
            }}>
              {/* All Button */}
                  <button
                    onClick={() => handleFilterClick('all')}
                    className={selectedFilters.length === 0 ? "all-button-selected" : "all-button-unselected"}
                    style={{
                  borderRadius: '50px',
                      padding: '10px 20px',
                      fontWeight: selectedFilters.length === 0 ? 700 : 600,
                      fontSize: '14px',
                      cursor: 'pointer',
                      margin: '6px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                  transition: 'all 0.2s ease',
                      backgroundColor: selectedFilters.length === 0 ? '#304B82' : '#eef2ff',
                      color: selectedFilters.length === 0 ? '#ffffff' : '#304B82',
                      border: selectedFilters.length === 0 ? '2px solid #304B82' : '2px solid #c7d2fe',
                      boxShadow: selectedFilters.length === 0 
                        ? '0 4px 10px rgba(48, 75, 130, 0.35)'
                        : '0 2px 5px rgba(0,0,0,0.08)',
                      transform: selectedFilters.length === 0 ? 'translateY(-2px)' : 'none'
                    }}
                    onMouseOver={(e) => {
                      if (selectedFilters.length !== 0) {
                        e.target.style.backgroundColor = '#dbe4ff';
                        e.target.style.opacity = '1';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (selectedFilters.length !== 0) {
                        e.target.style.backgroundColor = '#eef2ff';
                        e.target.style.opacity = '0.85';
                      }
                }}
              >
                All
                  </button>
              {/* Available Button */}
                  <button
                    onClick={() => handleFilterClick('available')}
                    style={{
                  backgroundColor: selectedFilters.includes('available') ? '#10B981 !important' : '#dcfce7 !important',
                  color: selectedFilters.includes('available') ? '#ffffff !important' : '#15803d !important',
                  border: selectedFilters.includes('available') ? '2px solid #0f9d7a !important' : '2px solid #86efac !important',
                  borderRadius: '50px !important',
                  padding: '8px 20px !important',
                  fontWeight: selectedFilters.includes('available') ? '700 !important' : '600 !important',
                  cursor: 'pointer !important',
                  fontSize: '14px !important',
                  transition: 'all 0.2s ease !important',
                      boxShadow: selectedFilters.includes('available')
                    ? '0 4px 10px rgba(16, 185, 129, 0.35) !important'
                    : '0 2px 5px rgba(0,0,0,0.08) !important',
                  transform: selectedFilters.includes('available') ? 'translateY(-2px) !important' : 'none !important',
                  position: 'relative !important',
                  zIndex: '2 !important',
                  width: 'auto !important',
                  height: 'auto !important',
                  display: 'inline-flex !important',
                  alignItems: 'center !important',
                  justifyContent: 'center !important',
                  marginBottom: '0 !important',
                  textTransform: 'none !important'
                }}
              >
                    Available
                  </button>
              {/* Jacuzzi Button */}
                  <button
                    onClick={() => handleFilterClick('jacuzzi')}
                    style={{
                  backgroundColor: selectedFilters.includes('jacuzzi') ? '#38BDF8' : '#e0f2fe',
                  color: selectedFilters.includes('jacuzzi') ? '#ffffff' : '#0369a1',
                  border: selectedFilters.includes('jacuzzi') ? '2px solid #24a8e0' : '2px solid #7dd3fc',
                  borderRadius: '50px',
                  padding: '8px 20px',
                  fontWeight: selectedFilters.includes('jacuzzi') ? '700' : '600',
                      cursor: 'pointer',
                      fontSize: '14px',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: selectedFilters.includes('jacuzzi')
                    ? '0 4px 10px rgba(56, 189, 248, 0.35)'
                    : '0 2px 5px rgba(0,0,0,0.08)',
                  transform: selectedFilters.includes('jacuzzi') ? 'translateY(-2px)' : 'none',
                  position: 'relative',
                  zIndex: 2
                }}
              >
                <span style={{ fontSize: '16px' }}>🛁</span> Jacuzzi
                  </button>

              {/* Non-Jacuzzi Button */}
                  <button
                    onClick={() => handleFilterClick('non-jacuzzi')}
                    style={{
                  backgroundColor: selectedFilters.includes('non-jacuzzi') ? '#6366F1' : '#ede9fe',
                  color: selectedFilters.includes('non-jacuzzi') ? '#ffffff' : '#5b21b6',
                  border: selectedFilters.includes('non-jacuzzi') ? '2px solid #4e51d6' : '2px solid #c4b5fd',
                  borderRadius: '50px',
                  padding: '8px 20px',
                  fontWeight: selectedFilters.includes('non-jacuzzi') ? '700' : '600',
                      cursor: 'pointer',
                      fontSize: '14px',
                  transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                  gap: '6px',
                  boxShadow: selectedFilters.includes('non-jacuzzi')
                    ? '0 4px 10px rgba(99, 102, 241, 0.35)'
                    : '0 2px 5px rgba(0,0,0,0.08)',
                  transform: selectedFilters.includes('non-jacuzzi') ? 'translateY(-2px)' : 'none',
                  position: 'relative',
                  zIndex: 2
                    }}
                  >
                <span style={{ fontSize: '16px' }}>🚿</span> Non-Jacuzzi
                  </button>
              {/* Smoking Button */}
                  <button
                onClick={() => handleFilterClick('smoking')}
                    style={{
                  backgroundColor: selectedFilters.includes('smoking') ? '#F97316' : '#fff7ed',
                  color: selectedFilters.includes('smoking') ? '#ffffff' : '#c2410c',
                  border: selectedFilters.includes('smoking') ? '2px solid #e4630a' : '2px solid #fdba74',
                  borderRadius: '50px',
                  padding: '8px 20px',
                  fontWeight: selectedFilters.includes('smoking') ? '700' : '600',
                      cursor: 'pointer',
                      fontSize: '14px',
                  transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                  gap: '6px',
                  boxShadow: selectedFilters.includes('smoking')
                    ? '0 4px 10px rgba(249, 115, 22, 0.35)'
                    : '0 2px 5px rgba(0,0,0,0.08)',
                  transform: selectedFilters.includes('smoking') ? 'translateY(-2px)' : 'none',
                  position: 'relative',
                  zIndex: 2
                    }}
                  >
                <span style={{ fontSize: '16px' }}>🚬</span> Smoking
                  </button>
              {/* Non-Smoking Button */}
                  <button
                    onClick={() => handleFilterClick('non-smoking')}
                    style={{
                  backgroundColor: selectedFilters.includes('non-smoking') ? '#64748B' : '#f1f5f9',
                  color: selectedFilters.includes('non-smoking') ? '#ffffff' : '#334155',
                  border: selectedFilters.includes('non-smoking') ? '2px solid #525d6d' : '2px solid #cbd5e1',
                  borderRadius: '50px',
                  padding: '8px 20px',
                  fontWeight: selectedFilters.includes('non-smoking') ? '700' : '600',
                      cursor: 'pointer',
                      fontSize: '14px',
                  transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                  gap: '6px',
                  boxShadow: selectedFilters.includes('non-smoking')
                    ? '0 4px 10px rgba(100, 116, 139, 0.35)'
                    : '0 2px 5px rgba(0,0,0,0.08)',
                  transform: selectedFilters.includes('non-smoking') ? 'translateY(-2px)' : 'none',
                  position: 'relative',
                  zIndex: 2
                    }}
                  >
                <span style={{ fontSize: '16px' }}>🚭</span> Non-Smoking
                  </button>
              {/* Handicap Button */}
                  <button
                onClick={() => handleFilterClick('handicap')}
                    style={{
                  backgroundColor: selectedFilters.includes('handicap') ? '#8B5CF6' : '#f5f3ff',
                  color: selectedFilters.includes('handicap') ? '#ffffff' : '#6d28d9',
                  border: selectedFilters.includes('handicap') ? '2px solid #7a43e8' : '2px solid #c4b5fd',
                  borderRadius: '50px',
                  padding: '8px 20px',
                  fontWeight: selectedFilters.includes('handicap') ? '700' : '600',
                      cursor: 'pointer',
                      fontSize: '14px',
                  transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                  gap: '6px',
                  boxShadow: selectedFilters.includes('handicap')
                    ? '0 4px 10px rgba(139, 92, 246, 0.35)'
                    : '0 2px 5px rgba(0,0,0,0.08)',
                  transform: selectedFilters.includes('handicap') ? 'translateY(-2px)' : 'none',
                  position: 'relative',
                  zIndex: 2
                    }}
                  >
                <span style={{ fontSize: '16px' }}>♿</span> Handicap
                  </button>
              {/* Queen Button */}
                  <button
                onClick={() => handleFilterClick('Queen')}
                    style={{
                  backgroundColor: selectedFilters.includes('Queen') ? '#EC4899' : '#fdf2f8',
                  color: selectedFilters.includes('Queen') ? '#ffffff' : '#be185d',
                  border: selectedFilters.includes('Queen') ? '2px solid #d63787' : '2px solid #fbcfe8',
                  borderRadius: '50px',
                  padding: '8px 20px',
                  fontWeight: selectedFilters.includes('Queen') ? '700' : '600',
                      cursor: 'pointer',
                      fontSize: '14px',
                  transition: 'all 0.2s ease',
                  boxShadow: selectedFilters.includes('Queen')
                    ? '0 4px 10px rgba(236, 72, 153, 0.35)'
                    : '0 2px 5px rgba(0,0,0,0.08)',
                  transform: selectedFilters.includes('Queen') ? 'translateY(-2px)' : 'none',
                  position: 'relative',
                  zIndex: 2
                }}
              >
                Queen
                  </button>
              {/* King Button */}
                  <button
                onClick={() => handleFilterClick('King')}
                    style={{
                  backgroundColor: selectedFilters.includes('King') ? '#6366F1' : '#eef2ff',
                  color: selectedFilters.includes('King') ? '#ffffff' : '#4338ca',
                  border: selectedFilters.includes('King') ? '2px solid #4e51d6' : '2px solid #c7d2fe',
                  borderRadius: '50px',
                  padding: '8px 20px',
                  fontWeight: selectedFilters.includes('King') ? '700' : '600',
                      cursor: 'pointer',
                      fontSize: '14px',
                  transition: 'all 0.2s ease',
                  boxShadow: selectedFilters.includes('King')
                    ? '0 4px 10px rgba(99, 102, 241, 0.35)'
                    : '0 2px 5px rgba(0,0,0,0.08)',
                  transform: selectedFilters.includes('King') ? 'translateY(-2px)' : 'none',
                  position: 'relative',
                  zIndex: 2
                }}
              >
                King
                  </button>
              {/* Queen 2 Beds Button */}
                  <button
                onClick={() => handleFilterClick('Queen 2 Beds')}
                    style={{
                  backgroundColor: selectedFilters.includes('Queen 2 Beds') ? '#0EA5E9' : '#f0f9ff',
                  color: selectedFilters.includes('Queen 2 Beds') ? '#ffffff' : '#0369a1',
                  border: selectedFilters.includes('Queen 2 Beds') ? '2px solid #0b8ac4' : '2px solid #bae6fd',
                  borderRadius: '50px',
                  padding: '8px 20px',
                  fontWeight: selectedFilters.includes('Queen 2 Beds') ? '700' : '600',
                      cursor: 'pointer',
                      fontSize: '14px',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                  boxShadow: selectedFilters.includes('Queen 2 Beds')
                    ? '0 4px 10px rgba(14, 165, 233, 0.35)'
                    : '0 2px 5px rgba(0,0,0,0.08)',
                  transform: selectedFilters.includes('Queen 2 Beds') ? 'translateY(-2px)' : 'none',
                  position: 'relative',
                  zIndex: 2
                }}
              >
                    Queen 2 Beds
                  </button>
              </div>

            {/* Ground Floor Rooms */}
                  <div className="rooms-grid" style={{
              position: 'relative',
              zIndex: 2
                  }}>
                    {rooms.groundFloor
                      .filter(filterRoom)
                      .map(room => (
                        <div key={room.number} 
                            className={`room-card ${room.status === 'available' ? 'available' : room.status === 'cleared' ? 'cleared' : 'occupied'}`}
                            onClick={() => handleRoomCardClick('groundFloor', room.number)}
                            style={selectedRoomsForShortStay.length > 0 && !selectedRoomsForShortStay.includes(room.number) ? {
                              opacity: 0.4,
                              filter: 'grayscale(80%)',
                              pointerEvents: 'none',
                              transform: 'none',
                              boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                            } : {}}
                        >
                          <div className="room-number">Room {room.number}</div>
                          <div>{room.beds}</div>
                          <div className="room-features">
                            {room.type === 'jacuzzi' && <span>🛁</span>}
                            {room.smoking ? <span>🚬</span> : <span>🚭</span>}
                            {room.handicap && <span>♿</span>}
                          </div>
                          <div className="price-tag">
                            {(() => { /* Changed to return JSX for breakdown */
                              // Calculate price based on room properties
                              const now = new Date();
                              const day = now.getDay();
                              
                              // Base price calculation
                              let basePrice;
                              if (day === 5) { // Friday
                                basePrice = room.type === 'jacuzzi' ? prices.friday.withJacuzzi : prices.friday.withoutJacuzzi;
                              } else if (day === 0 || day === 6) { // Weekend
                                basePrice = room.type === 'jacuzzi' ? prices.weekend.withJacuzzi : prices.weekend.withoutJacuzzi;
                              } else { // Weekday
                                basePrice = room.type === 'jacuzzi' ? prices.weekday.withJacuzzi : prices.weekday.withoutJacuzzi;
                              }
                              
                              // Add bed adjustment
                              if (room.beds.includes('King')) {
                                basePrice += 5;
                              } else if (room.beds.includes('2 Beds')) {
                                basePrice += 10;
                              }
                              
                              // Add tax
                              const tax = basePrice * 0.15;
                              const total = basePrice + tax;
                              
                              return (
                                <>
                                  <span style={{ fontSize: '9px', lineHeight: '1.1', display: 'block', color: 'rgba(255, 255, 255, 0.9)', fontWeight: '500' }}>Base:${basePrice.toFixed(2)}</span>
                                  <span style={{ fontSize: '9px', lineHeight: '1.1', display: 'block', color: 'rgba(255, 255, 255, 0.9)', fontWeight: '500' }}>Tax:${tax.toFixed(2)}</span>
                                  <span style={{ fontSize: '10px', fontWeight: 'bold', lineHeight: '1.1', display: 'block' }}>Total:${total.toFixed(2)}</span>
                                </>
                              );
                            })()}
                              </div>
                                  </div>
                      ))}
                                </div>
                              </div>
                              
          {/* First Floor Section - Bottom Right */}
                              <div style={{ 
            gridArea: 'firstfloor', 
            background: 'linear-gradient(135deg, #eff1fe, #e6ecff)',
            backgroundSize: 'cover',
            padding: '20px', 
            borderRadius: '16px',
            boxShadow: '0 8px 30px rgba(0, 31, 92, 0.12)',
            border: '1px solid rgba(255, 255, 255, 0.6)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ 
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(106, 130, 251, 0.04) 0%, transparent 25%), radial-gradient(circle at 85% 80%, rgba(252, 92, 125, 0.03) 0%, transparent 20%)',
              opacity: 1
            }}></div>
            
            <div style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '6px',
              background: 'linear-gradient(90deg, #FC5C7D, #6A82FB)',
              borderRadius: '16px 16px 0 0'
            }}></div>
            
            <div style={{ 
                                display: 'flex',
              justifyContent: 'space-between', 
              alignItems: 'center', 
              background: 'linear-gradient(90deg, #FC5C7D, #6A82FB)',
              padding: '12px 15px', 
              borderRadius: '12px',
              color: 'white',
              marginBottom: '15px',
              boxShadow: '0 4px 15px rgba(252, 92, 125, 0.2)',
              position: 'relative',
              zIndex: 1
            }}>
              <h2 className="section-header" style={{ margin: 0, borderBottom: 'none', color: 'white', fontSize: '16px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>First Floor</h2>
            </div>
            
            {/* Room Filters Title - REMOVED */}
            
            {/* First Floor Rooms */}
            <div className="rooms-grid" style={{
              background: 'linear-gradient(145deg, rgba(255,255,255,0.85), rgba(243,241,255,0.7))',
              padding: '15px',
              borderRadius: '12px',
              boxShadow: '0 2px 10px rgba(106, 130, 251, 0.1)',
              border: '1px solid rgba(255,255,255,0.6)',
              position: 'relative',
              zIndex: 2
            }}>
                    {rooms.firstFloor
                      .filter(filterRoom)
                      .map(room => (
                        <div key={room.number} 
                            className={`room-card ${room.status === 'available' ? 'available' : room.status === 'cleared' ? 'cleared' : 'occupied'}`}
                            onClick={() => handleRoomCardClick('firstFloor', room.number)}
                            style={selectedRoomsForShortStay.length > 0 && !selectedRoomsForShortStay.includes(room.number) ? {
                              opacity: 0.4,
                              filter: 'grayscale(80%)',
                              pointerEvents: 'none',
                              transform: 'none',
                              boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                            } : {}}
                        >
                          <div className="room-number">Room {room.number}</div>
                          <div>{room.beds}</div>
                          <div className="room-features">
                            {room.type === 'jacuzzi' && <span>🛁</span>}
                            {room.smoking ? <span>🚬</span> : <span>🚭</span>}
                            {room.handicap && <span>♿</span>}
                          </div>
                          <div className="price-tag">
                            {(() => { /* Changed to return JSX for breakdown */
                              // Calculate price based on room properties
                                  const now = new Date();
                              const day = now.getDay();
                                  
                              // Base price calculation
                                  let basePrice;
                                  if (day === 5) { // Friday
                                    basePrice = room.type === 'jacuzzi' ? prices.friday.withJacuzzi : prices.friday.withoutJacuzzi;
                              } else if (day === 0 || day === 6) { // Weekend
                                    basePrice = room.type === 'jacuzzi' ? prices.weekend.withJacuzzi : prices.weekend.withoutJacuzzi;
                                  } else { // Weekday
                                    basePrice = room.type === 'jacuzzi' ? prices.weekday.withJacuzzi : prices.weekday.withoutJacuzzi;
                                  }
                                  
                              // Add bed adjustment
                              if (room.beds.includes('King')) {
                                basePrice += 5;
                              } else if (room.beds.includes('2 Beds')) {
                                basePrice += 10;
                              }
                              
                              // Add tax
                              const tax = basePrice * 0.15;
                              const total = basePrice + tax;
                              
                              return (
                                <>
                                  <span style={{ fontSize: '9px', lineHeight: '1.1', display: 'block', color: 'rgba(255, 255, 255, 0.9)', fontWeight: '500' }}>Base:${basePrice.toFixed(2)}</span>
                                  <span style={{ fontSize: '9px', lineHeight: '1.1', display: 'block', color: 'rgba(255, 255, 255, 0.9)', fontWeight: '500' }}>Tax:${tax.toFixed(2)}</span>
                                  <span style={{ fontSize: '10px', fontWeight: 'bold', lineHeight: '1.1', display: 'block' }}>Total:${total.toFixed(2)}</span>
                                </>
                              );
                            })()}
                          </div>
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

      {/* Room Status Selection Modal */}
      {showRoomStatusModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
            padding: '25px',
            borderRadius: '16px',
            width: '90%',
            maxWidth: '950px',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            position: 'relative'
          }}>
            <div style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
                    width: '100%',
              height: '8px',
              background: 'linear-gradient(90deg, #3498db, #2980b9)',
              borderRadius: '16px 16px 0 0'
            }}></div>
            
            <div style={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
              marginBottom: '20px',
              marginTop: '8px'
            }}>
              <h2 style={{ 
                margin: 0, 
                fontSize: '24px', 
                    fontWeight: 'bold',
                color: '#2d3748',
                position: 'relative',
                display: 'inline-block'
              }}>
                Select Room
                              <div style={{ 
                  position: 'absolute',
                  bottom: '-5px',
                  left: '0',
                  width: '40px',
                  height: '3px',
                  background: 'linear-gradient(90deg, #3498db, #2980b9)',
                  borderRadius: '3px'
                }}></div>
              </h2>
                                    <button
                onClick={() => setShowRoomStatusModal(false)}
                                      style={{
                  backgroundColor: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#a0aec0',
                  transition: 'all 0.2s ease',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)';
                  e.currentTarget.style.color = '#4a5568';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#a0aec0';
                }}
              >
                ×
                                </button>
                              </div>
            
            <div style={{ borderBottom: '1px solid #e2e8f0', marginBottom: '20px' }}></div>
            
            {/* Room Filters - Copied from Ground Floor Section */}
            <div className="room-filters" style={{
                display: 'flex',
                gap: '10px',
                marginBottom: '15px',
                padding: '15px', 
                background: 'linear-gradient(145deg, rgba(255,255,255,0.85), rgba(245, 248, 255, 0.7))',
                borderRadius: '12px',
                justifyContent: 'flex-start',
                flexWrap: 'wrap', 
                overflowX: 'auto',
                boxShadow: 'inset 0 1px 5px rgba(0,0,0,0.05), 0 2px 10px rgba(52, 152, 219, 0.1)',
                border: '1px solid rgba(226, 232, 240, 0.8)',
                position: 'relative',
                zIndex: 2
            }}>
              {/* All Button */}
                  <button
                    onClick={() => handleFilterClick('all')}
                    className={selectedFilters.length === 0 ? "all-button-selected" : "all-button-unselected"}
                    style={{
                      borderRadius: '50px',
                      padding: '10px 20px',
                      fontWeight: selectedFilters.length === 0 ? 700 : 600,
                      fontSize: '14px',
                      cursor: 'pointer',
                      margin: '6px',
                      display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                      transition: 'all 0.2s ease',
                      backgroundColor: selectedFilters.length === 0 ? '#304B82' : '#eef2ff',
                      color: selectedFilters.length === 0 ? '#ffffff' : '#304B82',
                      border: selectedFilters.length === 0 ? '2px solid #304B82' : '2px solid #c7d2fe',
                      boxShadow: selectedFilters.length === 0 
                        ? '0 4px 10px rgba(48, 75, 130, 0.35)'
                        : '0 2px 5px rgba(0,0,0,0.08)',
                      transform: selectedFilters.length === 0 ? 'translateY(-2px)' : 'none'
                    }}
                    onMouseOver={(e) => {
                      if (selectedFilters.length !== 0) {
                        e.target.style.backgroundColor = '#dbe4ff';
                        e.target.style.opacity = '1';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (selectedFilters.length !== 0) {
                        e.target.style.backgroundColor = '#eef2ff';
                        e.target.style.opacity = '0.85';
                      }
                    }}
                  >
                    All
                  </button>
              {/* Available Button */}
                  <button
                    onClick={() => handleFilterClick('available')}
                    style={{
                      backgroundColor: selectedFilters.includes('available') ? '#10B981 !important' : '#dcfce7 !important',
                      color: selectedFilters.includes('available') ? '#ffffff !important' : '#15803d !important',
                      border: selectedFilters.includes('available') ? '2px solid #0f9d7a !important' : '2px solid #86efac !important',
                      borderRadius: '50px !important',
                      padding: '8px 20px !important',
                      fontWeight: selectedFilters.includes('available') ? '700 !important' : '600 !important',
                      cursor: 'pointer !important',
                      fontSize: '14px !important',
                      transition: 'all 0.2s ease !important',
                      boxShadow: selectedFilters.includes('available')
                        ? '0 4px 10px rgba(16, 185, 129, 0.35) !important'
                        : '0 2px 5px rgba(0,0,0,0.08) !important',
                      transform: selectedFilters.includes('available') ? 'translateY(-2px) !important' : 'none !important',
                      position: 'relative !important',
                      zIndex: '2 !important',
                      width: 'auto !important',
                      height: 'auto !important',
                      display: 'inline-flex !important',
                      alignItems: 'center !important',
                      justifyContent: 'center !important',
                      marginBottom: '0 !important',
                      textTransform: 'none !important'
                    }}
                  >
                    Available
                  </button>
              {/* Jacuzzi Button */}
                  <button
                    onClick={() => handleFilterClick('jacuzzi')}
                    style={{
                      backgroundColor: selectedFilters.includes('jacuzzi') ? '#38BDF8' : '#e0f2fe',
                      color: selectedFilters.includes('jacuzzi') ? '#ffffff' : '#0369a1',
                      border: selectedFilters.includes('jacuzzi') ? '2px solid #24a8e0' : '2px solid #7dd3fc',
                      borderRadius: '50px',
                      padding: '8px 20px',
                      fontWeight: selectedFilters.includes('jacuzzi') ? '700' : '600',
                      cursor: 'pointer',
                      fontSize: '14px',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: selectedFilters.includes('jacuzzi')
                        ? '0 4px 10px rgba(56, 189, 248, 0.35)'
                        : '0 2px 5px rgba(0,0,0,0.08)',
                      transform: selectedFilters.includes('jacuzzi') ? 'translateY(-2px)' : 'none',
                      position: 'relative',
                      zIndex: 2
                    }}
                  >
                <span style={{ fontSize: '16px' }}>🛁</span> Jacuzzi
                  </button>

              {/* Non-Jacuzzi Button */}
                  <button
                    onClick={() => handleFilterClick('non-jacuzzi')}
                                  style={{
                      backgroundColor: selectedFilters.includes('non-jacuzzi') ? '#6366F1' : '#ede9fe',
                      color: selectedFilters.includes('non-jacuzzi') ? '#ffffff' : '#5b21b6',
                      border: selectedFilters.includes('non-jacuzzi') ? '2px solid #4e51d6' : '2px solid #c4b5fd',
                      borderRadius: '50px',
                      padding: '8px 20px',
                      fontWeight: selectedFilters.includes('non-jacuzzi') ? '700' : '600',
                      cursor: 'pointer',
                      fontSize: '14px',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: selectedFilters.includes('non-jacuzzi')
                        ? '0 4px 10px rgba(99, 102, 241, 0.35)'
                        : '0 2px 5px rgba(0,0,0,0.08)',
                      transform: selectedFilters.includes('non-jacuzzi') ? 'translateY(-2px)' : 'none',
                      position: 'relative',
                      zIndex: 2
                    }}
                  >
                <span style={{ fontSize: '16px' }}>🚿</span> Non-Jacuzzi
                  </button>
              {/* Smoking Button */}
                  <button
                onClick={() => handleFilterClick('smoking')}
                            style={{ 
                      backgroundColor: selectedFilters.includes('smoking') ? '#F97316' : '#fff7ed',
                      color: selectedFilters.includes('smoking') ? '#ffffff' : '#c2410c',
                      border: selectedFilters.includes('smoking') ? '2px solid #e4630a' : '2px solid #fdba74',
                      borderRadius: '50px',
                      padding: '8px 20px',
                      fontWeight: selectedFilters.includes('smoking') ? '700' : '600',
                      cursor: 'pointer',
                      fontSize: '14px',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: selectedFilters.includes('smoking')
                        ? '0 4px 10px rgba(249, 115, 22, 0.35)'
                        : '0 2px 5px rgba(0,0,0,0.08)',
                      transform: selectedFilters.includes('smoking') ? 'translateY(-2px)' : 'none',
                      position: 'relative',
                      zIndex: 2
                    }}
                  >
                <span style={{ fontSize: '16px' }}>🚬</span> Smoking
                  </button>
              {/* Non-Smoking Button */}
                  <button
                    onClick={() => handleFilterClick('non-smoking')}
                                    style={{
                      backgroundColor: selectedFilters.includes('non-smoking') ? '#64748B' : '#f1f5f9',
                      color: selectedFilters.includes('non-smoking') ? '#ffffff' : '#334155',
                      border: selectedFilters.includes('non-smoking') ? '2px solid #525d6d' : '2px solid #cbd5e1',
                      borderRadius: '50px',
                      padding: '8px 20px',
                      fontWeight: selectedFilters.includes('non-smoking') ? '700' : '600',
                      cursor: 'pointer',
                      fontSize: '14px',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: selectedFilters.includes('non-smoking')
                        ? '0 4px 10px rgba(100, 116, 139, 0.35)'
                        : '0 2px 5px rgba(0,0,0,0.08)',
                      transform: selectedFilters.includes('non-smoking') ? 'translateY(-2px)' : 'none',
                      position: 'relative',
                      zIndex: 2
                    }}
                  >
                <span style={{ fontSize: '16px' }}>🚭</span> Non-Smoking
                  </button>
              {/* Handicap Button */}
                  <button
                onClick={() => handleFilterClick('handicap')}
                                style={{
                      backgroundColor: selectedFilters.includes('handicap') ? '#8B5CF6' : '#f5f3ff',
                      color: selectedFilters.includes('handicap') ? '#ffffff' : '#6d28d9',
                      border: selectedFilters.includes('handicap') ? '2px solid #7a43e8' : '2px solid #c4b5fd',
                      borderRadius: '50px',
                      padding: '8px 20px',
                      fontWeight: selectedFilters.includes('handicap') ? '700' : '600',
                      cursor: 'pointer',
                      fontSize: '14px',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: selectedFilters.includes('handicap')
                        ? '0 4px 10px rgba(139, 92, 246, 0.35)'
                        : '0 2px 5px rgba(0,0,0,0.08)',
                      transform: selectedFilters.includes('handicap') ? 'translateY(-2px)' : 'none',
                      position: 'relative',
                      zIndex: 2
                    }}
                  >
                <span style={{ fontSize: '16px' }}>♿</span> Handicap
                  </button>
              {/* Queen Button */}
                  <button
                onClick={() => handleFilterClick('Queen')}
                    style={{
                      backgroundColor: selectedFilters.includes('Queen') ? '#EC4899' : '#fdf2f8',
                      color: selectedFilters.includes('Queen') ? '#ffffff' : '#be185d',
                      border: selectedFilters.includes('Queen') ? '2px solid #d63787' : '2px solid #fbcfe8',
                      borderRadius: '50px',
                      padding: '8px 20px',
                      fontWeight: selectedFilters.includes('Queen') ? '700' : '600',
                      cursor: 'pointer',
                      fontSize: '14px',
                      transition: 'all 0.2s ease',
                      boxShadow: selectedFilters.includes('Queen')
                        ? '0 4px 10px rgba(236, 72, 153, 0.35)'
                        : '0 2px 5px rgba(0,0,0,0.08)',
                      transform: selectedFilters.includes('Queen') ? 'translateY(-2px)' : 'none',
                      position: 'relative',
                      zIndex: 2
                    }}
                  >
                Queen
                  </button>
              {/* King Button */}
                  <button
                onClick={() => handleFilterClick('King')}
                    style={{
                      backgroundColor: selectedFilters.includes('King') ? '#6366F1' : '#eef2ff',
                      color: selectedFilters.includes('King') ? '#ffffff' : '#4338ca',
                      border: selectedFilters.includes('King') ? '2px solid #4e51d6' : '2px solid #c7d2fe',
                      borderRadius: '50px',
                      padding: '8px 20px',
                      fontWeight: selectedFilters.includes('King') ? '700' : '600',
                      cursor: 'pointer',
                      fontSize: '14px',
                      transition: 'all 0.2s ease',
                      boxShadow: selectedFilters.includes('King')
                        ? '0 4px 10px rgba(99, 102, 241, 0.35)'
                        : '0 2px 5px rgba(0,0,0,0.08)',
                      transform: selectedFilters.includes('King') ? 'translateY(-2px)' : 'none',
                      position: 'relative',
                      zIndex: 2
                    }}
                  >
                King
                  </button>
              {/* Queen 2 Beds Button */}
                  <button
                onClick={() => handleFilterClick('Queen 2 Beds')}
                    style={{
                      backgroundColor: selectedFilters.includes('Queen 2 Beds') ? '#0EA5E9' : '#f0f9ff',
                      color: selectedFilters.includes('Queen 2 Beds') ? '#ffffff' : '#0369a1',
                      border: selectedFilters.includes('Queen 2 Beds') ? '2px solid #0b8ac4' : '2px solid #bae6fd',
                      borderRadius: '50px',
                      padding: '8px 20px',
                      fontWeight: selectedFilters.includes('Queen 2 Beds') ? '700' : '600',
                      cursor: 'pointer',
                      fontSize: '14px',
                      transition: 'all 0.2s ease',
                      whiteSpace: 'nowrap',
                      boxShadow: selectedFilters.includes('Queen 2 Beds')
                        ? '0 4px 10px rgba(14, 165, 233, 0.35)'
                        : '0 2px 5px rgba(0,0,0,0.08)',
                      transform: selectedFilters.includes('Queen 2 Beds') ? 'translateY(-2px)' : 'none',
                      position: 'relative',
                      zIndex: 2
                    }}
                  >
                    Queen 2 Beds
                  </button>
                                      </div>

            {/* Ground Floor Rooms */}
            <div style={{ marginBottom: '20px' }}>
                    <h3 style={{ 
                  color: '#2d3748', 
                fontSize: '18px',
                borderBottom: '1px solid #e2e8f0',
                      paddingBottom: '10px',
                marginBottom: '15px'
                }}>
                Ground Floor
                    </h3>
                                      <div style={{ 
              display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '15px'
              }}>
                {rooms.groundFloor
                  .filter(filterRoom) // Apply filter here
                  .map(room => (
                  <div 
                    key={room.number}
                              style={{ 
                      padding: '15px',
                      borderRadius: '10px',
                      backgroundColor: room.status === 'available' ? 'rgba(42, 157, 143, 0.1)' : 
                                       room.status === 'cleared' ? 'rgba(87, 216, 168, 0.1)' : 
                                       'rgba(211, 47, 47, 0.1)',
                      border: selectedRoomsForShortStay.includes(room.number) ? '2px solid #3498db' : '1px solid #e2e8f0',
                      transition: 'all 0.2s ease',
                      position: 'relative'
                    }}
                  >
                            <input 
                      type="checkbox"
                      id={`room-${room.number}`}
                      name={`room-${room.number}`}
                      value={room.number}
                      checked={selectedRoomsForShortStay.includes(room.number)}
                      onChange={() => handleRoomSelectionForShortStay(room.number)}
                              style={{ 
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        width: '18px',
                        height: '18px',
                        cursor: 'pointer'
                      }}
                    />
                    <label 
                      htmlFor={`room-${room.number}`}
                              style={{ 
                        display: 'block',
                        cursor: 'pointer',
                        fontWeight: '600',
                              fontSize: '16px',
                        marginBottom: '10px',
                        color: '#2d3748'
                      }}
                    >
                      Room {room.number}
                    </label>
                                      <div style={{ 
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '5px',
                      fontSize: '14px',
                      color: '#4a5568'
                    }}>
                      <div>{room.beds}</div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {room.type === 'jacuzzi' && <span>🛁 Jacuzzi</span>}
                        {room.smoking ? <span>🚬 Smoking</span> : <span>🚭 Non-Smoking</span>}
                        {room.handicap && <span>♿ Handicap</span>}
                          </div>
                      <div style={{ 
                        marginTop: '5px',
                        padding: '4px 8px',
                        backgroundColor: room.status === 'available' ? '#2a9d8f' : 
                                        room.status === 'cleared' ? '#57d8a8' : 
                                        '#d32f2f',
                        color: 'white',
                        borderRadius: '4px',
                        display: 'inline-block',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                      </div>
                    </div>
                  </div>
                ))}
                    </div>
                  </div>

            {/* First Floor Rooms */}
            <div style={{ marginBottom: '20px' }}>
                <h3 style={{ 
                  color: '#2d3748',
                  fontSize: '18px',
                  borderBottom: '1px solid #e2e8f0',
                  paddingBottom: '10px',
                  marginBottom: '15px'
              }}>
                First Floor
                    </h3>
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '15px'
              }}>
                {rooms.firstFloor
                  .filter(filterRoom) // Apply filter here
                  .map(room => (
                    <div 
                      key={room.number}
                              style={{ 
                        padding: '15px',
                        borderRadius: '10px',
                        backgroundColor: room.status === 'available' ? 'rgba(42, 157, 143, 0.1)' : 
                                         room.status === 'cleared' ? 'rgba(87, 216, 168, 0.1)' : 
                                         'rgba(211, 47, 47, 0.1)',
                        border: selectedRoomsForShortStay.includes(room.number) ? '2px solid #3498db' : '1px solid #e2e8f0',
                        transition: 'all 0.2s ease',
                        position: 'relative'
                      }}
                    >
                          <input 
                        type="checkbox"
                        id={`room-${room.number}`}
                        name={`room-${room.number}`}
                        value={room.number}
                        checked={selectedRoomsForShortStay.includes(room.number)}
                        onChange={() => handleRoomSelectionForShortStay(room.number)}
                                  style={{
                          position: 'absolute',
                          top: '10px',
                          right: '10px',
                          width: '18px',
                          height: '18px',
                          cursor: 'pointer'
                        }}
                      />
                      <label 
                        htmlFor={`room-${room.number}`}
                            style={{ 
                          display: 'block',
                          cursor: 'pointer',
                          fontWeight: '600',
                              fontSize: '16px',
                          marginBottom: '10px',
                          color: '#2d3748'
                        }}
                      >
                        Room {room.number}
                      </label>
                      <div style={{ 
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '5px',
                        fontSize: '14px',
                        color: '#4a5568'
                      }}>
                        <div>{room.beds}</div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {room.type === 'jacuzzi' && <span>🛁 Jacuzzi</span>}
                          {room.smoking ? <span>🚬 Smoking</span> : <span>🚭 Non-Smoking</span>}
                          {room.handicap && <span>♿ Handicap</span>}
                        </div>
                        <div style={{ 
                          marginTop: '5px',
                          padding: '4px 8px',
                          backgroundColor: room.status === 'available' ? '#2a9d8f' : 
                                          room.status === 'cleared' ? '#57d8a8' : 
                                          '#d32f2f',
                          color: 'white',
                          borderRadius: '4px',
                          display: 'inline-block',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
                </div>

            {/* Action Buttons */}
                <div style={{ 
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: '20px',
              borderTop: '1px solid #e2e8f0',
              paddingTop: '20px',
              gap: '15px'
                }}>
                  <button 
                onClick={() => setShowRoomStatusModal(false)}
                                    style={{
                  backgroundColor: '#e2e8f0',
                  border: 'none',
                  padding: '10px 20px',
                              borderRadius: '8px',
                  fontWeight: '600',
                              fontSize: '16px',
                  color: '#4a5568',
                  cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#cbd5e0';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#e2e8f0';
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmRoomSelection}
                                style={{
                  backgroundColor: '#3498db',
                      border: 'none',
                  padding: '10px 20px',
                              borderRadius: '8px',
                  fontWeight: '600',
                              fontSize: '16px',
                  color: 'white',
                      cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#2980b9';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#3498db';
                }}
              >
                Confirm Selection
                  </button>
                              </div>
                          </div>
            </div>
          )}

      {/* Price Change Modal */}
      {showPriceChangeModal && (
                <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
            padding: '25px',
            borderRadius: '16px',
            width: '90%',
            maxWidth: '950px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            position: 'relative'
          }}>
            {/* Price Change Modal Content */}
            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#2d3748', marginBottom: '20px' }}>
              Update Prices
            </h2>
            
            <>
              {/* Overnight Prices Section */}
              <div style={{ marginBottom: '25px', paddingBottom: '20px', borderBottom: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '18px', color: '#4a5568', marginBottom: '15px' }}>Overnight Stay Prices</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                  {/* Weekday Prices */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: '#718096' }}>Weekday</label>
                    <div style={{ marginBottom: '10px' }}>
                      <label style={{ display: 'block', fontSize: '14px', color: '#4a5568', marginBottom: '5px' }}>Standard:</label>
                            <input 
                              type="number" 
                        value={tempPrices.weekday.withoutJacuzzi}
                        onChange={(e) => handleModalPriceChange('weekday', 'withoutJacuzzi', e.target.value)}
                        style={{ width: '90%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e0' }}
                            />
                          </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', color: '#4a5568', marginBottom: '5px' }}>Jacuzzi:</label>
                            <input 
                              type="number" 
                        value={tempPrices.weekday.withJacuzzi}
                        onChange={(e) => handleModalPriceChange('weekday', 'withJacuzzi', e.target.value)}
                        style={{ width: '90%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e0' }}
                            />
                          </div>
                  </div>
                  {/* Friday Prices */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: '#718096' }}>Friday</label>
                    <div style={{ marginBottom: '10px' }}>
                      <label style={{ display: 'block', fontSize: '14px', color: '#4a5568', marginBottom: '5px' }}>Standard:</label>
                            <input 
                              type="number" 
                        value={tempPrices.friday.withoutJacuzzi}
                        onChange={(e) => handleModalPriceChange('friday', 'withoutJacuzzi', e.target.value)}
                        style={{ width: '90%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e0' }}
                            />
                          </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', color: '#4a5568', marginBottom: '5px' }}>Jacuzzi:</label>
                      <input 
                        type="number" 
                        value={tempPrices.friday.withJacuzzi}
                        onChange={(e) => handleModalPriceChange('friday', 'withJacuzzi', e.target.value)}
                        style={{ width: '90%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e0' }}
                      />
                    </div>
                  </div>
                  {/* Weekend Prices */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: '#718096' }}>Weekend (Sat/Sun)</label>
                    <div style={{ marginBottom: '10px' }}>
                      <label style={{ display: 'block', fontSize: '14px', color: '#4a5568', marginBottom: '5px' }}>Standard:</label>
                      <input 
                        type="number" 
                        value={tempPrices.weekend.withoutJacuzzi}
                        onChange={(e) => handleModalPriceChange('weekend', 'withoutJacuzzi', e.target.value)}
                        style={{ width: '90%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e0' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', color: '#4a5568', marginBottom: '5px' }}>Jacuzzi:</label>
                      <input 
                        type="number" 
                        value={tempPrices.weekend.withJacuzzi}
                        onChange={(e) => handleModalPriceChange('weekend', 'withJacuzzi', e.target.value)}
                        style={{ width: '90%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e0' }}
                      />
                    </div>
                  </div>
                    </div>
                  </div>

              {/* Short Stay Prices Section */}
              <div style={{ marginBottom: '25px', paddingBottom: '20px', borderBottom: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '18px', color: '#4a5568', marginBottom: '15px' }}>Short Stay Prices</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                  {/* Base Rates */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: '#718096' }}>Base Rate (4hr)</label>
                    <div style={{ marginBottom: '10px' }}>
                      <label style={{ display: 'block', fontSize: '14px', color: '#4a5568', marginBottom: '5px' }}>Standard:</label>
                            <input 
                              type="number" 
                        value={tempShortStayPrices.baseRate.withoutJacuzzi}
                        onChange={(e) => handleModalShortStayPriceChange('baseRate', 'withoutJacuzzi', e.target.value)}
                        style={{ width: '90%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e0' }}
                            />
                          </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', color: '#4a5568', marginBottom: '5px' }}>Jacuzzi:</label>
                            <input 
                              type="number" 
                        value={tempShortStayPrices.baseRate.withJacuzzi}
                        onChange={(e) => handleModalShortStayPriceChange('baseRate', 'withJacuzzi', e.target.value)}
                        style={{ width: '90%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e0' }}
                            />
                          </div>
                  </div>
                  {/* Extra Hour Rates */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: '#718096' }}>Extra Hour Rate</label>
                    <div style={{ marginBottom: '10px' }}>
                      <label style={{ display: 'block', fontSize: '14px', color: '#4a5568', marginBottom: '5px' }}>Regular (${shortStayPrices.extraHourRate.regular}):</label>
                            <input 
                              type="number" 
                              value={tempShortStayPrices.extraHourRate.regular}
                              onChange={(e) => handleModalShortStayPriceChange('extraHourRate', 'regular', e.target.value)}
                              style={{ width: '90%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e0' }}
                            />
                          </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', color: '#4a5568', marginBottom: '5px' }}>Discounted (${shortStayPrices.extraHourRate.discounted}):</label>
                      <input 
                        type="number" 
                        value={tempShortStayPrices.extraHourRate.discounted}
                        onChange={(e) => handleModalShortStayPriceChange('extraHourRate', 'discounted', e.target.value)}
                        style={{ width: '90%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e0' }}
                      />
                    </div>
                  </div>
                </div>
                </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '20px' }}>
                  <button 
                  onClick={handleModalClearPrices} // Use specific modal clear handler
                  style={{ backgroundColor: '#f1f5f9', border: '1px solid #cbd5e0', color: '#4a5568', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
                >
                  Clear Prices
                </button>
                <button 
                  onClick={() => setShowPriceChangeModal(false)}
                  style={{ backgroundColor: '#e2e8f0', border: 'none', color: '#4a5568', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleModalUpdate} // Use specific modal update handler
                  style={{ backgroundColor: '#3498db', border: 'none', color: 'white', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
                  >
                    Update Prices
                  </button>
                </div>
            </>
            {/* End of Price Change Modal Content */}
              </div>
            </div>
          )}
        </div>
  );
}

export default App;