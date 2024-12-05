import React, { useState } from 'react';
import { Calendar, DollarSign, FileText, Search, Plus, AlertCircle } from 'lucide-react';

// Dummy data for fee records
const INITIAL_FEE_RECORDS = [
  {
    id: 1,
    studentId: 1,
    studentName: "John Doe",
    class: "10-A",
    rollNo: "101",
    month: "March 2024",
    amount: 5000,
    dueDate: "2024-03-05",
    status: "paid",
    paidDate: "2024-03-03",
    paymentMode: "online",
    transactionId: "TXN123456",
    feeType: "Monthly",
    lateFee: 0
  },
  {
    id: 2,
    studentId: 2,
    studentName: "Jane Smith",
    class: "10-A",
    rollNo: "102",
    month: "March 2024",
    amount: 5000,
    dueDate: "2024-03-05",
    status: "pending",
    paidDate: null,
    paymentMode: null,
    transactionId: null,
    feeType: "Monthly",
    lateFee: 200
  }
];

const FEE_TYPES = [
  { id: 1, name: "Monthly Fee", amount: 5000 },
  { id: 2, name: "Annual Fee", amount: 15000 },
  { id: 3, name: "Transport Fee", amount: 2000 },
  { id: 4, name: "Lab Fee", amount: 1000 }
];

const PAYMENT_MODES = ["Cash", "Online", "Cheque"];

const FeeManagement = () => {
  const [feeRecords, setFeeRecords] = useState(INITIAL_FEE_RECORDS);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // State for new fee generation
  const [newFee, setNewFee] = useState({
    studentName: '',
    class: '',
    rollNo: '',
    feeType: '',
    amount: '',
    dueDate: '',
    month: ''
  });

  // State for payment details
  const [paymentDetails, setPaymentDetails] = useState({
    amount: '',
    paymentMode: '',
    transactionId: '',
    paidDate: new Date().toISOString().split('T')[0],
    remarks: ''
  });

  const getFilteredRecords = () => {
    let filtered = [...feeRecords];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(record => 
        record.studentName.toLowerCase().includes(query) ||
        record.rollNo.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(record => record.status === statusFilter);
    }

    return filtered;
  };

  const handleGenerateFee = (e) => {
    e.preventDefault();
    // Here you would typically make an API call to generate the fee
    console.log('Generating new fee:', newFee);
    setShowGenerateModal(false);
    setNewFee({
      studentName: '',
      class: '',
      rollNo: '',
      feeType: '',
      amount: '',
      dueDate: '',
      month: ''
    });
  };

  const handlePayment = (e) => {
    e.preventDefault();
    // Here you would typically make an API call to process the payment
    console.log('Processing payment:', paymentDetails);
    setShowPaymentModal(false);
    setPaymentDetails({
      amount: '',
      paymentMode: '',
      transactionId: '',
      paidDate: new Date().toISOString().split('T')[0],
      remarks: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Fee Management</h1>
            <p className="text-gray-600">Manage student fees and payments</p>
          </div>
          <button
            onClick={() => setShowGenerateModal(true)}
            className="btn btn-primary bg-[#800000] hover:bg-[#600000] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Generate Fee
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name or roll number..."
                  className="input input-bordered w-full pr-10"
                />
                <Search className="absolute right-3 top-3 text-gray-400" size={20} />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="select select-bordered w-full"
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>
        </div>

        {/* Fee Records Table */}
        <div className="bg-white rounded-lg shadow-md p-6 overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Student Name</th>
                <th>Class</th>
                <th>Month</th>
                <th>Amount</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {getFilteredRecords().map(record => (
                <tr key={record.id}>
                  <td>{record.rollNo}</td>
                  <td>{record.studentName}</td>
                  <td>{record.class}</td>
                  <td>{record.month}</td>
                  <td>PKR{record.amount}</td>
                  <td>{record.dueDate}</td>
                  <td>
                    <span
                      className={`badge ${
                        record.status === 'paid'
                          ? 'badge-success'
                          : record.status === 'pending'
                          ? 'badge-warning'
                          : 'badge-error'
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedRecord(record);
                          setShowPaymentModal(true);
                        }}
                        className="btn btn-sm bg-[#800000] text-white hover:bg-[#600000]"
                        disabled={record.status === 'paid'}
                      >
                        Record Payment
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Generate Fee Modal */}
        {showGenerateModal && (
          <dialog open className="modal">
            <div className="modal-box w-11/12 max-w-3xl">
              <h3 className="font-bold text-lg mb-4">Generate Fee</h3>
              <form onSubmit={handleGenerateFee} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">
                      <span className="label-text">Student Name</span>
                    </label>
                    <input
                      type="text"
                      value={newFee.studentName}
                      onChange={(e) => setNewFee({...newFee, studentName: e.target.value})}
                      className="input input-bordered w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">Roll Number</span>
                    </label>
                    <input
                      type="text"
                      value={newFee.rollNo}
                      onChange={(e) => setNewFee({...newFee, rollNo: e.target.value})}
                      className="input input-bordered w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">Class</span>
                    </label>
                    <select
                      value={newFee.class}
                      onChange={(e) => setNewFee({...newFee, class: e.target.value})}
                      className="select select-bordered w-full"
                      required
                    >
                      <option value="">Select Class</option>
                      <option value="10-A">10-A</option>
                      <option value="10-B">10-B</option>
                      <option value="9-A">9-A</option>
                    </select>
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">Fee Type</span>
                    </label>
                    <select
                      value={newFee.feeType}
                      onChange={(e) => {
                        const selectedFee = FEE_TYPES.find(fee => fee.name === e.target.value);
                        setNewFee({
                          ...newFee,
                          feeType: e.target.value,
                          amount: selectedFee ? selectedFee.amount : ''
                        });
                      }}
                      className="select select-bordered w-full"
                      required
                    >
                      <option value="">Select Fee Type</option>
                      {FEE_TYPES.map(fee => (
                        <option key={fee.id} value={fee.name}>
                          {fee.name} - PKR{fee.amount}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">Month</span>
                    </label>
                    <input
                      type="month"
                      value={newFee.month}
                      onChange={(e) => setNewFee({...newFee, month: e.target.value})}
                      className="input input-bordered w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">Due Date</span>
                    </label>
                    <input
                      type="date"
                      value={newFee.dueDate}
                      onChange={(e) => setNewFee({...newFee, dueDate: e.target.value})}
                      className="input input-bordered w-full"
                      required
                    />
                  </div>
                </div>

                <div className="modal-action">
                  <button 
                    type="button" 
                    className="btn btn-ghost"
                    onClick={() => setShowGenerateModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary bg-[#800000] hover:bg-[#600000] text-white"
                  >
                    Generate Fee
                  </button>
                </div>
              </form>
            </div>
          </dialog>
        )}

        {/* Payment Modal */}
        {showPaymentModal && selectedRecord && (
          <dialog open className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg mb-4">Record Payment</h3>
              <form onSubmit={handlePayment} className="space-y-4">
                <div>
                  <label className="label">
                    <span className="label-text">Student Name</span>
                  </label>
                  <input
                    type="text"
                    value={selectedRecord.studentName}
                    className="input input-bordered w-full"
                    disabled
                  />
                </div>

                <div>
                  <label className="label">
                    <span className="label-text">Amount Due</span>
                  </label>
                  <input
                    type="text"
                    value={`PKR${selectedRecord.amount + (selectedRecord.lateFee || 0)}`}
                    className="input input-bordered w-full"
                    disabled
                  />
                  {selectedRecord.lateFee > 0 && (
                    <p className="text-sm text-red-500 mt-1">
                      Includes late fee: PKR{selectedRecord.lateFee}
                    </p>
                  )}
                </div>

                <div>
                  <label className="label">
                    <span className="label-text">Payment Mode</span>
                  </label>
                  <select
                    value={paymentDetails.paymentMode}
                    onChange={(e) => setPaymentDetails({...paymentDetails, paymentMode: e.target.value})}
                    className="select select-bordered w-full"
                    required
                  >
                    <option value="">Select Payment Mode</option>
                    {PAYMENT_MODES.map(mode => (
                      <option key={mode} value={mode}>
                        {mode}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">
                    <span className="label-text">Transaction ID</span>
                  </label>
                  <input
                    type="text"
                    value={paymentDetails.transactionId}
                    onChange={(e) => setPaymentDetails({...paymentDetails, transactionId: e.target.value})}
                    className="input input-bordered w-full"
                    required
                  />
                </div>

                <div>
                  <label className="label">
                    <span className="label-text">Payment Date</span>
                  </label>
                  <input
                    type="date"
                    value={paymentDetails.paidDate}
                    onChange={(e) => setPaymentDetails({...paymentDetails, paidDate: e.target.value})}
                    className="input input-bordered w-full"
                    required
                  />
                </div>

                <div>
                  <label className="label">
                    <span className="label-text">Remarks</span>
                  </label>
                  <textarea
                    value={paymentDetails.remarks}
                    onChange={(e) => setPaymentDetails({...paymentDetails, remarks: e.target.value})}
                    className="textarea textarea-bordered w-full"
                    rows={3}
                  />
                </div>

                <div className="modal-action">
                  <button 
                    type="button" 
                    className="btn btn-ghost"
                    onClick={() => setShowPaymentModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary bg-[#800000] hover:bg-[#600000] text-white"
                  >
                    Record Payment
                  </button>
                </div>
              </form>
            </div>
          </dialog>
        )}
      </div>
    </div>
  );
}

export default FeeManagement;