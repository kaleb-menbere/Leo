// controllers/dishController.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create a new dish (restaurant only)
exports.createDish = async (req, res) => {
  try {
    const { name, price, category, video_url } = req.body;
    const userId = req.user.userId; // from JWT

    const dish = await prisma.dish.create({
      data: {
        name,
        price: parseFloat(price),
        category,
        video_url,
        restaurantId: userId
      },
    });

    res.json({ message: "Dish created successfully", dish });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all dishes (for any user)
exports.getAllDishes = async (req, res) => {
  try {
    const dishes = await prisma.dish.findMany({
      include: { restaurant: { select: { name: true, email: true } } },
    });
    res.json(dishes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
