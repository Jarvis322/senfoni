// Simple script to count products
const https = require('https');
const http = require('http');

async function fetchXML(url, redirectCount = 0) {
  if (redirectCount > 5) {
    throw new Error('Too many redirects');
  }

  return new Promise((resolve, reject) => {
    console.log(`Fetching data from: ${url}`);
    
    const client = url.startsWith('https') ? https : http;
    
    client.get(url, (res) => {
      console.log(`Status code: ${res.statusCode}`);
      
      // Follow redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        console.log(`Redirecting to: ${res.headers.location}`);
        return resolve(fetchXML(res.headers.location, redirectCount + 1));
      }
      
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`Total data size: ${data.length}`);
        if (data.length > 0) {
          console.log(`First 200 characters: ${data.substring(0, 200)}`);
        }
        resolve(data);
      });
      
    }).on('error', (err) => {
      console.error(`Error fetching data: ${err.message}`);
      reject(err);
    });
  });
}

async function countProducts() {
  try {
    const xmlData = await fetchXML('http://www.maskemuzik.com/TicimaxXml/59BAD4FD8FFD4D91AC4DA32A5477A903/');
    
    // Count products using regex
    const urunRegex = /<Urun>[\s\S]*?<\/Urun>/g;
    const matches = xmlData.match(urunRegex);
    
    if (matches && matches.length > 0) {
      console.log(`Toplam ürün sayısı: ${matches.length}`);
      
      // Count by categories
      const categories = {};
      
      matches.forEach(urunXml => {
        const categoryMatch = urunXml.match(/<Kategori>(.*?)<\/Kategori>/);
        if (categoryMatch) {
          const category = categoryMatch[1];
          categories[category] = (categories[category] || 0) + 1;
        }
      });
      
      console.log('\nKategorilere göre ürün sayıları:');
      Object.entries(categories)
        .sort((a, b) => b[1] - a[1])
        .forEach(([category, count]) => {
          console.log(`${category}: ${count}`);
        });
    } else {
      console.log('Ürün bulunamadı');
    }
  } catch (error) {
    console.error('Hata oluştu:', error);
  }
}

countProducts(); 