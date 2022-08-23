const API_URL ='http://localhost:3000';
let token = JSON.parse(localStorage.getItem('accessToken'));
let totalBook = 0;
let datas;
let page = 1,
records = 8,
totalCount = 0,
search = '';

    $(document).ready(function() {  
        getListGerne();
        getBookList();
        
        })
        

    function getListGerne(){
            let html ='';
            $.ajax({
                type :'GET',
                headers: {
                    // 
                    'Content-Type':'application/json'
                },
                url:`${API_URL}/gernes`,
                success : function(data) {
                    for(let i = 0; i < data.length; i++) {
                        html +=`
                        <li>
                        <a href="#" onclick ="showListBookToGerne('${data[i]._id}')">${data[i].name}</a>
                        </li>`
                    }
                    $('#list-gerne').html(html);
                }
            })
        }

function showListBookToGerne(id) {
    $.ajax({
        type :'GET',    
        headers: {
            // 'Authorization':'Bearer ' + token.token
            'Content-Type':'application/json'
        },
        url:`${API_URL}/books`,
        success : function(data) {
            let html = '';
            console.log(data);
           for(let i =0; i<data.length; i++) {
                html += `
                   <div class="col-md-6 col-xl-3" id="${data[i]._id}">
            <div class="product-item" style="width:100%">
                <div class="product product_filter">
                    <div class="product_image">
                        <img src="${data[i].image}" alt="">
                    </div>
                    <div class="favorite"></div>
                    <div class="product_info">
                        <h6 class="product_name"><a href="single.html">${data[i].name}</a></h6>
                        <div class="product_price">$${data[i].price}</div>
                    </div>
                </div>
                <div class="red_button add_to_cart_button"><a href="#" >add to cart</a></div>
            </div>
            </div>`
                }
                $('#product-item').replaceWith(html);
        
        }
    })
}


const Story = document.querySelector('#product-item');

function  getBookList() {
    $.ajax ({
        type :'GET',
        headers: {
            'Authorization':'Bearer ' + token.token
        },
        url:`${API_URL}/books`,
        success : function(data) {
            datas = data;
           
            totalBook = data.length;
                    
                    // Run on page load
                    fetchData();

                    $(document).on('click', '.page-item-numbers a', function() {
                        page = parseInt($(this)[0].text);
                        fetchData();
                    });

                    // Previous Page
                    $('[aria-label="Previous"]').click(function() {
                        if (page > 1) {
                        page--;
                        }
                        fetchData();
                    });

                    // Next page 
                    $('[aria-label="Next"]').click(function() {
                        if (page * records < totalCount) {
                        page++;
                        }
                        fetchData();
                    });
                    // data fetching from API

       }
        
    })
}

function renderPagination() {
            $('.page-item-numbers').remove();
            let pagesNumbers = Math.ceil(totalCount / records);
            for (let i = 1; i <= pagesNumbers; i++) {
            $(`.pagination > li:nth-child(${i})`).after(`<li class="page-item page-item-numbers ${i == page ? 'active': ''}" ><a class="page-link" href="#">${i}</a></li>`);
            }
        }

function fetchData() {
    totalCount = totalBook;
    Story.innerHTML = '';
    datas.slice((page - 1) * records, page * records).map((data) => {
    Story.innerHTML +=`
            <div class="col-md-6 col-xl-3" id="${data._id}">
            <div class="product-item" style="width:100%">
                <div class="product product_filter">
                    <div class="product_image">
                        <img src="${data.image}" alt="">
                    </div>
                    <div class="favorite"></div>
                    <div class="product_info">
                        <h6 class="product_name" style = " margin-top:0px"><a href="single.html">${data.name}</a></h6>
                        <div class="product_price">$${data.price}</div>
                        <input class="product_input" style="width: 50%" type="number" name="amount" id="amount-${data._id}" placeholder="Nhập số lượng" required/>
                        
                    </div>
                    <div class="list-card-badge">
                                <input hidden type="text" name="bookId" id="bookId-${data._id}" value="${data._id}"/>
                                <input hidden type="text" name="bookPrice" id="bookPrice-${data._id}" value="${data.price}"/>
                    </div>
                </div>
                <div class="red_button add_to_cart_button"><a href="#" class="add-cart" onclick="addToCart('${data._id}')">add to cart</a></div>
            </div>
            </div>`
    })
    renderPagination();
}
function addToCart(bookId) {
    let book = $(`#bookId-${bookId}`).val();
  let bookPrice = +$(`#bookPrice-${bookId}`).val();
  let amount = +$(`#amount-${bookId}`).val();
  if (amount !== 0) {
    
    
    let orderDetailPrice = bookPrice  * amount ;
    
     let orderDetailInfo = {
    book: book,
    price: orderDetailPrice,
    amount: amount
  }
  $.ajax({
    type: 'POST',
        url: `${API_URL}/orderdetails`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token.token
        },
        data: JSON.stringify(orderDetailInfo),
        success: function () {
          Swal.fire(
            "Xin Cám ơn quý khách",
            "Đặt hàng thành công!",
            "success"
        )
        showOrderDetailCount()
       


        }
  })
  } else {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: 'Chưa nhập số lượng',
        footer: '<a href="/User/index.html">Quay trở lại trang chủ</a>',

    });
  }
}





