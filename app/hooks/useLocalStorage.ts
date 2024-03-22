export default function useLocalStorage<T extends Identifiable>(key: string) {
  // Function to get all data from localStorage
  const getAllData = (): T[] => {
    if (typeof window === 'undefined') {
      return [];
    }
    const storedData = localStorage.getItem(key);
    return storedData ? (JSON.parse(storedData) as T[]) : [];
  };

  // Function to save data to localStorage
  const saveData = (newData: T[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(newData));
    }
  };

  // Function to add or update data by id
  const addOrUpdateData = (newItem: T) => {
    const currentData = getAllData();
    const existingIndex = currentData.findIndex(
      (item) => item.id === newItem.id
    );

    if (existingIndex !== -1) {
      currentData[existingIndex] = newItem; // Update existing item
    } else {
      currentData.push(newItem); // Add new item
    }
    saveData(currentData);
  };

  // Function to get data by id
  const getDataById = (id: string): T | undefined => {
    const items = getAllData();
    return items.find((item) => item.id === id);
  };

  // Function to remove data by id
  const removeData = (idToRemove: string) => {
    const filteredData = getAllData().filter((item) => item.id !== idToRemove);
    saveData(filteredData);
  };

  // Function to clear all data
  const clearData = () => {
    saveData([]);
  };

  return {
    getAllData,
    getDataById,
    addData: addOrUpdateData,
    removeData,
    clearData,
  };
}
