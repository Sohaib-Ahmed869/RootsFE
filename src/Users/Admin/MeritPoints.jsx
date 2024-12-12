import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Loader, AlertCircle } from "lucide-react";
import { MeritService } from "../../../services/meritService";

const MeritRulesManagement = () => {
  const [rules, setRules] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newRule, setNewRule] = useState({
    reason: "",
    points: 0,
  });

  // Fetch both merit and demerit templates
  const fetchTemplates = async () => {
    try {
      setLoading(true);
      setError(null);

      const [meritResponse, demeritResponse] = await Promise.all([
        MeritService.getMeritTemplates(),
        MeritService.getDemeritTemplates(),
      ]);

      // Combine and format the responses
      const meritTemplates = meritResponse.data.map((template) => ({
        ...template,
        points: Math.abs(template.points), // Ensure positive points for merits
      }));

      const demeritTemplates = demeritResponse.data.map((template) => ({
        ...template,
        points: -Math.abs(template.points), // Ensure negative points for demerits
      }));

      setRules([...meritTemplates, ...demeritTemplates]);
    } catch (err) {
      setError("Failed to fetch templates. Please try again later.");
      console.error("Error fetching templates:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchTemplates();
  }, []);

  const getFilteredRules = () => {
    return rules.filter((rule) => {
      if (filterType === "all") return true;
      return filterType === "merit" ? rule.points > 0 : rule.points < 0;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const isMerit = newRule.points > 0;
      const points = Math.abs(newRule.points); // Send absolute value for both types

      if (isMerit) {
        await MeritService.createMeritTemplate(points, newRule.reason);
      } else {
        await MeritService.createDemeritTemplate(points, newRule.reason);
      }

      // Refresh the templates after creating new one
      await fetchTemplates();

      // Reset form and close modal
      setNewRule({
        reason: "",
        points: 0,
      });
      setEditingRule(null);
      setShowAddModal(false);
    } catch (error) {
      console.error("Error creating template:", error);
      alert(
        `Failed to create ${
          newRule.points > 0 ? "merit" : "demerit"
        } template. Please try again.`
      );
    }
  };

  const handleEdit = (rule) => {
    setEditingRule(rule);
    setNewRule(rule);
    setShowAddModal(true);
  };

  const handleDelete = async (ruleId, points) => {
    if (confirm("Are you sure you want to delete this rule?")) {
      try {
        const isMerit = points > 0;

        if (isMerit) {
          await MeritService.deleteMeritTemplate(ruleId);
        } else {
          await MeritService.deleteDemeritTemplate(ruleId);
        }

        // Refresh the templates after deletion
        await fetchTemplates();
      } catch (error) {
        console.error("Error deleting template:", error);
        alert(
          `Failed to delete ${
            points > 0 ? "merit" : "demerit"
          } template. Please try again.`
        );
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader className="w-6 h-6 animate-spin" />
          <span>Loading templates...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-red-500 flex items-center gap-2">
          <AlertCircle className="w-6 h-6" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Merit Point Rules
            </h1>
            <p className="text-gray-600">
              Manage merit and demerit point rules
            </p>
          </div>
          <button
            onClick={() => {
              setEditingRule(null);
              setNewRule({
                reason: "",
                points: 0,
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type Filter
              </label>
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
          {getFilteredRules().length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No templates found. Add a new one to get started.
            </div>
          ) : (
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Reason</th>
                  <th>Points</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredRules().map((rule) => (
                  <tr key={rule.id}>
                    <td>
                      <span
                        className={`badge ${
                          rule.points > 0 ? "badge-success" : "badge-error"
                        }`}
                      >
                        {rule.points > 0 ? "merit" : "demerit"}
                      </span>
                    </td>
                    <td>
                      <p className="font-medium">{rule.reason}</p>
                    </td>
                    <td>
                      <span
                        className={
                          rule.points >= 0 ? "text-green-600" : "text-red-600"
                        }
                      >
                        {rule.points >= 0 ? "+" : ""}
                        {rule.points}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        {/* <button
                          onClick={() => handleEdit(rule)}
                          className="btn btn-sm btn-ghost"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button> */}
                        <button
                          onClick={() => handleDelete(rule._id, rule.points)}
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
          )}
        </div>

        {/* Add/Edit Rule Modal */}
        {showAddModal && (
          <dialog open className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg mb-4">
                {editingRule ? "Edit Rule" : "Add New Rule"}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">
                    <span className="label-text">Type</span>
                  </label>
                  <select
                    value={newRule.points > 0 ? "merit" : "demerit"}
                    onChange={(e) => {
                      const isDemerits = e.target.value === "demerit";
                      setNewRule({
                        ...newRule,
                        points: isDemerits
                          ? Math.abs(newRule.points) * -1
                          : Math.abs(newRule.points),
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
                    onChange={(e) =>
                      setNewRule({ ...newRule, reason: e.target.value })
                    }
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
                        points: newRule.points < 0 ? points * -1 : points,
                      });
                    }}
                    className="input input-bordered w-full"
                    required
                    min="0"
                  />
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
                    {editingRule ? "Update Rule" : "Add Rule"}
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
