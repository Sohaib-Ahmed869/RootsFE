import React, { useState } from "react";
import { Upload, AlertCircle, Loader } from "lucide-react";
import * as XLSX from "xlsx";
import { AuthService } from "../../../services/authService";

const TeacherExcelUpload = ({ onSuccess, branchId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateDefaultData = (serialNo, teacherName) => {
    // Generate email from teacher name and serial number
    const email = `teacher${serialNo.toString().toLowerCase().replace(/\s+/g, ".")}@school.com`;
    
    // Generate other required default values
    return {
      email,
      password: "teacher123", // Default password
      qualification: "Not Specified", // Default qualification
      cnic: `${serialNo}12345`, // Default CNIC using serial number
      address: "Address not specified", // Default address
      contactNumber: `03${Math.floor(Math.random() * 100000000)}`, // Random phone number
    };
  };

  const processExcelFile = async (file) => {
    try {
      setLoading(true);
      setError(null);

      // Read the Excel file
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, {
        type: "array",
        cellDates: true,
        dateNF: "yyyy-mm-dd",
      });

      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false });

      // Skip first row (header) and process rest
      const firstRowKeys = Object.keys(jsonData[0]);
      const serialNoKey = firstRowKeys[0];

      const dataRows = jsonData.slice(1);

      for (const row of dataRows) {
        const teacherName = row["__EMPTY"]; // Teacher Name column
        const serialNo = row[serialNoKey]; // Sr. # column

        if (!teacherName || !serialNo) {
          console.warn("Skipping invalid row:", row);
          continue;
        }

        // Generate default data for the teacher
        const defaultData = generateDefaultData(serialNo, teacherName);

        // Register the teacher using AuthService
        await AuthService.registerTeacher(
          teacherName,
          defaultData.email,
          defaultData.password,
          defaultData.qualification,
          branchId,
          defaultData.cnic,
          defaultData.address,
          defaultData.contactNumber
        );
      }

      setLoading(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error("Excel processing error:", err);
      setError(
        "Failed to process Excel file. Please check the format and try again."
      );
      setLoading(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      processExcelFile(file);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="mb-4">
        <label className="flex flex-col items-center px-4 py-6 bg-white border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400">
          <Upload className="w-8 h-8 text-gray-400" />
          <span className="mt-2 text-sm text-gray-500">
            Click to upload Excel file
          </span>
          <input
            type="file"
            className="hidden"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            disabled={loading}
          />
        </label>
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-2 text-gray-600">
          <Loader className="w-4 h-4 animate-spin" />
          <span>Processing Excel file...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        <p className="font-medium mb-2">Excel File Format:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>First column should be Sr. #</li>
          <li>Second column should be Teacher Name</li>
          <li>Skip the header row</li>
          <li>Other details will be auto-generated</li>
        </ul>
      </div>
    </div>
  );
};

export default TeacherExcelUpload;