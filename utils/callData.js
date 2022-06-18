//Lấy dữ liệu từ file Data.json
// Cú pháp Jquery: $.getJSON
function CallData() {
  this.getListData = function() {
    return $.getJSON("./../data/Data.json");
  };
}
