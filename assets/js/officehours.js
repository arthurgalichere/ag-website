const officeHoursBody = document.querySelector('.office-hours-body');
const officeHoursTarget = document.getElementById('office-hours-content');

if (!officeHoursBody || !officeHoursTarget) return;

const officeHoursUrl = officeHoursBody.dataset.officeHoursUrl;
