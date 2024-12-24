import moment from 'moment';

//Funkcja dodaje zero do daty jeżeli jest mniejsze od 10: 9 => 09
export const addZeroToDate = (date) => {
  if(date<10) return '0'+date;
  else return date;
}

//Funkcja zaznacza na kalendarzu okres między dwoma datami
export const getMarkedDates = (startDate, endDate) => {
  let dates = {};
  let currentDate = moment(startDate); // Zaczynamy od fromDate
  let lastDate = moment(endDate); // Kończymy na toDate

  while (currentDate <= lastDate) {
    const formattedDate = currentDate.format('YYYY-MM-DD');
    dates[formattedDate] = {
      color: 'green',
      textColor: 'white',
      ...(formattedDate === startDate && { startingDay: true }),
      ...(formattedDate === endDate && { endingDay: true })
    };
    currentDate = currentDate.add(1, 'day'); // Przechodzimy do następnego dnia
  }

  return dates;
};

export const isFirstMonthOfYear = (currentMonth) => {
  if(currentMonth==0) return 11;
  else return currentMonth-1;
}

export const isNextYear = (currentDate) => {
  if(currentDate.getMonth()==0) return currentDate.getFullYear()-1;
  else return currentDate.getFullYear();
}

export const changeValue = (e, setValue) => {
  e = e.replace(',', '.');
  if((e.length-e.indexOf('.')>3 && e.indexOf('.')!=-1) || (e.split('.').length-1)>1) null
  else {
      if(e.length==1 && e=='.'){
        setValue('0'+e);
      }else {
        setValue(e);
      }
  }
}