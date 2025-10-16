const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// GET ALL USERS (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN")
      return res.status(403).json({ error: "Only admins can view users" });

    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    });

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
