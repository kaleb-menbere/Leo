const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// CREATE ORDER
exports.createOrder = async (req, res) => {
  try {
    if (req.user.role !== "CUSTOMER")
      return res.status(403).json({ error: "Only customers can create orders" });

    const { dishIds } = req.body;
    if (!dishIds || !Array.isArray(dishIds) || dishIds.length === 0)
      return res.status(400).json({ error: "dishIds must be a non-empty array" });

    // fetch dishes and calculate total
    const dishes = await prisma.dish.findMany({
      where: { id: { in: dishIds } }
    });

    if (dishes.length !== dishIds.length)
      return res.status(404).json({ error: "One or more dishes not found" });

    const total = dishes.reduce((sum, dish) => sum + dish.price, 0);

    // create order
    const order = await prisma.order.create({
      data: {
        customerId: req.user.userId,
        total,
      },
    });

    // link dishes to order
    const orderDishData = dishes.map(dish => ({
      orderId: order.id,
      dishId: dish.id
    }));

    await prisma.orderDish.createMany({ data: orderDishData });

    res.json({ message: "Order created successfully", orderId: order.id, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// GET CUSTOMER ORDERS
exports.getCustomerOrders = async (req, res) => {
  try {
    if (req.user.role !== "CUSTOMER")
      return res.status(403).json({ error: "Only customers can view their orders" });

    const orders = await prisma.order.findMany({
      where: { customerId: req.user.userId },
      include: {
        dishes: { include: { dish: true } }
      },
      orderBy: { createdAt: "desc" }
    });

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// UPDATE ORDER STATUS (RESTAURANT)
exports.updateOrderStatus = async (req, res) => {
  try {
    if (req.user.role !== "RESTAURANT")
      return res.status(403).json({ error: "Only restaurants can update order status" });

    const { id } = req.params;
    const { status } = req.body;
    const allowedStatuses = ["pending", "accepted", "delivered"];

    if (!allowedStatuses.includes(status))
      return res.status(400).json({ error: "Invalid status" });

    // check if order exists
    const order = await prisma.order.findUnique({ where: { id: parseInt(id) } });
    if (!order) return res.status(404).json({ error: "Order not found" });

    await prisma.order.update({
      where: { id: parseInt(id) },
      data: { status }
    });

    res.json({ message: `Order status updated to ${status}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
