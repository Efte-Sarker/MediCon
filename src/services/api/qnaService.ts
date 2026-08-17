import Constants from 'expo-constants';
import { Question, QuestionAnswer } from '../../types/medical.types';

const localhost = Constants.expoConfig?.hostUri?.split(':')[0] || 'localhost';
const API_BASE_URL = `http://${localhost}:8000/api/v1/qna`;

class QnaService {
  async getPatientQuestions(patientId: string): Promise<Question[]> {
    const res = await fetch(`${API_BASE_URL}/patient/${patientId}`);
    if (!res.ok) throw new Error('Failed to fetch patient questions');
    return res.json();
  }

  async getDoctorInbox(department: string): Promise<Question[]> {
    const res = await fetch(`${API_BASE_URL}/doctor/inbox/${department}`);
    if (!res.ok) throw new Error('Failed to fetch doctor inbox');
    return res.json();
  }

  async askQuestion(
    patientId: string,
    department: string, // We pass this but the backend AI will overwrite it
    content: string,
    isAnonymous?: boolean,
    symptomId?: string,
  ): Promise<Question> {
    const res = await fetch(`${API_BASE_URL}/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patientId, content, isAnonymous, symptomId }),
    });
    if (!res.ok) throw new Error('Failed to ask question');
    return res.json();
  }

  async answerQuestion(
    questionId: string,
    doctorId: string,
    content: string,
  ): Promise<QuestionAnswer> {
    const res = await fetch(`${API_BASE_URL}/${questionId}/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ doctorId, content }),
    });
    if (!res.ok) throw new Error('Failed to answer question');
    const updatedQuestion = await res.json();
    // Return the newly added answer
    return updatedQuestion.answers[updatedQuestion.answers.length - 1];
  }

  async updateAnswer(
    questionId: string,
    answerId: string,
    doctorId: string,
    content: string,
  ): Promise<QuestionAnswer> {
    const res = await fetch(`${API_BASE_URL}/${questionId}/answer/${answerId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ doctorId, content }),
    });
    if (!res.ok) throw new Error('Failed to update answer');
    const updatedQuestion = await res.json();
    return updatedQuestion.answers.find((a: QuestionAnswer) => a.id === answerId);
  }

  async deleteQuestion(questionId: string, userId?: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/${questionId}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete question');
  }

  async updateQuestion(
    questionId: string,
    patientId: string,
    content: string,
    department: string,
    isAnonymous?: boolean,
    symptomId?: string,
  ): Promise<Question> {
    const res = await fetch(`${API_BASE_URL}/${questionId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patientId, content, isAnonymous, symptomId }),
    });
    if (!res.ok) throw new Error('Failed to update question');
    return res.json();
  }
}

export const qnaService = new QnaService();
