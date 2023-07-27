import Notiflix from 'notiflix';

function createPromise(position, delay) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const shouldResolve = Math.random() > 0.3;
      if (shouldResolve) {
        resolve({ position, delay });
      } else {
        reject({ position, delay });
      }
    }, delay);
  });
}

const form = document.querySelector('.form');

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const firstDelay = Number(event.target.elements.delay.value);
  const step = Number(event.target.elements.step.value);
  const amount = Number(event.target.elements.amount.value);

  let currentDelay = firstDelay;

  for (let i = 1; i <= amount; i++) {
    createPromise(i, currentDelay)
      .then(({ position, delay }) => {
        const message = `✅ Fulfilled promise ${position} in ${delay}ms`;
        Notiflix.Notify.success(message);
        console.log(message);
      })
      .catch(({ position, delay }) => {
        const message = `❌ Rejected promise ${position} in ${delay}ms`;
        Notiflix.Notify.failure(message);
        console.log(message);
      });

    currentDelay += step;
  }
});
