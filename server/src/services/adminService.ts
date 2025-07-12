import PetModel from "../models/petModel";
import ProductModel from "../models/productModel";
import UserModel from "../models/userModel";


export const adminService = {
    async getSummary(days: number = 7) {
        const now = new Date();
        const pastDate = new Date();
        pastDate.setDate(now.getDate() - days);

        // Tổng số user hiện tại
        const totalUsers = await UserModel.countDocuments({});

        // Số user mới trong n ngày
        const newUsers = await UserModel.countDocuments({
            createdAt: { $gte: pastDate },
        });
        const previousUsers = totalUsers - newUsers;
        const userChangePercent = previousUsers === 0 ? 100 : (newUsers / previousUsers) * 100;
        const userTrend = userChangePercent >= 0 ? "up" : "down";

        // Tổng số staff active
        const activeStaff = await UserModel.countDocuments({
            role: "staff",
            isActive: true,
        });

        // Số staff mới
        const newActiveStaff = await UserModel.countDocuments({
            role: "staff",
            isActive: true,
            createdAt: { $gte: pastDate },
        });
        const staffChange = newActiveStaff;
        const staffTrend = staffChange >= 0 ? "up" : "down";

        // Mock revenue
        const totalRevenue = 45231;
        const revenueChange = 18; // %
        const revenueTrend = revenueChange >= 0 ? "up" : "down";

        // Mock uptime
        const systemUptime = 99.9;
        const systemUptimeChange = -0.1;
        const uptimeTrend = systemUptimeChange >= 0 ? "up" : "down";

        return [
            {
                name: "Total Users",
                value: totalUsers.toLocaleString(),
                change: `${userChangePercent >= 0 ? "+" : ""}${userChangePercent.toFixed(1)}%`,
                trend: userTrend,
                color: userTrend === "up" ? "text-blue-600" : "text-red-600",
                bgColor: userTrend === "up" ? "bg-blue-50" : "bg-red-50",
            },
            {
                name: "Active Staff",
                value: activeStaff.toString(),
                change: `${staffChange >= 0 ? "+" : ""}${staffChange}`,
                trend: staffTrend,
                color: staffTrend === "up" ? "text-green-600" : "text-red-600",
                bgColor: staffTrend === "up" ? "bg-green-50" : "bg-red-50",
            },
            {
                name: "Total Revenue",
                value: `$${totalRevenue.toLocaleString()}`,

                change: `+${revenueChange}%`,
                trend: revenueTrend,
                color: "text-yellow-600",
                bgColor: "bg-yellow-50",
            },
            {
                name: "System Uptime",
                value: `${systemUptime}%`,
                change: `${systemUptimeChange >= 0 ? "+" : ""}${systemUptimeChange}%`,
                trend: uptimeTrend,
                color: uptimeTrend === "up" ? "text-green-600" : "text-red-600",
                bgColor: uptimeTrend === "up" ? "bg-green-50" : "bg-red-50",
            },
        ];
    },
    async getBussinessMetric(days: number = 1) {
        const now = new Date();
        // ==== PRODUCTS ====
        const totalProducts = await ProductModel.countDocuments();
        const productCompareDate = new Date(now);
        productCompareDate.setDate(productCompareDate.getDate() - days);

        const oldProductCount = await ProductModel.countDocuments({
            createdAt: { $lt: productCompareDate },
        });
        const productDelta = totalProducts - oldProductCount;
        const productChange =
            oldProductCount === 0 ? 100 : (productDelta / oldProductCount) * 100;
        const productTrend = productChange >= 0 ? "up" : "down";

        // ==== PETS ====
        const totalPets = await PetModel.countDocuments();
        const oldPetCount = await PetModel.countDocuments({
            createdAt: { $lt: productCompareDate },
        });

        const petDelta = totalPets - oldPetCount;
        const petChange =
            oldPetCount === 0 ? 100 : (petDelta / oldPetCount) * 100;
        const petTrend = petChange >= 0 ? "up" : "down";

        // ==== ORDERS ====
        //   const startOfToday = new Date();
        //   startOfToday.setHours(0, 0, 0, 0);

        //   const previousStart = new Date(startOfToday);
        //   previousStart.setDate(previousStart.getDate() - days);

        //   const ordersCurrent = await Order.countDocuments({
        //     createdAt: { $gte: startOfToday },
        //   });

        //   const ordersPrevious = await Order.countDocuments({
        //     createdAt: { $gte: previousStart, $lt: startOfToday },
        //   });

        //   const orderDelta = ordersCurrent - ordersPrevious;
        //   const orderChange =
        //     ordersPrevious === 0 ? 100 : (orderDelta / ordersPrevious) * 100;
        //   const orderTrend = orderChange >= 0 ? "up" : "down";

        return [
            {
                name: "Products",
                value: totalProducts.toLocaleString(),
                change: `${productChange >= 0 ? "+" : ""}${productChange.toFixed(1)}%`,
                trend: productTrend,
            },
            {
                name: "Pets Registered",
                value: totalPets.toLocaleString(),
                change: `${petChange >= 0 ? "+" : ""}${petChange.toFixed(1)}%`,
                trend: petTrend,
            },
            {
                name: "Orders Today",
                value: 89,
                change: 2.3,
                trend: "down",
            },
        ];
    },
     async getUserStats() {
    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - 7);
    startOfWeek.setHours(0, 0, 0, 0);

    const activeToday = await UserModel.countDocuments({
      lastLogin: { $gte: startOfToday },
    });

    const newThisWeek = await UserModel.countDocuments({
      createdAt: { $gte: startOfWeek },
    });

    const suspended = await UserModel.countDocuments({
      isActive: false,
    });
    return [
      { label: "Active Today", value: activeToday, color: "bg-green-500" },
      { label: "New This Week", value: newThisWeek, color: "bg-blue-500" },
      { label: "Suspended", value: suspended, color: "bg-red-500" },
    ];
  },
};

