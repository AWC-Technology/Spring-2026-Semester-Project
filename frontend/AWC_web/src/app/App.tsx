import { useState, useRef, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { CourseCard } from "./components/CourseCard";
import { ProfessorCard } from "./components/ProfessorCard";
import { ReviewDialog } from "./components/ReviewDialog";
import { ReviewList } from "./components/ReviewList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Search, User as UserIcon, Star } from "lucide-react";
import { AuthDialog } from "./components/AuthDialog";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";

interface User {
  email: string;
  name: string;
  major: string;
  year: string;
}

interface Course {
  id: string;
  code: string;
  name: string;
  department: string;
  professor: string;
  rating: number;
  reviewCount: number;
  difficulty: number;
}

interface Professor {
  id: string;
  name: string;
  department: string;
  rating: number;
  reviewCount: number;
  wouldTakeAgain: number;
}

interface Review {
  id: string;
  courseId?: string;
  professorId?: string;
  userName: string;
  userEmail: string;
  isAnonymous: boolean;
  rating: number;
  difficulty?: number;
  grade?: string;
  droppedCourse?: boolean;
  wouldTakeAgain?: boolean;
  tags?: string[];
  comment: string;
  createdAt: string;
  updatedAt?: string;
}

const mockCourses: Course[] = [
  {
    id: "1",
    code: "CS 101",
    name: "Introduction to Computer Science",
    department: "Computer Science",
    professor: "Dr. Sarah Johnson",
    rating: 4.5,
    reviewCount: 23,
    difficulty: 3,
  },
  {
    id: "2",
    code: "MATH 201",
    name: "Calculus II",
    department: "Mathematics",
    professor: "Prof. Michael Chen",
    rating: 3.8,
    reviewCount: 45,
    difficulty: 4,
  },
  {
    id: "3",
    code: "ENG 105",
    name: "English Composition",
    department: "English",
    professor: "Dr. Emily Williams",
    rating: 4.7,
    reviewCount: 67,
    difficulty: 2,
  },
  {
    id: "4",
    code: "PHYS 110",
    name: "General Physics I",
    department: "Physics",
    professor: "Prof. David Martinez",
    rating: 4.2,
    reviewCount: 34,
    difficulty: 4,
  },
  {
    id: "5",
    code: "HIST 150",
    name: "World History",
    department: "History",
    professor: "Dr. Lisa Anderson",
    rating: 4.6,
    reviewCount: 28,
    difficulty: 2,
  },
  {
    id: "6",
    code: "BIO 201",
    name: "Biology for Majors",
    department: "Biology",
    professor: "Prof. Robert Taylor",
    rating: 4.0,
    reviewCount: 52,
    difficulty: 3,
  },
];

const mockProfessors: Professor[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    department: "Computer Science",
    rating: 4.5,
    reviewCount: 45,
    wouldTakeAgain: 85,
  },
  {
    id: "2",
    name: "Prof. Michael Chen",
    department: "Mathematics",
    rating: 3.9,
    reviewCount: 67,
    wouldTakeAgain: 72,
  },
  {
    id: "3",
    name: "Dr. Emily Williams",
    department: "English",
    rating: 4.8,
    reviewCount: 89,
    wouldTakeAgain: 92,
  },
  {
    id: "4",
    name: "Prof. David Martinez",
    department: "Physics",
    rating: 4.3,
    reviewCount: 56,
    wouldTakeAgain: 80,
  },
  {
    id: "5",
    name: "Dr. Lisa Anderson",
    department: "History",
    rating: 4.7,
    reviewCount: 43,
    wouldTakeAgain: 88,
  },
  {
    id: "6",
    name: "Prof. Robert Taylor",
    department: "Biology",
    rating: 4.1,
    reviewCount: 61,
    wouldTakeAgain: 75,
  },
];

const mockReviews: Review[] = [
  {
    id: "1",
    courseId: "1",
    userName: "John Smith",
    userEmail: "john.smith@example.com",
    isAnonymous: false,
    rating: 5,
    difficulty: 3,
    grade: "A",
    droppedCourse: false,
    tags: ["Helpful Professor", "Clear Lectures", "Great Projects"],
    comment: "Great introductory course! Dr. Johnson explains concepts clearly and is always willing to help during office hours.",
    createdAt: "2026-02-15T10:30:00Z",
  },
  {
    id: "2",
    courseId: "1",
    userName: "Alice Brown",
    userEmail: "alice.brown@example.com",
    isAnonymous: true,
    rating: 4,
    difficulty: 2,
    grade: "A-",
    droppedCourse: false,
    tags: ["Fair Grading", "Good Assignments"],
    comment: "Enjoyed the course. The projects were challenging but fair. Would recommend to anyone starting in CS.",
    createdAt: "2026-02-10T14:20:00Z",
  },
  {
    id: "3",
    professorId: "1",
    userName: "Mark Davis",
    userEmail: "mark.davis@example.com",
    isAnonymous: false,
    rating: 5,
    wouldTakeAgain: true,
    tags: ["Approachable", "Knowledgeable"],
    comment: "Dr. Johnson is amazing! She makes difficult concepts easy to understand and is very approachable.",
    createdAt: "2026-02-12T09:15:00Z",
  },
];

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [dashboardSearchInput, setDashboardSearchInput] = useState("");
  const [activeDashboardSearch, setActiveDashboardSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{
    id: string;
    name: string;
    type: "course" | "professor";
  } | null>(null);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [viewingCourse, setViewingCourse] = useState<Course | null>(null);
  const [viewingProfessor, setViewingProfessor] = useState<Professor | null>(null);
  const [selectedCourseForReviews, setSelectedCourseForReviews] = useState<string | null>(null);
  const [selectedProfessorForReviews, setSelectedProfessorForReviews] = useState<string | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedMajor, setEditedMajor] = useState("");
  const [editedYear, setEditedYear] = useState("");

  // Create ref for the review button
  const reviewButtonRef = useRef<HTMLDivElement>(null);

  // Scroll to review button when viewing details
  useEffect(() => {
    if ((viewingCourse || viewingProfessor) && reviewButtonRef.current) {
      setTimeout(() => {
        reviewButtonRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 100);
    }
  }, [viewingCourse, viewingProfessor]);

  const handleLogin = (email: string, password: string, name?: string, major?: string, year?: string) => {
    setUser({
      email,
      name: name || email.split("@")[0],
      major: major || "",
      year: year || "",
    });
  };

  const handleLogout = () => {
    setUser(null);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleDashboardSearch = () => {
    setActiveDashboardSearch(dashboardSearchInput);
  };

  const handleReviewCourse = (courseId: string) => {
    if (!user) {
      setAuthDialogOpen(true);
      return;
    }
    const course = mockCourses.find((c) => c.id === courseId);
    if (course) {
      setSelectedItem({
        id: courseId,
        name: `${course.code}: ${course.name}`,
        type: "course",
      });
      setReviewDialogOpen(true);
    }
  };

  const handleReviewProfessor = (professorId: string) => {
    if (!user) {
      setAuthDialogOpen(true);
      return;
    }
    const professor = mockProfessors.find((p) => p.id === professorId);
    if (professor) {
      setSelectedItem({
        id: professorId,
        name: professor.name,
        type: "professor",
      });
      setReviewDialogOpen(true);
    }
  };

  const handleSubmitReview = (reviewData: {
    rating: number;
    difficulty?: number;
    grade?: string;
    droppedCourse?: boolean;
    wouldTakeAgain?: boolean;
    tags?: string[];
    comment: string;
    isAnonymous: boolean;
  }) => {
    if (!user || !selectedItem) return;

    const newReview: Review = {
      id: Date.now().toString(),
      userName: user.name,
      userEmail: user.email,
      isAnonymous: reviewData.isAnonymous,
      rating: reviewData.rating,
      difficulty: reviewData.difficulty,
      grade: reviewData.grade,
      droppedCourse: reviewData.droppedCourse,
      wouldTakeAgain: reviewData.wouldTakeAgain,
      tags: reviewData.tags,
      comment: reviewData.comment,
      createdAt: new Date().toISOString(),
      ...(selectedItem.type === "course"
        ? { courseId: selectedItem.id }
        : { professorId: selectedItem.id }),
    };

    setReviews([newReview, ...reviews]);
  };

  const handleEditReview = (reviewId: string, reviewData: {
    rating: number;
    difficulty?: number;
    grade?: string;
    droppedCourse?: boolean;
    wouldTakeAgain?: boolean;
    tags?: string[];
    comment: string;
    isAnonymous: boolean;
  }) => {
    setReviews(reviews.map(review => 
      review.id === reviewId 
        ? {
            ...review,
            rating: reviewData.rating,
            difficulty: reviewData.difficulty,
            grade: reviewData.grade,
            droppedCourse: reviewData.droppedCourse,
            wouldTakeAgain: reviewData.wouldTakeAgain,
            tags: reviewData.tags,
            comment: reviewData.comment,
            isAnonymous: reviewData.isAnonymous,
            updatedAt: new Date().toISOString(),
          }
        : review
    ));
  };

  const handleDeleteReview = (reviewId: string) => {
    setReviews(reviews.filter(review => review.id !== reviewId));
    toast.success("Review deleted successfully");
  };

  const handleOpenEditReview = (review: Review) => {
    setEditingReview(review);
    const course = mockCourses.find((c) => c.id === review.courseId);
    const professor = mockProfessors.find((p) => p.id === review.professorId);
    
    if (course) {
      setSelectedItem({
        id: review.courseId!,
        name: `${course.code}: ${course.name}`,
        type: "course",
      });
    } else if (professor) {
      setSelectedItem({
        id: review.professorId!,
        name: professor.name,
        type: "professor",
      });
    }
    
    setReviewDialogOpen(true);
  };

  const handleViewCourseDetails = (course: Course) => {
    setViewingCourse(course);
    setViewingProfessor(null);
  };

  const handleViewProfessorDetails = (professor: Professor) => {
    setViewingProfessor(professor);
    setViewingCourse(null);
  };

  const handleBackFromDetails = () => {
    setViewingCourse(null);
    setViewingProfessor(null);
  };

  const handleStartEditProfile = () => {
    if (user) {
      setEditedName(user.name);
      setEditedMajor(user.major);
      setEditedYear(user.year);
      setIsEditingProfile(true);
    }
  };

  const handleSaveProfile = () => {
    if (user) {
      setUser({
        ...user,
        name: editedName,
        major: editedMajor,
        year: editedYear,
      });
      setIsEditingProfile(false);
      toast.success("Profile updated successfully");
    }
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    setEditedName("");
    setEditedMajor("");
    setEditedYear("");
  };

  const departments = ["all", ...new Set([...mockCourses.map((c) => c.department)])];

  const filteredCourses = mockCourses.filter((course) => {
    const matchesSearch =
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.professor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment =
      departmentFilter === "all" || course.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  const filteredProfessors = mockProfessors.filter((professor) => {
    const matchesSearch = professor.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment =
      departmentFilter === "all" || professor.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  // Dashboard-specific filtered results (only updated when search button is clicked)
  const dashboardFilteredCourses = mockCourses.filter((course) => {
    const matchesSearch =
      course.name.toLowerCase().includes(activeDashboardSearch.toLowerCase()) ||
      course.code.toLowerCase().includes(activeDashboardSearch.toLowerCase()) ||
      course.professor.toLowerCase().includes(activeDashboardSearch.toLowerCase());
    return matchesSearch;
  });

  const dashboardFilteredProfessors = mockProfessors.filter((professor) => {
    const matchesSearch = professor.name.toLowerCase().includes(activeDashboardSearch.toLowerCase());
    return matchesSearch;
  });

  const getCourseReviews = (courseId: string) => {
    return reviews.filter((r) => r.courseId === courseId);
  };

  const getProfessorReviews = (professorId: string) => {
    return reviews.filter((r) => r.professorId === professorId);
  };

  return (
    <div className={`flex min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <Sidebar
        user={user}
        onLogout={handleLogout}
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          setViewingCourse(null);
          setViewingProfessor(null);
        }}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      <div className="flex-1 flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        {/* Top Bar */}
        <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-8 py-4 transition-colors">
          <div className="flex items-center justify-between">
            {currentView !== "dashboard" && (
              <div className="flex-1 max-w-2xl">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search courses or professors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  />
                </div>
              </div>
            )}

            <div className={currentView === "dashboard" ? "w-full flex justify-end" : "ml-4"}>
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

        {/* Main Content */}
        <main className="flex-1 px-8 py-6">
          {currentView === "dashboard" && (
            <>
              {/* Welcome Section */}
              <div className="text-center mb-12 mt-8">
                <h1 className="text-5xl font-bold text-[#2d1b3d] dark:text-white mb-8 transition-colors">
                  Welcome to AWC<br />Course Compass
                </h1>
                
                {/* Dashboard Search Bar */}
                <div className="max-w-xl mx-auto flex gap-2">
                  <Input
                    type="text"
                    placeholder="Search..."
                    value={dashboardSearchInput}
                    onChange={(e) => setDashboardSearchInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleDashboardSearch();
                      }
                    }}
                    className="flex-1 px-6 py-6 text-base dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  />
                  <Button 
                    className="bg-[#7a5093] hover:bg-[#8a60a3] px-8 py-6 text-base"
                    onClick={handleDashboardSearch}
                  >
                    Search
                  </Button>
                </div>
              </div>

              {/* Search Results or Default Dashboard Content */}
              {activeDashboardSearch.trim() ? (
                <div className="max-w-7xl mx-auto mt-16">
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                      Search Results for "{activeDashboardSearch}"
                    </h2>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setActiveDashboardSearch("");
                        setDashboardSearchInput("");
                      }}
                      className="dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    >
                      Clear Search
                    </Button>
                  </div>

                  {/* Courses Results */}
                  {dashboardFilteredCourses.length > 0 && (
                    <div className="mb-12">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        Courses ({dashboardFilteredCourses.length})
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {dashboardFilteredCourses.map((course) => (
                          <CourseCard key={course.id} course={course} onReview={handleReviewCourse} onViewDetails={handleViewCourseDetails} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Professors Results */}
                  {dashboardFilteredProfessors.length > 0 && (
                    <div className="mb-12">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        Professors ({dashboardFilteredProfessors.length})
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {dashboardFilteredProfessors.map((professor) => (
                          <ProfessorCard key={professor.id} professor={professor} onReview={handleReviewProfessor} onViewDetails={handleViewProfessorDetails} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* No Results */}
                  {dashboardFilteredCourses.length === 0 && dashboardFilteredProfessors.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-gray-500 dark:text-gray-400 text-lg">
                        No courses or professors found matching your search.
                      </p>
                      <Button
                        onClick={() => {
                          setActiveDashboardSearch("");
                          setDashboardSearchInput("");
                        }}
                        className="mt-4"
                      >
                        Clear Search
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="max-w-7xl mx-auto mt-16">
                  {/* Recent Reviews Section */}
                  <div className="mb-6">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">Recent Reviews</h2>
                    <p className="text-gray-600 dark:text-gray-400 transition-colors">A little line about what's being said and who's saying it.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                    {reviews.slice(0, 8).map((review) => {
                      const course = mockCourses.find((c) => c.id === review.courseId);
                      const professor = mockProfessors.find((p) => p.id === review.professorId);
                      const itemName = course ? `${course.code}` : professor?.name;
                      const subtitle = course ? `${course.name}` : professor?.department;
                      const displayName = review.isAnonymous ? "Anonymous" : review.userName;
                      
                      const formatTimeAgo = (dateString: string): string => {
                        const date = new Date(dateString);
                        const now = new Date();
                        const diffInMs = now.getTime() - date.getTime();
                        const diffInMins = Math.floor(diffInMs / 60000);
                        const diffInHours = Math.floor(diffInMs / 3600000);
                        const diffInDays = Math.floor(diffInMs / 86400000);

                        if (diffInMins < 1) return "just now";
                        if (diffInMins < 60) return `${diffInMins}m ago`;
                        if (diffInHours < 24) return `${diffInHours}h ago`;
                        if (diffInDays < 30) return `${diffInDays}d ago`;
                        
                        return date.toLocaleDateString("en-US", { 
                          month: "short", 
                          day: "numeric", 
                          year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined 
                        });
                      };

                      return (
                        <div key={review.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all">
                          <div className="flex items-start gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-[#7a5093]/10 dark:bg-[#7a5093]/20 flex items-center justify-center shrink-0">
                              <UserIcon className="w-6 h-6 text-[#7a5093] dark:text-[#9d7eb1]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 dark:text-white truncate">{displayName}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{itemName}</p>
                              {subtitle && <p className="text-xs text-gray-500 dark:text-gray-500 truncate">{subtitle}</p>}
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{formatTimeAgo(review.createdAt)}</p>
                            </div>
                          </div>
                          {review.tags && review.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {review.tags.slice(0, 2).map((tag) => (
                                <span key={tag} className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded">
                                  {tag}
                                </span>
                              ))}
                              {review.tags.length > 2 && (
                                <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                                  +{review.tags.length - 2}
                                </span>
                              )}
                            </div>
                          )}
                          <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3">{review.comment}</p>
                          <div className="mt-3 flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"}>
                                ★
                              </span>
                            ))}
                            <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">{review.rating}.0</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Total Courses</h3>
                      <p className="text-4xl font-bold text-[#7a5093] dark:text-[#9d7eb1]">{mockCourses.length}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Total Professors</h3>
                      <p className="text-4xl font-bold text-[#7a5093] dark:text-[#9d7eb1]">{mockProfessors.length}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Total Reviews</h3>
                      <p className="text-4xl font-bold text-[#7a5093] dark:text-[#9d7eb1]">{reviews.length}</p>
                    </div>
                  </div>

                  {/* Top Rated Courses */}
                  <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 transition-colors">Top Rated Courses</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[...mockCourses].sort((a, b) => b.rating - a.rating).slice(0, 3).map((course) => (
                        <CourseCard key={course.id} course={course} onReview={handleReviewCourse} onViewDetails={handleViewCourseDetails} />
                      ))}
                    </div>
                  </div>

                  {/* Top Rated Professors */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 transition-colors">Top Rated Professors</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[...mockProfessors].sort((a, b) => b.rating - a.rating).slice(0, 3).map((professor) => (
                        <ProfessorCard key={professor.id} professor={professor} onReview={handleReviewProfessor} onViewDetails={handleViewProfessorDetails} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {currentView === "courses" && (
            <>
              <h1 className="text-3xl font-bold mb-6 dark:text-white">All Courses</h1>
              <div className="mb-6 flex items-center gap-4">
                <label className="text-sm font-medium dark:text-gray-300">Filter by Department:</label>
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="w-64 dark:bg-gray-700 dark:text-white dark:border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept === "all" ? "All Departments" : dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <CourseCard key={course.id} course={course} onReview={handleReviewCourse} onViewDetails={handleViewCourseDetails} />
                ))}
              </div>
            </>
          )}

          {currentView === "professors" && (
            <>
              <h1 className="text-3xl font-bold mb-6 dark:text-white">All Professors</h1>
              <div className="mb-6 flex items-center gap-4">
                <label className="text-sm font-medium dark:text-gray-300">Filter by Department:</label>
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="w-64 dark:bg-gray-700 dark:text-white dark:border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept === "all" ? "All Departments" : dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProfessors.map((professor) => (
                  <ProfessorCard
                    key={professor.id}
                    professor={professor}
                    onReview={handleReviewProfessor}
                    onViewDetails={handleViewProfessorDetails}
                  />
                ))}
              </div>
            </>
          )}

          {currentView === "settings" && !viewingCourse && !viewingProfessor && (
            <div className="max-w-2xl">
              <h1 className="text-3xl font-bold mb-6 dark:text-white">Settings</h1>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-6 border dark:border-gray-700">
                {user ? (
                  <>
                    <div>
                      <h3 className="text-xl font-semibold mb-4 dark:text-white">Account Information</h3>
                      {!isEditingProfile && (
                        <div className="space-y-3">
                          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <Label className="text-xs text-gray-500 dark:text-gray-400">Name</Label>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                          </div>
                          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <Label className="text-xs text-gray-500 dark:text-gray-400">Email</Label>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{user.email}</p>
                          </div>
                          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <Label className="text-xs text-gray-500 dark:text-gray-400">Major</Label>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{user.major || "Not specified"}</p>
                          </div>
                          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <Label className="text-xs text-gray-500 dark:text-gray-400">Year</Label>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{user.year || "Not specified"}</p>
                          </div>
                          <Button
                            onClick={handleStartEditProfile}
                            className="w-full bg-[#7a5093] hover:bg-[#8a60a3] mt-4"
                          >
                            Edit Profile
                          </Button>
                        </div>
                      )}
                      {isEditingProfile && (
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="edit-name" className="text-sm font-medium dark:text-white mb-2 block">Name</Label>
                            <Input
                              id="edit-name"
                              type="text"
                              placeholder="Your full name"
                              value={editedName}
                              onChange={(e) => setEditedName(e.target.value)}
                              className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-major" className="text-sm font-medium dark:text-white mb-2 block">Major</Label>
                            <Input
                              id="edit-major"
                              type="text"
                              placeholder="e.g., Computer Science"
                              value={editedMajor}
                              onChange={(e) => setEditedMajor(e.target.value)}
                              className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-year" className="text-sm font-medium dark:text-white mb-2 block">Year in College</Label>
                            <Select value={editedYear} onValueChange={setEditedYear}>
                              <SelectTrigger id="edit-year" className="dark:bg-gray-700 dark:text-white dark:border-gray-600">
                                <SelectValue placeholder="Select your year" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Freshman">Freshman</SelectItem>
                                <SelectItem value="Sophomore">Sophomore</SelectItem>
                                <SelectItem value="Junior">Junior</SelectItem>
                                <SelectItem value="Senior">Senior</SelectItem>
                                <SelectItem value="Graduate">Graduate Student</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-center gap-3 pt-2">
                            <Button
                              onClick={handleSaveProfile}
                              className="flex-1 bg-[#7a5093] hover:bg-[#8a60a3]"
                            >
                              Save Changes
                            </Button>
                            <Button
                              onClick={handleCancelEdit}
                              variant="outline"
                              className="flex-1 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div>
                    <h3 className="text-xl font-semibold mb-4 dark:text-white">Account Information</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Please sign in to view and edit your account information.</p>
                    <Button onClick={() => setAuthDialogOpen(true)} className="mt-4 bg-[#7a5093] hover:bg-[#8a60a3]">
                      Sign In
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Course Detail View */}
          {viewingCourse && (
            <div className="max-w-7xl mx-auto">
              <Button
                variant="ghost"
                onClick={handleBackFromDetails}
                className="mb-4 dark:text-white"
              >
                ← Back
              </Button>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-8 mb-8 border dark:border-gray-700">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="text-4xl font-bold mb-2 dark:text-white">
                      {viewingCourse.code}: {viewingCourse.name}
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">{viewingCourse.professor}</p>
                  </div>
                  <Badge variant="secondary" className="dark:bg-gray-700 dark:text-gray-200">
                    {viewingCourse.department}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                      <span className="text-2xl font-bold dark:text-white">{viewingCourse.rating.toFixed(1)}</span>
                      <span className="text-gray-500 dark:text-gray-400">/ 5.0</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Difficulty</p>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`w-8 h-3 rounded ${
                              level <= viewingCourse.difficulty ? "bg-orange-400" : "bg-gray-200 dark:bg-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-semibold dark:text-white">{viewingCourse.difficulty}/5</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Reviews</p>
                    <p className="text-2xl font-bold dark:text-white">{viewingCourse.reviewCount}</p>
                  </div>
                </div>

                <div ref={reviewButtonRef}>
                  <Button onClick={() => handleReviewCourse(viewingCourse.id)} className="bg-[#7a5093] hover:bg-[#8a60a3]">
                    Write a Review
                  </Button>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-6 dark:text-white">Student Reviews</h2>
                <ReviewList
                  reviews={getCourseReviews(viewingCourse.id)}
                  type="course"
                  currentUserEmail={user?.email}
                  onEdit={handleOpenEditReview}
                  onDelete={handleDeleteReview}
                />
              </div>
            </div>
          )}

          {/* Professor Detail View */}
          {viewingProfessor && (
            <div className="max-w-7xl mx-auto">
              <Button
                variant="ghost"
                onClick={handleBackFromDetails}
                className="mb-4 dark:text-white"
              >
                ← Back
              </Button>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-8 mb-8 border dark:border-gray-700">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="text-4xl font-bold mb-2 dark:text-white">
                      {viewingProfessor.name}
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">{viewingProfessor.department}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                      <span className="text-2xl font-bold dark:text-white">{viewingProfessor.rating.toFixed(1)}</span>
                      <span className="text-gray-500 dark:text-gray-400">/ 5.0</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Would Take Again</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{viewingProfessor.wouldTakeAgain}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Reviews</p>
                    <p className="text-2xl font-bold dark:text-white">{viewingProfessor.reviewCount}</p>
                  </div>
                </div>

                <div ref={reviewButtonRef}>
                  <Button onClick={() => handleReviewProfessor(viewingProfessor.id)} className="bg-[#7a5093] hover:bg-[#8a60a3]">
                    Write a Review
                  </Button>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-6 dark:text-white">Student Reviews</h2>
                <ReviewList
                  reviews={getProfessorReviews(viewingProfessor.id)}
                  type="professor"
                  currentUserEmail={user?.email}
                  onEdit={handleOpenEditReview}
                  onDelete={handleDeleteReview}
                />
              </div>
            </div>
          )}
        </main>
      </div>

      {selectedItem && (
        <ReviewDialog
          open={reviewDialogOpen}
          onClose={() => {
            setReviewDialogOpen(false);
            setSelectedItem(null);
            setEditingReview(null);
          }}
          type={selectedItem.type}
          itemName={selectedItem.name}
          onSubmit={editingReview ? 
            (data) => handleEditReview(editingReview.id, data) : 
            handleSubmitReview
          }
          existingReview={editingReview ? {
            id: editingReview.id,
            rating: editingReview.rating,
            difficulty: editingReview.difficulty,
            grade: editingReview.grade,
            droppedCourse: editingReview.droppedCourse,
            wouldTakeAgain: editingReview.wouldTakeAgain,
            tags: editingReview.tags,
            comment: editingReview.comment,
            isAnonymous: editingReview.isAnonymous,
          } : undefined}
          mode={editingReview ? "edit" : "create"}
        />
      )}

      <AuthDialog
        open={authDialogOpen}
        onClose={() => setAuthDialogOpen(false)}
        onLogin={handleLogin}
      />

      <Toaster />
    </div>
  );
}