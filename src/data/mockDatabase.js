export const roles = [
  { id: 'admin', label: 'Admin / Ban Giám Hiệu', shortLabel: 'Quản trị viên' },
  { id: 'training', label: 'Phòng Đào Tạo', shortLabel: 'Đào tạo' },
  { id: 'teacher', label: 'Giáo Viên', shortLabel: 'Giáo viên' },
  { id: 'student', label: 'Học Viên', shortLabel: 'Học viên' },
]

export const faculties = [
  { id: 'fac-tech', name: 'Khoa Công nghệ số', code: 'KTCNS' },
  { id: 'fac-business', name: 'Khoa Quản trị doanh nghiệp', code: 'QTDB' },
  { id: 'fac-languages', name: 'Khoa Ngôn ngữ ứng dụng', code: 'NNUD' },
]

export const departments = [
  { id: 'dept-training', name: 'Phòng Đào tạo', code: 'PDT' },
  { id: 'dept-exam', name: 'Trung tâm Khảo thí', code: 'KT' },
  { id: 'dept-student', name: 'Công tác học viên', code: 'CTHV' },
]

export const campuses = [
  { id: 'campus-a', name: 'Cơ sở A - Trung tâm', address: '18 Lý Tự Trọng' },
  { id: 'campus-b', name: 'Cơ sở B - Hòa Lạc', address: 'Khu Giáo dục số 2' },
]

export const rooms = [
  { id: 'room-a201', code: 'A201', name: 'Lab 2 Hopper Bldg', capacity: 32, campusId: 'campus-a', type: 'Lab' },
  { id: 'room-a302', code: 'A302', name: 'Lecture Hall 3', capacity: 72, campusId: 'campus-a', type: 'Lecture' },
  { id: 'room-b118', code: 'B118', name: 'Phòng 402, Turing Bldg', capacity: 45, campusId: 'campus-b', type: 'Seminar' },
  { id: 'room-online', code: 'ONLINE', name: 'MS Teams / EduLive', capacity: 120, campusId: 'campus-a', type: 'Online' },
]

export const majors = [
  { id: 'major-se', code: 'SE', name: 'Kỹ thuật phần mềm', facultyId: 'fac-tech' },
  { id: 'major-ds', code: 'DS', name: 'Khoa học dữ liệu', facultyId: 'fac-tech' },
  { id: 'major-ba', code: 'BA', name: 'Quản trị kinh doanh số', facultyId: 'fac-business' },
]

export const courses = [
  { id: 'course-algo', code: 'CS101', name: 'Nhập môn Khoa học Máy tính', credits: 3, facultyId: 'fac-tech' },
  { id: 'course-db', code: 'CS204', name: 'Hệ thống Cơ sở dữ liệu', credits: 3, facultyId: 'fac-tech' },
  { id: 'course-ai', code: 'AI301', name: 'Giải thuật Nâng cao', credits: 4, facultyId: 'fac-tech' },
  { id: 'course-phys', code: 'PHY301', name: 'Vật lý Nâng cao 301', credits: 2, facultyId: 'fac-tech' },
  { id: 'course-erp', code: 'ERP220', name: 'Quản trị quy trình ERP', credits: 3, facultyId: 'fac-business' },
]

export const users = [
  {
    id: 'user-admin',
    role: 'admin',
    name: 'Nguyễn Minh Anh',
    email: 'admin@edutrack.pro',
    avatar: 'NA',
    departmentId: 'dept-training',
    status: 'active',
  },
  {
    id: 'user-training',
    role: 'training',
    name: 'Sarah Jenkins',
    email: 'training@edutrack.pro',
    avatar: 'SJ',
    departmentId: 'dept-training',
    status: 'active',
  },
  {
    id: 'teacher-thorne',
    role: 'teacher',
    name: 'TS. Aris Thorne',
    email: 'aris.thorne@edutrack.pro',
    avatar: 'AT',
    facultyId: 'fac-tech',
    assignedClassIds: ['class-cs101-a', 'class-phy301-a', 'class-ai301-a'],
    status: 'active',
  },
  {
    id: 'teacher-davis',
    role: 'teacher',
    name: 'PGS. David Kim',
    email: 'david.kim@edutrack.pro',
    avatar: 'DK',
    facultyId: 'fac-tech',
    assignedClassIds: ['class-db204-b', 'class-ai301-b'],
    status: 'active',
  },
  {
    id: 'student-alice',
    role: 'student',
    name: 'Alice Smith',
    email: 'alice.smith@learn.edutrack.pro',
    avatar: 'AS',
    studentId: 'stu-001',
    classIds: ['class-cs101-a', 'class-phy301-a'],
    status: 'active',
  },
]

export const students = [
  { id: 'stu-001', code: '20210001', fullName: 'Alice Smith', gender: 'Nữ', majorId: 'major-se', cohort: 'K20', email: 'alice.smith@learn.edutrack.pro' },
  { id: 'stu-002', code: '20210002', fullName: 'Bob Johnson', gender: 'Nam', majorId: 'major-se', cohort: 'K20', email: 'bob.johnson@learn.edutrack.pro' },
  { id: 'stu-003', code: '20210003', fullName: 'Charlie Davis', gender: 'Nam', majorId: 'major-ds', cohort: 'K20', email: 'charlie.davis@learn.edutrack.pro' },
  { id: 'stu-004', code: '20210004', fullName: 'Diana Nguyen', gender: 'Nữ', majorId: 'major-ba', cohort: 'K21', email: 'diana.nguyen@learn.edutrack.pro' },
  { id: 'stu-005', code: '20210005', fullName: 'Ethan Tran', gender: 'Nam', majorId: 'major-se', cohort: 'K21', email: 'ethan.tran@learn.edutrack.pro' },
  { id: 'stu-006', code: '20210006', fullName: 'Mai Pham', gender: 'Nữ', majorId: 'major-ds', cohort: 'K21', email: 'mai.pham@learn.edutrack.pro' },
  { id: 'stu-007', code: '20210007', fullName: 'Linh Hoang', gender: 'Nữ', majorId: 'major-se', cohort: 'K20', email: 'linh.hoang@learn.edutrack.pro' },
]

export const classes = [
  {
    id: 'class-cs101-a',
    code: 'CS101-A',
    name: 'Nhập môn Khoa học Máy tính',
    term: 'Mùa thu 2024',
    courseId: 'course-algo',
    majorId: 'major-se',
    instructorId: 'teacher-thorne',
    enrollmentIds: ['stu-001', 'stu-002', 'stu-003', 'stu-005', 'stu-007'],
    status: 'open',
  },
  {
    id: 'class-db204-b',
    code: 'CS204-B',
    name: 'Hệ thống Cơ sở dữ liệu',
    term: 'Mùa thu 2024',
    courseId: 'course-db',
    majorId: 'major-ds',
    instructorId: 'teacher-davis',
    enrollmentIds: ['stu-002', 'stu-003', 'stu-004', 'stu-006'],
    status: 'open',
  },
  {
    id: 'class-phy301-a',
    code: 'PHY301-A',
    name: 'Vật lý Nâng cao 301',
    term: 'Học kỳ 3',
    courseId: 'course-phys',
    majorId: 'major-se',
    instructorId: 'teacher-thorne',
    enrollmentIds: ['stu-001', 'stu-003', 'stu-007'],
    status: 'open',
  },
  {
    id: 'class-ai301-a',
    code: 'AI301-A',
    name: 'Giải thuật Nâng cao',
    term: 'Mùa thu 2024',
    courseId: 'course-ai',
    majorId: 'major-ds',
    instructorId: 'teacher-thorne',
    enrollmentIds: ['stu-001', 'stu-002', 'stu-005'],
    status: 'open',
  },
  {
    id: 'class-ai301-b',
    code: 'AI301-B',
    name: 'Faculty Seminar: AI Ethics',
    term: 'Mùa thu 2024',
    courseId: 'course-ai',
    majorId: 'major-ds',
    instructorId: 'teacher-davis',
    enrollmentIds: ['stu-003', 'stu-004', 'stu-006'],
    status: 'planning',
  },
]

export const schoolShifts = [
  { id: 'shift-1', name: 'Tiết 1', start: '08:00', end: '09:30', rowStart: 1, rowSpan: 3 },
  { id: 'shift-2', name: 'Tiết 2', start: '10:00', end: '11:30', rowStart: 5, rowSpan: 3 },
  { id: 'shift-3', name: 'Tiết 3', start: '12:00', end: '13:30', rowStart: 9, rowSpan: 3 },
  { id: 'shift-4', name: 'Tiết 4', start: '14:00', end: '15:00', rowStart: 13, rowSpan: 2 },
  { id: 'shift-5', name: 'Tiết 5', start: '15:30', end: '17:00', rowStart: 16, rowSpan: 3 },
]

export const weekDays = [
  { index: 1, code: 'T2', label: 'Thứ 2', dateLabel: '23' },
  { index: 2, code: 'T3', label: 'Thứ 3', dateLabel: '24' },
  { index: 3, code: 'T4', label: 'Thứ 4', dateLabel: '25' },
  { index: 4, code: 'T5', label: 'Thứ 5', dateLabel: '26' },
  { index: 5, code: 'T6', label: 'Thứ 6', dateLabel: '27' },
  { index: 6, code: 'T7', label: 'Thứ 7', dateLabel: '28' },
]

export const scheduleEvents = [
  { id: 'sch-001', dayIndex: 1, shiftId: 'shift-2', classId: 'class-ai301-a', subjectId: 'course-ai', instructorId: 'teacher-thorne', roomId: 'room-b118', color: 'blue' },
  { id: 'sch-002', dayIndex: 2, shiftId: 'shift-3', classId: 'class-db204-b', subjectId: 'course-db', instructorId: 'teacher-davis', roomId: 'room-a201', color: 'emerald' },
  { id: 'sch-003', dayIndex: 3, shiftId: 'shift-2', classId: 'class-phy301-a', subjectId: 'course-phys', instructorId: 'teacher-thorne', roomId: 'room-a302', color: 'rose' },
  { id: 'sch-004', dayIndex: 3, shiftId: 'shift-2', classId: 'class-ai301-b', subjectId: 'course-ai', instructorId: 'teacher-thorne', roomId: 'room-a302', color: 'rose' },
  { id: 'sch-005', dayIndex: 3, shiftId: 'shift-4', classId: 'class-cs101-a', subjectId: 'course-algo', instructorId: 'teacher-thorne', roomId: 'room-online', color: 'blue' },
  { id: 'sch-006', dayIndex: 4, shiftId: 'shift-2', classId: 'class-ai301-a', subjectId: 'course-ai', instructorId: 'teacher-thorne', roomId: 'room-b118', color: 'blue' },
  { id: 'sch-007', dayIndex: 5, shiftId: 'shift-3', classId: 'class-db204-b', subjectId: 'course-db', instructorId: 'teacher-davis', roomId: 'room-a201', color: 'emerald' },
]

export const scoreColumns = [
  { key: 'lab_1', label: 'Lab 1', weight: 0.08, min: 0, max: 10, required: true },
  { key: 'lab_2', label: 'Lab 2', weight: 0.08, min: 0, max: 10, required: true },
  { key: 'lab_3', label: 'Lab 3', weight: 0.08, min: 0, max: 10, required: true },
  { key: 'lab_4', label: 'Lab 4', weight: 0.08, min: 0, max: 10, required: true },
  { key: 'assignment_1', label: 'Assignment 1', weight: 0.15, min: 0, max: 10, required: true },
  { key: 'assignment_2', label: 'Assignment 2', weight: 0.15, min: 0, max: 10, required: true },
  { key: 'final_exam', label: 'Final Exam', weight: 0.38, min: 0, max: 10, required: true },
]

export const gradeRows = [
  { id: 'grade-001', classId: 'class-cs101-a', studentId: 'stu-001', lab_1: 8.5, lab_2: 9.0, lab_3: 7.5, lab_4: 8.0, assignment_1: 8.8, assignment_2: 9.1, final_exam: 8.4, locked: false },
  { id: 'grade-002', classId: 'class-cs101-a', studentId: 'stu-002', lab_1: 6.0, lab_2: 5.5, lab_3: 4.0, lab_4: 6.2, assignment_1: 6.4, assignment_2: 5.9, final_exam: 4.8, locked: false },
  { id: 'grade-003', classId: 'class-cs101-a', studentId: 'stu-003', lab_1: 9.5, lab_2: 10.0, lab_3: 9.0, lab_4: 10.0, assignment_1: 9.7, assignment_2: 9.4, final_exam: 9.6, locked: false },
  { id: 'grade-004', classId: 'class-cs101-a', studentId: 'stu-005', lab_1: 7.0, lab_2: 7.8, lab_3: 8.3, lab_4: 8.1, assignment_1: 7.6, assignment_2: 8.0, final_exam: 7.7, locked: false },
  { id: 'grade-005', classId: 'class-cs101-a', studentId: 'stu-007', lab_1: 4.5, lab_2: 5.0, lab_3: 5.4, lab_4: 4.9, assignment_1: 5.2, assignment_2: 5.6, final_exam: 4.2, locked: false },
  { id: 'grade-006', classId: 'class-db204-b', studentId: 'stu-002', lab_1: 7.4, lab_2: 7.1, lab_3: 6.8, lab_4: 7.0, assignment_1: 7.8, assignment_2: 8.0, final_exam: 7.2, locked: true },
  { id: 'grade-007', classId: 'class-db204-b', studentId: 'stu-006', lab_1: 8.9, lab_2: 8.7, lab_3: 9.1, lab_4: 9.4, assignment_1: 9.0, assignment_2: 8.8, final_exam: 9.2, locked: true },
]

export const excelObjectMappings = [
  {
    id: 'map-student-list',
    objectType: 'Danh sách học viên',
    sheetPattern: 'DSHV_*',
    matchMode: 'wildcard',
    mappings: [
      { property: 'Mã học viên', code: 'student_code', column: 'A', required: true },
      { property: 'Họ tên', code: 'full_name', column: 'B', required: true },
      { property: 'Lớp', code: 'class_code', column: 'C', required: true },
      { property: 'Email', code: 'email', column: 'F', required: false },
    ],
  },
  {
    id: 'map-score-board',
    objectType: 'Bảng điểm học phần',
    sheetPattern: 'BangDiem',
    matchMode: 'exact',
    mappings: [
      { property: 'Mã sinh viên', code: 'student_code', column: 'B', required: true },
      { property: 'Họ tên', code: 'full_name', column: 'C', required: true },
      { property: 'Lab 1', code: 'lab_1', column: 'E', required: true },
      { property: 'Final Exam', code: 'final_exam', column: 'K', required: true },
    ],
  },
]

export const gradingTemplates = [
  {
    id: 'tpl-standard-lab',
    name: 'Mẫu Lab + Assignment + Final',
    classType: 'Thực hành máy tính',
    columns: scoreColumns,
    formula: 'SUM(weight * score)',
  },
  {
    id: 'tpl-essay-board',
    name: 'Mẫu Hội đồng tự luận',
    classType: 'Tự luận',
    columns: [
      { key: 'essay_1', label: 'Bài tự luận 1', weight: 0.3, min: 0, max: 10, required: true },
      { key: 'essay_2', label: 'Bài tự luận 2', weight: 0.3, min: 0, max: 10, required: true },
      { key: 'oral_defense', label: 'Vấn đáp', weight: 0.4, min: 0, max: 10, required: true },
    ],
    formula: 'essay_1*0.3 + essay_2*0.3 + oral_defense*0.4',
  },
]

export const documents = [
  { id: 'doc-001', title: 'Q3_Syllabus_Advanced_Physics.pdf', courseId: 'course-phys', type: 'PDF', sizeMb: 2.4, owner: 'TS. Aris Thorne', updatedAt: 'Hôm nay, 09:32', sensitivity: 'public', complianceCode: 'PUB-PHY301' },
  { id: 'doc-002', title: 'Lab_Safety_Guidelines_v4.docx', courseId: 'course-phys', type: 'Word', sizeMb: 1.1, owner: 'Trung tâm Khảo thí', updatedAt: 'Hôm qua', sensitivity: 'public', complianceCode: 'PUB-LABSAFE' },
  { id: 'doc-003', title: 'Student_Scores_Midterm_Internal.xlsx', courseId: 'course-algo', type: 'Excel', sizeMb: 0.45, owner: 'Phòng Đào tạo', updatedAt: '12 Th10', sensitivity: 'restricted', complianceCode: 'INT-SCORE' },
  { id: 'doc-004', title: 'Lecture_04_Thermodynamics.pdf', courseId: 'course-phys', type: 'PDF', sizeMb: 15.2, owner: 'TS. Aris Thorne', updatedAt: '10 Th10', sensitivity: 'public', complianceCode: 'PUB-THERMO' },
  { id: 'doc-005', title: 'PL_HDTL1_BienBanChamThi.docx', courseId: 'course-algo', type: 'Word', sizeMb: 0.9, owner: 'Trung tâm Khảo thí', updatedAt: '08 Th10', sensitivity: 'confidential', complianceCode: 'EXAM-HDTL1' },
]

export const chatThreads = [
  {
    id: 'thread-phy301',
    title: 'Thảo luận Vật lý 301',
    courseId: 'course-phys',
    members: ['student-alice', 'teacher-thorne', 'user-training'],
    messages: [
      { id: 'msg-001', senderId: 'student-alice', senderName: 'David K.', role: 'student', at: '09:32', text: 'Thầy Thorne, về đề cương mới, bài kiểm tra giữa kỳ sẽ bao gồm toàn bộ chương 4 hay chỉ nửa đầu ạ?' },
      { id: 'msg-002', senderId: 'user-training', senderName: 'Ban Đào tạo', role: 'training', at: '09:35', text: 'Câu hỏi hay đấy David. Nội dung sẽ bao gồm đến phần 4.3. Tớ vừa tải lên đề cương chi tiết trong bảng tài liệu bên trái.' },
      { id: 'msg-003', senderId: 'student-alice', senderName: 'Sarah M.', role: 'student', at: '09:42', text: 'Cảm ơn thầy! Em thấy nó ở bảng bên trái rồi ạ.' },
    ],
  },
]

export const recentActivities = [
  { id: 'act-001', title: 'Sarah Jenkins đã đăng ký Data Science 101', time: '2 phút trước', tone: 'emerald' },
  { id: 'act-002', title: 'Thông báo hệ thống đã được gửi đến toàn bộ nhân viên', time: '1 giờ trước', tone: 'rose' },
  { id: 'act-003', title: 'Prof. Davis đã công bố điểm tổng kết cho ENG204', time: '3 giờ trước', tone: 'brand' },
]
