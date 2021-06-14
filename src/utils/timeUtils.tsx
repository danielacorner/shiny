export function getTimeOfDay() {
  const date = new Date();
  const hourOfDay = date.getHours();
  const isDaytime = hourOfDay > 6 && hourOfDay < 18;
  const isRaining = date.getDate() % 3 === 0;
  const isMonday = date.getDay() === 1;
  const isFriday = date.getDay() === 5;
  return { isDaytime, isMonday, isRaining, isFriday };
}
