class Api {
  constructor({ url, headers }) {
    this._url = url;
    this._headers = headers;
  }

  getAllInfo() {
    return Promise.all([this.getInitialCards(), this.getUserInfo()]);
  }

  _handleResponse(res) {
    if (res.ok) {
      console.log(res);
      return res.json();
    }
    return Promise.reject(`${res.status}: ${res.statusText}`);
  }

  getInitialCards(token) {
    return fetch(`${this._url}/cards`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }).then(this._handleResponse);
  }

  getUserInfo(token) {
    return fetch(`${this._url}/users/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }).then(this._handleResponse);
  }

  updateUserInfo(userInfo, token) {
    const { name, about } = userInfo;
    return fetch(`${this._url}/users/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        about,
      }),
    }).then(this._handleResponse);
  }

  updateUserImage(avatar, token) {
    return fetch(`${this._url}/users/me/avatar`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        avatar,
      }),
    }).then(this._handleResponse);
  }

  addNewCard(data, token) {
    const { title, url } = data;
    return fetch(`${this._url}/cards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: title,
        link: url,
      }),
    }).then(this._handleResponse);
  }

  deleteCard(card_id, token) {
    return fetch(`${this._url}/cards/${card_id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }).then(this._handleResponse);
  }

  changeLikeCardStatus(card_id, isLiked, token) {
    return fetch(`${this._url}/cards/likes/${card_id}`, {
      method: !isLiked ? 'DELETE' : 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }).then(this._handleResponse);
  }
}

const api = new Api({
  url: 'https://localhost:3000',
});
// const api = new Api({
//   url: 'https://around.nomoreparties.co/v1/group-12',
//   headers: {
//     authorization: '9dab4619-413b-4914-b4f4-ee6c3c0ed983',
//     'content-type': 'application/json',
//   },
// });

export default api;
