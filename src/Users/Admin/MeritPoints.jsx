import React, { useState } from 'react';
import { Plus, AlertCircle, Edit2, Trash2 } from 'lucide-react';

// Initial dummy data for merit/demerit rules
const INITIAL_RULES = [
  { 
    id: 1, 
    category: 'Academic Excellence',
    type: 'merit',
    reason: 'Outstanding performance in test/exam',
    points: 5,
    description: 'Awarded for scoring above 90% in any major examination',
    isActive: true
  },
  { 
    id: 2, 
    category: 'Discipline',
    type: 'demerit',
    reason: 'Late arrival to class',
    points: -2,
    description: 'Deducted for arriving more than 10 minutes late without valid reason',
    isActive: true
  }
];

const CATEGORIES = [
  'Academic Excellence',
  'Discipline',
  'Extra Curricular',
  'Sports',
  'Leadership',
  'Community Service',
  'Other'
];

const MeritRulesManagement = () => {
  const [rules, setRules] = useState(INITIAL_RULES);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState('all');
  
  const [newRule, setNewRule] = useState({
    category: '',
    type: 'merit',
    reason: '',
    points: 0,
    description: '',
    isActive: true
  });

  const getFilteredRules = () => {
    return rules.filter(rule => {
      const categoryMatch = filterCategory === 'all' || rule.category === filterCategory;
      const typeMatch = filterType === 'all' || rule.type === filterType;
      return categoryMatch && typeMatch;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingRule) {
      // Update existing rule
      setRules(rules.map(rule => 
        rule.id === editingRule.id ? { ...newRule, id: editingRule.id } : rule
      ));
    } else {
      // Add new rule
      setRules([...rules, { ...newRule, id: rules.length + 1 }]);
    }
    
    // Reset form and close modal
    setNewRule({
      category: '',
      type: 'merit',
      reason: '',
      points: 0,
      description: '',
      isActive: true
    });
    setEditingRule(null);
    setShowAddModal(false);
  };

  const handleEdit = (rule) => {
    setEditingRule(rule);
    setNewRule(rule);
    setShowAddModal(true);
  };

  const handleDelete = (ruleId) => {
    if (confirm('Are you sure you want to delete this rule?')) {
      setRules(rules.filter(rule => rule.id !== ruleId));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Merit Point Rules</h1>
            <p className="text-gray-600">Manage merit and demerit point rules</p>
          </div>
          <button
            onClick={() => {
              setEditingRule(null);
              setNewRule({
                category: '',
                type: 'merit',
                reason: '',
                points: 0,
                description: '',
                isActive: true
              });
              setShowAddModal(true);
            }}
            className="btn btn-primary bg-[#800000] hover:bg-[#600000] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Rule
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Category Filter</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="select select-bordered w-full"
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Type Filter</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="select select-bordered w-full"
              >
                <option value="all">All Types</option>
                <option value="merit">Merit</option>
                <option value="demerit">Demerit</option>
              </select>
            </div>
          </div>
        </div>

        {/* Rules Table */}
        <div className="bg-white rounded-lg shadow-md p-6 overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Category</th>
                <th>Type</th>
                <th>Reason</th>
                <th>Points</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {getFilteredRules().map(rule => (
                <tr key={rule.id}>
                  <td>{rule.category}</td>
                  <td>
                    <span
                      className={`badge ${
                        rule.type === 'merit' ? 'badge-success' : 'badge-error'
                      }`}
                    >
                      {rule.type}
                    </span>
                  </td>
                  <td>
                    <div>
                      <p className="font-medium">{rule.reason}</p>
                      <p className="text-sm text-gray-500">{rule.description}</p>
                    </div>
                  </td>
                  <td>
                    <span className={rule.points >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {rule.points >= 0 ? '+' : ''}{rule.points}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        rule.isActive ? 'badge-success' : 'badge-warning'
                      }`}
                    >
                      {rule.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(rule)}
                        className="btn btn-sm btn-ghost"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(rule.id)}
                        className="btn btn-sm btn-ghost text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add/Edit Rule Modal */}
        {showAddModal && (
          <dialog open className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg mb-4">
                {editingRule ? 'Edit Rule' : 'Add New Rule'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">
                    <span className="label-text">Category</span>
                  </label>
                  <select
                    value={newRule.category}
                    onChange={(e) => setNewRule({...newRule, category: e.target.value})}
                    className="select select-bordered w-full"
                    required
                  >
                    <option value="">Select Category</option>
                    {CATEGORIES.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">
                    <span className="label-text">Type</span>
                  </label>
                  <select
                    value={newRule.type}
                    onChange={(e) => {
                      const isDemerits = e.target.value === 'demerit';
                      setNewRule({
                        ...newRule,
                        type: e.target.value,
                        points: isDemerits ? Math.abs(newRule.points) * -1 : Math.abs(newRule.points)
                      });
                    }}
                    className="select select-bordered w-full"
                    required
                  >
                    <option value="merit">Merit</option>
                    <option value="demerit">Demerit</option>
                  </select>
                </div>

                <div>
                  <label className="label">
                    <span className="label-text">Reason</span>
                  </label>
                  <input
                    type="text"
                    value={newRule.reason}
                    onChange={(e) => setNewRule({...newRule, reason: e.target.value})}
                    className="input input-bordered w-full"
                    required
                  />
                </div>

                <div>
                  <label className="label">
                    <span className="label-text">Points</span>
                  </label>
                  <input
                    type="number"
                    value={Math.abs(newRule.points)}
                    onChange={(e) => {
                      const points = parseInt(e.target.value) || 0;
                      setNewRule({
                        ...newRule,
                        points: newRule.type === 'demerit' ? points * -1 : points
                      });
                    }}
                    className="input input-bordered w-full"
                    required
                    min="0"
                  />
                </div>

                <div>
                  <label className="label">
                    <span className="label-text">Description</span>
                  </label>
                  <textarea
                    value={newRule.description}
                    onChange={(e) => setNewRule({...newRule, description: e.target.value})}
                    className="textarea textarea-bordered w-full"
                    rows="3"
                    required
                  />
                </div>

                <div>
                  <label className="label cursor-pointer">
                    <span className="label-text">Active</span>
                    <input
                      type="checkbox"
                      checked={newRule.isActive}
                      onChange={(e) => setNewRule({...newRule, isActive: e.target.checked})}
                      className="checkbox"
                    />
                  </label>
                </div>

                <div className="modal-action">
                  <button 
                    type="button" 
                    className="btn btn-ghost"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingRule(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary bg-[#800000] hover:bg-[#600000] text-white"
                  >
                    {editingRule ? 'Update Rule' : 'Add Rule'}
                  </button>
                </div>
              </form>
            </div>
          </dialog>
        )}
      </div>
    </div>
  );
};

export default MeritRulesManagement;