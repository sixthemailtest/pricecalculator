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
      overnightExtraHours, overnightExtraRate, overnightCheckoutExtraHours, bedType]);
  
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
      
      // Set base prices based on day of week and jacuzzi
      if (dayOfWeek === 5) { // Friday
        dayBasePrice = hasJacuzziOvernight ? 159 : 139;
        if (overnightPayment === 'credit' && !hasJacuzziOvernight) {
          dayBasePrice = 139;
        }
      } else if (dayOfWeek === 0 || dayOfWeek === 6) { // Weekend (Sunday or Saturday)
        dayBasePrice = hasJacuzziOvernight ? 169 : 139;
      } else { // Weekday (Mon-Thu)
        dayBasePrice = hasJacuzziOvernight ? 120 : 105;
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
        </div>
      </div>
    </div>
  );
}

export default App;