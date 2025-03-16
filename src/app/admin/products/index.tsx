// Ürünler sayfasında URL parametrelerini kontrol eden fonksiyon
export function checkRefreshParam() {
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const refreshParam = urlParams.get('refresh');
    
    if (refreshParam === 'true') {
      // URL'den refresh parametresini temizle
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
      
      // true döndürerek yenileme yapılması gerektiğini bildir
      return true;
    }
  }
  
  return false;
} 