import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Star, MessageSquare } from "lucide-react";

interface Professor {
  id: string;
  name: string;
  department: string;
  rating: number;
  reviewCount: number;
  wouldTakeAgain: number;
}

interface ProfessorCardProps {
  professor: Professor;
  onReview: (professorId: string) => void;
  onViewDetails?: (professor: Professor) => void;
}

export function ProfessorCard({ professor, onReview, onViewDetails }: ProfessorCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1 cursor-pointer" onClick={() => onViewDetails?.(professor)}>
            <CardTitle className="text-lg dark:text-white hover:text-[#7a5093] dark:hover:text-[#9d7eb1] transition-colors">
              {professor.name}
            </CardTitle>
          </div>
          <Badge variant="secondary" className="dark:bg-gray-700 dark:text-gray-200">{professor.department}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
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
          </div>

          <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <span className="text-sm text-gray-700 dark:text-gray-300">Would take again</span>
            <span className="font-semibold text-green-700 dark:text-green-400">{professor.wouldTakeAgain}%</span>
          </div>

          <div className="flex gap-2 mt-2">
            {onViewDetails ? (
              <>
                <Button variant="outline" onClick={() => onViewDetails(professor)} className="flex-1 min-w-0">
                  View Details
                </Button>
                <Button onClick={() => onReview(professor.id)} className="flex-1 min-w-0">
                  Write Review
                </Button>
              </>
            ) : (
              <Button onClick={() => onReview(professor.id)} className="w-full">
                Write Review
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}