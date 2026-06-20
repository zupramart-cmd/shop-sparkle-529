import paymentMethods from '@/assets/payment-methods.png';

export default function TrustBadges() {
  return (
    <div className="flex items-center justify-center">
      <img
        src={paymentMethods}
        alt="Payment Methods - bKash, Nagad, Cash on Delivery"
        className="h-7 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity duration-200"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}
