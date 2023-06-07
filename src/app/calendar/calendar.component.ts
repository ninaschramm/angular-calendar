import { Component } from '@angular/core';

interface Appointment {
  title: string;
  date: Date;
  time: string;
}

// Helper function to format timezone offset
function getTimezoneOffsetString(offset: number): string {
  const sign = offset > 0 ? "-" : "+";
  const hours = Math.floor(Math.abs(offset) / 60);
  const minutes = Math.abs(offset) % 60;
  return `${sign}${padNumber(hours)}:${padNumber(minutes)}`;
}

// Helper function to pad number with leading zero
function padNumber(num: number): string {
  return String(num).padStart(2, "0");
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {
  currentDate: Date;
  currentMonth: number;
  currentYear: number;
  weeks: any[] = [];
  currentMonthName: string = '';
  weekdays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']; 
  appointments: Appointment[] = [];
  appointmentTitle: string = '';
  appointmentDate: string = '';
  appointmentTime: string = '';
  selectedDate: Date = new Date();



  constructor() {
    this.currentDate = new Date();
    this.currentMonth = this.currentDate.getMonth();
    this.currentYear = this.currentDate.getFullYear();
    this.currentMonthName = this.getMonthName(this.currentDate.getMonth());
    this.generateCalendar();
  }

  generateCalendar() {
    this.weeks = [];
  
    const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1);
    const lastDayOfMonth = new Date(this.currentYear, this.currentMonth + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
  
    let startDayOfWeek = firstDayOfMonth.getDay();
    if (startDayOfWeek === 0) {
      startDayOfWeek = 7; // Adjust Sunday to be the last day of the week (7)
    }
  
    let dayCounter = 1;
    let week: (number | null)[] = [];
  
    for (let i = 1; i < startDayOfWeek; i++) {
      week.push(null); // Add null placeholders for days before the first day of the month
    }
  
    while (dayCounter <= daysInMonth) {
      if (week.length === 7) {
        this.weeks.push(week); // Add the completed week to the calendar
        week = [];
      }
  
      week.push(dayCounter);
      dayCounter++;
    }
  
    // Add null placeholders for remaining days in the last week
    while (week.length < 7) {
      week.push(null);
    }
  
    this.weeks.push(week); // Add the last week to the calendar
  }
  

  prevMonth() {
    this.currentMonth--; // Decrement the current month
  
    if (this.currentMonth < 0) {
      // If the current month is less than 0, it means we have moved to the previous year
      this.currentMonth = 11; // Set the current month to December
      this.currentYear--; // Decrement the current year
    }
  
    this.generateCalendar(); // Regenerate the calendar grid for the new month
  }
  

  nextMonth() {
    this.currentMonth++; // Increment the current month
  
    if (this.currentMonth > 11) {
      // If the current month is greater than 11, it means we have moved to the next year
      this.currentMonth = 0; // Set the current month to January
      this.currentYear++; // Increment the current year
    }
  
    this.generateCalendar(); // Regenerate the calendar grid for the new month
  }

  isCurrentDay(day: number): boolean {
    const currentDate = new Date();
    return (
      day === currentDate.getDate() &&
      this.currentMonth === currentDate.getMonth() &&
      this.currentYear === currentDate.getFullYear()
    );
  }

  private getMonthName(month: number): string {
    const options: Intl.DateTimeFormatOptions = { month: 'long' };
    const date = new Date();
    date.setMonth(month);
    return date.toLocaleString('en-US', options);
  }
  
  addAppointment() {
    if (this.appointmentTitle && this.appointmentDate && this.appointmentTime) {
      const timezoneOffset = new Date().getTimezoneOffset();
      const newAppointment: Appointment = {
    title: this.appointmentTitle,
    date: new Date(`${this.appointmentDate}T00:00:00${getTimezoneOffsetString(timezoneOffset)}`),
    time: this.appointmentTime
  };
      this.appointments.push(newAppointment);
      this.clearAppointmentForm();
    }
  }
  

  clearAppointmentForm() {
    this.appointmentTitle = '';
    this.appointmentDate = '';
    this.appointmentTime = '';
  }

  getAppointmentsForDate(date: Date): Appointment[] {
    return this.appointments.filter(appointment => {
      return (
        appointment.date.getFullYear() === date.getFullYear() &&
        appointment.date.getMonth() === date.getMonth() &&
        appointment.date.getDate() === date.getDate()
      );
    });
  }

  hasAppointmentsForDay(day: number): boolean {
    if (day === null) {
      return false;
    }
    const date = new Date(this.currentYear, this.currentMonth, day);
    return this.getAppointmentsForDate(date).length > 0;
  }

  selectDay(day: number) {
    if (day !== null) {
      this.selectedDate = new Date(this.currentYear, this.currentMonth, day);
    }
  }  
  
  deleteAppointment(appointment: Appointment) {
    const index = this.appointments.indexOf(appointment);
    if (index !== -1) {
      this.appointments.splice(index, 1);
    }
  }

  changeAppointmentDate(appointment: Appointment) {
    const newDate = prompt('Enter a new date (YYYY-MM-DD):');
    const timezoneOffset = new Date().getTimezoneOffset();
    if (newDate) {
      appointment.date = new Date(`${newDate}T00:00:00${getTimezoneOffsetString(timezoneOffset)}`);      
    }
    console.log(this.appointments)
  }
  
  
}
