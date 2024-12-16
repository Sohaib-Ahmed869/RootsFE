import axios from "axios";
import { BASE_URL } from "./config";

export class MeritService {
  static getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
      headers: {
        auth: `${token}`,
      },
    };
  }

  static async createMeritTemplate(points, reason) {
    return axios.post(
      `${BASE_URL}/merit/merit-template`,
      { points, reason },
      this.getAuthHeaders()
    );
  }

  static async createDemeritTemplate(points, reason) {
    return axios.post(
      `${BASE_URL}/merit/demerit-template`,
      { points, reason },
      this.getAuthHeaders()
    );
  }

  static async awardPoints(studentId, points, reason,comments) {
    return axios.post(
      `${BASE_URL}/merit/award-points`,
      {
        studentId,
        points,
        reason,
        comments
      },
      this.getAuthHeaders()
    );
  }

  static async getStudentPoints(studentId, filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return axios.get(
      `${BASE_URL}/merit/student-points/${studentId}?${queryParams}`,
      this.getAuthHeaders()
    );
  }

  static async getMeritTemplates() {
    return axios.get(
      `${BASE_URL}/merit/merit-templates`,
      this.getAuthHeaders()
    );
  }

  static async getDemeritTemplates() {
    return axios.get(
      `${BASE_URL}/merit/demerit-templates`,
      this.getAuthHeaders()
    );
  }

  static async deleteMeritTemplate(templateId) {
    return axios.delete(
      `${BASE_URL}/merit/merit-template/${templateId}`,
      this.getAuthHeaders()
    );
  }

  static async deleteDemeritTemplate(templateId) {
    return axios.delete(
      `${BASE_URL}/merit/demerit-template/${templateId}`,
      this.getAuthHeaders()
    );
  }
  static async getTeacherStats(){
    return axios.get(`${BASE_URL}/merit/teacher/merit-stats`, this.getAuthHeaders());
  }
  static async getTeacherStats2(){
    return axios.get(`${BASE_URL}/merit/teacher/merit-stats2`, this.getAuthHeaders());
  }
  static async getChildrenStats(){
    return axios.get(`${BASE_URL}/merit/parent/merit-stats`, this.getAuthHeaders());
  }
  static async getLatestMerits(){
    return axios.get(`${BASE_URL}/merit/student/latest-merit`, this.getAuthHeaders());
  }
}
