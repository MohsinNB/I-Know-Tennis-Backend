import { Schema, Types, model } from "mongoose";
import { IQuiz, Quiz } from "./quiz.model";

export interface IAnswer {
  questionId: Types.ObjectId;
  selectedOptionIndex: number;
  isCorrect: boolean;
  pointsEarned: number;
}

export interface IQuizAttempt {
  userId: Types.ObjectId;
  quizId: Types.ObjectId;
  answers: IAnswer[];
  totalScore: number;
  status: "pending" | "completed";
}

const AnswerSchema = new Schema<IAnswer>({
  questionId: { type: Schema.Types.ObjectId, required: true },
  selectedOptionIndex: { type: Number, required: true },
  isCorrect: { type: Boolean, required: true },
  pointsEarned: { type: Number, required: true },
});

const QuizAttemptSchema = new Schema<IQuizAttempt>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    quizId: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
    answers: { type: [AnswerSchema], required: true },
    totalScore: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

//  Update Quiz Stack based on submission count
QuizAttemptSchema.post("save", async function (doc) {
  try {
    const attemptCount = await model("QuizAttempt").countDocuments({
      quizId: doc.quizId,
    });

    let newStack: IQuiz["stack"] = "newest";

    if (attemptCount >= 5) {
      newStack = "most_popular";
    } else if (attemptCount >= 3) {
      newStack = "popular";
    }

    await Quiz.findByIdAndUpdate(doc.quizId, { stack: newStack });
  } catch (error) {
    console.error("Error updating Quiz stack:", error);
  }
});

export const QuizAttempt = model<IQuizAttempt>(
  "QuizAttempt",
  QuizAttemptSchema
);
