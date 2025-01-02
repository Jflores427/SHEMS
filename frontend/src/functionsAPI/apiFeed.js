import api from "./api";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "June",
  "July",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];
export const monthMap = new Map();
for (let i = 1; i <= 12; i++) {
  monthMap.set(i, months[i - 1]);
}

export const getServiceLocations = async (cID) => {
  try {
    const response = await api.get("/getServiceLocation", {
      params: { cID: cID },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const getTotalEnrolledDevices = async (cID) => {
  try {
    const response = await api.get("/getTotalEnrolledDeviceByCID", {
      params: { cID: cID },
    });
    return response.data.totalEnrolledDevice;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const getTotalMonthlyCostByCID = async (cID) => {
  try {
    const response = await api.get("/getMonthlyCostByCID", {
      params: { cID: cID },
    });
    const lastIndex = response.data.length - 1;
    const month = monthMap.get(response.data[lastIndex].Month);
    const year = response.data[lastIndex].Year;
    const sID = response.data[lastIndex].sID;
    const cost = parseFloat(response.data[lastIndex].totalCost).toFixed(2);
    return { month, year, sID, cost };
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const getTotalMonthlyUsageByCID = async (cID) => {
  try {
    const response = await api.get("/getMonthlyUsageByCID", {
      params: { cID: cID },
    });
    const lastIndex = response.data.length - 1;
    const month = monthMap.get(response.data[lastIndex].Month);
    const year = response.data[lastIndex].Year;
    const sID = response.data[lastIndex].sID;
    const usage = parseFloat(response.data[lastIndex].totalUsage);
    return { month, year, sID, usage };
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Chart export consts~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export const getDailyUsageBySID = async (dailyUsageBySID) => {
  // sID, Month(MM), Year(YYYY)
  try {
    const response = await api.get("/getDailyUsageBySID", {
      params: dailyUsageBySID,
    });
    const data = response.data;
    let dataTransformed = data.map((data) => [
      data.Day,
      parseFloat(data.totalUsage),
    ]);
    dataTransformed = [["Day", "Usage (kW)"], ...dataTransformed];
    return dataTransformed;
  } catch (error) {
    throw new Error(error.response?.data?.response || error.message);
  }
};

export const getDailyMetricsBySID = async (dailyMetricsBySID) => {
  // sID, Month(MM), Year(YYYY)
  try {
    const response = await api.get("/getDailyMetricsBySID", {
      params: dailyMetricsBySID,
    });
    const data = response.data;
    let dataTransformed = data.map((data) => [
      data.Day,
      parseFloat(data.totalUsage),
      parseFloat(parseFloat(data.totalCost).toFixed(2)),
    ]);
    dataTransformed = [["Day", "Usage (kW)", "Cost ($)"], ...dataTransformed];
    return dataTransformed;
  } catch (error) {
    throw new Error(error.response?.data?.response || error.message);
  }
};

export const getMonthlyUsageBySID = async (monthlyUsageBySID) => {
  // Year(YYYY), sID

  try {
    const response = await api.get("/getMonthlyUsageBySID", {
      params: monthlyUsageBySID,
    });
    const data = response.data;
    let dataTransformed = data.map((data) => [
      monthMap.get(data.Month),
      parseFloat(data.totalUsage),
    ]);
    dataTransformed = [["Month", "Usage (kW)"], ...dataTransformed];
    return dataTransformed;
  } catch (error) {
    throw new Error(error.response?.data?.response || error.message);
  }
};

export const getMonthlyMetricsBySID = async (monthlyMetricsBySID) => {
  // Year(YYYY), sID

  try {
    const response = await api.get("/getMonthlyMetricsBySID", {
      params: monthlyMetricsBySID,
    });
    const data = response.data;
    let dataTransformed = data.map((data) => [
      monthMap.get(data.Month),
      parseFloat(data.totalUsage),
      parseFloat(parseFloat(data.totalCost).toFixed(2)),
    ]);
    dataTransformed = [["Month", "Usage (kW)", "Cost ($)"], ...dataTransformed];
    return dataTransformed;
  } catch (error) {
    throw new Error(error.response?.data?.response || error.message);
  }
};

export const getYearlyUsageBySID = async (yearlyUsageBySID) => {
  // sID
  try {
    const response = await api.get("/getYearlyUsageBySID", {
      params: yearlyUsageBySID,
    });
    const data = response.data;
    let dataTransformed = data.map((data) => [
      data.Year.toString(),
      parseFloat(data.totalUsage),
    ]);
    dataTransformed = [["Year", "Usage (kW)"], ...dataTransformed];
    return dataTransformed;
  } catch (error) {
    throw new Error(error.response?.data?.response || error.message);
  }
};

export const getYearlyMetricsBySID = async (yearlyMetricsBySID) => {
  // sID
  try {
    const response = await api.get("/getYearlyMetricsBySID", {
      params: yearlyMetricsBySID,
    });
    const data = response.data;
    let dataTransformed = data.map((data) => [
      data.Year.toString(),
      parseFloat(data.totalUsage),
      parseFloat(parseFloat(data.totalCost).toFixed(2)),
    ]);
    dataTransformed = [["Year", "Usage (kW)", "Cost ($)"], ...dataTransformed];
    return dataTransformed;
  } catch (error) {
    throw new Error(error.response?.data?.response || error.message);
  }
};

export const getMonthlyCostByCID = async (cID) => {
  try {
    const response = await api.get("/getMonthlyCostByCID", {
      params: { cID: cID },
    });
    const data = response.data;
    let dataTransformed = data.map((data) => [
      monthMap.get(data.Month) +
        " " +
        data.Year,
      parseFloat(parseFloat(data.totalCost).toFixed(2)),
    ]);

    dataTransformed = [["Month/Year", "Cost ($)"], ...dataTransformed];
    return dataTransformed;
  } catch (error) {
    throw new Error(error.response?.data?.response || error.message);
  }
};

export const getMonthlyUsageByCID = async (cID) => {
  try {
    const response = await api.get("/getMonthlyUsageByCID", {
      params: { cID: cID },
    });
    const data = response.data;
    let dataTransformed = data.map((data) => [
      monthMap.get(data.Month) +
        " " +
        data.Year,
      parseFloat(data.totalUsage),
    ]);
    dataTransformed = [["Month/Year", "Usage (kW)"], ...dataTransformed];
    return dataTransformed;
  } catch (error) {
    throw new Error(error.response?.data?.response || error.message);
  }
};

export const getEnergyUseMonthsByYearAndSID = async (paramsPayload) => {
  // sID, Year(YYYY)
  try {
    const response = await api.get("/getEnergyUseMonthsByYearAndSID", {
      params: paramsPayload,
    });
    const data = response.data;
    return data;

  } catch (error) {
    throw new Error(error.response?.data?.response || error.message);
  }
};

export const getEnergyUseYearsBySID = async (paramsPayload) => {
  // sID, Month(MM), Year(YYYY)
  try {
    const response = await api.get("/getEnergyUseYearsBySID", {
      params: paramsPayload,
    });
    const data = response.data;
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.response || error.message);
  }
};
