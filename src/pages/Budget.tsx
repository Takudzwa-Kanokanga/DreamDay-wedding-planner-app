import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Expense {
  id: string;
  category: string;
  item: string;
  estimated: number;
  actual: number;
  status: 'Paid' | 'Pending' | 'Overdue';
}

export default function Budget() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [formData, setFormData] = useState({
    category: '',
    item: '',
    estimated: '',
    actual: '',
    status: 'Pending' as Expense['status'],
  });
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchExpenses();
    } else {
      setExpenses([]);
      setLoading(false);
    }
  }, [user]);

  const fetchExpenses = async () => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setExpenses(data || []);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingExpense(null);
    setFormData({
      category: '',
      item: '',
      estimated: '',
      actual: '',
      status: 'Pending',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (expense: Expense) => {
    setEditingExpense(expense);
    setFormData({
      category: expense.category,
      item: expense.item,
      estimated: expense.estimated.toString(),
      actual: expense.actual.toString(),
      status: expense.status,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!user || !formData.category || !formData.item || !formData.estimated) return;

    try {
      const expenseData = {
        category: formData.category,
        item: formData.item,
        estimated: parseFloat(formData.estimated) || 0,
        actual: parseFloat(formData.actual) || 0,
        status: formData.status,
        updated_at: new Date().toISOString(),
      };

      if (editingExpense) {
        const { error } = await supabase
          .from('expenses')
          .update(expenseData)
          .eq('id', editingExpense.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from('expenses').insert([
          {
            user_id: user.id,
            ...expenseData,
          },
        ]);

        if (error) throw error;
      }

      setIsModalOpen(false);
      fetchExpenses();
    } catch (error) {
      console.error('Error saving expense:', error);
    }
  };

  const deleteExpense = async (expenseId: string) => {
    if (!user || !confirm('Are you sure you want to delete this expense?')) return;

    try {
      const { error } = await supabase.from('expenses').delete().eq('id', expenseId);

      if (error) throw error;
      fetchExpenses();
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const totalActual = expenses.reduce((sum, expense) => sum + expense.actual, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-pink-100 text-pink-700';
      case 'Pending':
        return 'bg-green-100 text-green-700';
      case 'Overdue':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-serif text-gray-900 mb-2">Sign in to manage budget</h2>
          <p className="text-gray-600">Please sign in to access your wedding budget.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-serif text-gray-900 mb-2">Budget Overview</h1>
            <p className="text-gray-600">Track and manage your wedding expenses</p>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-6 py-3 bg-pink-300 text-white rounded-lg hover:bg-pink-400 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add New Expense
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Budget</h3>
            <p className="text-3xl font-bold text-gray-900">$25,000</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Spent</h3>
            <p className="text-3xl font-bold text-pink-300">${totalActual.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Remaining</h3>
            <p className="text-3xl font-bold text-green-600">
              ${(25000 - totalActual).toLocaleString()}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading expenses...</p>
          </div>
        ) : expenses.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <p className="text-gray-600">No expenses yet. Add your first expense to start tracking!</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">Detailed Expenses</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Estimated
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Actual
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {expenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-900">{expense.category}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{expense.item}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        ${expense.estimated.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        ${expense.actual.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            expense.status
                          )}`}
                        >
                          {expense.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditModal(expense)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4 text-gray-600" />
                          </button>
                          <button
                            onClick={() => deleteExpense(expense.id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                          >
                            <Trash2 className="w-4 h-4 text-gray-600 group-hover:text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-2xl font-serif text-gray-900">
                {editingExpense ? 'Edit Expense' : 'Add New Expense'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Venue, Catering, Photography"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Item</label>
                <input
                  type="text"
                  value={formData.item}
                  onChange={(e) => setFormData({ ...formData, item: e.target.value })}
                  placeholder="e.g., Reception Hall Deposit"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated ($)
                  </label>
                  <input
                    type="number"
                    value={formData.estimated}
                    onChange={(e) => setFormData({ ...formData, estimated: e.target.value })}
                    placeholder="0"
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Actual ($)
                  </label>
                  <input
                    type="number"
                    value={formData.actual}
                    onChange={(e) => setFormData({ ...formData, actual: e.target.value })}
                    placeholder="0"
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as Expense['status'] })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!formData.category || !formData.item || !formData.estimated}
                  className="flex-1 px-4 py-3 bg-pink-300 text-white rounded-lg hover:bg-pink-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingExpense ? 'Update' : 'Add'} Expense
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
