import { CheckCircle, Clock, X } from 'lucide-react'
import { useState } from 'react'

export default function TimesheetInteractivePrototype() {
  const [workerName, setWorkerName] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedJobs, setSelectedJobs] = useState([])
  const [jobTasks, setJobTasks] = useState({})
  const [modalState, setModalState] = useState({
    open: false,
    step: null,
    jobName: null,
    category: null,
    task: null,
    hours: '',
    notes: '',
  })

  const workers = ['Livia', 'Will', 'Dar', 'Dan', 'Mike']
  const availableJobs = [
    'Zevin Tingley',
    'Harbor View Renovation',
    'Oak Street Addition',
    'Riverside Deck',
  ]

  const categories = [
    { name: 'Demo', icon: '🔨' },
    { name: 'Framing', icon: '🏗️' },
    { name: 'Electrical', icon: '⚡' },
    { name: 'Plumbing', icon: '🚰' },
    { name: 'HVAC', icon: '❄️' },
    { name: 'Drywall', icon: '🔲' },
    { name: 'Painting', icon: '🎨' },
    { name: 'Flooring', icon: '🪵' },
    { name: 'Finish', icon: '✨' },
    { name: 'Cleanup', icon: '🧹' },
    { name: 'Other', icon: '📦' },
  ]

  const tasksByCategory = {
    Demo: ['Interior', 'Exterior', 'Roof', 'Concrete', 'Other demo'],
    Framing: [
      'Exterior walls',
      'Interior walls',
      'Roof framing',
      'Floor joists',
      'Stairs',
      'Other framing',
    ],
    Electrical: [
      'Rough-in',
      'Panel work',
      'Fixtures',
      'Troubleshooting',
      'Other electrical',
    ],
    Plumbing: [
      'Rough-in',
      'Fixtures',
      'Gas lines',
      'Water heater',
      'Other plumbing',
    ],
    HVAC: ['Ductwork', 'Installation', 'Repair', 'Other HVAC'],
    Drywall: [
      'Hanging',
      'Taping',
      'Mudding',
      'Sanding',
      'Texturing',
      'Other drywall',
    ],
    Painting: [
      'Prep',
      'Primer',
      'Interior',
      'Exterior',
      'Trim',
      'Other painting',
    ],
    Flooring: ['Prep', 'Installation', 'Trim', 'Finish', 'Other flooring'],
    Finish: [
      'Trim install',
      'Cabinets',
      'Countertops',
      'Hardware',
      'Other finish',
    ],
    Cleanup: [
      'Site cleanup',
      'Debris removal',
      'Final cleanup',
      'Other cleanup',
    ],
    Other: ['Travel', 'Shop time', 'Material pickup', 'Other work'],
  }

  const toggleJob = (jobName) => {
    const isSelected = selectedJobs.includes(jobName)

    if (isSelected) {
      const newSelectedJobs = selectedJobs.filter((j) => j !== jobName)
      setSelectedJobs(newSelectedJobs)

      const newJobTasks = { ...jobTasks }
      delete newJobTasks[jobName]
      setJobTasks(newJobTasks)
    } else {
      const newSelectedJobs = [...selectedJobs, jobName]
      setSelectedJobs(newSelectedJobs)

      if (!jobTasks[jobName]) {
        setJobTasks({ ...jobTasks, [jobName]: [] })
      }
    }
  }

  const openAddTaskModal = (jobName) => {
    setModalState({
      open: true,
      step: 'category',
      jobName,
      category: null,
      task: null,
      hours: '',
      notes: '',
    })
  }

  const selectCategory = (categoryName) => {
    setModalState({
      ...modalState,
      step: 'tasks',
      category: categoryName,
    })
  }

  const selectTask = (taskName) => {
    setModalState({
      ...modalState,
      step: 'hours',
      task: taskName,
    })
  }

  const addTask = () => {
    if (!modalState.hours || parseFloat(modalState.hours) <= 0) {
      alert('Please enter hours')
      return
    }

    const newTask = {
      category: modalState.category,
      task: modalState.task,
      hours: parseFloat(modalState.hours),
      notes: modalState.notes,
    }

    const currentTasks = jobTasks[modalState.jobName] || []
    const updatedTasks = {
      ...jobTasks,
      [modalState.jobName]: [...currentTasks, newTask],
    }

    setJobTasks(updatedTasks)
    closeModal()
  }

  const removeTask = (jobName, taskIndex) => {
    const currentTasks = jobTasks[jobName] || []
    const updatedTasks = {
      ...jobTasks,
      [jobName]: currentTasks.filter((_, idx) => idx !== taskIndex),
    }
    setJobTasks(updatedTasks)
  }

  const closeModal = () => {
    setModalState({
      open: false,
      step: null,
      jobName: null,
      category: null,
      task: null,
      hours: '',
      notes: '',
    })
  }

  const getJobTotal = (jobName) => {
    const tasks = jobTasks[jobName] || []
    return tasks.reduce((sum, task) => sum + task.hours, 0)
  }

  const getGrandTotal = () => {
    return selectedJobs.reduce((sum, job) => sum + getJobTotal(job), 0)
  }

  const isJobSelected = (jobName) => selectedJobs.includes(jobName)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-[400px] mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-gray-800">
        <div className="bg-gray-800 text-white px-6 py-2 flex justify-between items-center text-xs">
          <span>9:41 AM</span>
          <span>100% 📶</span>
        </div>

        <div className="p-5 bg-white max-h-[750px] overflow-y-auto">
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-xl font-bold text-gray-900">
                Daily Timesheet
              </h1>
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-sm text-gray-600">Enter your hours for today</p>
          </div>

          <div className="bg-blue-50 rounded-lg p-3 mb-5">
            <div className="grid grid-cols-2 gap-2">
              <div className="min-w-0">
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Name *
                </label>
                <select
                  value={workerName}
                  onChange={(e) => setWorkerName(e.target.value)}
                  className="w-full px-2 py-1.5 bg-white border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select</option>
                  {workers.map((worker) => (
                    <option key={worker} value={worker}>
                      {worker}
                    </option>
                  ))}
                </select>
              </div>
              <div className="min-w-0">
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-2 py-1.5 bg-white border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="mb-5">
            <h3 className="text-sm font-bold text-gray-900 mb-2.5">
              Select jobs you worked on today:
            </h3>
            <div className="grid grid-cols-2 gap-2.5">
              {availableJobs.map((job) => {
                const selected = isJobSelected(job)
                return (
                  <button
                    key={job}
                    onClick={() => toggleJob(job)}
                    className={`relative rounded-xl p-3.5 text-center transition-all border-2 ${
                      selected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-lg'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:shadow-md'
                    }`}
                  >
                    {selected && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                    )}
                    <div className="font-semibold text-sm pr-5">{job}</div>
                  </button>
                )
              })}
            </div>

            <div className="mt-2 text-xs text-gray-500">
              Selected: {selectedJobs.length} job
              {selectedJobs.length !== 1 ? 's' : ''}
            </div>
          </div>

          {selectedJobs.length > 0 && (
            <div className="border-t-2 border-gray-200 my-5"></div>
          )}

          {selectedJobs.map((job) => {
            const tasks = jobTasks[job] || []
            const jobTotal = getJobTotal(job)

            return (
              <div
                key={job}
                className="mb-5 bg-gray-50 rounded-lg p-3.5 border-2 border-gray-200"
              >
                <div className="flex justify-between items-center mb-3.5">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-gray-900">
                      📋 {job}
                    </span>
                    {jobTotal > 0 && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                        {jobTotal.toFixed(1)}h
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => toggleJob(job)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {tasks.length > 0 && (
                  <div className="space-y-2.5 mb-3.5">
                    {tasks.map((task, idx) => (
                      <div
                        key={idx}
                        className="bg-white border-2 border-gray-200 rounded-lg p-2.5 shadow-sm"
                      >
                        <div className="flex justify-between items-start mb-1.5">
                          <div className="flex-1">
                            <div className="text-xs font-semibold text-blue-600 mb-0.5">
                              {task.category}
                            </div>
                            <div className="text-sm font-semibold text-gray-900">
                              {task.task}
                            </div>
                          </div>
                          <button
                            onClick={() => removeTask(job, idx)}
                            className="text-xs text-red-600 hover:text-red-700 font-semibold ml-2"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="text-base font-bold text-blue-600">
                          {task.hours} hour{task.hours !== 1 ? 's' : ''}
                        </div>
                        {task.notes && (
                          <div className="text-xs text-gray-600 mt-1.5 bg-gray-50 p-2 rounded">
                            📝 {task.notes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {tasks.length === 0 && (
                  <div className="text-sm text-gray-500 italic text-center py-3.5 mb-3.5">
                    No tasks added yet
                  </div>
                )}

                <button
                  onClick={() => openAddTaskModal(job)}
                  className="w-full py-2.5 bg-white border-2 border-blue-600 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors shadow-sm"
                >
                  + Add Task
                </button>
              </div>
            )
          })}

          {selectedJobs.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              <div className="text-4xl mb-3">👆</div>
              <div className="text-sm font-semibold">
                Select jobs above to get started
              </div>
            </div>
          )}

          {selectedJobs.length > 0 && getGrandTotal() > 0 && (
            <div className="border-t-2 border-gray-300 pt-5 mt-5">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 mb-4 border-2 border-green-300 shadow-md">
                <div className="flex justify-between items-center">
                  <span className="text-base font-bold text-gray-800">
                    Total Hours
                  </span>
                  <span className="text-3xl font-bold text-green-700">
                    {getGrandTotal().toFixed(1)}h
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  if (!workerName) {
                    alert('Please select your name')
                    return
                  }
                  if (getGrandTotal() === 0) {
                    alert('Please add at least one task')
                    return
                  }
                  alert(
                    `Timesheet submitted for ${workerName} on ${date}!\n\nTotal hours: ${getGrandTotal().toFixed(
                      1
                    )}h`
                  )
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3.5 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg flex items-center justify-center gap-2 text-base"
              >
                <CheckCircle className="w-5 h-5" />
                Submit Timesheet
              </button>
            </div>
          )}
        </div>
      </div>

      {modalState.open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl max-w-[400px] w-full max-h-[80vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {modalState.step === 'category' && (
              <div className="p-5">
                <h2 className="text-lg font-bold text-gray-900 mb-1">
                  Add Task
                </h2>
                <p className="text-sm text-blue-600 font-semibold mb-1">
                  to {modalState.jobName}
                </p>
                <p className="text-sm text-gray-600 mb-5">
                  Select work category:
                </p>

                <div className="grid grid-cols-3 gap-2.5 mb-5">
                  {categories.map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => selectCategory(cat.name)}
                      className="bg-white border-2 border-gray-300 rounded-xl p-3 hover:border-blue-500 hover:bg-blue-50 transition-all hover:shadow-md active:scale-95"
                    >
                      <div className="text-2xl mb-1">{cat.icon}</div>
                      <div className="text-xs font-semibold text-gray-700">
                        {cat.name}
                      </div>
                    </button>
                  ))}
                </div>

                <button
                  onClick={closeModal}
                  className="w-full py-2.5 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}

            {modalState.step === 'tasks' && (
              <div className="p-5">
                <button
                  onClick={() =>
                    setModalState({
                      ...modalState,
                      step: 'category',
                      task: null,
                    })
                  }
                  className="text-blue-600 text-sm font-semibold mb-4 hover:text-blue-700"
                >
                  ← Back to Categories
                </button>
                <h2 className="text-lg font-bold text-gray-900 mb-1">
                  {modalState.category} Tasks
                </h2>
                <p className="text-sm text-gray-600 mb-5">
                  Select specific task:
                </p>

                <div className="space-y-2 mb-5 max-h-96 overflow-y-auto">
                  {tasksByCategory[modalState.category].map((task) => (
                    <button
                      key={task}
                      onClick={() => selectTask(task)}
                      className="w-full text-left p-3 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all hover:shadow-md active:scale-[0.98]"
                    >
                      <div className="font-semibold text-gray-900">{task}</div>
                    </button>
                  ))}
                </div>

                <button
                  onClick={closeModal}
                  className="w-full py-2.5 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}

            {modalState.step === 'hours' && (
              <div className="p-5">
                <button
                  onClick={() =>
                    setModalState({
                      ...modalState,
                      step: 'tasks',
                      hours: '',
                      notes: '',
                    })
                  }
                  className="text-blue-600 text-sm font-semibold mb-4 hover:text-blue-700"
                >
                  ← Back to Tasks
                </button>
                <h2 className="text-base font-bold text-gray-900 mb-1">
                  {modalState.category} - {modalState.task}
                </h2>
                <p className="text-sm text-blue-600 font-semibold mb-5">
                  For: {modalState.jobName}
                </p>

                <div className="space-y-4 mb-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Hours worked *
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={modalState.hours}
                      onChange={(e) =>
                        setModalState({ ...modalState, hours: e.target.value })
                      }
                      placeholder="3.5"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-semibold"
                      autoFocus
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter hours (e.g., 3.5 or 7)
                    </p>
                  </div>

                  <div>
                    <details>
                      <summary className="cursor-pointer text-blue-600 font-semibold text-sm hover:text-blue-700">
                        + Add note (optional)
                      </summary>
                      <textarea
                        value={modalState.notes}
                        onChange={(e) =>
                          setModalState({
                            ...modalState,
                            notes: e.target.value,
                          })
                        }
                        placeholder="Any details about this task..."
                        rows={3}
                        className="w-full mt-2 px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                      />
                    </details>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <button
                    onClick={addTask}
                    className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                  >
                    Add Task
                  </button>

                  <button
                    onClick={closeModal}
                    className="w-full py-2.5 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
