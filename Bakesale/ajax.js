// adapted from https://www.linkedin.com/learning/react-native-essential-training/

export default {
  async fetchInitialDeals() {
    try {
      const response = await fetch('https://bakesaleforgood.com/api/deals');
      const responseJson = await response.json();
      return responseJson;
    } catch(error) {
      console.error(error);
    }
  },
  async fetchDealDetail(dealId) {
    try {
      const response = await fetch('https://bakesaleforgood.com/api/deals/' + dealId);
      const responseJson = await response.json();
      return responseJson;
    } catch(error) {
      console.error(error);
    }
  },
  async fetchDealSearchResults(searchTerm) {
    try {
      const response = await fetch('https://bakesaleforgood.com/api/deals?searchTerm=' + searchTerm);
      const responseJson = await response.json();
      return responseJson;
    } catch(error) {
      console.error(error);
    }
  }
};