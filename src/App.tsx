import { useState, useEffect } from 'react';
import { Clock, MapPin, Calendar } from 'lucide-react';

interface PrayerTime {
  saat: string;
  vakit: string;
}

interface ApiResponse {
  success: boolean;
  result: PrayerTime[];
}

function App() {
  const [city, setCity] = useState<string>(() => localStorage.getItem('lastCity') || 'istanbul');
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [countdown, setCountdown] = useState<string>('00:00:00');
  const [countdownLabel, setCountdownLabel] = useState<string>('İftara kalan süre');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');

  const cities = [
    'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Aksaray', 'Amasya', 'Ankara', 'Antalya', 'Ardahan', 'Artvin',
    'Aydın', 'Balıkesir', 'Bartın', 'Batman', 'Bayburt', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur',
    'Bursa', 'Çanakkale', 'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır', 'Düzce', 'Edirne', 'Elazığ', 'Erzincan',
    'Erzurum', 'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay', 'Iğdır', 'Isparta', 'Istanbul',
    'Izmir', 'Kahramanmaraş', 'Karabük', 'Karaman', 'Kars', 'Kastamonu', 'Kayseri', 'Kilis', 'Kırıkkale', 'Kırklareli',
    'Kırşehir', 'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Mardin', 'Mersin', 'Muğla', 'Muş',
    'Nevşehir', 'Niğde', 'Ordu', 'Osmaniye', 'Rize', 'Sakarya', 'Samsun', 'Şanlıurfa', 'Siirt', 'Sinop',
    'Sivas', 'Şırnak', 'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Uşak', 'Van', 'Yalova', 'Yozgat', 'Zonguldak'
  ];

  // Function to normalize Turkish characters to their Latin equivalents
  const normalizeTurkishChars = (text: string): string => {
    const turkishChars: Record<string, string> = {
      'ç': 'c',
      'ğ': 'g',
      'ı': 'i',
      'İ': 'i',
      'ö': 'o',
      'ş': 's',
      'ü': 'u'
    };
    
    return text
      .split('')
      .map(char => turkishChars[char] || turkishChars[char.toLowerCase()] || char.toLowerCase())
      .join('');
  };

  const fetchPrayerTimes = async (selectedCity: string) => {
    try {
      setLoading(true);
      setError('');
      
      // Normalize the city name to handle Turkish characters
      const normalizedCity = normalizeTurkishChars(selectedCity.toLowerCase());
      // Properly encode the city name for URL
      const encodedCity = encodeURIComponent(normalizedCity);
      
      const response = await fetch(`https://api.collectapi.com/pray/all?data.city=${encodedCity}`, {
        headers: {
          'content-type': 'application/json',
          'authorization': `apikey ${import.meta.env.VITE_API_KEY || 'your_api_key_here'}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        if (errorData && errorData.message) {
          throw new Error(`API Error: ${errorData.message}`);
        } else {
          throw new Error(`HTTP Error: ${response.status}`);
        }
      }

      const data: ApiResponse = await response.json();
      
      if (!data.success) {
        throw new Error('API returned unsuccessful response');
      }
      
      setPrayerTimes(data.result);
      localStorage.setItem('lastCity', selectedCity);
    } catch (err) {
      console.error('Error fetching prayer times:', err);
      setError('Namaz vakitleri yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  const calculateCountdown = () => {
    if (!prayerTimes.length) return;

    const now = new Date();
    const iftarTime = prayerTimes.find(time => time.vakit === 'Akşam');
    const sahurTime = prayerTimes.find(time => time.vakit === 'İmsak');

    if (!iftarTime || !sahurTime) return;

    // Parse prayer times
    const [iftarHours, iftarMinutes] = iftarTime.saat.split(':');
    const [sahurHours, sahurMinutes] = sahurTime.saat.split(':');

    const iftar = new Date();
    iftar.setHours(parseInt(iftarHours), parseInt(iftarMinutes), 0);

    const sahur = new Date();
    sahur.setHours(parseInt(sahurHours), parseInt(sahurMinutes), 0);

    // If sahur time is earlier than current time, it means sahur is for tomorrow
    if (sahur < now) {
      sahur.setDate(sahur.getDate() + 1);
    }

    let targetTime;
    let label;

    // If iftar time has passed, count down to sahur
    if (now > iftar) {
      targetTime = sahur;
      label = 'Sahura kalan süre';
    } else {
      // Otherwise count down to iftar
      targetTime = iftar;
      label = 'İftara kalan süre';
    }

    const diff = targetTime.getTime() - now.getTime();
    const hours_remaining = Math.floor(diff / (1000 * 60 * 60));
    const minutes_remaining = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds_remaining = Math.floor((diff % (1000 * 60)) / 1000);

    setCountdown(
      `${hours_remaining.toString().padStart(2, '0')}:${minutes_remaining.toString().padStart(2, '0')}:${seconds_remaining.toString().padStart(2, '0')}`
    );
    setCountdownLabel(label);
  };

  const calculatePercentage = () => {
    if (!prayerTimes.length) return 0;

    const now = new Date();
    const iftarTime = prayerTimes.find(time => time.vakit === 'Akşam');
    const sahurTime = prayerTimes.find(time => time.vakit === 'İmsak');

    if (!iftarTime || !sahurTime) return 0;

    // Parse prayer times
    const [iftarHours, iftarMinutes] = iftarTime.saat.split(':');
    const [sahurHours, sahurMinutes] = sahurTime.saat.split(':');

    const iftar = new Date();
    iftar.setHours(parseInt(iftarHours), parseInt(iftarMinutes), 0);

    const sahur = new Date();
    sahur.setHours(parseInt(sahurHours), parseInt(sahurMinutes), 0);

    // If sahur time is earlier than current time, it means sahur is for tomorrow
    if (sahur < now) {
      sahur.setDate(sahur.getDate() + 1);
    }

    let startTime, endTime;

    // If iftar time has passed, count down to sahur
    if (now > iftar) {
      // We're counting down to sahur
      // Start time is iftar, end time is sahur
      startTime = iftar;
      endTime = sahur;
    } else {
      // We're counting down to iftar
      // Start time is sahur, end time is iftar
      startTime = sahur;
      // If sahur is for tomorrow, then we need to use yesterday's sahur
      if (sahur > now) {
        const yesterdaySahur = new Date(sahur);
        yesterdaySahur.setDate(yesterdaySahur.getDate() - 1);
        startTime = yesterdaySahur;
      }
      endTime = iftar;
    }

    const totalDuration = endTime.getTime() - startTime.getTime();
    const elapsedDuration = now.getTime() - startTime.getTime();
    
    // Calculate percentage (0-100)
    const percentage = (elapsedDuration / totalDuration) * 100;
    
    // Ensure percentage is between 0 and 100
    return Math.max(0, Math.min(100, percentage));
  };

  // Format and set current date
  const updateCurrentDate = () => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    setCurrentDate(now.toLocaleDateString('tr-TR', options));
  };

  useEffect(() => {
    fetchPrayerTimes(city);
    updateCurrentDate();
  }, [city]);

  useEffect(() => {
    if (prayerTimes.length > 0) {
      const timer = setInterval(calculateCountdown, 1000);
      return () => clearInterval(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prayerTimes]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <header className="mb-12">
          <h1 className="text-3xl font-light text-center mb-8">İftara Ne Kadar Kaldı?</h1>
          <div className="flex items-center justify-center gap-4 mb-4">
            <MapPin className="w-5 h-5 text-gray-500" />
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="bg-white px-4 py-2 rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              {cities.map(city => (
                <option key={city} value={city.toLowerCase()}>
                  {city}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-center text-gray-500">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{currentDate}</span>
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-600"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 bg-red-50 p-4 rounded">
            {error}
          </div>
        ) : (
          <main>
            <div className="text-center mb-12">
              <div className="font-mono text-5xl font-light tracking-wider mb-2">
                {countdown}
              </div>
              <div className="flex justify-center text-sm mb-2">
                <span className="w-24 text-center">saat</span>
                <span className="w-24 text-center">dakika</span>
                <span className="w-24 text-center">saniye</span>
              </div>
              <div className="text-sm text-gray-500 mb-4">{countdownLabel}</div>
              <div className="relative h-2 bg-gray-100 rounded-full max-w-md mx-auto">
                <div 
                  className="absolute top-0 left-0 h-full bg-green-500 rounded-full" 
                  style={{ width: `${calculatePercentage()}%` }}
                ></div>
              </div>
              <div className="text-sm text-green-500 mt-1">% {calculatePercentage().toFixed(1)}</div>
            </div>

            <div className="space-y-4">
              {prayerTimes.map((time) => (
                <div
                  key={time.vakit}
                  className={`p-4 rounded flex items-center justify-between ${
                    (time.vakit === 'Akşam' || time.vakit === 'İmsak') ? 'bg-gray-100' : 'bg-white border border-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{time.vakit}</span>
                  </div>
                  <span className="font-mono">{time.saat}</span>
                </div>
              ))}
            </div>
          </main>
        )}
      </div>
    </div>
  );
}

export default App;