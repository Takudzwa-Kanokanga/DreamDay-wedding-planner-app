import { Receipt, CheckCircle2, Users, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface DashboardStats {
  totalBudget: number;
  totalSpent: number;
  upcomingTasks: number;
  completedTasks: number;
  totalGuests: number;
  rsvpCount: number;
}

export default function Dashboard({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const [stats, setStats] = useState<DashboardStats>({
    totalBudget: 25000,
    totalSpent: 0,
    upcomingTasks: 0,
    completedTasks: 0,
    totalGuests: 0,
    rsvpCount: 0,
  });
  const [upcomingTasksList, setUpcomingTasksList] = useState<any[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const [expensesRes, tasksRes, guestsRes] = await Promise.all([
        supabase.from('expenses').select('actual'),
        supabase.from('tasks').select('*').order('due_date', { ascending: true }),
        supabase.from('guests').select('rsvp_status'),
      ]);

      const totalSpent = (expensesRes.data || []).reduce(
        (sum, expense) => sum + (expense.actual || 0),
        0
      );

      const tasks = tasksRes.data || [];
      const upcomingTasks = tasks.filter((t) => !t.completed).slice(0, 3);
      const completedTasks = tasks.filter((t) => t.completed).length;

      const guests = guestsRes.data || [];
      const rsvpCount = guests.filter((g) => g.rsvp_status === 'Accepted').length;

      setStats({
        totalBudget: 25000,
        totalSpent,
        upcomingTasks: tasks.filter((t) => !t.completed).length,
        completedTasks,
        totalGuests: guests.length,
        rsvpCount,
      });

      setUpcomingTasksList(upcomingTasks);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-serif text-gray-900 mb-2">Sign in to view dashboard</h2>
          <p className="text-gray-600">Please sign in to access your wedding dashboard.</p>
        </div>
      </div>
    );
  }

  const budgetPercentage = (stats.totalSpent / stats.totalBudget) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-serif text-gray-900 mb-3">Your Wedding at a Glance</h1>
          <p className="text-gray-600">
            A comprehensive overview of your planning progress, ensuring every detail is perfectly
            managed.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="text-pink-300 mb-2">
                  <Receipt className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Budget Overview</h3>
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-4xl font-bold text-pink-300">
                ${stats.totalSpent.toLocaleString()}
              </div>
              <p className="text-sm text-gray-600">
                spent of ${stats.totalBudget.toLocaleString()} total
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-pink-300 h-2 rounded-full"
                  style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">{Math.round(budgetPercentage)}% Allocated</p>
              <button
                onClick={() => onNavigate?.('budget')}
                className="w-full mt-4 px-4 py-2 bg-pink-300 text-white rounded-lg hover:bg-pink-400 transition-colors"
              >
                View Details
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="text-green-500 mb-2">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Next Steps</h3>
              </div>
            </div>
            <div className="space-y-4">
              <div className="text-5xl font-bold text-green-500">{stats.upcomingTasks}</div>
              <p className="text-sm text-gray-600">tasks remaining</p>
              <ul className="space-y-2 text-sm">
                {upcomingTasksList.length > 0 ? (
                  upcomingTasksList.map((task) => (
                    <li key={task.id} className="flex items-start gap-2">
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-700">
                        {task.title}
                        {task.due_date && ` (${new Date(task.due_date).toLocaleDateString()})`}
                      </span>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500 italic">No upcoming tasks</li>
                )}
              </ul>
              <button
                onClick={() => onNavigate?.('tasks')}
                className="w-full mt-4 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Manage Tasks
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="text-pink-300 mb-2">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Guest List Status</h3>
              </div>
            </div>
            <div className="space-y-4">
              <div className="text-5xl font-bold text-pink-300">{stats.rsvpCount}</div>
              <p className="text-sm text-gray-600">
                RSVPs received{stats.totalGuests > 0 && ` of ${stats.totalGuests} invited`}
              </p>
              <p className="text-sm text-gray-700 font-medium">
                {stats.totalGuests - stats.rsvpCount} guests still pending response.
              </p>
              <button
                onClick={() => onNavigate?.('tasks')}
                className="w-full mt-4 px-4 py-2 bg-pink-300 text-white rounded-lg hover:bg-pink-400 transition-colors"
              >
                View Guest List
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="text-pink-300 mb-2">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Completed Tasks</h3>
              </div>
            </div>
            <div className="space-y-4">
              <div className="text-5xl font-bold text-pink-300">{stats.completedTasks}</div>
              <p className="text-sm text-gray-600">Tasks completed</p>
              <p className="text-sm text-gray-700 font-medium">
                {stats.upcomingTasks > 0
                  ? `Keep going! ${stats.upcomingTasks} more to finish.`
                  : 'All tasks completed!'}
              </p>
              <button
                onClick={() => onNavigate?.('tasks')}
                className="w-full mt-4 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                View All Tasks
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-serif text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <button
              onClick={() => onNavigate?.('tasks')}
              className="p-4 border border-gray-200 rounded-lg hover:border-pink-300 hover:bg-pink-50 transition-colors text-left"
            >
              <h3 className="font-semibold text-gray-900 mb-1">Add Task</h3>
              <p className="text-sm text-gray-600">Create a new wedding planning task</p>
            </button>
            <button
              onClick={() => onNavigate?.('budget')}
              className="p-4 border border-gray-200 rounded-lg hover:border-pink-300 hover:bg-pink-50 transition-colors text-left"
            >
              <h3 className="font-semibold text-gray-900 mb-1">Track Expense</h3>
              <p className="text-sm text-gray-600">Add a new expense to your budget</p>
            </button>
            <button
              onClick={() => onNavigate?.('gallery')}
              className="p-4 border border-gray-200 rounded-lg hover:border-pink-300 hover:bg-pink-50 transition-colors text-left"
            >
              <h3 className="font-semibold text-gray-900 mb-1">Save Inspiration</h3>
              <p className="text-sm text-gray-600">Browse and save wedding ideas</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
