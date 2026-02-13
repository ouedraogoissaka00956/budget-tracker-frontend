import api from './api';

const reportService = {
  getMonthlyReport: async (year, month) => {
    const params = new URLSearchParams();
    if (year) params.append('year', year);
    if (month) params.append('month', month);
    
    const response = await api.get(`/reports/monthly?${params}`);
    return response.data;
  },

  getYearlyReport: async (year) => {
    const params = new URLSearchParams();
    if (year) params.append('year', year);
    
    const response = await api.get(`/reports/yearly?${params}`);
    return response.data;
  },

  getComparisonReport: async (startDate1, endDate1, startDate2, endDate2) => {
    const params = new URLSearchParams({
      startDate1,
      endDate1,
      startDate2,
      endDate2
    });
    
    const response = await api.get(`/reports/comparison?${params}`);
    return response.data;
  },
};

export default reportService;