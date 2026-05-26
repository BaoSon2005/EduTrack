import { classes, courses, rooms, schoolShifts, students, users } from '../data/mockDatabase'

export function getById(collection, id) {
  return collection.find((item) => item.id === id)
}

export function getStudent(studentId) {
  return getById(students, studentId)
}

export function getClass(classId) {
  return getById(classes, classId)
}

export function getCourse(courseId) {
  return getById(courses, courseId)
}

export function getUser(userId) {
  return getById(users, userId)
}

export function getRoom(roomId) {
  return getById(rooms, roomId)
}

export function getShift(shiftId) {
  return getById(schoolShifts, shiftId)
}

export function computeAverageScore(row, scoreColumns) {
  const weightedSum = scoreColumns.reduce((total, column) => {
    const value = Number(row[column.key])
    return total + (Number.isFinite(value) ? value * column.weight : 0)
  }, 0)

  return Number(weightedSum.toFixed(2))
}

export function getScoreTone(score) {
  if (score < 5) {
    return 'danger'
  }

  if (score > 8.5) {
    return 'success'
  }

  return 'neutral'
}

export function canEditClassGrades(role, currentUser, classRecord) {
  if (!classRecord || classRecord.status === 'archived') {
    return false
  }

  if (role === 'admin' || role === 'training') {
    return true
  }

  if (role === 'teacher') {
    return currentUser.assignedClassIds?.includes(classRecord.id) === true
  }

  return false
}

export function validateScore(value, column) {
  const numericValue = Number(value)

  if (!Number.isFinite(numericValue)) {
    return { valid: false, message: 'Điểm phải là số.' }
  }

  if (numericValue < column.min || numericValue > column.max) {
    return { valid: false, message: `Điểm phải nằm trong khoảng ${column.min}-${column.max}.` }
  }

  return { valid: true, value: Number(numericValue.toFixed(1)) }
}

export function detectScheduleConflicts(events) {
  return events.reduce((conflicts, event, index) => {
    const hasConflict = events.some((candidate, candidateIndex) => {
      if (index === candidateIndex) {
        return false
      }

      const sameSlot = event.dayIndex === candidate.dayIndex && event.shiftId === candidate.shiftId
      const sameInstructor = event.instructorId === candidate.instructorId
      const sameRoom = event.roomId === candidate.roomId

      return sameSlot && (sameInstructor || sameRoom)
    })

    if (hasConflict) {
      conflicts.add(event.id)
    }

    return conflicts
  }, new Set())
}

export function filterEventsForRole(events, role, currentUser) {
  if (role === 'teacher') {
    return events.filter((event) => currentUser.assignedClassIds?.includes(event.classId))
  }

  if (role === 'student') {
    return events.filter((event) => currentUser.classIds?.includes(event.classId))
  }

  return events
}

export function getEventDetails(event) {
  const classRecord = getClass(event.classId)
  const course = getCourse(event.subjectId)
  const instructor = getUser(event.instructorId)
  const room = getRoom(event.roomId)
  const shift = getShift(event.shiftId)

  return { classRecord, course, instructor, room, shift }
}

export function validateExcelMapping(mapping) {
  const sheetIsValid = mapping.matchMode === 'wildcard'
    ? /^[A-Za-z0-9_\-*]+$/.test(mapping.sheetPattern) && mapping.sheetPattern.includes('*')
    : /^[A-Za-z0-9_\- ]+$/.test(mapping.sheetPattern)

  const columnsAreValid = mapping.mappings.every((item) => /^[A-Z]{1,3}$/.test(item.column))
  const requiredColumnsPresent = mapping.mappings.every((item) => !item.required || item.column.trim().length > 0)

  return {
    valid: sheetIsValid && columnsAreValid && requiredColumnsPresent,
    sheetIsValid,
    columnsAreValid,
    requiredColumnsPresent,
  }
}

export function downloadTextFile(filename, content, mimeType = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}
