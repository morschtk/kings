async function checkSession() {
  const userName = sessionStorage.getItem('kingsName');
  if (userName) {
    console.log(userName);
  }
}