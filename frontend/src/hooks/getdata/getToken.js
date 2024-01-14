function getToken() {
    const localStorageToken = localStorage.getItem('token');
    const sessionStorageToken = sessionStorage.getItem('token');
    return localStorageToken || sessionStorageToken;
  }
  
  export default getToken;