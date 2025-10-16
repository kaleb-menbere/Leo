const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAnalytics = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN")
      return res.status(403).json({ error: "Only admins can access analytics" });

    const totalUsers = await prisma.user.count();
    const totalOrders = await prisma.order.count();
    const orders = await prisma.order.findMany({ include: { dishes: true } });

    let totalRevenue = 0;
    const dishCount = {};

    orders.forEach(order => {
      totalRevenue += order.total;
      order.dishes.forEach(od => {
        dishCount[od.dishId] = (dishCount[od.dishId] || 0) + 1;
      });
    });

    // Find the most ordered dish
    let mostOrderedDish = null;
    let maxCount = 0;
    for (const dishId in dishCount) {
      if (dishCount[dishId] > maxCount) {
        maxCount = dishCount[dishId];
        mostOrderedDish = dishId;
      }
    }

    // Get dish name
    if (mostOrderedDish) {
      const dish = await prisma.dish.findUnique({ where: { id: parseInt(mostOrderedDish) } });
      mostOrderedDish = dish.name;
    }

    res.json({ totalUsers, totalOrders, mostOrderedDish, totalRevenue });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
