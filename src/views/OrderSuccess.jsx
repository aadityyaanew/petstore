import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { CheckCircle } from 'lucide-react';

const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <CheckCircle size={100} className="text-emerald-500 mb-6" />
      <h1 className="text-4xl font-extrabold text-foreground mb-4">
        Payment Successful!
      </h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-md">
        Thank you for your purchase. Your order has been placed successfully and is being processed.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button variant="outline" size="lg" onClick={() => navigate('/orders')}>
          View Orders
        </Button>
        <Button variant="secondary" size="lg" onClick={() => navigate('/')}>
          Continue Shopping
        </Button>
      </div>
    </div>
  );
};

export default OrderSuccess;
