import axios from "axios";
import { BASE_URL } from "./config";

/**
 * Branch Service
 * Handles all branch-related API calls
 */
export class BranchService {
  static getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
      headers: {
        auth: `${token}`,
      },
    };
  }

  /**
   * Create a new branch (Requires superadmin token)
   * @param {string} name - Branch name
   * @param {string} address - Branch address
   * @param {string} contactNumber - Branch contact number
   * @param {string} email - Branch email
   * @param {number} capacity - Branch capacity
   */
  static async createBranch(name, address, contactNumber, email, capacity) {
    return axios.post(
      `${BASE_URL}/branch`,
      {
        name,
        address,
        contactNumber,
        email,
        capacity,
      },
      this.getAuthHeaders()
    );
  }

  static async deleteBranch(branch_id) {
    return axios.delete(
      `${BASE_URL}/branch/${branch_id}`,
      this.getAuthHeaders()
    );
  }

  static async updateBranch(branch_id, data) {
    return axios.put(
      `${BASE_URL}/branch/${branch_id}`,
      data,
      this.getAuthHeaders()
    );
  }

  /**
   * Get all branches
   */
  static async getAllBranches() {
    return axios.get(`${BASE_URL}/branch`, this.getAuthHeaders());
  }
  static async getMeritStats() {
    return axios.get(`${BASE_URL}/merit/merit-stats`, this.getAuthHeaders());
  }

  /**
   * Get branch by ID
   * @param {string} id - Branch ID
   */
  static async getBranchById(id) {
    return axios.get(`${BASE_URL}/branch/${id}`, this.getAuthHeaders());
  }

  /**
   * Add a new class to branch (Requires branch admin token)
   * @param {string} name - Class name
   * @param {string} branch_id - Branch ID
   */
  static async addClass(name, branch_id) {
    return axios.post(
      `${BASE_URL}/branch/class/create`,
      { name, branch_id },
      this.getAuthHeaders()
    );
  }

  /**
   * Add students to a class (Requires branch admin token)
   * @param {string} class_id - Class ID
   * @param {Array<string>} student_ids - Array of student IDs
   */
  static async addStudentsToClass(class_name, student_ids) {
    return axios.post(
      `${BASE_URL}/branch/class/add-students`,
      { class_name, student_ids },
      this.getAuthHeaders()
    );
  }

  /**
   * Change student's class (Requires branch admin token)
   * @param {string} student_id - Student ID
   * @param {string} new_class_id - New class ID
   */
  static async changeStudentClass(student_id, new_class_name) {
    return axios.put(
      `${BASE_URL}/branch/class/change-student`,
      { student_id, new_class_name }, // Make sure this matches your backend expectations
      this.getAuthHeaders()
    );
  }

  /**
   * Add subject to class (Requires branch admin token)
   * @param {string} class_id - Class ID
   * @param {string} subject_name - Subject name
   */
  static async addSubjectToClass(class_id, subject_name) {
    return axios.post(
      `${BASE_URL}/branch/class/add-subject`,
      { class_id, subject_name },
      this.getAuthHeaders()
    );
  }

  /**
   * Assign teacher to subject (Requires branch admin token)
   * @param {string} class_id - Class ID
   * @param {string} subject_id - Subject ID
   * @param {string} teacher_id - Teacher ID
   */
  static async assignTeacher(class_id, subject_name, teacher_id) {
    return axios.post(
      `${BASE_URL}/branch/class/assign-teacher`,
      {
        class_id,
        subject_name,
        teacher_id,
      },
      this.getAuthHeaders()
    );
  }
  static async getBranchTeachers() {
    return axios.get(`${BASE_URL}/branch/teacher/data`, this.getAuthHeaders());
  }

  /**
   * Get Recent activy of a branch
   * @param {string} branch_id - Branch ID
   * @queryParam {number} num_recent - Number of recent activities to fetch
   **/
  static async getAwardedMeritsByBranch(branch_id, num_recent) {
    const params = {};
    if (num_recent) {
      params.num_recent = num_recent;
    }
    return axios.get(`${BASE_URL}/branch/recent/${branch_id}`, {
      ...this.getAuthHeaders(),
      params,
    });
  }
  /**
   * Get awarded merit points by teacher ID
   * @param {string} teacher_id - Teacher ID
   */
  static async getAwardedMeritPoints(teacher_id) {
    return axios.get(
      `${BASE_URL}/teacher/merit/${teacher_id}`,
      this.getAuthHeaders()
    );
  }
  static getBranchClasses(branch_id) {
    return axios.get(
      `${BASE_URL}/branch/classes/${branch_id}`,
      this.getAuthHeaders()
    );
  }
  static async getBranchStudents() {
    return axios.get(`${BASE_URL}/branch/student/data`, this.getAuthHeaders());
  }
}
