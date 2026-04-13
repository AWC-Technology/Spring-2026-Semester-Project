'use client'
import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Moon, Sun, Search, Star, MessageSquare, User as UserIcon, Edit, Trash2, User, X, HelpCircle } from 'lucide-react'
import { Toaster, toast } from 'sonner'
import svgPaths from './svgPaths'

// ─── Utility ───────────────────────────────────────────────────────────────
function cn(...classes) { return classes.filter(Boolean).join(' ') }

function formatTimeAgo(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInMins = Math.floor(diffInMs / 60000)
  const diffInHours = Math.floor(diffInMs / 3600000)
  const diffInDays = Math.floor(diffInMs / 86400000)
  if (diffInMins < 1) return 'just now'
  if (diffInMins < 60) return `${diffInMins}m ago`
  if (diffInHours < 24) return `${diffInHours}h ago`
  if (diffInDays < 30) return `${diffInDays}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// ─── Mock Data ──────────────────────────────────────────────────────────────
const mockCourses = [
  { id: '1', code: 'CS 101', name: 'Introduction to Computer Science', department: 'Computer Science', professor: 'Dr. Sarah Johnson', rating: 4.5, reviewCount: 23, difficulty: 3 },
  { id: '2', code: 'MATH 201', name: 'Calculus II', department: 'Mathematics', professor: 'Prof. Michael Chen', rating: 3.8, reviewCount: 45, difficulty: 4 },
  { id: '3', code: 'ENG 105', name: 'English Composition', department: 'English', professor: 'Dr. Emily Williams', rating: 4.7, reviewCount: 67, difficulty: 2 },
  { id: '4', code: 'PHYS 110', name: 'General Physics I', department: 'Physics', professor: 'Prof. David Martinez', rating: 4.2, reviewCount: 34, difficulty: 4 },
  { id: '5', code: 'HIST 150', name: 'World History', department: 'History', professor: 'Dr. Lisa Anderson', rating: 4.6, reviewCount: 28, difficulty: 2 },
  { id: '6', code: 'BIO 201', name: 'Biology for Majors', department: 'Biology', professor: 'Prof. Robert Taylor', rating: 4.0, reviewCount: 52, difficulty: 3 },
]

const mockProfessors = [
  { id: '1', name: 'Dr. Sarah Johnson', department: 'Computer Science', rating: 4.5, reviewCount: 45, wouldTakeAgain: 85 },
  { id: '2', name: 'Prof. Michael Chen', department: 'Mathematics', rating: 3.9, reviewCount: 67, wouldTakeAgain: 72 },
  { id: '3', name: 'Dr. Emily Williams', department: 'English', rating: 4.8, reviewCount: 89, wouldTakeAgain: 92 },
  { id: '4', name: 'Prof. David Martinez', department: 'Physics', rating: 4.3, reviewCount: 56, wouldTakeAgain: 80 },
  { id: '5', name: 'Dr. Lisa Anderson', department: 'History', rating: 4.7, reviewCount: 43, wouldTakeAgain: 88 },
  { id: '6', name: 'Prof. Robert Taylor', department: 'Biology', rating: 4.1, reviewCount: 61, wouldTakeAgain: 75 },
]

const initialReviews = [
  { id: '1', courseId: '1', userName: 'John Smith', userEmail: 'john@example.com', isAnonymous: false, rating: 5, difficulty: 3, grade: 'A', droppedCourse: false, tags: ['Helpful Professor', 'Clear Lectures', 'Great Projects'], comment: 'Great introductory course! Dr. Johnson explains concepts clearly and is always willing to help during office hours.', createdAt: '2026-02-15T10:30:00Z' },
  { id: '2', courseId: '1', userName: 'Alice Brown', userEmail: 'alice@example.com', isAnonymous: true, rating: 4, difficulty: 2, grade: 'A-', droppedCourse: false, tags: ['Fair Grading', 'Good Assignments'], comment: 'Enjoyed the course. The projects were challenging but fair. Would recommend to anyone starting in CS.', createdAt: '2026-02-10T14:20:00Z' },
  { id: '3', professorId: '1', userName: 'Mark Davis', userEmail: 'mark@example.com', isAnonymous: false, rating: 5, wouldTakeAgain: true, tags: ['Approachable', 'Knowledgeable'], comment: 'Dr. Johnson is amazing! She makes difficult concepts easy to understand and is very approachable.', createdAt: '2026-02-12T09:15:00Z' },
]

const COURSE_TAGS = ['Helpful Professor','Clear Lectures','Great Projects','Fair Grading','Good Assignments','Engaging Content','Heavy Workload','Tough Exams','Participation Matters','Group Work']
const PROFESSOR_TAGS = ['Approachable','Knowledgeable','Funny','Caring','Inspirational','Clear Explanations','Available','Tough Grader','Lots of Reading','Extra Credit']
const GRADE_OPTIONS = ['A+','A','A-','B+','B','B-','C+','C','C-','D+','D','F','Pass','Not sure yet']

// ─── Small shared components ────────────────────────────────────────────────
function Badge({ children, variant = 'default', className = '', onClick }) {
  const base = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors'
  const variants = {
    default: 'bg-[#7a5093] text-white',
    secondary: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    outline: 'border border-gray-300 dark:border-gray-600 dark:text-gray-300',
    green: 'bg-green-600 text-white',
  }
  return <span className={cn(base, variants[variant] || variants.default, className, onClick && 'cursor-pointer')} onClick={onClick}>{children}</span>
}

function Button({ children, onClick, type = 'button', variant = 'default', className = '', size = 'default', disabled }) {
  const base = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none disabled:opacity-50'
  const variants = {
    default: 'bg-[#030213] text-white hover:bg-gray-800',
    outline: 'border border-gray-300 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700',
    ghost: 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white',
    purple: 'bg-[#7a5093] text-white hover:bg-[#8a60a3]',
    red: 'bg-red-600 text-white hover:bg-red-700',
  }
  const sizes = { default: 'px-4 py-2 text-sm', sm: 'px-2 py-1 text-xs h-8 w-8', lg: 'px-6 py-3 text-base' }
  return <button type={type} onClick={onClick} disabled={disabled} className={cn(base, variants[variant] || variants.default, sizes[size] || sizes.default, className)}>{children}</button>
}

function Input({ value, onChange, placeholder, type = 'text', id, required, onKeyDown, className = '' }) {
  return <input id={id} type={type} value={value} onChange={onChange} placeholder={placeholder} required={required} onKeyDown={onKeyDown} className={cn('w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7a5093] dark:bg-gray-700 dark:border-gray-600 dark:text-white', className)} />
}

function Textarea({ value, onChange, placeholder, id, rows = 4, required, className = '' }) {
  return <textarea id={id} value={value} onChange={onChange} placeholder={placeholder} rows={rows} required={required} className={cn('w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7a5093] dark:bg-gray-700 dark:border-gray-600 dark:text-white', className)} />
}

function Select({ value, onChange, options, placeholder, id }) {
  return (
    <select id={id} value={value} onChange={e => onChange(e.target.value)} className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7a5093] dark:bg-gray-700 dark:border-gray-600 dark:text-white">
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(o => <option key={o.value || o} value={o.value || o}>{o.label || o}</option>)}
    </select>
  )
}

function Checkbox({ id, checked, onChange, label }) {
  return (
    <div className="flex items-center gap-2">
      <input id={id} type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="rounded border-gray-300 text-[#7a5093] focus:ring-[#7a5093]" />
      {label && <label htmlFor={id} className="text-sm dark:text-white">{label}</label>}
    </div>
  )
}

function Modal({ open, onClose, title, description, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto p-6">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><X className="w-5 h-5" /></button>
        {title && <h2 className="text-xl font-bold mb-1 dark:text-white">{title}</h2>}
        {description && <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{description}</p>}
        {children}
      </div>
    </div>
  )
}

// ─── Sidebar ────────────────────────────────────────────────────────────────
function Sidebar({ user, onLogout, currentView, onNavigate, isDarkMode, onToggleDarkMode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: svgPaths.p2fdc1580 },
    { id: 'courses', label: 'Courses', icon: svgPaths.p2b252d80 },
    { id: 'professors', label: 'Professors', icon: svgPaths.p39b46a00 },
    { id: 'settings', label: 'Settings', icon: svgPaths.p2e787500 },
  ]
  return (
    <div className={cn('bg-[#7a5093] flex flex-col justify-between transition-all duration-300 shadow-lg h-screen sticky top-0', isCollapsed ? 'w-20' : 'w-72')}>
      <div className="flex flex-col gap-12 p-6">
        <div className="flex items-center justify-between">
          <button onClick={() => onNavigate('dashboard')} className="flex items-center gap-4 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
              <span className="text-white text-lg font-bold">CC</span>
            </div>
            {!isCollapsed && <span className="text-white font-semibold text-xl">CourseCompass</span>}
          </button>
          {!isCollapsed && (
            <button onClick={() => setIsCollapsed(true)} className="text-white hover:bg-[#8a60a3] p-1 rounded transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
        </div>
        {isCollapsed && (
          <button onClick={() => setIsCollapsed(false)} className="text-white hover:bg-[#8a60a3] p-2 rounded transition-colors mx-auto">
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
        <div className="flex flex-col gap-4">
          {navItems.map(item => (
            <button key={item.id} onClick={() => onNavigate(item.id)} className={cn('flex items-center gap-3 px-2 py-3 rounded transition-colors', currentView === item.id ? 'bg-[#8a60a3]' : 'hover:bg-[#8a60a3]/50', isCollapsed && 'justify-center')}>
              <div className="w-8 h-8 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
                  <path d={item.icon} fill="white" />
                </svg>
              </div>
              {!isCollapsed && <span className="text-white text-base whitespace-nowrap">{item.label}</span>}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-6 p-6">
        <button onClick={onToggleDarkMode} className={cn('flex items-center gap-3 px-2 py-3 rounded transition-all hover:bg-[#8a60a3]/50', isCollapsed && 'justify-center')}>
          {!isCollapsed && (
            <div className="flex items-center gap-3 flex-1">
              <div className="w-8 h-8 flex items-center justify-center">
                {isDarkMode ? <Moon className="w-6 h-6 text-white" /> : <Sun className="w-6 h-6 text-white" />}
              </div>
              <span className="text-white text-base">Dark Mode</span>
            </div>
          )}
          {isCollapsed && <div className="w-8 h-8 flex items-center justify-center">{isDarkMode ? <Moon className="w-6 h-6 text-white" /> : <Sun className="w-6 h-6 text-white" />}</div>}
          {!isCollapsed && (
            <div className={cn('relative w-12 h-6 rounded-full transition-colors duration-300', isDarkMode ? 'bg-white/30' : 'bg-white/20')}>
              <div className={cn('absolute top-0.5 w-5 h-5 rounded-full shadow-md transition-all duration-300', isDarkMode ? 'left-[26px] bg-white' : 'left-0.5 bg-white/80')} />
            </div>
          )}
        </button>
        {user && (
          <button onClick={onLogout} className={cn('flex items-center gap-3 px-2 py-3 rounded bg-[#320e3b] hover:bg-[#4a1555] transition-colors', isCollapsed && 'justify-center')}>
            <div className="w-8 h-8 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 29 28">
                <path d={svgPaths.p27647300} fill="white" />
              </svg>
            </div>
            {!isCollapsed && <span className="text-white text-base font-semibold whitespace-nowrap">Logout</span>}
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Course Card ─────────────────────────────────────────────────────────────
function CourseCard({ course, onReview, onViewDetails }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 cursor-pointer" onClick={() => onViewDetails?.(course)}>
          <h3 className="font-bold text-base dark:text-white hover:text-[#7a5093] dark:hover:text-[#9d7eb1] transition-colors">{course.code}: {course.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{course.professor}</p>
        </div>
        <Badge variant="secondary">{course.department}</Badge>
      </div>
      <div className="space-y-3 mt-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold dark:text-white">{course.rating.toFixed(1)}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">/ 5.0</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm">{course.reviewCount} reviews</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Difficulty:</span>
          <div className="flex gap-1">
            {[1,2,3,4,5].map(l => <div key={l} className={cn('w-6 h-2 rounded', l <= course.difficulty ? 'bg-orange-400' : 'bg-gray-200 dark:bg-gray-600')} />)}
          </div>
          <span className="text-sm dark:text-gray-300">{course.difficulty}/5</span>
        </div>
        <div className="flex gap-2 mt-2">
          <Button variant="outline" onClick={() => onViewDetails?.(course)} className="flex-1">View Details</Button>
          <Button onClick={() => onReview(course.id)} className="flex-1">Write Review</Button>
        </div>
      </div>
    </div>
  )
}

// ─── Professor Card ───────────────────────────────────────────────────────────
function ProfessorCard({ professor, onReview, onViewDetails }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 cursor-pointer" onClick={() => onViewDetails?.(professor)}>
          <h3 className="font-bold text-base dark:text-white hover:text-[#7a5093] dark:hover:text-[#9d7eb1] transition-colors">{professor.name}</h3>
        </div>
        <Badge variant="secondary">{professor.department}</Badge>
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold dark:text-white">{professor.rating.toFixed(1)}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">/ 5.0</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm">{professor.reviewCount} reviews</span>
          </div>
        </div>
        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <span className="text-sm text-gray-700 dark:text-gray-300">Would take again</span>
          <span className="font-semibold text-green-700 dark:text-green-400">{professor.wouldTakeAgain}%</span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onViewDetails?.(professor)} className="flex-1">View Details</Button>
          <Button onClick={() => onReview(professor.id)} className="flex-1">Write Review</Button>
        </div>
      </div>
    </div>
  )
}

// ─── Review Card ──────────────────────────────────────────────────────────────
function ReviewCard({ review, type, currentUserEmail, onEdit, onDelete }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const isOwn = currentUserEmail && review.userEmail === currentUserEmail
  const displayName = review.isAnonymous ? 'Anonymous' : review.userName
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex gap-4">
        <div className="w-10 h-10 rounded-full bg-[#7a5093]/10 flex items-center justify-center shrink-0">
          <User className="w-5 h-5 text-[#7a5093]" />
        </div>
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold dark:text-white">{displayName}</p>
                {isOwn && <Badge variant="secondary" className="text-xs">You</Badge>}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{formatTimeAgo(review.createdAt)}{review.updatedAt && ' (edited)'}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold dark:text-white">{review.rating}.0</span>
              </div>
              {isOwn && (
                <div className="flex gap-1 ml-2">
                  <button onClick={() => onEdit(review)} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"><Edit className="w-4 h-4 text-gray-500" /></button>
                  <button onClick={() => setShowDeleteConfirm(true)} className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"><Trash2 className="w-4 h-4 text-red-500" /></button>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {type === 'course' && review.difficulty && <Badge variant="outline">Difficulty: {review.difficulty}/5</Badge>}
            {type === 'course' && review.grade && <Badge variant="outline">Grade: {review.grade}</Badge>}
            {type === 'course' && review.droppedCourse && <Badge variant="secondary">Dropped</Badge>}
            {type === 'professor' && review.wouldTakeAgain !== undefined && (
              <Badge variant={review.wouldTakeAgain ? 'green' : 'secondary'}>{review.wouldTakeAgain ? 'Would take again' : 'Would not take again'}</Badge>
            )}
          </div>
          {review.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {review.tags.map(tag => <Badge key={tag} variant="outline" className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 text-purple-700 dark:text-purple-300">{tag}</Badge>)}
            </div>
          )}
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{review.comment}</p>
        </div>
      </div>
      {showDeleteConfirm && (
        <Modal open title="Delete Review" description="Are you sure you want to delete this review? This action cannot be undone." onClose={() => setShowDeleteConfirm(false)}>
          <div className="flex gap-3 mt-4">
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} className="flex-1">Cancel</Button>
            <Button variant="red" onClick={() => { onDelete(review.id); setShowDeleteConfirm(false) }} className="flex-1">Delete</Button>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ─── Auth Modal ───────────────────────────────────────────────────────────────
function AuthModal({ open, onClose, onLogin }) {
  const [tab, setTab] = useState('login')
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [signupName, setSignupName] = useState('')
  const [signupMajor, setSignupMajor] = useState('')
  const [signupYear, setSignupYear] = useState('')

  const handleLogin = (e) => { e.preventDefault(); onLogin(loginEmail, loginPassword); onClose() }
  const handleSignup = (e) => { e.preventDefault(); onLogin(signupEmail, signupPassword, signupName, signupMajor, signupYear); onClose() }

  return (
    <Modal open={open} onClose={onClose} title="Welcome to CourseCompass" description="Sign in or create an account to review courses and professors">
      <div className="flex border-b mb-4">
        {['login','signup'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={cn('flex-1 py-2 text-sm font-medium capitalize transition-colors', tab === t ? 'border-b-2 border-[#7a5093] text-[#7a5093]' : 'text-gray-500 hover:text-gray-700')}>{t === 'login' ? 'Login' : 'Sign Up'}</button>
        ))}
      </div>
      {tab === 'login' ? (
        <form onSubmit={handleLogin} className="space-y-4">
          <div><label className="block text-sm font-medium mb-1 dark:text-white">Email</label><Input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="you@example.com" required /></div>
          <div><label className="block text-sm font-medium mb-1 dark:text-white">Password</label><Input type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} placeholder="••••••••" required /></div>
          <Button type="submit" className="w-full">Login</Button>
        </form>
      ) : (
        <form onSubmit={handleSignup} className="space-y-4">
          <div><label className="block text-sm font-medium mb-1 dark:text-white">Full Name</label><Input value={signupName} onChange={e => setSignupName(e.target.value)} placeholder="John Doe" required /></div>
          <div><label className="block text-sm font-medium mb-1 dark:text-white">Email</label><Input type="email" value={signupEmail} onChange={e => setSignupEmail(e.target.value)} placeholder="you@example.com" required /></div>
          <div><label className="block text-sm font-medium mb-1 dark:text-white">Password</label><Input type="password" value={signupPassword} onChange={e => setSignupPassword(e.target.value)} placeholder="••••••••" required /></div>
          <div><label className="block text-sm font-medium mb-1 dark:text-white">Major</label><Input value={signupMajor} onChange={e => setSignupMajor(e.target.value)} placeholder="e.g., Computer Science" required /></div>
          <div><label className="block text-sm font-medium mb-1 dark:text-white">Year</label>
            <Select value={signupYear} onChange={setSignupYear} placeholder="Select your year" options={['Freshman','Sophomore','Junior','Senior','Graduate Student'].map(v => ({value:v,label:v}))} />
          </div>
          <Button type="submit" className="w-full">Create Account</Button>
        </form>
      )}
    </Modal>
  )
}

// ─── Review Modal ─────────────────────────────────────────────────────────────
function ReviewModal({ open, onClose, type, itemName, onSubmit, existingReview, mode = 'create' }) {
  const [rating, setRating] = useState(existingReview?.rating || 0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [difficulty, setDifficulty] = useState(existingReview?.difficulty || 3)
  const [grade, setGrade] = useState(existingReview?.grade || '')
  const [droppedCourse, setDroppedCourse] = useState(existingReview?.droppedCourse || false)
  const [wouldTakeAgain, setWouldTakeAgain] = useState(existingReview?.wouldTakeAgain ?? null)
  const [selectedTags, setSelectedTags] = useState(existingReview?.tags || [])
  const [customTag, setCustomTag] = useState('')
  const [comment, setComment] = useState(existingReview?.comment || '')
  const [isAnonymous, setIsAnonymous] = useState(existingReview?.isAnonymous ?? false)

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating); setDifficulty(existingReview.difficulty || 3)
      setGrade(existingReview.grade || ''); setDroppedCourse(existingReview.droppedCourse || false)
      setWouldTakeAgain(existingReview.wouldTakeAgain ?? null); setSelectedTags(existingReview.tags || [])
      setComment(existingReview.comment); setIsAnonymous(existingReview.isAnonymous)
    }
  }, [existingReview])

  const tags = type === 'course' ? COURSE_TAGS : PROFESSOR_TAGS

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) setSelectedTags(selectedTags.filter(t => t !== tag))
    else if (selectedTags.length < 5) setSelectedTags([...selectedTags, tag])
    else toast.error('You can select up to 5 tags')
  }

  const addCustomTag = () => {
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
      if (selectedTags.length < 5) { setSelectedTags([...selectedTags, customTag.trim()]); setCustomTag('') }
      else toast.error('You can select up to 5 tags')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (rating === 0) { toast.error('Please select a rating'); return }
    if (type === 'professor' && wouldTakeAgain === null) { toast.error('Please indicate if you would take this professor again'); return }
    onSubmit({ rating, difficulty: type === 'course' ? difficulty : undefined, grade: type === 'course' ? grade : undefined, droppedCourse: type === 'course' ? droppedCourse : undefined, wouldTakeAgain: type === 'professor' ? wouldTakeAgain ?? false : undefined, tags: selectedTags.length > 0 ? selectedTags : undefined, comment, isAnonymous })
    setRating(0); setDifficulty(3); setGrade(''); setDroppedCourse(false); setWouldTakeAgain(null); setSelectedTags([]); setComment(''); setIsAnonymous(false)
    onClose()
    toast.success(mode === 'edit' ? 'Review updated!' : 'Review submitted!')
  }

  return (
    <Modal open={open} onClose={onClose} title={`${mode === 'edit' ? 'Edit Review' : 'Review'} ${itemName}`} description="Share your experience to help other students">
      <form onSubmit={handleSubmit} className="space-y-5 mt-2">
        <div>
          <label className="block text-sm font-medium mb-2 dark:text-white">Overall Rating *</label>
          <div className="flex items-center gap-1">
            {[1,2,3,4,5].map(star => (
              <button key={star} type="button" onClick={() => setRating(star)} onMouseEnter={() => setHoveredRating(star)} onMouseLeave={() => setHoveredRating(0)}>
                <Star className={cn('w-8 h-8 transition-colors', star <= (hoveredRating || rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600')} />
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-500">{rating > 0 ? `${rating}.0 / 5.0` : 'Select rating'}</span>
          </div>
        </div>
        {type === 'course' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-2 dark:text-white">Difficulty Level</label>
              <div className="flex items-center gap-3">
                <input type="range" min="1" max="5" value={difficulty} onChange={e => setDifficulty(parseInt(e.target.value))} className="flex-1 accent-[#7a5093]" />
                <span className="text-sm font-medium w-12 dark:text-white">{difficulty} / 5</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">1 = Very Easy, 5 = Very Hard</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-2 dark:text-white">Grade Received</label>
                <Select value={grade} onChange={setGrade} placeholder="Select grade" options={GRADE_OPTIONS.map(g => ({value:g,label:g}))} />
              </div>
              <div className="flex items-end pb-2"><Checkbox id="dropped" checked={droppedCourse} onChange={setDroppedCourse} label="I dropped this course" /></div>
            </div>
          </>
        )}
        {type === 'professor' && (
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-white">Would you take this professor again? *</label>
            <div className="flex gap-3">
              <Button type="button" variant={wouldTakeAgain === true ? 'default' : 'outline'} onClick={() => setWouldTakeAgain(true)} className="flex-1">Yes</Button>
              <Button type="button" variant={wouldTakeAgain === false ? 'default' : 'outline'} onClick={() => setWouldTakeAgain(false)} className="flex-1">No</Button>
            </div>
          </div>
        )}
        <div>
          <label className="block text-sm font-medium mb-2 dark:text-white">Tags (up to 5)</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map(tag => <Badge key={tag} variant={selectedTags.includes(tag) ? 'default' : 'outline'} onClick={() => toggleTag(tag)} className="cursor-pointer">{tag}</Badge>)}
          </div>
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg mb-3">
              <span className="text-sm text-gray-600 dark:text-gray-300 w-full mb-1">Selected:</span>
              {selectedTags.map(tag => <Badge key={tag} className="gap-1">{tag} <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedTags(selectedTags.filter(t => t !== tag))} /></Badge>)}
            </div>
          )}
          <div className="flex gap-2">
            <Input value={customTag} onChange={e => setCustomTag(e.target.value)} placeholder="Add custom tag..." onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustomTag() } }} />
            <Button type="button" variant="outline" onClick={addCustomTag}>Add</Button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 dark:text-white">Your Review *</label>
          <Textarea value={comment} onChange={e => setComment(e.target.value)} placeholder={`Share your thoughts about this ${type}...`} rows={5} required />
        </div>
        <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <Checkbox id="anon" checked={isAnonymous} onChange={setIsAnonymous} label="Post anonymously" />
        </div>
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button type="submit" variant="purple" className="flex-1">{mode === 'edit' ? 'Update Review' : 'Submit Review'}</Button>
        </div>
      </form>
    </Modal>
  )
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function ClientApp() {
  const [user, setUser] = useState(null)
  const [currentView, setCurrentView] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [dashboardSearchInput, setDashboardSearchInput] = useState('')
  const [activeDashboardSearch, setActiveDashboardSearch] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [authDialogOpen, setAuthDialogOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [editingReview, setEditingReview] = useState(null)
  const [reviews, setReviews] = useState(initialReviews)
  const [viewingCourse, setViewingCourse] = useState(null)
  const [viewingProfessor, setViewingProfessor] = useState(null)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [editedName, setEditedName] = useState('')
  const [editedMajor, setEditedMajor] = useState('')
  const [editedYear, setEditedYear] = useState('')
  const reviewButtonRef = useRef(null)

  useEffect(() => {
    if ((viewingCourse || viewingProfessor) && reviewButtonRef.current) {
      setTimeout(() => reviewButtonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100)
    }
  }, [viewingCourse, viewingProfessor])

  const handleLogin = (email, password, name, major, year) => setUser({ email, name: name || email.split('@')[0], major: major || '', year: year || '' })
  const handleLogout = () => setUser(null)

  const handleReviewCourse = (courseId) => {
    if (!user) { setAuthDialogOpen(true); return }
    const course = mockCourses.find(c => c.id === courseId)
    if (course) { setSelectedItem({ id: courseId, name: `${course.code}: ${course.name}`, type: 'course' }); setReviewDialogOpen(true) }
  }

  const handleReviewProfessor = (professorId) => {
    if (!user) { setAuthDialogOpen(true); return }
    const professor = mockProfessors.find(p => p.id === professorId)
    if (professor) { setSelectedItem({ id: professorId, name: professor.name, type: 'professor' }); setReviewDialogOpen(true) }
  }

  const handleSubmitReview = (reviewData) => {
    if (!user || !selectedItem) return
    const newReview = { id: Date.now().toString(), userName: user.name, userEmail: user.email, ...reviewData, createdAt: new Date().toISOString(), ...(selectedItem.type === 'course' ? { courseId: selectedItem.id } : { professorId: selectedItem.id }) }
    setReviews([newReview, ...reviews])
  }

  const handleEditReview = (reviewId, reviewData) => {
    setReviews(reviews.map(r => r.id === reviewId ? { ...r, ...reviewData, updatedAt: new Date().toISOString() } : r))
  }

  const handleDeleteReview = (reviewId) => { setReviews(reviews.filter(r => r.id !== reviewId)); toast.success('Review deleted') }

  const handleOpenEditReview = (review) => {
    setEditingReview(review)
    const course = mockCourses.find(c => c.id === review.courseId)
    const professor = mockProfessors.find(p => p.id === review.professorId)
    if (course) setSelectedItem({ id: review.courseId, name: `${course.code}: ${course.name}`, type: 'course' })
    else if (professor) setSelectedItem({ id: review.professorId, name: professor.name, type: 'professor' })
    setReviewDialogOpen(true)
  }

  const departments = ['all', ...new Set(mockCourses.map(c => c.department))]

  const filteredCourses = mockCourses.filter(c => {
    const q = searchQuery.toLowerCase()
    return (c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q) || c.professor.toLowerCase().includes(q)) && (departmentFilter === 'all' || c.department === departmentFilter)
  })

  const filteredProfessors = mockProfessors.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) && (departmentFilter === 'all' || p.department === departmentFilter))

  const dashboardFilteredCourses = mockCourses.filter(c => {
    const q = activeDashboardSearch.toLowerCase()
    return c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q) || c.professor.toLowerCase().includes(q)
  })
  const dashboardFilteredProfessors = mockProfessors.filter(p => p.name.toLowerCase().includes(activeDashboardSearch.toLowerCase()))

  const getCourseReviews = (id) => reviews.filter(r => r.courseId === id)
  const getProfessorReviews = (id) => reviews.filter(r => r.professorId === id)

  return (
    <div className={cn('flex min-h-screen', isDarkMode && 'dark')}>
      <Sidebar user={user} onLogout={handleLogout} currentView={currentView} onNavigate={(v) => { setCurrentView(v); setViewingCourse(null); setViewingProfessor(null) }} isDarkMode={isDarkMode} onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} />

      <div className="flex-1 flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        {/* Topbar */}
        <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-8 py-4 transition-colors">
          <div className="flex items-center justify-between">
            {currentView !== 'dashboard' && (
              <div className="flex-1 max-w-2xl">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search courses or professors..." className="pl-10" />
                </div>
              </div>
            )}
            <div className={currentView === 'dashboard' ? 'w-full flex justify-end' : 'ml-4'}>
              {user ? (
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <UserIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  <span className="font-medium text-gray-700 dark:text-gray-200">{user.name}</span>
                </div>
              ) : (
                <Button onClick={() => setAuthDialogOpen(true)}>Sign In</Button>
              )}
            </div>
          </div>
        </div>

        {/* Main */}
        <main className="flex-1 px-8 py-6">

          {/* ── Dashboard ── */}
          {currentView === 'dashboard' && !viewingCourse && !viewingProfessor && (
            <>
              <div className="text-center mb-12 mt-8">
                <h1 className="text-5xl font-bold text-[#2d1b3d] dark:text-white mb-8">Welcome to AWC<br />Course Compass</h1>
                <div className="max-w-xl mx-auto flex gap-2">
                  <Input value={dashboardSearchInput} onChange={e => setDashboardSearchInput(e.target.value)} placeholder="Search..." onKeyDown={e => e.key === 'Enter' && setActiveDashboardSearch(dashboardSearchInput)} className="flex-1 py-3 text-base" />
                  <Button onClick={() => setActiveDashboardSearch(dashboardSearchInput)} variant="purple" className="px-8">Search</Button>
                </div>
              </div>

              {activeDashboardSearch.trim() ? (
                <div className="max-w-7xl mx-auto">
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold dark:text-white">Results for "{activeDashboardSearch}"</h2>
                    <Button variant="outline" onClick={() => { setActiveDashboardSearch(''); setDashboardSearchInput('') }}>Clear</Button>
                  </div>
                  {dashboardFilteredCourses.length > 0 && <><h3 className="text-xl font-bold dark:text-white mb-4">Courses ({dashboardFilteredCourses.length})</h3><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">{dashboardFilteredCourses.map(c => <CourseCard key={c.id} course={c} onReview={handleReviewCourse} onViewDetails={setViewingCourse} />)}</div></>}
                  {dashboardFilteredProfessors.length > 0 && <><h3 className="text-xl font-bold dark:text-white mb-4">Professors ({dashboardFilteredProfessors.length})</h3><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{dashboardFilteredProfessors.map(p => <ProfessorCard key={p.id} professor={p} onReview={handleReviewProfessor} onViewDetails={setViewingProfessor} />)}</div></>}
                  {!dashboardFilteredCourses.length && !dashboardFilteredProfessors.length && <p className="text-center text-gray-500 py-12">No results found.</p>}
                </div>
              ) : (
                <div className="max-w-7xl mx-auto">
                  <h2 className="text-2xl font-bold dark:text-white mb-2">Recent Reviews</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">A little line about what's being said and who's saying it.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                    {reviews.slice(0, 8).map(review => {
                      const course = mockCourses.find(c => c.id === review.courseId)
                      const professor = mockProfessors.find(p => p.id === review.professorId)
                      const displayName = review.isAnonymous ? 'Anonymous' : review.userName
                      return (
                        <div key={review.id} className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-[#7a5093]/10 flex items-center justify-center shrink-0"><UserIcon className="w-5 h-5 text-[#7a5093]" /></div>
                            <div>
                              <p className="font-semibold text-sm dark:text-white">{displayName}</p>
                              <p className="text-xs text-gray-500">{course ? course.code : professor?.name}</p>
                              <p className="text-xs text-gray-400">{formatTimeAgo(review.createdAt)}</p>
                            </div>
                          </div>
                          {review.tags?.slice(0,2).map(t => <span key={t} className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 rounded mr-1">{t}</span>)}
                          <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 line-clamp-3">{review.comment}</p>
                          <div className="flex items-center gap-1 mt-2">{Array.from({length:5}).map((_,i) => <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>)}</div>
                        </div>
                      )
                    })}
                  </div>
                  <div className="grid grid-cols-3 gap-6 mb-12">
                    {[['Total Courses', mockCourses.length],['Total Professors', mockProfessors.length],['Total Reviews', reviews.length]].map(([label, val]) => (
                      <div key={label} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
                        <p className="text-4xl font-bold text-[#7a5093] dark:text-[#9d7eb1]">{val}</p>
                      </div>
                    ))}
                  </div>
                  <h2 className="text-2xl font-bold dark:text-white mb-6">Top Rated Courses</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {[...mockCourses].sort((a,b) => b.rating - a.rating).slice(0,3).map(c => <CourseCard key={c.id} course={c} onReview={handleReviewCourse} onViewDetails={setViewingCourse} />)}
                  </div>
                  <h2 className="text-2xl font-bold dark:text-white mb-6">Top Rated Professors</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...mockProfessors].sort((a,b) => b.rating - a.rating).slice(0,3).map(p => <ProfessorCard key={p.id} professor={p} onReview={handleReviewProfessor} onViewDetails={setViewingProfessor} />)}
                  </div>
                </div>
              )}
            </>
          )}

          {/* ── Courses ── */}
          {currentView === 'courses' && !viewingCourse && (
            <>
              <h1 className="text-3xl font-bold mb-6 dark:text-white">All Courses</h1>
              <div className="mb-6 flex items-center gap-4">
                <label className="text-sm font-medium dark:text-gray-300">Filter by Department:</label>
                <select value={departmentFilter} onChange={e => setDepartmentFilter(e.target.value)} className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white px-3 py-2 text-sm w-64">
                  {departments.map(d => <option key={d} value={d}>{d === 'all' ? 'All Departments' : d}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map(c => <CourseCard key={c.id} course={c} onReview={handleReviewCourse} onViewDetails={setViewingCourse} />)}
              </div>
            </>
          )}

          {/* ── Professors ── */}
          {currentView === 'professors' && !viewingProfessor && (
            <>
              <h1 className="text-3xl font-bold mb-6 dark:text-white">All Professors</h1>
              <div className="mb-6 flex items-center gap-4">
                <label className="text-sm font-medium dark:text-gray-300">Filter by Department:</label>
                <select value={departmentFilter} onChange={e => setDepartmentFilter(e.target.value)} className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white px-3 py-2 text-sm w-64">
                  {departments.map(d => <option key={d} value={d}>{d === 'all' ? 'All Departments' : d}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProfessors.map(p => <ProfessorCard key={p.id} professor={p} onReview={handleReviewProfessor} onViewDetails={setViewingProfessor} />)}
              </div>
            </>
          )}

          {/* ── Settings ── */}
          {currentView === 'settings' && !viewingCourse && !viewingProfessor && (
            <div className="max-w-2xl">
              <h1 className="text-3xl font-bold mb-6 dark:text-white">Settings</h1>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border dark:border-gray-700">
                {user ? (
                  <>
                    <h3 className="text-xl font-semibold mb-4 dark:text-white">Account Information</h3>
                    {!isEditingProfile ? (
                      <div className="space-y-3">
                        {[['Name', user.name],['Email', user.email],['Major', user.major || 'Not specified'],['Year', user.year || 'Not specified']].map(([label, val]) => (
                          <div key={label} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
                            <p className="text-sm font-medium dark:text-white">{val}</p>
                          </div>
                        ))}
                        <Button variant="purple" onClick={() => { setEditedName(user.name); setEditedMajor(user.major); setEditedYear(user.year); setIsEditingProfile(true) }} className="w-full mt-4">Edit Profile</Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div><label className="block text-sm font-medium mb-1 dark:text-white">Name</label><Input value={editedName} onChange={e => setEditedName(e.target.value)} /></div>
                        <div><label className="block text-sm font-medium mb-1 dark:text-white">Major</label><Input value={editedMajor} onChange={e => setEditedMajor(e.target.value)} /></div>
                        <div><label className="block text-sm font-medium mb-1 dark:text-white">Year</label>
                          <select value={editedYear} onChange={e => setEditedYear(e.target.value)} className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white px-3 py-2 text-sm">
                            {['Freshman','Sophomore','Junior','Senior','Graduate Student'].map(y => <option key={y} value={y}>{y}</option>)}
                          </select>
                        </div>
                        <div className="flex gap-3">
                          <Button variant="purple" onClick={() => { setUser({ ...user, name: editedName, major: editedMajor, year: editedYear }); setIsEditingProfile(false); toast.success('Profile updated!') }} className="flex-1">Save Changes</Button>
                          <Button variant="outline" onClick={() => setIsEditingProfile(false)} className="flex-1">Cancel</Button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-semibold mb-2 dark:text-white">Account Information</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Please sign in to view and edit your account information.</p>
                    <Button variant="purple" onClick={() => setAuthDialogOpen(true)}>Sign In</Button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* ── Course Detail ── */}
          {viewingCourse && (
            <div className="max-w-7xl mx-auto">
              <Button variant="ghost" onClick={() => setViewingCourse(null)} className="mb-4">← Back</Button>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 mb-8 border dark:border-gray-700">
                <div className="flex items-start justify-between mb-6">
                  <div><h1 className="text-3xl font-bold dark:text-white mb-1">{viewingCourse.code}: {viewingCourse.name}</h1><p className="text-gray-600 dark:text-gray-400">{viewingCourse.professor}</p></div>
                  <Badge variant="secondary">{viewingCourse.department}</Badge>
                </div>
                <div className="grid grid-cols-3 gap-6 mb-6">
                  <div className="flex items-center gap-2"><Star className="w-6 h-6 fill-yellow-400 text-yellow-400" /><span className="text-2xl font-bold dark:text-white">{viewingCourse.rating.toFixed(1)}</span><span className="text-gray-500">/ 5.0</span></div>
                  <div><p className="text-sm text-gray-500 mb-1">Difficulty</p><div className="flex gap-1">{[1,2,3,4,5].map(l => <div key={l} className={cn('w-8 h-3 rounded', l <= viewingCourse.difficulty ? 'bg-orange-400' : 'bg-gray-200 dark:bg-gray-600')} />)}</div></div>
                  <div><p className="text-sm text-gray-500 mb-1">Reviews</p><p className="text-2xl font-bold dark:text-white">{viewingCourse.reviewCount}</p></div>
                </div>
                <div ref={reviewButtonRef}><Button variant="purple" onClick={() => handleReviewCourse(viewingCourse.id)}>Write a Review</Button></div>
              </div>
              <h2 className="text-2xl font-bold mb-6 dark:text-white">Student Reviews</h2>
              {getCourseReviews(viewingCourse.id).length === 0 ? <p className="text-gray-500 text-center py-8">No reviews yet. Be the first!</p> : (
                <div className="space-y-4">{getCourseReviews(viewingCourse.id).map(r => <ReviewCard key={r.id} review={r} type="course" currentUserEmail={user?.email} onEdit={handleOpenEditReview} onDelete={handleDeleteReview} />)}</div>
              )}
            </div>
          )}

          {/* ── Professor Detail ── */}
          {viewingProfessor && (
            <div className="max-w-7xl mx-auto">
              <Button variant="ghost" onClick={() => setViewingProfessor(null)} className="mb-4">← Back</Button>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 mb-8 border dark:border-gray-700">
                <div className="flex items-start justify-between mb-6">
                  <div><h1 className="text-3xl font-bold dark:text-white mb-1">{viewingProfessor.name}</h1><p className="text-gray-600 dark:text-gray-400">{viewingProfessor.department}</p></div>
                </div>
                <div className="grid grid-cols-3 gap-6 mb-6">
                  <div className="flex items-center gap-2"><Star className="w-6 h-6 fill-yellow-400 text-yellow-400" /><span className="text-2xl font-bold dark:text-white">{viewingProfessor.rating.toFixed(1)}</span><span className="text-gray-500">/ 5.0</span></div>
                  <div><p className="text-sm text-gray-500 mb-1">Would Take Again</p><p className="text-2xl font-bold text-green-600">{viewingProfessor.wouldTakeAgain}%</p></div>
                  <div><p className="text-sm text-gray-500 mb-1">Reviews</p><p className="text-2xl font-bold dark:text-white">{viewingProfessor.reviewCount}</p></div>
                </div>
                <div ref={reviewButtonRef}><Button variant="purple" onClick={() => handleReviewProfessor(viewingProfessor.id)}>Write a Review</Button></div>
              </div>
              <h2 className="text-2xl font-bold mb-6 dark:text-white">Student Reviews</h2>
              {getProfessorReviews(viewingProfessor.id).length === 0 ? <p className="text-gray-500 text-center py-8">No reviews yet. Be the first!</p> : (
                <div className="space-y-4">{getProfessorReviews(viewingProfessor.id).map(r => <ReviewCard key={r.id} review={r} type="professor" currentUserEmail={user?.email} onEdit={handleOpenEditReview} onDelete={handleDeleteReview} />)}</div>
              )}
            </div>
          )}
        </main>
      </div>

      {selectedItem && (
        <ReviewModal open={reviewDialogOpen} onClose={() => { setReviewDialogOpen(false); setSelectedItem(null); setEditingReview(null) }} type={selectedItem.type} itemName={selectedItem.name} onSubmit={editingReview ? (data) => handleEditReview(editingReview.id, data) : handleSubmitReview} existingReview={editingReview} mode={editingReview ? 'edit' : 'create'} />
      )}
      <AuthModal open={authDialogOpen} onClose={() => setAuthDialogOpen(false)} onLogin={handleLogin} />
      <Toaster />
    </div>
  )
}