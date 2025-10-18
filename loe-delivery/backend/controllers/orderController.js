const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// 🟢 CREATE ORDER (Customer)
exports.createOrder = async (req, res) => {
  try {
    if (req.user.role !== "CUSTOMER") {
      return res.status(403).json({ error: "Only customers can create orders" });
    }

    const { dishes } = req.body; // expects [{ dishId: 1, quantity: 2 }, { dishId: 2, quantity: 1 }]
    if (!dishes || !Array.isArray(dishes) || dishes.length === 0) {
      return res.status(400).json({ error: "dishes must be a non-empty array" });
    }

    // Fetch dishes to calculate total
    const dishIds = dishes.map((d) => d.dishId);
    const foundDishes = await prisma.dish.findMany({
      where: { id: { in: dishIds } },
    });

    if (foundDishes.length !== dishIds.length) {
      return res.status(404).json({ error: "One or more dishes not found" });
    }

    const total = dishes.reduce((sum, item) => {
      const dish = foundDishes.find((d) => d.id === item.dishId);
      return sum + dish.price * (item.quantity || 1);
    }, 0);

    // Create order
    const order = await prisma.order.create({
      data: {
        customerId: req.user.userId,
        total,
      },
    });

    // Link dishes to the order
    const orderDishData = dishes.map((item) => ({
      orderId: order.id,
      dishId: item.dishId,
    }));

    await prisma.orderDish.createMany({ data: orderDishData });

    res.json({
      message: "Order created successfully",
      orderId: order.id,
      total,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// 🟢 GET ORDERS (role-based)
exports.getOrders = async (req, res) => {
  try {
    const { role, userId } = req.user;
    let orders;

    if (role === "ADMIN") {
      // Admin can see all orders
      orders = await prisma.order.findMany({
        include: {
          customer: { select: { name: true, email: true } },
          dishes: { include: { dish: true } },
        },
        orderBy: { createdAt: "desc" },
      });
    } else if (role === "RESTAURANT") {
      // Restaurant sees only orders that include their dishes
      orders = await prisma.order.findMany({
        where: {
          dishes: {
            some: {
              dish: { restaurantId: userId },
            },
          },
        },
        include: {
          customer: { select: { name: true, email: true } },
          dishes: { include: { dish: true } },
        },
        orderBy: { createdAt: "desc" },
      });
    } else if (role === "CUSTOMER") {
      // Customer sees only their orders
      orders = await prisma.order.findMany({
        where: { customerId: userId },
        include: {
          dishes: { include: { dish: true } },
        },
        orderBy: { createdAt: "desc" },
      });
    }

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// 🟢 UPDATE ORDER STATUS (Restaurant)
exports.updateOrderStatus = async (req, res) => {
  try {
    if (req.user.role !== "RESTAURANT") {
      return res.status(403).json({ error: "Only restaurants can update order status" });
    }

    const { id } = req.params;
    const { status } = req.body;
    const allowedStatuses = ["pending", "accepted", "delivered"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    // Check order exists and belongs to restaurant’s dishes
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: {
        dishes: { include: { dish: true } },
      },
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Ensure this restaurant owns at least one dish in the order
    const ownsDish = order.dishes.some(
      (od) => od.dish.restaurantId === req.user.userId
    );

    if (!ownsDish) {
      return res.status(403).json({
        error: "You cannot update orders that do not include your dishes",
      });
    }

    // Enforce sequential transitions: pending -> accepted -> delivered
    const current = order.status;
    const isValidTransition =
      (current === "pending" && status === "accepted") ||
      (current === "accepted" && status === "delivered");

    if (!isValidTransition) {
      return res.status(400).json({ error: `Invalid transition from '${current}' to '${status}'` });
    }

    const updated = await prisma.order.update({
      where: { id: parseInt(id) },
      data: { status },
      include: { dishes: { include: { dish: true } }, customer: { select: { name: true, email: true } } }
    });

    res.json({ message: `Order status updated to ${status}`, order: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
