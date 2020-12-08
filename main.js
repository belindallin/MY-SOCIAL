const BASE_URL = 'https://lighthouse-user-api.herokuapp.com/api/v1/users/'

const friends = []
let filteredFriends  = []
const FRIENDS_PER_PAGE = 18

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const searchBtn = document.querySelector('#search-submit')
const paginator = document.querySelector('#paginator')

// 主程式
searchForm.addEventListener ( 'submit' , onSearchBtnSumitted )
searchForm.addEventListener ( 'keypress' , onSearchBtnKeypress )
dataPanel.addEventListener ( 'click' , function (event) {
  if ( event.target.matches ('.btn-show-friend') ) {
    showFriendsPanel ( Number ( event.target.dataset.id ) )        
  } else if ( event.target.matches('.add-to-favorite') || event.target.tagName === 'I' ) {
    addToFriends ( Number ( event.target.dataset.id ) )
  }  
})
paginator.addEventListener ( 'click' , function onPaginatorClicked ( event ) {
  if ( event.target.tagName !== 'A' ) return
  const page = Number ( event.target.dataset.page )
  renderFriendsData ( getFriendsPage ( page ) )
})


//串接 Index API ，放進friends陣列
axios.get (BASE_URL)
.then ( response => {
  friends.push(...response.data.results)
  renderPaginator ( friends.length )
  renderFriendsData ( getFriendsPage ( 1 ) )
})
//函式 renderFriendsData，放進的資料執行陣列迴圈產生卡片
function renderFriendsData ( data ) {
  let rawHTML = ''
  data.forEach ( friend => {
    rawHTML += `
      <div class="col-sm-2 mb-3">
        <div class="col-mb-3">
          <div class="card">
            <img class="card-img-top" src="${friend.avatar}" alt="Card image cap">
            <div class="card-body">
              <h5 class="card-title">${friend.name} ${friend.surname}</h5>
            </div>
            <div class="card-footer text-muted">
              <button type="button" class="btn btn-primary btn-show-friend" data-toggle="modal" data-target="#friends-modal" data-id="${friend.id}">...</button>
              <button type="button" class="btn btn-warning add-to-favorite" data-id="${friend.id}"><i class="fas fa-heart " style="color:#A30000" data-id="${friend.id}"></i></button>
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
// Search Bar
function onSearchBtnSumitted ( event ) {
  event.preventDefault()
  const keywords = searchInput.value.trim().toLowerCase()
  filteredFriends = friends.filter( friend => friend.name.toLowerCase().includes( keywords ) || friend.surname.toLowerCase().includes( keywords ) )
  if ( filteredFriends.length === 0 ) {
    alert(`搜尋不到與關鍵字: ${keywords} 有關的資料`)
  }
  renderPaginator ( filteredFriends.length )
  renderFriendsData ( getFriendsPage ( 1 ) ) 
}
function onSearchBtnKeypress ( event ) {
  if ( event.keyCode === 13 ) {
    onSearchBtnSumitted ( event )    
  }
}
// Add To Friends
function addToFriends ( id ) {
  const list = JSON.parse ( localStorage.getItem ( 'favoriteFriends') ) || []
  const friend = friends.find ( friend => friend.id === id )
  if ( list.some ( friend => friend.id === id ) ) {
   return alert ('此朋友已加入在收藏清單中')
  }
  list.push ( friend ) 
  localStorage.setItem ( 'favoriteFriends' , JSON.stringify(list) )
}
// Paginator
function getFriendsPage ( page ) {
  const data = filteredFriends.length ? filteredFriends : friends
  const startIndex = ( page - 1 ) * FRIENDS_PER_PAGE
  return data.slice ( startIndex , startIndex + FRIENDS_PER_PAGE )
}

function renderPaginator ( amount ) {
  const numberOfPage = Math.ceil ( amount / FRIENDS_PER_PAGE )
  let pageHTML = ''
  for ( let page = 1 ; page <= numberOfPage ; page++ ) {
    pageHTML += `
    <li class="page-item"><a class="page-link" href="#" data-page='${page}'> ${page} </a></li>  
   `
  } 
  paginator.innerHTML = pageHTML 
}






