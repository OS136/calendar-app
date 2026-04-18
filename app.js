const CalendarApp = (() => {
  // State
  let currentDate = new Date();
  let events = [];
  let editingEventId = null;

  // DOM Elements
  const monthYearEl = document.getElementById('monthYear');
  const calendarGridEl = document.getElementById('calendarGrid');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const todayBtn = document.getElementById('todayBtn');
  const addEventBtn = document.getElementById('addEventBtn');
  const modalOverlay = document.getElementById('modalOverlay');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const cancelBtn = document.getElementById('cancelBtn');
  const eventForm = document.getElementById('eventForm');
  const deleteBtn = document.getElementById('deleteBtn');
  const deleteSection = document.getElementById('deleteSection');

  // Form inputs
  const titleInput = document.getElementById('eventTitle');
  const dateInput = document.getElementById('eventDate');
  const startTimeInput = document.getElementById('eventStartTime');
  const endTimeInput = document.getElementById('eventEndTime');
  const descriptionInput = document.getElementById('eventDescription');
  const eventIdInput = document.getElementById('eventId');

  // Error elements
  const titleError = document.getElementById('titleError');
  const dateError = document.getElementById('dateError');
  const startTimeError = document.getElementById('startTimeError');
  const endTimeError = document.getElementById('endTimeError');

  // Storage
  function loadEvents() {
    try {
      const stored = localStorage.getItem('calendar_events');
      return stored ? JSON.parse(stored) : [];
    } catch {
      console.error('Failed to load events from localStorage');
      return [];
    }
  }

  function saveEvents() {
    try {
      localStorage.setItem('calendar_events', JSON.stringify(events));
    } catch {
      console.error('Failed to save events to localStorage');
    }
  }

  // Validation
  function clearErrors() {
    titleError.textContent = '';
    dateError.textContent = '';
    startTimeError.textContent = '';
    endTimeError.textContent = '';
  }

  function validateForm() {
    clearErrors();
    let isValid = true;

    if (!titleInput.value.trim()) {
      titleError.textContent = 'Title is required';
      isValid = false;
    }

    if (!dateInput.value) {
      dateError.textContent = 'Date is required';
      isValid = false;
    }

    const startTime = startTimeInput.value;
    const endTime = endTimeInput.value;

    if (startTime && endTime && startTime >= endTime) {
      endTimeError.textContent = 'End time must be after start time';
      isValid = false;
    }

    return isValid;
  }

  // CRUD Operations
  function addEvent(data) {
    const event = {
      id: crypto.randomUUID(),
      title: data.title.trim(),
      date: data.date,
      startTime: data.startTime || '',
      endTime: data.endTime || '',
      description: data.description.trim(),
      createdAt: new Date().toISOString()
    };
    events.push(event);
    saveEvents();
    return event;
  }

  function updateEvent(id, data) {
    const event = events.find(e => e.id === id);
    if (!event) return null;

    event.title = data.title.trim();
    event.date = data.date;
    event.startTime = data.startTime || '';
    event.endTime = data.endTime || '';
    event.description = data.description.trim();
    saveEvents();
    return event;
  }

  function deleteEvent(id) {
    events = events.filter(e => e.id !== id);
    saveEvents();
  }

  function getEventsByDate(dateStr) {
    return events.filter(e => e.date === dateStr).sort((a, b) => {
      if (!a.startTime) return 1;
      if (!b.startTime) return -1;
      return a.startTime.localeCompare(b.startTime);
    });
  }

  // Calendar Rendering
  function getDaysInMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }

  function getFirstDayOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  }

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function isToday(dateStr) {
    return dateStr === formatDate(new Date());
  }

  function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Update header
    const monthName = new Date(year, month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    monthYearEl.textContent = monthName;

    // Clear grid
    calendarGridEl.innerHTML = '';

    // Add day headers
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayNames.forEach(day => {
      const header = document.createElement('div');
      header.className = 'day-header';
      header.textContent = day;
      calendarGridEl.appendChild(header);
    });

    // Add empty cells for days before month starts
    const firstDay = getFirstDayOfMonth(currentDate);
    for (let i = 0; i < firstDay; i++) {
      const emptyCell = document.createElement('div');
      emptyCell.className = 'day-cell other-month';
      calendarGridEl.appendChild(emptyCell);
    }

    // Add day cells
    const daysInMonth = getDaysInMonth(currentDate);
    for (let day = 1; day <= daysInMonth; day++) {
      const cellDate = new Date(year, month, day);
      const dateStr = formatDate(cellDate);
      const dayEventsToday = getEventsByDate(dateStr);

      const cell = document.createElement('div');
      cell.className = 'day-cell';
      if (isToday(dateStr)) cell.classList.add('today');

      const dayNumber = document.createElement('div');
      dayNumber.className = 'day-number';
      dayNumber.textContent = day;
      cell.appendChild(dayNumber);

      const eventsList = document.createElement('div');
      eventsList.className = 'events-list';
      dayEventsToday.forEach(event => {
        const chip = document.createElement('div');
        chip.className = 'event-chip';
        chip.textContent = event.title;
        chip.addEventListener('click', (e) => {
          e.stopPropagation();
          openModal(dateStr, event.id);
        });
        eventsList.appendChild(chip);
      });
      cell.appendChild(eventsList);

      cell.addEventListener('click', () => openModal(dateStr));
      calendarGridEl.appendChild(cell);
    }
  }

  // Modal
  function openModal(dateStr, eventId = null) {
    editingEventId = eventId;
    clearErrors();

    // Set date input
    dateInput.value = dateStr;

    if (eventId) {
      const event = events.find(e => e.id === eventId);
      if (event) {
        titleInput.value = event.title;
        startTimeInput.value = event.startTime;
        endTimeInput.value = event.endTime;
        descriptionInput.value = event.description;
        eventIdInput.value = event.id;
        deleteSection.classList.remove('hidden');
        document.querySelector('.modal-header h2').textContent = 'Edit Event';
      }
    } else {
      titleInput.value = '';
      startTimeInput.value = '';
      endTimeInput.value = '';
      descriptionInput.value = '';
      eventIdInput.value = '';
      deleteSection.classList.add('hidden');
      document.querySelector('.modal-header h2').textContent = 'Add Event';
    }

    modalOverlay.classList.remove('hidden');
    titleInput.focus();
  }

  function closeModal() {
    modalOverlay.classList.add('hidden');
    editingEventId = null;
    eventForm.reset();
    clearErrors();
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    if (!validateForm()) return;

    const formData = {
      title: titleInput.value,
      date: dateInput.value,
      startTime: startTimeInput.value,
      endTime: endTimeInput.value,
      description: descriptionInput.value
    };

    if (editingEventId) {
      updateEvent(editingEventId, formData);
    } else {
      addEvent(formData);
    }

    closeModal();
    renderCalendar();
  }

  function handleDeleteEvent() {
    if (!editingEventId) return;

    const confirmed = confirm('Are you sure you want to delete this event?');
    if (confirmed) {
      deleteEvent(editingEventId);
      closeModal();
      renderCalendar();
    }
  }

  // Navigation
  function goToPreviousMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
  }

  function goToNextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
  }

  function goToToday() {
    currentDate = new Date();
    renderCalendar();
  }

  function openAddEventModal() {
    const todayStr = formatDate(new Date());
    openModal(todayStr);
  }

  // Event Listeners
  function attachEventListeners() {
    prevBtn.addEventListener('click', goToPreviousMonth);
    nextBtn.addEventListener('click', goToNextMonth);
    todayBtn.addEventListener('click', goToToday);
    addEventBtn.addEventListener('click', openAddEventModal);
    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    eventForm.addEventListener('submit', handleFormSubmit);
    deleteBtn.addEventListener('click', handleDeleteEvent);

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  // Initialize
  function init() {
    events = loadEvents();
    attachEventListeners();
    renderCalendar();
  }

  return { init };
})();

// Start the app
document.addEventListener('DOMContentLoaded', CalendarApp.init);
