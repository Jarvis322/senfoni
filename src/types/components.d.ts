declare module '@/components/PaymentClient' {
  import { FC } from 'react';
  
  interface LayoutSettings {
    showHeader: boolean;
    showFooter: boolean;
    showSearch: boolean;
    showCart: boolean;
    [key: string]: any;
  }
  
  interface PaymentClientProps {
    layoutSettings: LayoutSettings;
  }
  
  const PaymentClient: FC<PaymentClientProps>;
  export default PaymentClient;
}

declare module '@/components/PaymentSuccessClient' {
  import { FC } from 'react';
  
  interface LayoutSettings {
    showHeader: boolean;
    showFooter: boolean;
    showSearch: boolean;
    showCart: boolean;
    [key: string]: any;
  }
  
  interface PaymentSuccessClientProps {
    paymentMethod: string | null;
    orderIdFromUrl: string | null;
    layoutSettings: LayoutSettings;
  }
  
  const PaymentSuccessClient: FC<PaymentSuccessClientProps>;
  export default PaymentSuccessClient;
}

declare module '@/components/PaymentFailedClient' {
  import { FC } from 'react';
  
  interface LayoutSettings {
    showHeader: boolean;
    showFooter: boolean;
    showSearch: boolean;
    showCart: boolean;
    [key: string]: any;
  }
  
  interface PaymentFailedClientProps {
    layoutSettings: LayoutSettings;
  }
  
  const PaymentFailedClient: FC<PaymentFailedClientProps>;
  export default PaymentFailedClient;
} 