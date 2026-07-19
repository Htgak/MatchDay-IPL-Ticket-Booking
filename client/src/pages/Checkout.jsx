import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { BookingService, PaymentService, MatchService } from '../services/api';

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { matchId, seatIds, subtotal: stateSubtotal } = location.state || {};
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [match, setMatch] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('supabase_token');
    if (!token) {
      alert("Please login to proceed with checkout.");
      navigate('/login');
      return;
    }
    if (!matchId || !seatIds || seatIds.length === 0) {
      navigate('/matches');
    }
  }, [matchId, seatIds, navigate]);

  useEffect(() => {
    if (matchId) {
      MatchService.getById(matchId).then(res => setMatch(res.data)).catch(console.error);
    }
  }, [matchId]);

  if (!matchId || !seatIds?.length) {
    return <div className="text-center p-10 mt-20 text-on-surface">Invalid checkout state. <Link to="/" className="text-primary underline font-bold">Go Home</Link></div>;
  }

  const handlePayment = async () => {
    setLoading(true);
    setError(null);
    try {
      const bookingRes = await BookingService.createBooking(matchId, seatIds);
      const bookingId = bookingRes.data.bookingId;
      const totalAmount = bookingRes.data.totalAmount;

      const orderRes = await PaymentService.createOrder(bookingId);
      const { orderId, keyId } = orderRes.data;

      const userName = localStorage.getItem('user_name') || '';
      const userEmail = localStorage.getItem('user_email') || '';
      const userPhone = localStorage.getItem('user_phone') || '';

      const options = {
        key: keyId, 
        amount: totalAmount * 100,
        currency: 'INR',
        name: 'MatchDay',
        description: 'Cricket Match Tickets',
        order_id: orderId,
        handler: async function (response) {
          try {
            await PaymentService.verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              bookingId
            });
            navigate('/tickets');
          } catch (err) {
            setError(err.message || 'Payment verification failed');
          }
        },
        prefill: {
          name: userName,
          email: userEmail,
          contact: userPhone
        },
        theme: {
          color: '#001256'
        }
      };
      
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response){
        setError(response.error.description);
      });
      rzp.open();

    } catch (err) {
      setError(err.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  // Pricing display based on selected seats
  const subtotal = stateSubtotal || (seatIds?.length * 1500) || 0;
  const pricePerSeat = seatIds?.length ? subtotal / seatIds.length : 0;
  const fee = seatIds?.length ? seatIds.length * 150 : 0;
  const total = subtotal + fee;

  return (
    <div className="bg-surface-container-low min-h-screen flex flex-col font-body-md text-on-surface w-full absolute top-0 z-50">
      {/* Transactional Navbar */}
      <header className="bg-primary shadow-md w-full sticky top-0 z-50">
        <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-4 max-w-container-max-width mx-auto">
          <Link to="/" className="text-headline-md font-headline-md font-black text-white tracking-tight flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary-fixed" style={{ fontVariationSettings: "'FILL' 1" }}>sports_cricket</span>
            MatchDay
          </Link>
          <div className="flex items-center gap-2 text-white opacity-80 text-label-md font-label-md">
            <span className="material-symbols-outlined text-xl">lock</span>
            Secure Checkout
          </div>
        </div>
      </header>

      <main className="flex-grow w-full max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg md:py-stack-xl flex justify-center">
        <div className="w-full max-w-3xl">
          <button onClick={() => navigate(-1)} className="mb-stack-md flex items-center text-on-surface-variant hover:text-primary transition-colors text-label-md font-label-md group">
            <span className="material-symbols-outlined mr-1 group-hover:-translate-x-1 transition-transform">arrow_back</span>
            Back to Match Details
          </button>
          
          <h1 className="text-display-lg-mobile md:text-display-lg font-display-lg-mobile md:font-display-lg text-on-surface mb-stack-lg">Checkout</h1>
          
          <div className="bg-surface-container-lowest rounded-xl shadow-[0_4px_20px_rgba(27,42,107,0.08)] overflow-hidden border border-outline-variant/20">
            {/* Match Details Header */}
            {match && (
              <div className="p-stack-md md:p-gutter border-b border-surface-variant flex flex-col md:flex-row gap-gutter items-start md:items-center">
                <div className="w-full md:w-32 h-24 rounded-lg overflow-hidden shrink-0 relative bg-surface-variant flex items-center justify-center p-2">
                  <div className="flex w-full h-full">
                    <img className="object-contain w-1/2 h-full" src={match.team_a.logo_url} alt={match.team_a.short_code} />
                    <img className="object-contain w-1/2 h-full" src={match.team_b.logo_url} alt={match.team_b.short_code} />
                  </div>
                </div>
                <div className="flex-grow">
                  <div className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider mb-1">T20 League</div>
                  <h2 className="text-headline-md font-headline-md text-on-surface mb-2">{match.team_a.name} vs {match.team_b.name}</h2>
                  <div className="flex items-center gap-4 text-label-sm font-label-sm text-on-surface-variant">
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">calendar_today</span> {new Date(match.match_date).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">schedule</span> {new Date(match.match_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Order Summary */}
            <div className="p-stack-md md:p-gutter flex flex-col gap-stack-md">
              <h3 className="text-headline-md font-headline-md text-on-surface mb-stack-sm">Order Summary</h3>
              <div className="flex justify-between items-center py-2">
                <div>
                  <div className="text-body-md font-body-md text-on-surface font-semibold">Match Tickets</div>
                  <div className="text-label-sm font-label-sm text-on-surface-variant">Standard Rate</div>
                </div>
                <div className="text-right">
                  <div className="text-body-md font-body-md text-on-surface font-semibold">₹{pricePerSeat}</div>
                  <div className="text-label-sm font-label-sm text-on-surface-variant">Qty: {seatIds.length}</div>
                </div>
              </div>
              
              <div className="flex justify-between items-center py-2 border-t border-surface-variant border-dashed pt-4 mt-2">
                <div className="text-body-md font-body-md text-on-surface-variant">Subtotal</div>
                <div className="text-body-md font-body-md text-on-surface">₹{subtotal}</div>
              </div>
              <div className="flex justify-between items-center py-2">
                <div className="text-body-md font-body-md text-on-surface-variant">Service Fee</div>
                <div className="text-body-md font-body-md text-on-surface">₹{fee}</div>
              </div>
              
              <div className="flex justify-between items-center py-4 mt-stack-sm border-t-2 border-primary border-solid">
                <div className="text-headline-md font-headline-md text-on-surface">Total</div>
                <div className="text-headline-md font-headline-md text-primary font-black">₹{total}</div>
              </div>

              {error && <div className="bg-error-container text-on-error-container p-3 rounded text-label-md font-bold text-center mt-2 border border-error/30">{error}</div>}
            </div>

            {/* Action */}
            <div className="p-stack-md md:p-gutter bg-surface-container-lowest border-t border-surface-variant flex flex-col items-center">
              <button 
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-primary text-white py-4 px-6 rounded-xl font-bold text-headline-md hover:bg-primary-fixed-variant transition-all shadow-md hover:shadow-lg flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {loading ? 'Processing...' : (
                  <>
                    <span className="material-symbols-outlined">lock</span>
                    Proceed to Pay ₹{total}
                  </>
                )}
              </button>
              <p className="text-label-sm font-label-sm text-on-surface-variant mt-4 text-center flex items-center justify-center gap-1">
                By proceeding, you agree to our <a className="text-primary underline font-bold" href="#">Terms of Service</a>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
