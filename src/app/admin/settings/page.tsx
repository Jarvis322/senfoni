'use client';

import { FaSave, FaGlobe, FaEnvelope, FaLock, FaShoppingCart, FaUsers, FaImage, FaMoneyBillWave } from "react-icons/fa";
import Link from "next/link";
import { useState } from "react";
import { useNotification } from "@/components/NotificationProvider";

export default function SettingsPage() {
  const { showNotification } = useNotification();
  const [isSaving, setIsSaving] = useState(false);

  // Ayar kategorileri
  const settingCategories = [
    {
      id: "general",
      title: "Genel Ayarlar",
      icon: <FaGlobe className="w-5 h-5 text-blue-500" />,
      description: "Site başlığı, açıklama, logo ve favicon ayarları",
      settings: [
        { id: "site_title", name: "Site Başlığı", type: "text", value: "Senfoni Müzik" },
        { id: "site_description", name: "Site Açıklaması", type: "textarea", value: "Kaliteli müzik aletleri ve ekipmanları" },
        { id: "site_logo", name: "Site Logosu", type: "image", value: "/images/logo.png" },
        { id: "site_favicon", name: "Favicon", type: "image", value: "/images/favicon.ico" },
        { id: "maintenance_mode", name: "Bakım Modu", type: "toggle", value: false }
      ]
    },
    {
      id: "email",
      title: "E-posta Ayarları",
      icon: <FaEnvelope className="w-5 h-5 text-green-500" />,
      description: "E-posta gönderimi ve bildirim ayarları",
      settings: [
        { id: "smtp_host", name: "SMTP Sunucu", type: "text", value: "smtp.example.com" },
        { id: "smtp_port", name: "SMTP Port", type: "number", value: 587 },
        { id: "smtp_user", name: "SMTP Kullanıcı", type: "text", value: "info@senfonimusic.com" },
        { id: "smtp_password", name: "SMTP Şifre", type: "password", value: "********" },
        { id: "email_from", name: "Gönderen E-posta", type: "text", value: "info@senfonimusic.com" },
        { id: "email_from_name", name: "Gönderen Adı", type: "text", value: "Senfoni Müzik" }
      ]
    },
    {
      id: "security",
      title: "Güvenlik Ayarları",
      icon: <FaLock className="w-5 h-5 text-red-500" />,
      description: "Güvenlik ve gizlilik ayarları",
      settings: [
        { id: "enable_recaptcha", name: "reCAPTCHA Etkinleştir", type: "toggle", value: true },
        { id: "recaptcha_site_key", name: "reCAPTCHA Site Anahtarı", type: "text", value: "6LcXXXXXXXXXXXXXXXXXXXXX" },
        { id: "recaptcha_secret_key", name: "reCAPTCHA Gizli Anahtar", type: "password", value: "6LcXXXXXXXXXXXXXXXXXXXXX" },
        { id: "login_attempts", name: "Maksimum Giriş Denemesi", type: "number", value: 5 },
        { id: "session_timeout", name: "Oturum Zaman Aşımı (dakika)", type: "number", value: 60 }
      ]
    },
    {
      id: "payment",
      title: "Ödeme Ayarları",
      icon: <FaMoneyBillWave className="w-5 h-5 text-yellow-500" />,
      description: "Ödeme yöntemleri ve yapılandırma",
      settings: [
        { id: "currency", name: "Para Birimi", type: "select", value: "TRY", options: ["TRY", "USD", "EUR"] },
        { id: "enable_credit_card", name: "Kredi Kartı Ödemesi", type: "toggle", value: true },
        { id: "enable_bank_transfer", name: "Banka Havalesi", type: "toggle", value: true },
        { id: "enable_paypal", name: "PayPal", type: "toggle", value: false },
        { id: "payment_api_key", name: "Ödeme API Anahtarı", type: "password", value: "sk_test_XXXXXXXXXXXXXXXXXXXXXXXX" }
      ]
    },
    {
      id: "shipping",
      title: "Kargo Ayarları",
      icon: <FaShoppingCart className="w-5 h-5 text-purple-500" />,
      description: "Kargo ve teslimat ayarları",
      settings: [
        { id: "free_shipping_min", name: "Ücretsiz Kargo Minimum Tutar", type: "number", value: 500 },
        { id: "shipping_flat_rate", name: "Sabit Kargo Ücreti", type: "number", value: 30 },
        { id: "enable_local_pickup", name: "Mağazadan Teslim Alma", type: "toggle", value: true },
        { id: "shipping_countries", name: "Kargo Yapılan Ülkeler", type: "multiselect", value: ["Türkiye"], options: ["Türkiye", "Almanya", "Fransa", "İngiltere"] }
      ]
    },
    {
      id: "media",
      title: "Medya Ayarları",
      icon: <FaImage className="w-5 h-5 text-indigo-500" />,
      description: "Resim boyutları ve medya ayarları",
      settings: [
        { id: "thumbnail_size", name: "Küçük Resim Boyutu", type: "text", value: "150x150" },
        { id: "medium_size", name: "Orta Boy Resim", type: "text", value: "300x300" },
        { id: "large_size", name: "Büyük Boy Resim", type: "text", value: "800x800" },
        { id: "max_upload_size", name: "Maksimum Yükleme Boyutu (MB)", type: "number", value: 5 },
        { id: "allowed_file_types", name: "İzin Verilen Dosya Türleri", type: "text", value: "jpg,jpeg,png,gif,webp" }
      ]
    },
    {
      id: "notifications",
      title: "Bildirim Ayarları",
      icon: <FaUsers className="w-5 h-5 text-orange-500" />,
      description: "Kullanıcı ve yönetici bildirimleri",
      settings: [
        { id: "notify_new_order", name: "Yeni Sipariş Bildirimi", type: "toggle", value: true },
        { id: "notify_low_stock", name: "Düşük Stok Bildirimi", type: "toggle", value: true },
        { id: "notify_new_user", name: "Yeni Kullanıcı Bildirimi", type: "toggle", value: false },
        { id: "notify_contact_form", name: "İletişim Formu Bildirimi", type: "toggle", value: true },
        { id: "admin_email", name: "Yönetici E-posta Adresi", type: "text", value: "admin@senfonimusic.com" }
      ]
    }
  ];

  // Ayarları kaydetme fonksiyonu
  const saveSettings = async () => {
    setIsSaving(true);
    
    try {
      // Burada gerçek bir API çağrısı yapılabilir
      // Örnek: await fetch('/api/settings', { method: 'POST', body: JSON.stringify(formData) });
      
      // Simüle edilmiş bir gecikme
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Başarılı bildirim göster
      showNotification("Ayarlar başarıyla kaydedildi!", "success");
    } catch (error) {
      // Hata bildirimi göster
      showNotification("Ayarlar kaydedilirken bir hata oluştu.", "error");
      console.error("Ayarlar kaydedilirken hata:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Ayar tipine göre input render etme
  const renderSettingInput = (setting: any) => {
    switch (setting.type) {
      case "text":
        return (
          <input
            type="text"
            id={setting.id}
            name={setting.id}
            defaultValue={setting.value}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        );
      case "textarea":
        return (
          <textarea
            id={setting.id}
            name={setting.id}
            rows={3}
            defaultValue={setting.value}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        );
      case "number":
        return (
          <input
            type="number"
            id={setting.id}
            name={setting.id}
            defaultValue={setting.value}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        );
      case "password":
        return (
          <input
            type="password"
            id={setting.id}
            name={setting.id}
            defaultValue={setting.value}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        );
      case "toggle":
        return (
          <div className="mt-1">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                id={setting.id}
                name={setting.id}
                defaultChecked={setting.value}
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        );
      case "select":
        return (
          <select
            id={setting.id}
            name={setting.id}
            defaultValue={setting.value}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            {setting.options?.map((option: string) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case "multiselect":
        return (
          <select
            id={setting.id}
            name={setting.id}
            defaultValue={setting.value}
            multiple
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            {setting.options?.map((option: string) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case "image":
        return (
          <div className="mt-1 flex items-center">
            <input
              type="text"
              id={setting.id}
              name={setting.id}
              defaultValue={setting.value}
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <button
              type="button"
              className="ml-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Seç
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Site Ayarları</h1>
        <button
          type="button"
          onClick={saveSettings}
          disabled={isSaving}
          className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            isSaving ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
        >
          <FaSave className="mr-2 h-4 w-4" />
          {isSaving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {settingCategories.map((category) => (
          <div key={category.id} className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center">
              <div className="mr-3">{category.icon}</div>
              <div>
                <h2 className="text-lg font-medium text-gray-900">{category.title}</h2>
                <p className="text-sm text-gray-500">{category.description}</p>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {category.settings.map((setting) => (
                  <div key={setting.id} className="space-y-1">
                    <label htmlFor={setting.id} className="block text-sm font-medium text-gray-700">
                      {setting.name}
                    </label>
                    {renderSettingInput(setting)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 