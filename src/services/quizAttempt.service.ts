import { Quiz } from "../models/quiz.model";
import { QuizAttempt } from "../models/quizattempt.model";

export const submitQuizService = async (
  userId: string,
  quizId: string,
  answers: any[]
) => {
  const quiz = await Quiz.findById(quizId);
  if (!quiz) throw new Error("Quiz not found");

  let score = 0;

  answers.forEach((ans) => {
    const question = quiz.questions[ans.questionIndex];
    if (question.options[ans.selectedOptionIndex]?.isCorrect) {
      score += question.points;
    }
  });

  return await QuizAttempt.create({
    userId, // ✅ matches schema
    quizId, // ✅ matches schema
    answers, // ✅ matches schema
    totalScore: score, // ✅ required
  });
};
