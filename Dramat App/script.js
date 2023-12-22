let students = [];
let workingStudents = [];
let log = [];

function addStudent() {
    const newStudentInput = document.getElementById('newStudent');
    const studentName = newStudentInput.value.trim();

    if (studentName !== '' && !students.includes(studentName)) {
        students.push(studentName);
        updateStudentList();
        newStudentInput.value = '';
    }
}

function updateStudentList() {
    const studentsList = document.getElementById('students');
    studentsList.innerHTML = '';

    students.forEach(student => {
        const listItem = document.createElement('li');
        listItem.textContent = student;
        listItem.onclick = () => startWorking(student);
        studentsList.appendChild(listItem);
    });
}

function updateWorkingList() {
    const workingList = document.getElementById('working');
    workingList.innerHTML = '';

    workingStudents.forEach(student => {
        const listItem = document.createElement('li');
        listItem.textContent = `${student.name} (${formatTime(student.elapsedTime)})`;
        listItem.onclick = () => stopWorking(student);
        workingList.appendChild(listItem);

        // Clear previous interval (if any)
        if (student.intervalId) {
            clearInterval(student.intervalId);
        }

        // Update the elapsed time every second
        student.intervalId = setInterval(() => {
            student.elapsedTime += 1000; // Update elapsed time every second
            listItem.textContent = `${student.name} (${formatTime(student.elapsedTime)})`;
        }, 1000);
    });
}


function startWorking(studentName) {
    const studentIndex = students.indexOf(studentName);
    if (studentIndex !== -1) {
        const startTime = new Date();
        const student = { name: studentName, startTime: startTime, elapsedTime: 0 };
        workingStudents.push(student);
        students.splice(studentIndex, 1);
        updateStudentList();
        updateWorkingList();
    }
}

function stopWorking(student) {
    const endTime = new Date();
    const elapsedTime = endTime - student.startTime + student.elapsedTime;
    const logEntry = {
        name: student.name,
        date: formatDate(endTime),
        time: elapsedTime
    };
    log.push(logEntry);
    workingStudents = workingStudents.filter(s => s !== student);
    students.push(student.name);
    updateWorkingList();
    updateStudentList();
    updateLog();
}

function updateLog() {
    const logList = document.getElementById('log');
    logList.innerHTML = '';

    log.forEach(entry => {
        const listItem = document.createElement('li');
        listItem.textContent = `${entry.name} worked on ${entry.date} for ${formatTime(entry.time)}`;
        logList.appendChild(listItem);
    });
}

function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function formatTime(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
}

// Initial population of student list
updateStudentList();
