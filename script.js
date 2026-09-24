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
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                fetchCurrentCity(latitude, longitude);
                fetchWeatherData(latitude, longitude);
            },
            (error) => {
                console.error("Lỗi xác định toạ độ:", error.message);
            },
            { timeout: 10000 }
        );
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

async function fetchCurrentCity(latitude, longitude) {
    const apiUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=vi`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        const city = data.city || data.locality || data.principalSubdivision || "Bạn đang ở nơi đồng không mông quạnh";
        document.querySelector('#city').textContent = city;
    } catch (error) {
        console.error("Error fetching current city:", error);
    }
}

async function fetchWeatherData(latitude, longitude) {
    const apiKey = "6cfba0e18ed1446b14b7e341f2fb93db";
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&lang=vi`;
    
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        const description = data.weather[0].description;
        const formattedDescription = description.charAt(0).toUpperCase() + description.slice(1);
        const isRaining = description.toLowerCase().includes("mưa");
        renderBackground(isRaining);
        document.querySelector('.weather').textContent = formattedDescription;
    } catch (error) {
        console.error("Error fetching weather data:", error);
        document.querySelector('.weather').textContent = "Hôm nay trời sao ai biết";
    }
}

function renderBackground(isRaining) {
    const background = document.querySelector('.container');
    const information = document.querySelectorAll('p');
    if (isRaining) {
        background.style.background = 'linear-gradient(to bottom, #6B6969, #1E1E1E)';
        information.forEach((element) => {
            element.style.color ='#FFFFFF'
        })
    } else {
        background.style.background = 'linear-gradient(to bottom, #67CAFF, #0073D1)';
        information.forEach((element) => {
            element.style.color ='#FFFFFF'
        })
    }
}

function speak() {
    const time = new Date();
    const dateText = document.querySelector('.date').textContent || '';
    const locationText = document.querySelector('#city').textContent || '';
    const weatherText = document.querySelector('.weather').textContent || '';
    const hoursText = time.getHours();
    const minutesText = time.getMinutes();
    if (!dateText && !locationText && !weatherText && !hoursText && !minutesText ) {
        console.warn("Không tìm thấy thông tin");
        return;
    } 

    const fullText = `Hôm nay là ${dateText}, bây giờ là ${hoursText} giờ ${minutesText} phút. 
    Bạn đang ở ${locationText} và thời tiết hiện tại: ${weatherText}`;
    const synth = window.speechSynthesis;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(fullText);
    const voices = synth.getVoices();
    const vietnameseVoice = voices.find(voice => voice.lang.includes('vi'));

    if (vietnameseVoice) {
        utterance.voice = vietnameseVoice;
    }

    utterance.lang = 'vi-VN';
    utterance.rate = 1.0;
    synth.speak(utterance);
}

function getSpeech() {
    document.querySelector('#speak-btn').addEventListener('click', speak);
    if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
    } 
}


function main() {
    getCurrentTime();
    getCurrentLocation();
    getSpeech();
    setInterval(getCurrentTime, 1000);
}

main();