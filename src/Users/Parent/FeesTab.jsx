import React from 'react';

// Dummy Fees Data
const FEES_DATA = {
  1: {
    totalFees: 120000,
    paid: 80000,
    pending: 40000,
    history: [
      {
        id: "FEE001",
        term: "Term 1",
        type: "Tuition Fee",
        amount: 40000,
        dueDate: "2024-01-05",
        status: "Paid",
        paidDate: "2024-01-03",
        receiptNo: "RCP001"
      },
      {
        id: "FEE002",
        term: "Term 1",
        type: "Development Fee",
        amount: 10000,
        dueDate: "2024-01-05",
        status: "Paid",
        paidDate: "2024-01-03",
        receiptNo: "RCP002"
      },
      {
        id: "FEE003",
        term: "Term 2",
        type: "Tuition Fee",
        amount: 40000,
        dueDate: "2024-04-05",
        status: "Pending"
      }
    ]
  },
  2: {
    totalFees: 100000,
    paid: 60000,
    pending: 40000,
    history: [
      {
        id: "FEE004",
        term: "Term 1",
        type: "Tuition Fee",
        amount: 35000,
        dueDate: "2024-01-05",
        status: "Paid",
        paidDate: "2024-01-04",
        receiptNo: "RCP003"
      }
    ]
  }
};

// Card Component
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-md ${className}`}>
    {children}
  </div>
);

const FeesTab = ({ viewMode, selectedChild }) => {
  const downloadReceipt = (receiptNo) => {
    console.log(`Downloading receipt: ${receiptNo}`);
  };

  if (viewMode === 'consolidated') {
    return (
      <div className="space-y-6">
        {/* Overall Summary */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Family Fees Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Total Fees</p>
              <p className="text-2xl font-bold">PKR{Object.values(FEES_DATA).reduce((sum, child) => sum + child.totalFees, 0).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Paid</p>
              <p className="text-2xl font-bold text-green-600">PKR{Object.values(FEES_DATA).reduce((sum, child) => sum + child.paid, 0).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Pending</p>
              <p className="text-2xl font-bold text-red-600">PKR{Object.values(FEES_DATA).reduce((sum, child) => sum + child.pending, 0).toLocaleString()}</p>
            </div>
          </div>
        </Card>

        {/* Individual Child Summaries */}
        {Object.entries(FEES_DATA).map(([childId, childFees]) => (
          <Card key={childId} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold">Child {childId}</h3>
                <p className="text-sm text-gray-600">ID: {childId}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Pending Amount</p>
                <p className="text-lg font-bold text-red-600">PKR{childFees.pending.toLocaleString()}</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-2 px-4">Term</th>
                    <th className="text-left py-2 px-4">Type</th>
                    <th className="text-left py-2 px-4">Amount</th>
                    <th className="text-left py-2 px-4">Status</th>
                    <th className="text-left py-2 px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {childFees.history.map(fee => (
                    <tr key={fee.id} className="border-t">
                      <td className="py-2 px-4">{fee.term}</td>
                      <td className="py-2 px-4">{fee.type}</td>
                      <td className="py-2 px-4">PKR{fee.amount.toLocaleString()}</td>
                      <td className="py-2 px-4">
                        <span className={`px-2 py-1 rounded text-sm ${
                          fee.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {fee.status}
                        </span>
                      </td>
                      <td className="py-2 px-4">
                        {fee.receiptNo && (
                          <button
                            onClick={() => downloadReceipt(fee.receiptNo)}
                            className="text-[#800000] hover:text-[#600000]"
                          >
                            Download Receipt
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  // Individual Child Fees View
  const childFees = FEES_DATA[selectedChild];

  return (
    <div className="space-y-6">
      {/* Fee Summary */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">Total Fees</p>
            <p className="text-2xl font-bold">PKR{childFees.totalFees.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Paid Amount</p>
            <p className="text-2xl font-bold text-green-600">PKR{childFees.paid.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Pending Amount</p>
            <p className="text-2xl font-bold text-red-600">PKR{childFees.pending.toLocaleString()}</p>
          </div>
        </div>
      </Card>

      {/* Fee History */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Fee History</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4">Term</th>
                <th className="text-left py-3 px-4">Type</th>
                <th className="text-left py-3 px-4">Amount</th>
                <th className="text-left py-3 px-4">Due Date</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Paid Date</th>
                <th className="text-left py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {childFees.history.map(fee => (
                <tr key={fee.id} className="border-t">
                  <td className="py-3 px-4">{fee.term}</td>
                  <td className="py-3 px-4">{fee.type}</td>
                  <td className="py-3 px-4">PKR{fee.amount.toLocaleString()}</td>
                  <td className="py-3 px-4">{new Date(fee.dueDate).toLocaleDateString()}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-sm ${
                      fee.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {fee.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">{fee.paidDate ? new Date(fee.paidDate).toLocaleDateString() : '-'}</td>
                  <td className="py-3 px-4">
                    {fee.receiptNo && (
                      <button
                        onClick={() => downloadReceipt(fee.receiptNo)}
                        className="text-[#800000] hover:text-[#600000]"
                      >
                        Download Receipt
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default FeesTab;