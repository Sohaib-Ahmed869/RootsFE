import React, { useState } from "react";
import { Upload, AlertCircle, Loader } from "lucide-react";
import * as XLSX from "xlsx";
import { AuthService } from "../../../services/authService";

const ExcelUpload = ({ onSuccess, branchId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getaNumberFromName = (name) => {
    //generate an id from the name
    let id = 0;
    for (let i = 0; i < name.length; i++) {
      id += name.charCodeAt(i);
    }
    return id;
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
        const studentName = row["__EMPTY"]; // Student Name column
        const serialNo = row[serialNoKey]; // S. No. column

        if (!studentName || !serialNo) {
          console.warn("Skipping invalid row:", row);
          continue;
        }

        // Generate email from student name
        const email = `${serialNo + getaNumberFromName(studentName)
          .toString()
          .toLowerCase()
          .replace(/\s+/g, ".")}@school.com`;

        // Generate default password
        const defaultPassword = `student`;

        // Register the student without class field
        await AuthService.registerStudent(
          studentName,
          email,
          defaultPassword,
          serialNo,
          new Date().toISOString().split("T")[0], // Current date as default
          "", // grade
          branchId,
          "", // CNIC
          "", // Address
          "", // Contact
          0 // Age,
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
    </div>
  );
};

export default ExcelUpload;
