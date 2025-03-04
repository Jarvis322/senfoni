'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatPriceForPayTR } from '@/services/currencyService';

// Cart item interface
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface PaymentFormProps {
  className?: string;
}

export default function PaymentForm({ className = '' }: PaymentFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('creditCard'); // 'creditCard' veya 'bankTransfer'
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    cardName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    agreeTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form alanlarını güncelle
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Hata mesajını temizle
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Ödeme yöntemini değiştir
  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
    // Ödeme yöntemi değiştiğinde ilgili hataları temizle
    if (method === 'bankTransfer') {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.cardNumber;
        delete newErrors.cardName;
        delete newErrors.expiryMonth;
        delete newErrors.expiryYear;
        delete newErrors.cvv;
        return newErrors;
      });
    }
  };

  // Kredi kartı numarasını formatlama
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Kredi kartı numarası değişikliği
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value);
    setFormData(prev => ({ ...prev, cardNumber: formattedValue }));
    
    if (errors.cardNumber) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.cardNumber;
        return newErrors;
      });
    }
  };

  // Form doğrulama
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Zorunlu alanları kontrol et
    if (!formData.fullName.trim()) newErrors.fullName = 'Ad Soyad gereklidir';
    if (!formData.email.trim()) newErrors.email = 'E-posta gereklidir';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Geçerli bir e-posta adresi girin';
    
    if (!formData.phone.trim()) newErrors.phone = 'Telefon gereklidir';
    if (!formData.address.trim()) newErrors.address = 'Adres gereklidir';
    if (!formData.city.trim()) newErrors.city = 'Şehir gereklidir';
    
    // Kredi kartı bilgilerini kontrol et (sadece kredi kartı ödeme yöntemi seçiliyse)
    if (paymentMethod === 'creditCard') {
      if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Kart numarası gereklidir';
      else if (formData.cardNumber.replace(/\s/g, '').length !== 16) newErrors.cardNumber = 'Geçerli bir kart numarası girin';
      
      if (!formData.cardName.trim()) newErrors.cardName = 'Kart üzerindeki isim gereklidir';
      if (!formData.expiryMonth) newErrors.expiryMonth = 'Son kullanma ayı gereklidir';
      if (!formData.expiryYear) newErrors.expiryYear = 'Son kullanma yılı gereklidir';
      if (!formData.cvv.trim()) newErrors.cvv = 'CVV gereklidir';
      else if (!/^\d{3,4}$/.test(formData.cvv)) newErrors.cvv = 'Geçerli bir CVV girin';
    }
    
    if (!formData.agreeTerms) newErrors.agreeTerms = 'Kullanım koşullarını kabul etmelisiniz';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form gönderimi
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Sepet bilgilerini localStorage'dan al
      let cartItems: CartItem[] = [];
      try {
        const cartData = localStorage.getItem('cart');
        if (cartData) {
          cartItems = JSON.parse(cartData);
        }
      } catch (error) {
        console.error('Sepet verileri okunamadı:', error);
        setErrors({ form: 'Sepet bilgileri okunamadı. Lütfen sayfayı yenileyip tekrar deneyin.' });
        setIsLoading(false);
        return;
      }
      
      // Sepet boş mu kontrol et
      if (!cartItems || cartItems.length === 0) {
        setErrors({ form: 'Sepetinizde ürün bulunmuyor. Lütfen sepetinize ürün ekleyin.' });
        setIsLoading(false);
        return;
      }
      
      const totalAmount = cartItems.reduce((total: number, item: CartItem) => total + (item.price * item.quantity), 0);
      
      if (paymentMethod === 'bankTransfer') {
        // Banka havalesi için sipariş oluştur ve API'ye gönder
        try {
          const bankTransferData = {
            user: {
              fullName: formData.fullName,
              email: formData.email,
              phone: formData.phone,
              address: formData.address,
              city: formData.city,
              zipCode: formData.zipCode,
            },
            order: {
              amount: formatPriceForPayTR(totalAmount), // Kuruş cinsinden (örn: 10.99 TL -> 1099)
              items: cartItems.map((item: CartItem) => ({
                id: item.id,
                name: item.name,
                price: formatPriceForPayTR(item.price),
                quantity: item.quantity,
              })),
            },
            paymentMethod: 'bankTransfer',
          };
          
          // API'ye istek gönder
          const response = await fetch('/api/payment/process', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(bankTransferData),
          });
          
          const result = await response.json();
          
          if (result.success) {
            // Başarılı sipariş durumunda sepeti temizle
            localStorage.removeItem('cart');
            
            // Kullanıcı bilgilerini localStorage'a kaydet
            localStorage.setItem('checkoutInfo', JSON.stringify({
              email: formData.email,
              fullName: formData.fullName,
              phone: formData.phone
            }));
            
            // Başarılı sipariş durumunda yönlendirme
            router.push(`/odeme/basarili?method=bankTransfer&orderId=${result.orderId || ''}`);
          } else {
            // Hata durumu
            setErrors({ form: result.error || 'Sipariş oluşturulurken bir hata oluştu.' });
            setIsLoading(false);
          }
        } catch (error) {
          console.error('Sipariş hatası:', error);
          setErrors({ form: 'Sipariş işlemi sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin.' });
          setIsLoading(false);
        }
        return;
      }
      
      // PayTR için ödeme isteği oluştur
      const paymentData = {
        user: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode,
        },
        card: {
          number: formData.cardNumber.replace(/\s/g, ''),
          name: formData.cardName,
          expiry: `${formData.expiryMonth}/${formData.expiryYear.slice(-2)}`,
          cvv: formData.cvv,
        },
        order: {
          amount: formatPriceForPayTR(totalAmount), // Kuruş cinsinden (örn: 10.99 TL -> 1099)
          items: cartItems.map((item: CartItem) => ({
            id: item.id,
            name: item.name,
            price: formatPriceForPayTR(item.price),
            quantity: item.quantity,
          })),
        },
        paymentMethod: 'creditCard',
      };
      
      // PayTR API'sine istek gönder
      const response = await fetch('/api/payment/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Başarılı ödeme durumunda sepeti temizle
        localStorage.removeItem('cart');
        
        // Kullanıcı bilgilerini localStorage'a kaydet
        localStorage.setItem('checkoutInfo', JSON.stringify({
          email: formData.email,
          fullName: formData.fullName,
          phone: formData.phone
        }));
        
        // Başarılı ödeme durumunda yönlendirme
        if (result.redirectUrl) {
          window.location.href = result.redirectUrl;
        } else {
          router.push('/odeme/basarili');
        }
      } else {
        // Hata durumu
        setErrors({ form: result.error || 'Ödeme işlemi sırasında bir hata oluştu.' });
      }
    } catch (error) {
      console.error('Ödeme hatası:', error);
      setErrors({ form: 'Ödeme işlemi sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`p-6 ${className}`}>
      {errors.form && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {errors.form}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Kişisel Bilgiler</h2>
        </div>
        
        {/* Kişisel Bilgiler */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
            Ad Soyad <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
          />
          {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            E-posta <span className="text-red-600">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Telefon <span className="text-red-600">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
          />
          {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
        </div>
        
        <div className="md:col-span-2">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Adres <span className="text-red-600">*</span>
          </label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={3}
            className={`w-full px-3 py-2 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
          />
          {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
        </div>
        
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
            Şehir <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
          />
          {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
        </div>
        
        <div>
          <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
            Posta Kodu
          </label>
          <input
            type="text"
            id="zipCode"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        
        {/* Ödeme Yöntemi Seçimi */}
        <div className="md:col-span-2 mt-6">
          <h2 className="text-lg font-semibold mb-4">Ödeme Yöntemi</h2>
          <div className="flex flex-col space-y-4">
            <div 
              className={`border rounded-md p-4 cursor-pointer ${paymentMethod === 'creditCard' ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
              onClick={() => handlePaymentMethodChange('creditCard')}
            >
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full border ${paymentMethod === 'creditCard' ? 'border-red-500' : 'border-gray-400'} flex items-center justify-center mr-3`}>
                  {paymentMethod === 'creditCard' && <div className="w-3 h-3 rounded-full bg-red-500"></div>}
                </div>
                <div>
                  <h3 className="font-medium">Kredi Kartı</h3>
                  <p className="text-sm text-gray-500">Kredi kartı veya banka kartı ile güvenli ödeme yapın</p>
                </div>
              </div>
            </div>
            
            <div 
              className={`border rounded-md p-4 cursor-pointer ${paymentMethod === 'bankTransfer' ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
              onClick={() => handlePaymentMethodChange('bankTransfer')}
            >
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full border ${paymentMethod === 'bankTransfer' ? 'border-red-500' : 'border-gray-400'} flex items-center justify-center mr-3`}>
                  {paymentMethod === 'bankTransfer' && <div className="w-3 h-3 rounded-full bg-red-500"></div>}
                </div>
                <div>
                  <h3 className="font-medium">Banka Havalesi / EFT</h3>
                  <p className="text-sm text-gray-500">Banka havalesi veya EFT ile ödeme yapın</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Banka Havalesi Bilgileri */}
        {paymentMethod === 'bankTransfer' && (
          <div className="md:col-span-2 mt-4 p-4 bg-gray-50 border border-gray-200 rounded-md">
            <h3 className="font-medium text-gray-800 mb-3">Banka Havalesi / EFT Bilgileri</h3>
            <p className="text-sm text-gray-600 mb-4">
              Lütfen aşağıdaki banka hesaplarından birine ödeme yapın. Ödeme açıklamasına adınızı ve soyadınızı yazmayı unutmayın.
            </p>
            
            <div className="space-y-4">
              <div className="p-3 bg-white border border-gray-200 rounded-md">
                <h4 className="font-medium text-gray-800">VakıfBank</h4>
                <div className="mt-2 space-y-1">
                  <p className="text-sm"><span className="font-medium">IBAN:</span> TR40 0001 5001 5800 7307 4767 62</p>
                  <p className="text-sm"><span className="font-medium">Alıcı Adı:</span> Kahraman Pehlivan</p>
                </div>
              </div>
              
              <div className="p-3 bg-white border border-gray-200 rounded-md">
                <h4 className="font-medium text-gray-800">QNB Finansbank</h4>
                <div className="mt-2 space-y-1">
                  <p className="text-sm"><span className="font-medium">IBAN:</span> TR76 0011 1000 0000 0142 2737 93</p>
                  <p className="text-sm"><span className="font-medium">Alıcı Adı:</span> Kahraman Pehlivan</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                <strong>Not:</strong> Ödemeniz onaylandıktan sonra siparişiniz işleme alınacaktır. Ödeme onayı 1-2 iş günü sürebilir.
              </p>
            </div>
          </div>
        )}
        
        {/* Kredi Kartı Bilgileri */}
        {paymentMethod === 'creditCard' && (
          <>
            <div className="md:col-span-2 mt-6">
              <h2 className="text-lg font-semibold mb-4">Kredi Kartı Bilgileri</h2>
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Kart Numarası <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleCardNumberChange}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                className={`w-full px-3 py-2 border ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
              />
              {errors.cardNumber && <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>}
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                Kart Üzerindeki İsim <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="cardName"
                name="cardName"
                value={formData.cardName}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors.cardName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
              />
              {errors.cardName && <p className="mt-1 text-sm text-red-600">{errors.cardName}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Son Kullanma Tarihi <span className="text-red-600">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <select
                    name="expiryMonth"
                    value={formData.expiryMonth}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.expiryMonth ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
                  >
                    <option value="">Ay</option>
                    {Array.from({ length: 12 }, (_, i) => {
                      const month = (i + 1).toString().padStart(2, '0');
                      return <option key={month} value={month}>{month}</option>;
                    })}
                  </select>
                  {errors.expiryMonth && <p className="mt-1 text-sm text-red-600">{errors.expiryMonth}</p>}
                </div>
                <div>
                  <select
                    name="expiryYear"
                    value={formData.expiryYear}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.expiryYear ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
                  >
                    <option value="">Yıl</option>
                    {Array.from({ length: 10 }, (_, i) => {
                      const year = (new Date().getFullYear() + i).toString();
                      return <option key={year} value={year}>{year}</option>;
                    })}
                  </select>
                  {errors.expiryYear && <p className="mt-1 text-sm text-red-600">{errors.expiryYear}</p>}
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                CVV <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="cvv"
                name="cvv"
                value={formData.cvv}
                onChange={handleChange}
                placeholder="123"
                maxLength={4}
                className={`w-full px-3 py-2 border ${errors.cvv ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
              />
              {errors.cvv && <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>}
            </div>
          </>
        )}
        
        <div className="md:col-span-2 mt-6">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="agreeTerms"
                name="agreeTerms"
                type="checkbox"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="agreeTerms" className={`font-medium ${errors.agreeTerms ? 'text-red-500' : 'text-gray-700'}`}>
                Kullanım koşullarını ve gizlilik politikasını kabul ediyorum <span className="text-red-600">*</span>
              </label>
              {errors.agreeTerms && <p className="mt-1 text-sm text-red-600">{errors.agreeTerms}</p>}
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2 mt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                İşleniyor...
              </span>
            ) : (
              paymentMethod === 'creditCard' ? 'Ödemeyi Tamamla' : 'Siparişi Tamamla'
            )}
          </button>
        </div>
      </div>
    </form>
  );
} 