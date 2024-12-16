import axios from "axios";
import { BASE_URL } from "./config";


/**
 * Parent service class
 */

export default class ParentService {
    /**
     * Get children of a parent
     * @returns {Promise} Response containing children
     */
    static async getChildren(){
        return axios.get(`${BASE_URL}/parent/children`, {
            headers: {
                auth: `${localStorage.getItem('token')}`
            }
        });
        
    }
    static async AddChildren(parent_id,student_ids){
        return axios.put(`${BASE_URL}/parent/children`, {parent_id,student_ids}, {
            headers: {
                auth: `${localStorage.getItem('token')}`
            }
        });

    }
    static async assignParentToStudent(parent_id,student_id){
        return axios.post(`${BASE_URL}/parent/assign`, {parent_id,student_id}, {
            headers: {
                auth: `${localStorage.getItem('token')}`
            }
        });

    }
    static async deAssignParentToStudent(parent_id,student_id){ 
        return axios.post(`${BASE_URL}/parent/deassign`, {parent_id,student_id}, {
            headers: {
                auth: `${localStorage.getItem('token')}`
            }
        });

    }

}
