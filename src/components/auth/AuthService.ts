const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxM3zVVF-0EwM28wCaOW0qc9HkWCIn3z8rTEgx61r82hUTT_8TfvJA80N4Wkb9CxmHbEA/exec';

export interface LoginResult {
  success: boolean;
  message?: string;
  studentName?: string;
  studentClass?: string;
}

export interface ProgressResult {
  success: boolean;
  stars?: number;
  average?: number;
  syllabus?: number;
  grammar?: number;
  reading?: number;
  writing?: number;
  studentName?: string;
  studentClass?: string;
}

export class AuthService {
  static async login(username: string, passwordString: string): Promise<LoginResult> {
    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain'
        },
        body: JSON.stringify({
          action: 'login',
          username: username.trim(),
          password: passwordString.trim()
        })
      });
      const result = await response.json();
      return result;
    } catch (e) {
      console.error("Login request failed", e);
      throw e;
    }
  }

  static async getProgress(username: string): Promise<ProgressResult> {
    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain'
        },
        body: JSON.stringify({
          action: 'getProgress',
          username: username.trim()
        })
      });
      const result = await response.json();
      return result;
    } catch (e) {
      console.error("Get progress failed", e);
      throw e;
    }
  }

  static async saveProgress(data: {
    username: string;
    studentName: string;
    studentClass: string;
    stars: number;
    average: number;
    syllabus: number;
    grammar: number;
    reading: number;
    writing: number;
  }) {
    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain'
        },
        body: JSON.stringify({
          action: 'saveProgress',
          ...data
        })
      });
      return await response.json();
    } catch (e) {
      console.error("Save progress failed", e);
      // Fail silently in background
    }
  }
}
