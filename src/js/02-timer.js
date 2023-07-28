import Notiflix from 'notiflix';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const dateTimePicker = document.getElementById('datetime-picker');
const startButton = document.querySelector('[data-start]');
const daysValue = document.querySelector('[data-days]');
const hoursValue = document.querySelector('[data-hours]');
const minutesValue = document.querySelector('[data-minutes]');
const secondsValue = document.querySelector('[data-seconds]');

let countdownIntervalId;
let timerRunning = false;

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function updateTimerDisplay(timeObj) {
  daysValue.textContent = addLeadingZero(timeObj.days);
  hoursValue.textContent = addLeadingZero(timeObj.hours);
  minutesValue.textContent = addLeadingZero(timeObj.minutes);
  secondsValue.textContent = addLeadingZero(timeObj.seconds);
}

function startCountdown() {
  const selectedDate = new Date(dateTimePicker.value).getTime();
  const currentDate = new Date().getTime();
  const timeRemaining = selectedDate - currentDate;

  if (timeRemaining <= 0) {
    Notiflix.Notify.failure('Please choose a date in the future');
    return;
  }

  updateTimerDisplay(convertMs(timeRemaining));

  countdownIntervalId = setInterval(() => {
    const currentDate = new Date().getTime();
    const timeRemaining = selectedDate - currentDate;

    if (timeRemaining <= 0) {
      clearInterval(countdownIntervalId);
      updateTimerDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      Notiflix.Notify.success('Countdown completed!');
      startButton.disabled = false;
      timerRunning = false;
      dateTimePicker.disabled = false;
    } else {
      updateTimerDisplay(convertMs(timeRemaining));
    }
  }, 1000);
}

startButton.addEventListener('click', () => {
  if (!timerRunning) {
    startCountdown();
    startButton.disabled = true;
    timerRunning = true;
    dateTimePicker.disabled = true;
  }
});

flatpickr('#datetime-picker', {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = new Date(selectedDates[0]).getTime();
    const currentDate = new Date().getTime();
    const timeRemaining = selectedDate - currentDate;

    if (timeRemaining <= 0) {
      Notiflix.Notify.failure('Please choose a date in the future');
      startButton.disabled = true;
    } else {
      startButton.disabled = false;
    }
  },
});

startButton.disabled = true;
