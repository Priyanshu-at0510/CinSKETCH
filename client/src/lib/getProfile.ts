import axios from 'axios';

const getProfile = async () => {
  const token = localStorage.getItem('authentication-token');
  
  if (!token) {
    console.error('No token found');
    return;
  }

  try {
    const res = await axios.get('http://localhost:3000/api/v1/user/profile', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    console.log('Profile data:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
  }
};

export default getProfile;
