import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Star, X, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "./ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface ReviewDialogProps {
  open: boolean;
  onClose: () => void;
  type: "course" | "professor";
  itemName: string;
  onSubmit: (review: {
    rating: number;
    difficulty?: number;
    grade?: string;
    droppedCourse?: boolean;
    wouldTakeAgain?: boolean;
    tags?: string[];
    comment: string;
    isAnonymous: boolean;
  }) => void;
  existingReview?: {
    id: string;
    rating: number;
    difficulty?: number;
    grade?: string;
    droppedCourse?: boolean;
    wouldTakeAgain?: boolean;
    tags?: string[];
    comment: string;
    isAnonymous: boolean;
  };
  mode?: "create" | "edit";
}

const COURSE_TAGS = [
  "Helpful Professor",
  "Clear Lectures",
  "Great Projects",
  "Fair Grading",
  "Good Assignments",
  "Engaging Content",
  "Heavy Workload",
  "Tough Exams",
  "Participation Matters",
  "Group Work",
];

const PROFESSOR_TAGS = [
  "Approachable",
  "Knowledgeable",
  "Funny",
  "Caring",
  "Inspirational",
  "Clear Explanations",
  "Available",
  "Tough Grader",
  "Lots of Reading",
  "Extra Credit",
];

const GRADE_OPTIONS = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "F", "Pass", "Not sure yet"];

export function ReviewDialog({ 
  open, 
  onClose, 
  type, 
  itemName, 
  onSubmit,
  existingReview,
  mode = "create"
}: ReviewDialogProps) {
  const [showTutorial, setShowTutorial] = useState(false);
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [difficulty, setDifficulty] = useState(existingReview?.difficulty || 3);
  const [grade, setGrade] = useState(existingReview?.grade || "");
  const [droppedCourse, setDroppedCourse] = useState(existingReview?.droppedCourse || false);
  const [wouldTakeAgain, setWouldTakeAgain] = useState<boolean | null>(
    existingReview?.wouldTakeAgain ?? null
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(existingReview?.tags || []);
  const [customTag, setCustomTag] = useState("");
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [isAnonymous, setIsAnonymous] = useState(existingReview?.isAnonymous ?? false);

  const tags = type === "course" ? COURSE_TAGS : PROFESSOR_TAGS;

  useEffect(() => {
    if (open && mode === "create") {
      const hasSeenTutorial = localStorage.getItem("hasSeenReviewTutorial");
      if (!hasSeenTutorial) {
        setShowTutorial(true);
        localStorage.setItem("hasSeenReviewTutorial", "true");
      }
    }
  }, [open, mode]);

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating);
      setDifficulty(existingReview.difficulty || 3);
      setGrade(existingReview.grade || "");
      setDroppedCourse(existingReview.droppedCourse || false);
      setWouldTakeAgain(existingReview.wouldTakeAgain ?? null);
      setSelectedTags(existingReview.tags || []);
      setComment(existingReview.comment);
      setIsAnonymous(existingReview.isAnonymous);
    }
  }, [existingReview]);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else if (selectedTags.length < 5) {
      setSelectedTags([...selectedTags, tag]);
    } else {
      toast.error("You can select up to 5 tags");
    }
  };

  const addCustomTag = () => {
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
      if (selectedTags.length < 5) {
        setSelectedTags([...selectedTags, customTag.trim()]);
        setCustomTag("");
      } else {
        toast.error("You can select up to 5 tags");
      }
    }
  };

  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (type === "professor" && wouldTakeAgain === null) {
      toast.error("Please indicate if you would take this professor again");
      return;
    }

    onSubmit({
      rating,
      difficulty: type === "course" ? difficulty : undefined,
      grade: type === "course" ? grade : undefined,
      droppedCourse: type === "course" ? droppedCourse : undefined,
      wouldTakeAgain: type === "professor" ? wouldTakeAgain || false : undefined,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      comment,
      isAnonymous,
    });

    // Reset form
    setRating(0);
    setDifficulty(3);
    setGrade("");
    setDroppedCourse(false);
    setWouldTakeAgain(null);
    setSelectedTags([]);
    setComment("");
    setIsAnonymous(false);
    onClose();
    toast.success(mode === "edit" ? "Review updated successfully!" : "Review submitted successfully!");
  };

  if (showTutorial) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-2xl dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="dark:text-white">How to Write a Great Review</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Follow these tips to help other students make informed decisions
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">⭐ Rating</h3>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Be honest with your star rating. Consider the overall experience, teaching quality, and course value.
              </p>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-900 dark:text-purple-300 mb-2">📊 Details</h3>
              <p className="text-sm text-purple-800 dark:text-purple-200">
                Include your grade, difficulty level, and whether you dropped the course. This context helps others understand your perspective.
              </p>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 dark:text-green-300 mb-2">🏷️ Tags</h3>
              <p className="text-sm text-green-800 dark:text-green-200">
                Add up to 5 tags to highlight key aspects. You can choose from common tags or create your own!
              </p>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
              <h3 className="font-semibold text-orange-900 dark:text-orange-300 mb-2">✍️ Written Review</h3>
              <p className="text-sm text-orange-800 dark:text-orange-200">
                Share specific examples and be constructive. Mention what worked well and what could be improved.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 dark:text-gray-200 mb-2">🔒 Privacy</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                You can choose to post anonymously or with your name. Either way, your feedback is valuable!
              </p>
            </div>
          </div>

          <Button onClick={() => setShowTutorial(false)} className="w-full">
            Got it, let's start!
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="dark:text-white">
            {mode === "edit" ? "Edit Review" : "Review"} {itemName}
          </DialogTitle>
          <DialogDescription className="dark:text-gray-400">
            Share your experience to help other students
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="dark:text-white">Overall Rating *</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Rate your overall experience</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      star <= (hoveredRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                {rating > 0 ? `${rating}.0 / 5.0` : "Select rating"}
              </span>
            </div>
          </div>

          {/* Course-specific fields */}
          {type === "course" && (
            <>
              <div className="space-y-2">
                <Label className="dark:text-white">Difficulty Level</Label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={difficulty}
                    onChange={(e) => setDifficulty(parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium w-12 dark:text-white">{difficulty} / 5</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">1 = Very Easy, 5 = Very Hard</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="dark:text-white">Grade Received</Label>
                  <Select value={grade} onValueChange={setGrade}>
                    <SelectTrigger className="dark:bg-gray-700 dark:text-white dark:border-gray-600">
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-700 dark:text-white dark:border-gray-600">
                      {GRADE_OPTIONS.map((g) => (
                        <SelectItem key={g} value={g}>
                          {g}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 flex items-end">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="dropped"
                      checked={droppedCourse}
                      onCheckedChange={(checked) => setDroppedCourse(checked as boolean)}
                      className="dark:border-gray-500"
                    />
                    <label
                      htmlFor="dropped"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-white"
                    >
                      I dropped this course
                    </label>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Professor-specific fields */}
          {type === "professor" && (
            <div className="space-y-2">
              <Label className="dark:text-white">Would you take this professor again? *</Label>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant={wouldTakeAgain === true ? "default" : "outline"}
                  onClick={() => setWouldTakeAgain(true)}
                  className="flex-1"
                >
                  Yes
                </Button>
                <Button
                  type="button"
                  variant={wouldTakeAgain === false ? "default" : "outline"}
                  onClick={() => setWouldTakeAgain(false)}
                  className="flex-1"
                >
                  No
                </Button>
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="space-y-2">
            <Label className="dark:text-white">Tags (up to 5)</Label>
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer dark:border-gray-600"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
            
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-300 w-full mb-1">Selected:</span>
                {selectedTags.map((tag) => (
                  <Badge key={tag} className="gap-1">
                    {tag}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => removeTag(tag)} />
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <Input
                placeholder="Add custom tag..."
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCustomTag();
                  }
                }}
                className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
              <Button type="button" variant="outline" onClick={addCustomTag}>
                Add
              </Button>
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment" className="dark:text-white">Your Review *</Label>
            <Textarea
              id="comment"
              placeholder={`Share your thoughts about this ${type}...`}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={5}
              required
              className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Minimum 50 characters. Be specific and constructive.
            </p>
          </div>

          {/* Anonymity */}
          <div className="flex items-center space-x-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <Checkbox
              id="anonymous"
              checked={isAnonymous}
              onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
              className="dark:border-gray-500"
            />
            <label
              htmlFor="anonymous"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-white"
            >
              Post anonymously
            </label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Your name will be hidden from other users</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-[#7a5093] hover:bg-[#8a60a3]">
              {mode === "edit" ? "Update Review" : "Submit Review"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
