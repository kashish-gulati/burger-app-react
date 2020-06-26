import Axios from 'axios';

const instance = Axios.create({
    baseURL:'https://burger-app-react-b4bf7.firebaseio.com/',
});

export default instance;