import { Quiz } from "../models/quiz.model";
import { IAnswer, QuizAttempt } from "../models/quizattempt.model";

interface QuizAnswerPayload {
  questionIndex: number;
  selectedOptionIndex: number;
}

export const submitQuizService = async (
  userId: string,
  quizId: string,
  answers: QuizAnswerPayload[]
) => {
  const quiz = await Quiz.findById(quizId);
  if (!quiz) throw new Error("Quiz not found");

  const existingAttempt = await QuizAttempt.findOne({ userId, quizId });
  if (existingAttempt) {
    throw new Error("Quiz already submitted");
  }

  let totalScore = 0;
  const evaluatedAnswers: IAnswer[] = [];

  for (const ans of answers) {
    const question = quiz.questions?.[ans.questionIndex];
    if (!question) continue;

    const option = question.options?.[ans.selectedOptionIndex];
    const isCorrect = Boolean(option?.isCorrect);
    const pointsEarned = isCorrect ? question.points : 0;

    totalScore += pointsEarned;

    evaluatedAnswers.push({
      questionId: question._id,
      selectedOptionIndex: ans.selectedOptionIndex,
      isCorrect,
      pointsEarned,
    });
  }

  return await QuizAttempt.create({
    userId,
    quizId,
    answers: evaluatedAnswers,
    totalScore,
    status: "completed",
  });
};
