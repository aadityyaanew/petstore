import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/lib/models/Order';
import Product from '@/lib/models/Product';
import User from '@/lib/models/User';
import { requireAdmin } from '@/lib/auth';

export async function GET(request) {
  try {
    await connectDB();
    await requireAdmin(request);

    // 1. Total counts
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    // 2. Total Revenue (only paid)
    const revenueResult = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // 3. Sales Data (Last 30 days revenue)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    // Fill in 30 days with 0s so chart doesn't break
    const dateMap = {};
    for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateString = d.toISOString().split('T')[0];
        dateMap[dateString] = 0;
    }

    const salesDataRaw = await Order.aggregate([
      { $match: { paymentStatus: 'paid', createdAt: { $gte: thirtyDaysAgo } } },
      { 
        $group: { 
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          amount: { $sum: "$totalPrice" }
        } 
      },
      { $sort: { "_id": 1 } }
    ]);
    
    salesDataRaw.forEach(item => {
        dateMap[item._id] = item.amount;
    });
    
    const salesData = Object.keys(dateMap).map(date => ({ date, amount: dateMap[date] })).sort((a,b) => new Date(a.date) - new Date(b.date));

    // 4. Order Status Distribution
    const statusDataRaw = await Order.aggregate([
      { $group: { _id: "$status", value: { $sum: 1 } } }
    ]);
    const statusData = statusDataRaw.map(item => ({ name: item._id, value: item.value }));

    // 5. New Users Data (Last 30 days)
    const userDateMap = {};
    for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateString = d.toISOString().split('T')[0];
        userDateMap[dateString] = 0;
    }

    const usersDataRaw = await User.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      { 
        $group: { 
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          users: { $sum: 1 }
        } 
      },
      { $sort: { "_id": 1 } }
    ]);

    usersDataRaw.forEach(item => {
        userDateMap[item._id] = item.users;
    });

    const newUsersData = Object.keys(userDateMap).map(date => ({ date, users: userDateMap[date] })).sort((a,b) => new Date(a.date) - new Date(b.date));

    // 6. Top 5 Selling Products
    const topProductsRaw = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $unwind: "$items" },
      { 
        $group: { 
          _id: "$items.product",
          name: { $first: "$items.name" },
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
          quantity: { $sum: "$items.quantity" }
        } 
      },
      { $sort: { quantity: -1 } },
      { $limit: 5 }
    ]);

    // Format top products
    const topProducts = topProductsRaw.map(p => ({
        _id: p._id,
        name: p.name,
        revenue: Math.round(p.revenue * 100) / 100,
        quantity: p.quantity
    }));
    
    // 7. Recent Orders
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);
    
    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        salesData: salesData,
        statusData,
        newUsersData,
        topProducts,
        recentOrders
      }
    });

  } catch (error) {
    if (error instanceof Response) return error;
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
