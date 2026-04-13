import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Star, Edit, Trash2, User } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

interface Review {
  id: string;
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

interface ReviewListProps {
  reviews: Review[];
  type: "course" | "professor";
  currentUserEmail?: string;
  onEdit?: (review: Review) => void;
  onDelete?: (reviewId: string) => void;
}

function formatTimeAgo(dateString: string): string {
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
}

export function ReviewList({ reviews, type, currentUserEmail, onEdit, onDelete }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No reviews yet. Be the first to review!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => {
        const isOwnReview = currentUserEmail && review.userEmail === currentUserEmail;
        const displayName = review.isAnonymous ? "Anonymous" : review.userName;

        return (
          <Card key={review.id} className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <Avatar className="dark:bg-gray-700">
                  <AvatarFallback className="dark:bg-gray-600 dark:text-white">
                    {review.isAnonymous ? (
                      <User className="w-5 h-5" />
                    ) : (
                      displayName.charAt(0).toUpperCase()
                    )}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold dark:text-white">{displayName}</p>
                        {isOwnReview && (
                          <Badge variant="secondary" className="text-xs">You</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <span>{formatTimeAgo(review.createdAt)}</span>
                        {review.updatedAt && (
                          <span className="text-xs">(edited)</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold dark:text-white">{review.rating.toFixed(1)}</span>
                      </div>
                      
                      {isOwnReview && onEdit && onDelete && (
                        <div className="flex gap-1 ml-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(review)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="dark:bg-gray-800">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="dark:text-white">Delete Review</AlertDialogTitle>
                                <AlertDialogDescription className="dark:text-gray-400">
                                  Are you sure you want to delete this review? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => onDelete(review.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {type === "course" && (
                      <>
                        {review.difficulty !== undefined && (
                          <Badge variant="outline" className="dark:border-gray-600 dark:text-gray-300">
                            Difficulty: {review.difficulty}/5
                          </Badge>
                        )}
                        {review.grade && (
                          <Badge variant="outline" className="dark:border-gray-600 dark:text-gray-300">
                            Grade: {review.grade}
                          </Badge>
                        )}
                        {review.droppedCourse && (
                          <Badge variant="secondary" className="dark:bg-orange-900/30 dark:text-orange-300">
                            Dropped
                          </Badge>
                        )}
                      </>
                    )}
                    {type === "professor" && review.wouldTakeAgain !== undefined && (
                      <Badge 
                        variant={review.wouldTakeAgain ? "default" : "secondary"}
                        className={review.wouldTakeAgain ? "bg-green-600 hover:bg-green-700" : "dark:bg-gray-600"}
                      >
                        {review.wouldTakeAgain ? "Would take again" : "Would not take again"}
                      </Badge>
                    )}
                  </div>

                  {review.tags && review.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {review.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{review.comment}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
