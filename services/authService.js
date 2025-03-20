// authService.js
import axios from "axios";
import { BASE_URL } from "./config";

/**
 * Authentication Service
 * Handles all authentication related API calls
 */
export class AuthService {
  static getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
      headers: {
        auth: `${token}`,
      },
    };
  }
  static async checkAuth(role) {
    return axios.get(
      `${BASE_URL}/auth/${role}/check-auth`,
      this.getAuthHeaders()
    );
  }

  /**
   * Login user based on role
   * @param {string} role - One of: 'superadmin', 'branchadmin', 'teacher', 'student', 'parent'
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} Response containing auth token
   */
  static async login(role, email, password) {
    return fetch(`${BASE_URL}/auth/login/${role}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role, email, password }),
    });
  }

  /**
   * Register a superadmin
   * @param {string} name - Admin name
   * @param {string} email - Admin email
   * @param {string} password - Admin password
   */
  static async registerSuperAdmin(name, email, password) {
    return axios.post(`${BASE_URL}/auth/register/superadmin`, {
      name,
      email,
      password,
    });
  }

  /**
   * Register a branch admin (Requires superadmin token)
   * @param {string} name - Admin name
   * @param {string} email - Admin email
   * @param {string} password - Admin password
   * @param {string} cnic - Admin CNIC
   * @param {string} branch_id - Branch ID
   * @param {string} address - Admin address
   * @param {string} contactNumber - Admin contact number
   */
  static async registerBranchAdmin(
    name,
    email,
    password,
    cnic,
    branch_id,
    address = "",
    contactNumber = ""
  ) {
    return axios.post(
      `${BASE_URL}/auth/register/branchadmin`,
      {
        name,
        email,
        password,
        cnic,
        branch_id,
        address,
        contactNumber,
      },
      this.getAuthHeaders()
    );
  }

  /**
   * Register a teacher (Requires branch admin token)
   * @param {string} name - Teacher name
   * @param {string} email - Teacher email
   * @param {string} password - Teacher password
   * @param {string} qualification - Teacher qualification
   * @param {string} branch_id - Branch ID
   * @param {string} cnic - Teacher CNIC
   * @param {string} address - Teacher address
   * @param {string} contactNumber - Teacher contact number
   */
  static async registerTeacher(
    name,
    email,
    password,
    qualification,
    branch_id,
    cnic,
    address = "",
    contactNumber = ""
  ) {
    return axios.post(
      `${BASE_URL}/auth/register/teacher`,
      {
        name,
        email,
        password,
        qualification,
        branch_id,
        cnic,
        address,
        contactNumber,
      },
      this.getAuthHeaders()
    );
  }

  /**
   * Register a student (Requires branch admin token)
   * @param {string} name - Student name
   * @param {string} email - Student email
   * @param {string} password - Student password
   * @param {string} rollNumber - Student roll number
   * @param {string} dateOfBirth - Student date of birth
   * @param {string} grade - Student grade
   * @param {string} branch_id - Branch ID
   * @param {string} cnic - Student CNIC
   * @param {string} address - Student address
   * @param {string} contactNumber - Student contact number
   * @param {number} age - Student age
   */
  static async registerStudent(
    name,
    email,
    password,
    rollNumber,
    dateOfBirth,
    grade,
    branch_id,
    cnic,
    address = "",
    contactNumber = "",
    age = null,
    class_name = ""
  ) {
    console.log(rollNumber);
    return axios.post(
      `${BASE_URL}/auth/register/student`,
      {
        name,
        email,
        password,
        rollNumber,
        dateOfBirth,
        grade,
        branch_id,
        cnic,
        address,
        contactNumber,
        age,
        class_name,
      },
      this.getAuthHeaders()
    );
  }

  /**
   * Get all users of a specific role (Requires appropriate admin token)
   * @param {string} role - User role
   */
  static async getAllUsers(role) {
    return axios.get(`${BASE_URL}/auth/${role}`, this.getAuthHeaders());
  }

  /**
   * Get user by ID and role
   * @param {string} role - User role
   * @param {string} id - User ID
   */
  static async getUserById(role, id) {
    return axios.get(`${BASE_URL}/auth/${role}/${id}`, this.getAuthHeaders());
  }

  /**
   * Update user by ID and role
   * @param {string} role - User role
   * @param {string} id - User ID
   * @param {Object} updates - Fields to update
   */
  static async updateUser(role, id, updates) {
    return axios.put(
      `${BASE_URL}/auth/${role}/${id}`,
      updates,
      this.getAuthHeaders()
    );
  }

  /**
   * Delete user by ID and role
   * @param {string} role - User role
   * @param {string} id - User ID
   */
  static async deleteUser(role, id) {
    return axios.delete(
      `${BASE_URL}/auth/${role}/${id}`,
      this.getAuthHeaders()
    );
  }
  static async getStudents() {
    return axios.get(`${BASE_URL}/auth/student2`, this.getAuthHeaders());
  }
  static async getAdminStudents() {
    return axios.get(`${BASE_URL}/auth/student3`, this.getAuthHeaders());
  }
  static async getAdminBranch() {
    return axios.get(
      `${BASE_URL}/auth/get-admin-branch`,
      this.getAuthHeaders()
    );
  }
  static async getStudentDash() {
    return axios.get(`${BASE_URL}/auth/student-dash`, this.getAuthHeaders());
  }
  static async getStudentDash2() {
    return axios.get(`${BASE_URL}/auth/student-dash2`, this.getAuthHeaders());
  }
  static async updatePassword(password) {
    return axios.put(
      `${BASE_URL}/auth/update-student-pass`,
      { password },
      this.getAuthHeaders()
    );
  }

  static async registerParent(
    name,
    email,
    password,
    student_id,
    cnic,
    address = "",
    contactNumber = ""
  ) {
    const children = [student_id];
    console.log(children);
    console.log(password);
    return axios.post(
      `${BASE_URL}/auth/register/parent`,
      {
        name,
        email,
        password,
        cnic,
        address,
        contactNumber,
        children,
      },
      this.getAuthHeaders()
    );
  }
  static async forgotPassword(email) {
    return axios.post(`${BASE_URL}/auth/student/forgot-password`, { email });
  }
}
