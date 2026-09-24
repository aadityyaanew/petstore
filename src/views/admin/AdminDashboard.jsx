import { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, Alert } from '@mui/material';
import { Inventory, ShoppingCart, People, AttachMoney, TrendingUp, Warning } from '@mui/icons-material';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../../services/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AdminDashboard = () => {
  const [data, setData] = useState({
    users: 0,
    products: 0,
    orders: 0,
    revenue: 0,
    salesData: [],
    statusData: [],
    newUsersData: [],
    topProducts: [],
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);
  const [lowStockProducts, setLowStockProducts] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.getAnalyticsStats();
        if (res.data?.success) {
          const stats = res.data.data;
          setData({
            users: stats.totalUsers || 0,
            products: stats.totalProducts || 0,
            orders: stats.totalOrders || 0,
            revenue: stats.totalRevenue || 0,
            salesData: stats.salesData || [],
            statusData: stats.statusData || [],
            newUsersData: stats.newUsersData || [],
            topProducts: stats.topProducts || [],
            recentOrders: stats.recentOrders || []
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    // Fetch low stock products in parallel
    api.getLowStockProducts()
      .then((res) => setLowStockProducts(res.data || []))
      .catch((e) => console.error('Low stock fetch failed:', e.message));
  }, []);

  if (loading) {
    return <Box display="flex" justifyContent="center" alignItems="center" height="80vh"><CircularProgress size={60} thickness={4} /></Box>;
  }

  const statCards = [
    { title: 'Total Revenue', value: `₹${data.revenue.toFixed(2)}`, icon: <AttachMoney sx={{ fontSize: 36, color: '#fff' }} />, gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' },
    { title: 'Total Orders', value: data.orders, icon: <ShoppingCart sx={{ fontSize: 36, color: '#fff' }} />, gradient: 'linear-gradient(135deg, #2D9CDB 0%, #56CCF2 100%)' },
    { title: 'Total Products', value: data.products, icon: <Inventory sx={{ fontSize: 36, color: '#fff' }} />, gradient: 'linear-gradient(135deg, #F2994A 0%, #F2C94C 100%)' },
    { title: 'Total Users', value: data.users, icon: <People sx={{ fontSize: 36, color: '#fff' }} />, gradient: 'linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)' },
  ];

  return (
    <Box sx={{ pb: 6 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 5, gap: 2 }}>
        <TrendingUp color="primary" sx={{ fontSize: 40 }} />
        <Typography variant="h3" sx={{ fontWeight: 900, color: '#1a1a1a', letterSpacing: '-0.02em' }}>
          Analytics & Dashboard
        </Typography>
      </Box>
      
      {/* Stat Cards */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ 
              borderRadius: '24px', 
              background: card.gradient,
              color: 'white',
              boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
              position: 'relative',
              overflow: 'hidden',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              }
            }}>
              <Box sx={{ position: 'absolute', top: -20, right: -20, opacity: 0.1, transform: 'scale(3)' }}>
                {card.icon}
              </Box>
              <CardContent sx={{ p: '32px !important', zIndex: 1, position: 'relative' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, textTransform: 'uppercase', mb: 1, letterSpacing: '0.1em', opacity: 0.9 }}>
                  {card.title}
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 900 }}>
                  {card.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Low Stock Alert Panel */}
      {lowStockProducts.length > 0 && (
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <Warning sx={{ color: '#D97706', fontSize: 28 }} />
            <Typography variant="h6" sx={{ fontWeight: 800 }}>Low Stock Alerts</Typography>
            <Chip
              label={`${lowStockProducts.length} product${lowStockProducts.length > 1 ? 's' : ''} need restocking`}
              size="small"
              sx={{ bgcolor: '#FEF3C7', color: '#D97706', fontWeight: 700 }}
            />
          </Box>
          <Paper sx={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #FDE68A' }}>
            <TableContainer>
              <Table size="small">
                <TableHead sx={{ bgcolor: '#FFFBEB' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, color: '#92400E' }}>Product Name</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#92400E' }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#92400E' }}>Current Stock</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#92400E' }}>Alert Threshold</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#92400E' }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lowStockProducts.map((product) => (
                    <TableRow key={product._id} hover sx={{ '&:last-child td': { border: 0 } }}>
                      <TableCell sx={{ fontWeight: 600 }}>{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>
                        <Typography sx={{ fontWeight: 800, color: product.stock === 0 ? '#DC2626' : '#D97706' }}>
                          {product.stock}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ color: 'text.secondary' }}>≤ {product.lowStockThreshold ?? 5}</TableCell>
                      <TableCell>
                        {product.stock === 0 ? (
                          <Chip label="Out of Stock" size="small" sx={{ bgcolor: '#FEE2E2', color: '#DC2626', fontWeight: 700 }} />
                        ) : (
                          <Chip label="Low Stock" size="small" sx={{ bgcolor: '#FEF3C7', color: '#D97706', fontWeight: 700 }} />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      )}

      {/* Charts Section 1: Revenue & Order Status */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 4, borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', height: 450 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 4 }}>Revenue Trends (Last 30 Days)</Typography>
            <ResponsiveContainer width="100%" height="80%">
              {data.salesData.length > 0 ? (
                <AreaChart data={data.salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#11998e" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#11998e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tickMargin={10} 
                        tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, {month:'short', day:'numeric'})} />
                  <YAxis tickFormatter={(val) => `₹${val}`} axisLine={false} tickLine={false} tickMargin={10} width={80} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
                    formatter={(value) => [`₹${value.toFixed(2)}`, 'Revenue']}
                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#11998e" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              ) : (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                  <Typography color="text.secondary">No revenue data available.</Typography>
                </Box>
              )}
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 4, borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', height: 450, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>Order Status</Typography>
            <ResponsiveContainer width="100%" height="100%">
              {data.statusData.length > 0 ? (
                <PieChart>
                  <Pie
                    data={data.statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius="60%"
                    outerRadius="80%"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }} />
                </PieChart>
              ) : (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                  <Typography color="text.secondary">No orders yet.</Typography>
                </Box>
              )}
            </ResponsiveContainer>
            
            {/* Custom Legend */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center', mt: 2 }}>
              {data.statusData.map((entry, index) => (
                <Box key={entry.name} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: COLORS[index % COLORS.length] }} />
                  <Typography variant="body2" sx={{ textTransform: 'capitalize', fontWeight: 600 }}>{entry.name}</Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Analytics Section 2: User Growth */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={12}>
          <Paper sx={{ p: 4, borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', height: 400 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 4 }}>User Registrations (Last 30 Days)</Typography>
            <ResponsiveContainer width="100%" height="80%">
              {data.newUsersData.length > 0 ? (
                <AreaChart data={data.newUsersData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8E2DE2" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8E2DE2" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tickMargin={10} 
                         tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, {month:'short', day:'numeric'})} />
                  <YAxis axisLine={false} tickLine={false} tickMargin={10} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
                    formatter={(value) => [value, 'New Users']}
                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                  />
                  <Area type="monotone" dataKey="users" stroke="#8E2DE2" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                </AreaChart>
              ) : (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                  <Typography color="text.secondary">No user data available.</Typography>
                </Box>
              )}
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        {/* Top Products */}
        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 0, borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', height: '100%' }}>
            <Box sx={{ p: 4, pb: 2, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>Top Selling Products</Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Product Name</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">Qty Sold</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">Revenue</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.topProducts.map((product) => (
                    <TableRow key={product._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell sx={{ fontWeight: 500 }}>{product.name}</TableCell>
                      <TableCell align="right">
                        <Chip label={product.quantity} size="small" color="primary" variant="outlined" sx={{ fontWeight: 'bold' }} />
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: 'success.main' }}>
                        ₹{product.revenue.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                  {data.topProducts.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                        No products sold yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Recent Orders */}
        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 0, borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', height: '100%' }}>
            <Box sx={{ p: 4, pb: 2, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>Recent Orders</Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Order ID</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Customer</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Total</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.recentOrders.map((order) => (
                    <TableRow key={order._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell sx={{ fontFamily: 'monospace' }}>{order._id.substring(18)}</TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>{order.user?.name || 'Guest'}</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>₹{order.totalPrice.toFixed(2)}</TableCell>
                      <TableCell>
                        <Chip 
                          label={order.status} 
                          size="small"
                          sx={{ 
                            textTransform: 'capitalize', 
                            fontWeight: 700,
                            bgcolor: order.status === 'delivered' ? 'success.light' : 
                                     order.status === 'processing' ? 'warning.light' : 
                                     order.status === 'shipped' ? 'info.light' : 'grey.200',
                            color: order.status === 'delivered' ? 'success.dark' : 
                                   order.status === 'processing' ? 'warning.dark' : 
                                   order.status === 'shipped' ? 'info.dark' : 'text.primary',
                          }} 
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  {data.recentOrders.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                        No orders found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
