import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Star, MessageSquare } from "lucide-react";

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

interface CourseCardProps {
  course: Course;
  onReview: (courseId: string) => void;
  onViewDetails?: (course: Course) => void;
}

export function CourseCard({ course, onReview, onViewDetails }: CourseCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1 cursor-pointer" onClick={() => onViewDetails?.(course)}>
            <CardTitle className="text-lg dark:text-white hover:text-[#7a5093] dark:hover:text-[#9d7eb1] transition-colors">
              {course.code}: {course.name}
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {course.professor}
            </p>
          </div>
          <Badge variant="secondary" className="dark:bg-gray-700 dark:text-gray-200">{course.department}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
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
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Difficulty:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={`w-6 h-2 rounded ${
                    level <= course.difficulty ? "bg-orange-400" : "bg-gray-200 dark:bg-gray-600"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm dark:text-gray-300">{course.difficulty}/5</span>
          </div>

          <div className="flex gap-2 mt-2">
            {onViewDetails ? (
              <>
                <Button variant="outline" onClick={() => onViewDetails(course)} className="flex-1 min-w-0">
                  View Details
                </Button>
                <Button onClick={() => onReview(course.id)} className="flex-1 min-w-0">
                  Write Review
                </Button>
              </>
            ) : (
              <Button onClick={() => onReview(course.id)} className="w-full">
                Write Review
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}