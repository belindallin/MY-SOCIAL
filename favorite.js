const BASE_URL = 'https://lighthouse-user-api.herokuapp.com/api/v1/users/'

const friends = JSON.parse ( localStorage.getItem ( 'favoriteFriends') )

const dataPanel = document.querySelector('#data-panel')

// 主程式
renderFriendsData(friends)

// 監聽dataPanel,如果按下more按鈕則執行函式showFriendPanel
dataPanel.addEventListener ( 'click' , function (event) {
  if ( event.target.matches ('.btn-show-friend') ) {
    showFriendsPanel ( Number ( event.target.dataset.id ) )        
  } else if ( event.target.matches('.remove-from-favorite') ) {
    removeFromFavorite ( Number ( event.target.dataset.id ) )
  }  
})

//函式 renderFriendsData，放進的資料執行陣列迴圈產生卡片
function renderFriendsData ( data ) {
  let rawHTML = ''
  data.forEach ( friend => {
    rawHTML += `
      <div class="col-sm-2">
        <div class="col-mb-2">
          <div class="card">
            <img class="card-img-top" src="${friend.avatar}" alt="Card image cap">
            <div class="card-body">
              <h5 class="card-title">${friend.name} ${friend.surname}</h5>
            </div>
            <div class="card-footer text-muted">
              <button type="button" class="btn btn-primary btn-show-friend" data-toggle="modal" data-target="#friends-modal" data-id="${friend.id}">more</button>
              <button type="button" class="btn btn-danger remove-from-favorite" data-id="${friend.id}">X</button>
            </div>
          </div>
        </div>
      </div>
    `    
  }) 
  dataPanel.innerHTML = rawHTML   
}
//函式showFriendPanel，放進id串接showAPI使用DOM修改Modal內容
function showFriendsPanel ( id ) {
  const modalName = document.querySelector('#friends-modal-name')
  const modalAvatar = document.querySelector('#friends-modal-avatar img')
  const modalBirthday = document.querySelector('#friends-modal-birthday')
  const modalEmail = document.querySelector('#friends-modal-email')  
  const modalRegion = document.querySelector('#friends-modal-region')  
  
  axios.get( BASE_URL + id ) 
  .then ( res => {
    const data = res.data
    modalName.innerText = data.name + data.surname
    modalBirthday.innerHTML =`<i class="fas fa-birthday-cake"></i> <span>${data.birthday}</span>` 
    modalEmail.innerHTML =`<i class="fas fa-envelope"></i> <span>${data.email}</span>` 
    modalRegion.innerHTML = `<i class="fas fa-map-marker-alt"></i> <span>${data.region}</span>`
    modalAvatar.src = data.avatar
  })
  .catch ( err => {
    console.log ( err )
  })
}
//從收藏清單中移除
function removeFromFavorite ( id ) {
  if ( !friends ) return
  const friendIndex = friends.findIndex ( friend => friend.id === id )
  if ( friendIndex === -1 ) return
  friends.splice ( friendIndex , 1 )
  localStorage.setItem ( 'favoriteFriends' , JSON.stringify(friends) )
  renderFriendsData(friends)
}








