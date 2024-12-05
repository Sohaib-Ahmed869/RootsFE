import React from 'react';
import { LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// Dummy Overview Data
const OVERVIEW_DATA = {
  1: {
    notifications: [
      { id: 1, type: 'academic', message: 'Scored highest in Mathematics Unit Test', date: '2024-03-15', priority: 'high' },
      { id: 2, type: 'fee', message: 'Term 2 fees due in 5 days', date: '2024-03-14', priority: 'medium' },
      { id: 3, type: 'homework', message: 'Physics assignment overdue', date: '2024-03-13', priority: 'high' },
    ],
    upcomingEvents: [
      { id: 1, title: 'Parent Teacher Meeting', date: '2024-03-20', type: 'meeting' },
      { id: 2, title: 'Science Exhibition', date: '2024-03-25', type: 'event' },
      { id: 3, title: 'Term End Exam', date: '2024-04-01', type: 'exam' },
    ],
    performance: {
      attendance: 95,
      meritPoints: 85,
      academicScore: 88,
      homeworkCompletion: 90,
      recentActivities: [
        { date: '2024-03-15', activity: 'Merit points awarded', points: 5 },
        { date: '2024-03-14', activity: 'Completed Math Assignment', points: 3 },
        { date: '2024-03-13', activity: 'Won Science Quiz', points: 8 },
      ]
    }
  },
  2: {
    notifications: [
      { id: 4, type: 'academic', message: 'Outstanding performance in English', date: '2024-03-15', priority: 'high' },
      { id: 5, type: 'attendance', message: 'Perfect attendance this month', date: '2024-03-14', priority: 'low' },
    ],
    upcomingEvents: [
      { id: 4, title: 'Annual Sports Day', date: '2024-03-22', type: 'event' },
      { id: 5, title: 'Class Test', date: '2024-03-28', type: 'exam' },
    ],
    performance: {
      attendance: 98,
      meritPoints: 90,
      academicScore: 92,
      homeworkCompletion: 95,
      recentActivities: [
        { date: '2024-03-15', activity: 'Won Essay Competition', points: 10 },
        { date: '2024-03-13', activity: 'Helped organize event', points: 5 },
      ]
    }
  }
};

// Performance Distribution Data
const PERFORMANCE_DISTRIBUTION = [
  { name: 'Academics', value: 40 },
  { name: 'Extra-Curricular', value: 25 },
  { name: 'Discipline', value: 20 },
  { name: 'Attendance', value: 15 }
];

const COLORS = ['#800000', '#A52A2A', '#B22222', '#8B0000'];

// Card Component
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-md ${className}`}>
    {children}
  </div>
);

// Quick Stats Card
const QuickStats = ({ data }) => (
  <Card className="p-6">
    <h3 className="text-lg font-semibold mb-4">Performance Overview</h3>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div>
        <p className="text-sm text-gray-600">Attendance</p>
        <p className="text-2xl font-bold">{data.attendance}%</p>
      </div>
      <div>
        <p className="text-sm text-gray-600">Merit Points</p>
        <p className="text-2xl font-bold text-green-600">{data.meritPoints}</p>
      </div>
      <div>
        <p className="text-sm text-gray-600">Academic Score</p>
        <p className="text-2xl font-bold text-[#800000]">{data.academicScore}%</p>
      </div>
      <div>
        <p className="text-sm text-gray-600">Homework</p>
        <p className="text-2xl font-bold text-blue-600">{data.homeworkCompletion}%</p>
      </div>
    </div>
  </Card>
);

// Notifications Card
const NotificationsCard = ({ notifications }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Notifications</h3>
      <div className="space-y-4">
        {notifications.map(notification => (
          <div key={notification.id} className="flex items-start gap-3 border-b pb-3">
            <div className={`mt-1 w-2 h-2 rounded-full ${getPriorityColor(notification.priority)}`} />
            <div>
              <p className="text-gray-800">{notification.message}</p>
              <p className="text-sm text-gray-500">{new Date(notification.date).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

// Upcoming Events Card
const UpcomingEventsCard = ({ events }) => {
  const getEventIcon = (type) => {
    switch (type) {
      case 'exam': return '📝';
      case 'meeting': return '👥';
      case 'event': return '🎯';
      default: return '📅';
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
      <div className="space-y-4">
        {events.map(event => (
          <div key={event.id} className="flex items-center gap-3 border-b pb-3">
            <span className="text-2xl">{getEventIcon(event.type)}</span>
            <div>
              <p className="font-medium">{event.title}</p>
              <p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

// Recent Activities Card
const RecentActivitiesCard = ({ activities }) => (
  <Card className="p-6">
    <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div key={index} className="flex justify-between items-start border-b pb-3">
          <div>
            <p className="font-medium">{activity.activity}</p>
            <p className="text-sm text-gray-500">{new Date(activity.date).toLocaleDateString()}</p>
          </div>
          <span className="text-green-600 font-medium">+{activity.points} points</span>
        </div>
      ))}
    </div>
  </Card>
);

// Performance Distribution Chart
const PerformanceDistribution = () => (
  <Card className="p-6">
    <h3 className="text-lg font-semibold mb-4">Performance Distribution</h3>
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={PERFORMANCE_DISTRIBUTION}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
          label
        >
          {PERFORMANCE_DISTRIBUTION.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </Card>
);

// Main Overview Component
const OverviewTab = ({ viewMode, selectedChild }) => {
  if (viewMode === 'consolidated') {
    return (
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(OVERVIEW_DATA).map(([childId, data]) => (
            <Card key={childId} className="p-6">
              <h3 className="text-lg font-semibold mb-4">Child {childId}'s Overview</h3>
              <QuickStats data={data.performance} />
              <div className="mt-4 space-y-4">
                {data.notifications.slice(0, 2).map(notification => (
                  <div key={notification.id} className="text-sm text-gray-600">
                    {notification.message}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* Performance Distribution */}
        <PerformanceDistribution />

        {/* Combined Upcoming Events */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Family Calendar</h3>
          <div className="space-y-4">
            {Object.values(OVERVIEW_DATA)
              .flatMap(data => data.upcomingEvents)
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .slice(0, 5)
              .map(event => (
                <div key={event.id} className="flex justify-between items-center border-b pb-3">
                  <div>
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
                  </div>
                  <span className="text-sm text-gray-600">Child {event.id <= 3 ? '1' : '2'}</span>
                </div>
              ))}
          </div>
        </Card>
      </div>
    );
  }

  // Individual Child View
  const childData = OVERVIEW_DATA[selectedChild];

  return (
    <div className="space-y-6">
      {/* Performance Stats */}
      <QuickStats data={childData.performance} />

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NotificationsCard notifications={childData.notifications} />
        <UpcomingEventsCard events={childData.upcomingEvents} />
      </div>

      {/* Recent Activities and Performance Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RecentActivitiesCard activities={childData.performance.recentActivities} />
        <PerformanceDistribution />
      </div>
    </div>
  );
};

export default OverviewTab;