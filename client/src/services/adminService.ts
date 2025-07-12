import API from "@/lib/axios";


export const getAllSummary = async (days: number) => {
  try {
    const res = await API.get("/admin/summaryAll", {
      params: { days },
    });
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch summary:", error);
    throw error;
  }
};

export const getBussinessMetric = async (days: number) => {
  try {
    const res = await API.get("/admin/business-metrics", {
      params: { days },
    });
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch summary:", error);
    throw error;
  }
};

export const getUserStatistics = async () => {
  try {
    const res = await API.get("/admin/user-statistics");
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch summary:", error);
    throw error;
  }
};
