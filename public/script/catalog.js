

var items = [];
var serverURL = "http://localhost:8080/API/";

function fetchCatalog() {
    // get the items from the server
    $.ajax({
        url: serverURL + "items/Samatha",
        type: "GET",
        success: function (res) {
            console.log("it works", res);
            // this will travel the array that the server sends back
            for (var i = 0; i < res.length; i++) {
                var item = res[i];
                drawItem(item); // send each item to be draw on HTML            
            }
        },
        error: function (details) {
            console.log("Error", details);
        }
    });
}

function drawItem(product) {
    // create the template string 
    var layout = ` <div id="${product.code}" class="item">
                            <img src="${product.image}">
                            <h4> ${product.title}</h4>
                            <h5 class="itemPrice">$${product.price}</h5>
                            <p> ${product.description} </p>
                            <div> 
                                <button class="btn btn-primary">Add to Cart </button>
                            </div>
                        </div> `;
    // display the layout on the DOM append
    $('#catalog').append(layout);
}

function Search() {
    var searchText = $('#txt-search').val();
    $("#catalog").html("");
    //travel the array and display the items that contains searchText in the title,
    // OR the description contains the searchText
    // OR the code contains the searchText
    // OR the price
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.title.toLowerCase().includes(searchText) || item.description.toLowerCase().includes(searchText)) {
            drawItem(item);
        }
    }
}

function init() {
    console.log("Catalog Page");
    fetchCatalog();

    // detecting events
    $('#btn-search').click(Search);

    $('#txt-search').change(function () {
        var searchText = $('#txt-search').val();
        for (var i = 0; i < items.length; i++) {
            if (searchText == '') {
                //$('#'+items[i].code).show();
                drawItem(items[i]);
            }
        }
    });

    $('#txt-search').keypress(function (e) {
        if (e.keyCode == 13) {
            Search();
        }
    });

}

window.onload = init;