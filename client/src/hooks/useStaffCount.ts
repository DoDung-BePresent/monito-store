import { useState, useEffect, useCallback } from 'react';
import { staffService } from '@/services/staffService';

export const useStaffCount = () => {
  const [totalCount, setTotalCount] = useState<number>(0);
  const [activeCount, setActiveCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchStaffCounts = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch just the first page to get pagination info with total count
      const allStaffResponse = await staffService.getStaffs({ 
        page: 1, 
        limit: 1
      });
      
      // Fetch active staff count
      const activeStaffResponse = await staffService.getStaffs({ 
        page: 1, 
        limit: 1,
        isActive: true 
      });

      setTotalCount(allStaffResponse.pagination.totalItems);
      setActiveCount(activeStaffResponse.pagination.totalItems);
    } catch (error) {
      console.error('Failed to fetch staff counts:', error);
      setTotalCount(0);
      setActiveCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStaffCounts();
  }, [fetchStaffCounts]);

  return {
    totalCount,
    activeCount,
    loading,
    refresh: fetchStaffCounts,
  };
};
