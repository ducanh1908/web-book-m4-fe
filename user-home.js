const API_URL ='http://localhost:3000';
let token = JSON.parse(localStorage.getItem('accessToken'));
let totalAuthor = 0;
let datas;
let page = 1,
    records = 100,
    totalCount = 0,
    search = '';

// if (!token) {
//     location.href = 'login.html'
// } else {
$(document).ready(function() {
    getBookList();
})

// })


const Story = document.querySelector('#books');

function  getBookList() {
    $.ajax ({
        type :'GET',
        // headers: {
        //     'Authorization':'Bearer ' + token.token
        // },
        url:`${API_URL}/books`,
        success : function(data) {
            datas = data;
            totalAuthor = data.length;

            // Run on page load
            fetchData(records);

            $(document).on('click', '.page-item-numbers a', function() {
                page = parseInt($(this)[0].text);
                fetchData();
            });

            // Previous Page
            $('[aria-label="Previous"]').click(function() {
                if (page > 1) {
                    page--;
                }
                fetchData(records);
            });

            // Next page
            $('[aria-label="Next"]').click(function() {
                if (page * records < totalCount) {
                    page++;
                }
                fetchData(records);
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
    totalCount = totalAuthor;
    Story.innerHTML = '';
    datas.slice((page - 1) * records, page * records).map((data) => {
        Story.innerHTML +=
            `<div class="col-md-6 col-xl-3">
                                <div class="card-box product-box">
                                    
                                    <div class="product-action">
                                        <a href="javascript: void(0);" class="btn btn-success btn-xs waves-effect waves-light"><i class="mdi mdi-pencil"></i></a>
                                        <a href="javascript: void(0);" class="btn btn-danger btn-xs waves-effect waves-light"><i class="mdi mdi-close"></i></a>
                                    </div>

                                    <div class="bg-light">
                                        <img src="${data.image}" alt="product-pic" class="img-fluid" />
                                    </div>

                                    <div class="product-info">
                                        <div class="row align-items-center">
                                            <div class="col">
                                                <h5 class="font-16 mt-0 sp-line-1"><a href="ecommerce-product-detail.html" class="text-dark">Designer Awesome Chair</a> </h5>
                                                <div class="text-warning mb-2 font-13">
                                                    <i class="fa fa-star"></i>
                                                    <i class="fa fa-star"></i>
                                                    <i class="fa fa-star"></i>
                                                    <i class="fa fa-star"></i>
                                                    <i class="fa fa-star"></i>
                                                </div>
                                                <h5 class="m-0"> <span class="text-muted"> Stocks : 385 pcs</span></h5>
                                            </div>
                                            <div class="col-auto">
                                                <div class="product-price-tag">
                                                    $29
                                                </div>
                                            </div>
                                        </div> <!-- end row -->
                                    </div> <!-- end product info-->
                                </div> <!-- end card-box-->
                            </div> <!-- end col-->
                        </div>
                        <!-- end row-->`
    })
    renderPagination();
}




