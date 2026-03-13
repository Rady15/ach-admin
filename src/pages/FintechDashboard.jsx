import React, { useState, useEffect, useMemo } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import GlassPanel from '../components/common/GlassPanel';
import StatCard from '../components/common/StatCard';
import StatusBadge from '../components/common/StatusBadge';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useData } from '../contexts/DataContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const FintechDashboard = () => {
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const { orders, customers, employees, stats, loading } = useData();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter data
  const filteredOrders = useMemo(() => {
    return orders.filter(order =>
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5);
  }, [orders, searchQuery]);

  const filteredCustomers = useMemo(() => {
    return customers
      .filter(customer => customer.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 5);
  }, [customers, searchQuery]);

  // Status distribution for doughnut chart
  const statusCounts = useMemo(() => {
    const counts = {};
    orders.forEach(order => {
      const status = order.status || 'unknown';
      counts[status] = (counts[status] || 0) + 1;
    });
    return counts;
  }, [orders]);

  // Revenue trend (last 7 days)
  const revenueTrend = useMemo(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const trendData = Array(7).fill(0);
    orders.forEach(order => {
      const orderDate = new Date(order.date);
      if (orderDate >= sevenDaysAgo && ['completed', 'paid'].includes(order.status)) {
        const dayIndex = Math.floor((orderDate - sevenDaysAgo) / (1000 * 60 * 60 * 24));
        trendData[dayIndex] += Number(order.price || 0);
      }
    });
    return trendData;
  }, [orders]);

  // Chart data
  const revenueChartData = {
    labels: ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'],
    datasets: [{
      label: t('revenue'),
      data: revenueTrend,
      borderColor: 'rgba(34, 197, 94, 1)',
      backgroundColor: 'rgba(34, 197, 94, 0.2)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: 'rgba(34, 197, 94, 1)',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 6,
      pointHoverRadius: 8,
    }]
  };

  const statusChartData = {
    labels: Object.keys(statusCounts),
    datasets: [{
      data: Object.values(statusCounts),
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',  // completed/success
        'rgba(99, 102, 241, 0.8)', // paid/info
        'rgba(245, 158, 11, 0.8)', // pending/warning
        'rgba(239, 68, 68, 0.8)',  // cancelled/danger
        'rgba(168, 85, 247, 0.8)', // waitingforpayment/purple
        'rgba(156, 163, 175, 0.8)', // others
      ],
      borderColor: [
        'rgba(34, 197, 94, 1)',
        'rgba(99, 102, 241, 1)',
        'rgba(245, 158, 11, 1)',
        'rgba(239, 68, 68, 1)',
        'rgba(168, 85, 247, 1)',
        'rgba(156, 163, 175, 1)',
      ],
      borderWidth: 2,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true,
              color: isDark ? 'rgba(255,255,255,0.9)' : 'rgba(31,41,55,0.9)',
              font: { size: 12, family: 'Inter, -apple-system, BlinkMacSystemFont' }
            }
          },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.9)',
        titleColor: 'white',
        bodyColor: 'rgba(255,255,255,0.9)',
        borderColor: 'rgba(255,255,255,0.2)',
        cornerRadius: 12,
        padding: 12
      }
    },
    scales: {
      y: {
        grid: { color: 'rgba(255,255,255,0.1)' },
        ticks: { 
          color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(55,65,81,0.9)',
          font: { size: 12, family: 'Inter, -apple-system, BlinkMacSystemFont' },
          callback: function(value) {
            return value.toLocaleString() + ' ر.س';
          }
        }
      },
      x: {
        grid: { color: 'transparent' },
        ticks: { color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(55,65,81,0.9)', font: { size: 12, family: 'Inter, -apple-system, BlinkMacSystemFont' } }
      }
    }
  };

  const statusChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 20,
          usePointStyle: true,
          color: isDark ? 'rgba(255,255,255,0.9)' : 'rgba(31,41,55,0.9)',
          font: { size: 12, family: 'Inter, -apple-system, BlinkMacSystemFont' }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.9)',
        titleColor: 'white',
        bodyColor: 'rgba(255,255,255,0.9)',
        borderColor: 'rgba(255,255,255,0.2)',
        cornerRadius: 12,
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          }
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">جاري التحميل...</div>
      </div>
    );
  }

  return (
<div className="min-h-screen p-6 lg:p-12 space-y-8 ">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <p className="text-xl text-slate-300 font-medium">
            نظرة عامة شاملة على الأداء والطلبات والعملاء
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="إجمالي الطلبات"
          value={stats.totalOrders.toLocaleString()}
          trend="up"
          trendValue="12%"
          icon="receipt_long"
          color="primary"
        />
        <StatCard
          title="الطلبات النشطة"
          value={stats.activeOrders.toLocaleString()}
          trend="up"
          trendValue="5%"
          icon="pending_actions"
          color="warning"
        />
        <StatCard
          title="الإيرادات الإجمالية"
          value={`${stats.totalRevenue.toLocaleString()} ر.س`}
          trend="up"
          trendValue="18%"
          icon="account_balance"
          color="success"
        />
        {/* Removed new customers card as requested */}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
       
        {/* <GlassPanel className="p-8 lg:col-span-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">إيرادات الأسبوع</h2>
            <StatusBadge status="success" className="!text-xs">
              +18% من الأسبوع الماضي
            </StatusBadge>
          </div>
          <div className="h-80 lg:h-96">
            <Line data={revenueChartData} options={chartOptions} />
          </div>
        </GlassPanel> */}

      
        <GlassPanel className="p-8 lg:col-span-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">توزيع حالة الطلبات</h2>
            <span className="text-sm text-slate-400">{orders.length} طلب إجمالي</span>
          </div>
          <div className="h-80 lg:h-96">
            <Doughnut data={statusChartData} options={statusChartOptions} />
          </div>
        </GlassPanel>
      </div>

      {/* Recent Orders */}
      {/* <GlassPanel className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="material-symbols-outlined text-3xl text-primary">receipt_long</span>
            أحدث الطلبات
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-400">{filteredOrders.length} من {orders.length}</span>
            <button className="px-4 py-2 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl text-sm font-medium hover:shadow-glow-primary transition-all whitespace-nowrap">
              عرض الكل
            </button>
          </div>
        </div>
        
        <div className="space-y-3">
          {filteredOrders.map((order, idx) => (
            <div key={order.id || idx} className="group flex items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-white/5 to-white/2 hover:from-white/10 hover:to-white/5 border border-white/10 hover:border-primary/30 transition-all duration-300 cursor-pointer hover:shadow-glow-primary">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-info rounded-2xl flex items-center justify-center shadow-lg text-white font-bold text-sm">
                  {order.id.slice(-3)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-white truncate text-lg">{order.customer}</p>
                  <p className="text-sm text-slate-400 truncate">{t(order.service)}</p>
                </div>
                <StatusBadge status={order.status} className="px-3 py-1 text-xs !font-bold min-w-[80px] justify-center">
                  {t(order.status)}
                </StatusBadge>
              </div>
              <div className="text-right ml-4">
                <p className="font-bold text-xl text-success font-numbers">
                  {Number(order.price).toLocaleString()} <span className="text-xs">ر.س</span>
                </p>
                <p className="text-xs text-slate-500">{order.date}</p>
              </div>
            </div>
          ))}
          {filteredOrders.length === 0 && (
            <div className="text-center py-16 text-slate-400">
              <span className="material-symbols-outlined text-6xl block mb-4 opacity-50">receipt_long</span>
              <p>لا توجد طلبات مطابقة للبحث</p>
            </div>
          )}
        </div>
      </GlassPanel> */}

      {/* Employees & Customers Grid */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GlassPanel className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">أفضل الموظفين</h2>
            <span className="text-sm text-slate-400">{employees.length} موظف</span>
          </div>
          <div className="space-y-4">
            {employees.slice(0, 4).map((emp, idx) => (
              <div key={emp.id || idx} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-info to-primary rounded-2xl flex items-center justify-center shadow-lg text-white font-bold text-sm">
                    {emp.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-white truncate">{emp.name}</p>
                    <p className="text-xs text-slate-400 capitalize">{emp.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-success text-lg font-numbers">{emp.completedTasks || 0}</p>
                  <p className="text-xs text-slate-500">مهام مكتملة</p>
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">عملاء جدد</h2>
            <span className="text-sm text-slate-400">{filteredCustomers.length} عميل</span>
          </div>
          <div className="space-y-4">
            {filteredCustomers.map((cust, idx) => (
              <div key={cust.id || idx} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg text-white font-bold text-sm">
                    {cust.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-white truncate">{cust.name}</p>
                    <p className="text-xs text-slate-400">{cust.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-success text-lg font-numbers">{cust.ordersCount || 0}</p>
                  <p className="text-xs text-slate-500">طلبات</p>
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div> */}

      {/* Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassPanel className="p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-success to-success-dark rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-success/25">
            <span className="material-symbols-outlined text-3xl text-white font-bold">check_circle</span>
          </div>
          <h3 className="text-3xl font-black text-white mb-2 font-numbers">{orders.filter(o => o.status === 'completed').length}</h3>
          <p className="text-xl text-success font-bold mb-1">طلب مكتمل</p>
          <p className="text-sm text-slate-400">هذا الأسبوع</p>
        </GlassPanel>

        <GlassPanel className="p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-warning to-warning-dark rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-warning/25">
            <span className="material-symbols-outlined text-3xl text-white font-bold">schedule</span>
          </div>
          <h3 className="text-3xl font-black text-white mb-2 font-numbers">{stats.activeOrders}</h3>
          <p className="text-xl text-warning font-bold mb-1">طلب نشط</p>
          <p className="text-sm text-slate-400">قيد المراجعة</p>
        </GlassPanel>

        <GlassPanel className="p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-dark rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-primary/25">
            <span className="material-symbols-outlined text-3xl text-white font-bold">trending_up</span>
          </div>
          <h3 className="text-3xl font-black text-white mb-2 font-numbers">
            +{Math.round(stats.totalRevenue * 0.12).toLocaleString()}
          </h3>
          <p className="text-xl text-primary font-bold mb-1">نمو الإيرادات</p>
          <p className="text-sm text-slate-400">مقارنة بالشهر الماضي</p>
        </GlassPanel>
      </div>
    </div>
  );
};

export default FintechDashboard;

