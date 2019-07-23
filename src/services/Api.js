import axios from "axios";
/* eslint-disable */
class Api {
  constructor(endpoint) {
    switch(process.env.NODE_ENV){
      case "development":
        this.base_url = 'http://127.0.0.1:8081';
        break;
      default:
        this.base_url = 'https://api.hypercase.com';
    }
    this.endpoint = endpoint
    let user = this.getLoggedInUser()
    if (user) {
      this.addHeader("Authorization", "Bearer " + user.access_token);
    }
  }

  addHeader(name, value) {
    axios.defaults.headers.common[name] = value;
  }

  removeHeader(name) {
    delete axios.defaults.headers.common[name];
  }

  getLoggedInUser() {
    if (window.sessionStorage["vue-session-key"] !== undefined) {
      let session = JSON.parse(window.sessionStorage["vue-session-key"]);
      if (session.user && session.user.access_token !== undefined) {
        return session.user;
      }
    }

    return false;
  }

  getList(params) {
    let url = `${this.base_url}${this.endpoint}`;
    let config = {};
    config.params = params;
    let axiosGetList = axios.get(url, config).then(resp => {
      return resp.data;
    });

    return axiosGetList;
  }

  get(id, params) {
    let url = `${this.base_url}${this.endpoint}/${id}`;
    let config = {};
    config.params = params;

    let axiosGet = axios.get(url, config).then(resp => {
      return resp.data;
    });

    return axiosGet;
  }

  post(data, headers) {
    let url = `${this.base_url}${this.endpoint}`;
    let config = {};
    if (headers) {
      config.headers = headers;
    }
    return axios.post(url, data, config).then(resp => resp.data);
  }

  put(id, data) {
    let url = `${this.base_url}${this.endpoint}/${id}`;
    let config = {};
    return axios.put(url, data, config).then(resp => resp.data);
  }

  postOrPut(data) {
    if (data.id) {
      return this.put(data.id, data);
    }else {
      return this.post(data);
    }
  }

  delete(id) {
    let url = `${this.base_url}${this.endpoint}`;
    if (id) {
      url = `${url}/${id}`;
    }
    let config = {};
    return axios.delete(url, config);
  }

  raw(method, endpoint, data, headers) {
    let url = `${this.base_url}${endpoint}`;
    let config = {};
    if (headers) {
      config.headers = headers;
    }
    return axios[method](url, data, config).then(resp => resp.data);
  }
}

export default Api;
