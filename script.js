function getCurrentTime() {
    const time = new Date();
    const dayofWeek = time.toLocaleDateString('vi-VN', { weekday: 'long' });
    const day = time.getDate();
    const month = time.toLocaleDateString('vi-VN', { month: 'long' });
    const year = time.getFullYear();
    const currentDate = `${dayofWeek}, Ngày ${day} ${month} Năm ${year}`;
    document.querySelector('.date').textContent = currentDate;
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const currentTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    document.querySelector('.time').textContent = currentTime;
}

function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            fetchCurrentCity(latitude, longitude);
        }));
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

async function fetchCurrentCity(latitude, longitude) {
    const apiUrl =`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&accept-language=vi`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const city = data.address.city || data.address.town || data.address.village || data.address.county;
        document.querySelector('#city').textContent = city;
    } catch (error) {
        console.error("Error fetching current city:", error);
    }
}


function main() {
    getCurrentTime();
    getCurrentLocation();
    setInterval(getCurrentTime, 1000);
}

main();