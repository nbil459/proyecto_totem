/* ---------------------------------------------------
   PANEL DE ADMINISTRACIÓN E INSPECTORÍA - APP LOGIC
   --------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {

  // ---------------------------------------------------
  // 0. LIGHT & DARK THEME TOGGLE LOGIC
  // ---------------------------------------------------
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const sunIcon = document.getElementById('sunIcon');
  const moonIcon = document.getElementById('moonIcon');

  function setTheme(isDark) {
    if (isDark) {
      document.body.classList.add('dark-theme');
      sunIcon.style.display = 'block';
      moonIcon.style.display = 'none';
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'block';
      localStorage.setItem('theme', 'light');
    }
  }

  // Load saved theme or system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    setTheme(true);
  } else {
    setTheme(false);
  }

  themeToggleBtn.addEventListener('click', () => {
    const isCurrentlyDark = document.body.classList.contains('dark-theme');
    setTheme(!isCurrentlyDark);
  });

  // ---------------------------------------------------
  // 1. ALL 14 COURSES LIST AS REQUESTED
  // ---------------------------------------------------
  const allCourses = [
    '1°A', '1°B', '1°C',
    '2°A', '2°B', '2°C',
    '3° Administración', '3° Enfermería', '3° Programación', '3° Electrónica',
    '4° Administración', '4° Enfermería', '4° Programación', '4° Electrónica'
  ];

  // ---------------------------------------------------
  // 2. MOCK DATABASE (STUDENTS & LATE RECORDS LOG)
  // ---------------------------------------------------
  
  const studentNames = [
    'Juan Pérez', 'María González', 'Tomás López', 'Camila Rodríguez', 'Benjamín Muñoz',
    'Valentina Soto', 'Diego Rojas', 'Fernanda Silva', 'Gabriel Araya', 'Sofía Castro',
    'Lucas Morales', 'Isidora Espinoza', 'Matías Vera', 'Antonia Navarrete', 'Joaquín Godoy',
    'Martina Sepúlveda', 'Bastián Orellana', 'Florencia Tapia', 'Agustín Parra', 'Isabella Fuentes',
    'Maximiliano Lagos', 'Constanza Pizarro', 'Sebastián Carrasco', 'Catalina Bravo', 'Nicolás Valenzuela'
  ];

  let studentsData = [];
  let studentCounter = 1;

  allCourses.forEach(course => {
    const studentCount = 12;
    for (let i = 1; i <= studentCount; i++) {
      const nameIndex = (studentCounter - 1) % studentNames.length;
      const name = `${studentNames[nameIndex]} ${i > 1 ? i : ''}`.trim();
      const rut = `${12 + (studentCounter % 10)}.${100 + i * 7}.${200 + i * 11}-${(i * 3) % 9}`;
      
      const totalLates = Math.floor(Math.random() * 8) + (i % 3);
      const justified = Math.floor(Math.random() * (totalLates + 1));
      const unjustified = totalLates - justified;
      const avgDaily = (totalLates > 0 ? (totalLates / 20) : 0).toFixed(2);
      const latePercentage = Math.min(100, Math.round((totalLates / 20) * 100));

      studentsData.push({
        id: studentCounter,
        rut: rut,
        name: name,
        course: course,
        totalLates: totalLates,
        justified: justified,
        unjustified: unjustified,
        avgDaily: parseFloat(avgDaily),
        latePercentage: latePercentage,
        phone: `+56 9 ${5000 + studentCounter} ${1000 + i}`,
        guardian: `Apoderado/a de ${name}`
      });
      studentCounter++;
    }
  });

  // Daily Log list for Module 1 (Live arrivals)
  let dailyLatesLog = [
    { id: 1, datetime: '13/08/2026 - 08:05 hrs', rut: '12.345.678-K', name: 'Juan Pérez', course: '1°A', status: 'Injustificado', note: 'Retraso locomoción' },
    { id: 2, datetime: '13/08/2026 - 08:12 hrs', rut: '23.456.789-1', name: 'María González', course: '4° Programación', status: 'Justificado', note: 'Certificado médico' },
    { id: 3, datetime: '13/08/2026 - 08:15 hrs', rut: '34.567.890-2', name: 'Tomás López', course: '3° Administración', status: 'Injustificado', note: 'Sin justificación' },
    { id: 4, datetime: '13/08/2026 - 08:20 hrs', rut: '45.678.901-3', name: 'Camila Rodríguez', course: '4° Enfermería', status: 'Injustificado', note: 'Sin justificación' },
    { id: 5, datetime: '13/08/2026 - 08:25 hrs', rut: '56.789.012-4', name: 'Benjamín Muñoz', course: '2°A', status: 'Justificado', note: 'Trámite personal' },
    { id: 6, datetime: '13/08/2026 - 08:30 hrs', rut: '67.890.123-5', name: 'Valentina Soto', course: '1°B', status: 'Injustificado', note: 'Sin justificación' },
    { id: 7, datetime: '13/08/2026 - 08:35 hrs', rut: '78.901.234-6', name: 'Diego Rojas', course: '4° Electrónica', status: 'Injustificado', note: 'Sin justificación' }
  ];

  // ---------------------------------------------------
  // 3. TAB SWITCHING LOGIC (2 MODULES)
  // ---------------------------------------------------
  const tabBtns = document.querySelectorAll('.module-tab-btn');
  const panels = {
    '1': document.getElementById('module1Panel'),
    '2': document.getElementById('module2Panel')
  };

  const themeColors = {
    '1': { primary: '#0052cc', hover: '#0040a8', light: 'rgba(0, 82, 204, 0.15)' },
    '2': { primary: '#1e8e3e', hover: '#156a2e', light: 'rgba(30, 142, 62, 0.15)' }
  };

  function switchTab(moduleNum) {
    tabBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-module') === moduleNum);
    });

    Object.keys(panels).forEach(key => {
      panels[key].classList.toggle('active', key === moduleNum);
    });

    const theme = themeColors[moduleNum];
    document.documentElement.style.setProperty('--active-primary', theme.primary);
    document.documentElement.style.setProperty('--active-primary-hover', theme.hover);
    document.documentElement.style.setProperty('--active-primary-light', theme.light);
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      switchTab(btn.getAttribute('data-module'));
    });
  });

  // ---------------------------------------------------
  // 4. MODULE 1: REGISTRO DIARIO DE ATRASOS
  // ---------------------------------------------------
  const m1Search = document.getElementById('m1Search');
  const m1CourseSelect = document.getElementById('m1CourseSelect');
  const m1TableBody = document.getElementById('m1TableBody');
  const m1RegisterBtn = document.getElementById('m1RegisterBtn');

  function renderModule1() {
    const searchTerm = m1Search.value.toLowerCase().trim();
    const selectedCourse = m1CourseSelect.value;

    const filtered = dailyLatesLog.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm) || 
                            item.rut.toLowerCase().includes(searchTerm) ||
                            item.course.toLowerCase().includes(searchTerm);
      const matchesCourse = selectedCourse === 'all' || item.course === selectedCourse;
      return matchesSearch && matchesCourse;
    });

    m1TableBody.innerHTML = filtered.map((item, index) => `
      <tr>
        <td>${index + 1}</td>
        <td><strong>${item.datetime}</strong></td>
        <td>${item.rut}</td>
        <td><strong>${item.name}</strong></td>
        <td>${item.course}</td>
        <td class="col-center">
          <span class="badge-status ${item.status === 'Justificado' ? 'badge-justified' : 'badge-unjustified'}">
            ${item.status}
          </span>
        </td>
        <td class="col-center">
          <button class="btn-action-outline btn-action-blue" onclick="openLateReceipt('${item.id}')">
            Detalles
          </button>
        </td>
      </tr>
    `).join('');
  }

  m1Search.addEventListener('input', renderModule1);
  m1CourseSelect.addEventListener('change', renderModule1);
  document.getElementById('m1FilterBtn').addEventListener('click', renderModule1);

  // Register New Late Entry Modal
  m1RegisterBtn.addEventListener('click', () => {
    const bodyHTML = `
      <form id="newLateForm">
        <div class="form-group">
          <label>Nombre del Estudiante</label>
          <input type="text" id="newStudentName" class="form-input" placeholder="Ej: Ignacio Silva" required>
        </div>
        <div class="form-group">
          <label>RUT</label>
          <input type="text" id="newStudentRUT" class="form-input" placeholder="Ej: 19.876.543-2" required>
        </div>
        <div class="form-group">
          <label>Curso</label>
          <select id="newStudentCourse" class="form-select">
            ${allCourses.map(c => `<option value="${c}">${c}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Estado de Justificación</label>
          <select id="newStudentStatus" class="form-select">
            <option value="Injustificado">Injustificado</option>
            <option value="Justificado">Justificado</option>
          </select>
        </div>
        <div class="form-group">
          <label>Observación / Motivo</label>
          <textarea id="newStudentNote" class="form-textarea" rows="2" placeholder="Ej: Llegada a las 08:20 por problemas de movilización"></textarea>
        </div>
      </form>
    `;

    openModal('Registrar Nuevo Atraso de Estudiante', bodyHTML, () => {
      const name = document.getElementById('newStudentName').value;
      const rut = document.getElementById('newStudentRUT').value;
      const course = document.getElementById('newStudentCourse').value;
      const status = document.getElementById('newStudentStatus').value;
      const note = document.getElementById('newStudentNote').value;

      if (!name || !rut) {
        alert('Por favor ingrese Nombre y RUT del estudiante.');
        return false;
      }

      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      const datetime = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth()+1).toString().padStart(2, '0')}/${now.getFullYear()} - ${timeStr} hrs`;

      dailyLatesLog.unshift({
        id: Date.now(),
        datetime: datetime,
        rut: rut,
        name: name,
        course: course,
        status: status,
        note: note || 'Sin observaciones'
      });

      const existingStudent = studentsData.find(s => s.rut === rut);
      if (existingStudent) {
        existingStudent.totalLates++;
        if (status === 'Justificado') existingStudent.justified++;
        else existingStudent.unjustified++;
      }

      renderModule1();
      renderModule2();
      return true;
    });
  });

  // Receipt Modal Action
  window.openLateReceipt = (id) => {
    const item = dailyLatesLog.find(l => l.id == id);
    if (!item) return;

    const bodyHTML = `
      <div style="background: var(--bg-subtle); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem;">
          <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Ticket de Registro</span>
          <span class="badge-status ${item.status === 'Justificado' ? 'badge-justified' : 'badge-unjustified'}">${item.status}</span>
        </div>
        <h4 style="font-size: 1.15rem; font-weight: 800; color: var(--theme-blue); margin-bottom: 0.5rem;">${item.name}</h4>
        <p style="font-size: 0.9rem; margin-bottom: 0.25rem;"><strong>RUT:</strong> ${item.rut}</p>
        <p style="font-size: 0.9rem; margin-bottom: 0.25rem;"><strong>Curso:</strong> ${item.course}</p>
        <p style="font-size: 0.9rem; margin-bottom: 0.25rem;"><strong>Fecha y Hora de Ingreso:</strong> ${item.datetime}</p>
        <p style="font-size: 0.9rem; margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px dashed var(--border-color);">
          <strong>Observación:</strong> ${item.note}
        </p>
      </div>
    `;

    openModal(`Comprobante de Ingreso Tardío`, bodyHTML);
  };

  // ---------------------------------------------------
  // 5. MODULE 2: CONTROL Y ESPECIFICACIONES POR CURSO
  // ---------------------------------------------------
  const courseChipsGrid = document.getElementById('courseChipsGrid');
  const m2SelectedCourseTitle = document.getElementById('m2SelectedCourseTitle');
  const m2StatTotalStudents = document.getElementById('m2StatTotalStudents');
  const m2StatTotalLates = document.getElementById('m2StatTotalLates');
  const m2StatAvg = document.getElementById('m2StatAvg');
  const m2Search = document.getElementById('m2Search');
  const m2TableBody = document.getElementById('m2TableBody');
  const m2ExportBtn = document.getElementById('m2ExportBtn');

  let activeCourse = '1°A';

  function renderCourseSelectorChips() {
    courseChipsGrid.innerHTML = allCourses.map(course => {
      const courseStudents = studentsData.filter(s => s.course === course);
      const totalLates = courseStudents.reduce((acc, curr) => acc + curr.totalLates, 0);

      return `
        <button class="course-chip-btn ${course === activeCourse ? 'active' : ''}" onclick="selectCourse('${course}')">
          <span>${course}</span>
          <span class="badge-count">${totalLates}</span>
        </button>
      `;
    }).join('');
  }

  window.selectCourse = (course) => {
    activeCourse = course;
    renderCourseSelectorChips();
    renderModule2();
  };

  function renderModule2() {
    const searchTerm = m2Search.value.toLowerCase().trim();

    const courseStudents = studentsData.filter(s => s.course === activeCourse);

    const totalStudents = courseStudents.length;
    const totalLates = courseStudents.reduce((acc, curr) => acc + curr.totalLates, 0);
    const avgPerStudent = totalStudents > 0 ? (totalLates / totalStudents).toFixed(2).replace('.', ',') : '0,00';

    m2SelectedCourseTitle.textContent = `Especificaciones del Curso: ${activeCourse}`;
    m2StatTotalStudents.textContent = totalStudents;
    m2StatTotalLates.textContent = totalLates;
    m2StatAvg.textContent = avgPerStudent;

    const filtered = courseStudents.filter(s => 
      s.name.toLowerCase().includes(searchTerm) || s.rut.toLowerCase().includes(searchTerm)
    );

    m2TableBody.innerHTML = filtered.map((s, index) => `
      <tr>
        <td>${index + 1}</td>
        <td><strong>${s.rut}</strong></td>
        <td><strong>${s.name}</strong></td>
        <td class="col-center"><strong>${s.totalLates}</strong></td>
        <td class="col-center" style="color: #15803d; font-weight: 700;">${s.justified}</td>
        <td class="col-center" style="color: #b91c1c; font-weight: 700;">${s.unjustified}</td>
        <td>
          <div class="progress-bar-container">
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" style="width: ${s.latePercentage}%;"></div>
            </div>
            <span style="font-size: 0.8rem; font-weight: 700;">${s.avgDaily.toString().replace('.', ',')} / día</span>
          </div>
        </td>
        <td class="col-center">
          <button class="btn-action-outline btn-action-green" onclick="openStudentDetailsModal('${s.rut}')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
            </svg>
            Detalles de Atrasos
          </button>
        </td>
      </tr>
    `).join('');
  }

  m2Search.addEventListener('input', renderModule2);
  m2ExportBtn.addEventListener('click', () => {
    const courseStudents = studentsData.filter(s => s.course === activeCourse);
    exportCSV(`Especificaciones_${activeCourse}.csv`, courseStudents);
  });

  // Student Details Modal (Timeline)
  window.openStudentDetailsModal = (rut) => {
    const student = studentsData.find(s => s.rut === rut);
    if (!student) return;

    const sampleDates = [
      { date: '10/08/2026 - 08:14 hrs', status: 'Injustificado', note: 'Sin justificativo presentado' },
      { date: '04/08/2026 - 08:22 hrs', status: 'Justificado', note: 'Certificado médico atendido' },
      { date: '01/08/2026 - 08:10 hrs', status: 'Injustificado', note: 'Problemas de movilización' }
    ];

    const bodyHTML = `
      <div style="margin-bottom: 1.25rem; background: var(--bg-subtle); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
        <h4 style="font-weight: 800; font-size: 1.15rem; color: var(--theme-green);">${student.name}</h4>
        <p style="font-size: 0.88rem; color: var(--text-muted);">RUT: ${student.rut} | Curso: ${student.course}</p>
        <p style="font-size: 0.88rem; color: var(--text-muted);">Apoderado: ${student.guardian} (${student.phone})</p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; margin-bottom: 1.25rem; text-align: center;">
        <div style="background: var(--bg-subtle); padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
          <span style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase;">Total Atrasos</span>
          <p style="font-size: 1.2rem; font-weight: 800; color: var(--text-main);">${student.totalLates}</p>
        </div>
        <div style="background: rgba(22, 163, 74, 0.15); padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid rgba(22, 163, 74, 0.3);">
          <span style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: #15803d;">Justificados</span>
          <p style="font-size: 1.2rem; font-weight: 800; color: #15803d;">${student.justified}</p>
        </div>
        <div style="background: rgba(220, 38, 38, 0.15); padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid rgba(220, 38, 38, 0.3);">
          <span style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: #b91c1c;">Injustificados</span>
          <p style="font-size: 1.2rem; font-weight: 800; color: #b91c1c;">${student.unjustified}</p>
        </div>
      </div>

      <h5 style="font-weight: 800; font-size: 0.95rem; margin-bottom: 0.75rem; color: var(--text-main);">Historial de Registros</h5>
      <div class="timeline-list">
        ${sampleDates.slice(0, Math.max(1, student.totalLates)).map(item => `
          <div class="timeline-item">
            <div>
              <strong>${item.date}</strong>
              <p style="font-size: 0.82rem; color: var(--text-muted);">${item.note}</p>
            </div>
            <span class="badge-status ${item.status === 'Justificado' ? 'badge-justified' : 'badge-unjustified'}">
              ${item.status}
            </span>
          </div>
        `).join('')}
      </div>
    `;

    openModal(`Especificaciones y Detalles - ${student.name}`, bodyHTML);
  };

  // ---------------------------------------------------
  // 6. MODALS UTILITY
  // ---------------------------------------------------
  const backdrop = document.getElementById('appModalBackdrop');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const modalFooter = document.getElementById('modalFooter');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalFooterCloseBtn = document.getElementById('modalFooterCloseBtn');

  let currentConfirmHandler = null;

  function openModal(title, bodyHTML, onConfirm = null) {
    modalTitle.textContent = title;
    modalBody.innerHTML = bodyHTML;
    currentConfirmHandler = onConfirm;

    if (onConfirm) {
      modalFooter.innerHTML = `
        <button class="btn-secondary" id="modalCancelBtn">Cancelar</button>
        <button class="btn-action-primary" id="modalSaveBtn">Guardar Registro</button>
      `;
      document.getElementById('modalCancelBtn').addEventListener('click', closeModal);
      document.getElementById('modalSaveBtn').addEventListener('click', () => {
        if (currentConfirmHandler && currentConfirmHandler()) {
          closeModal();
        }
      });
    } else {
      modalFooter.innerHTML = `<button class="btn-secondary" onclick="closeModal()">Cerrar</button>`;
    }

    backdrop.classList.add('active');
  }

  window.closeModal = function() {
    backdrop.classList.remove('active');
  };

  modalCloseBtn.addEventListener('click', closeModal);
  modalFooterCloseBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeModal();
  });

  // CSV Export Utility
  function exportCSV(filename, data) {
    if (!data || !data.length) return;
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(obj => Object.values(obj).map(val => `"${val}"`).join(','));
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Initial Initialization
  renderModule1();
  renderCourseSelectorChips();
  renderModule2();

});
