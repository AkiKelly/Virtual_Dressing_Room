$(document).ready(function() {
  var callData = new CallData();
  var listChosen = new ListChosen();

  renderHMTL();

  function renderHMTL() {
    // Lấy data từ file data.json
    callData
      .getListData()
      //hàm getData json sẽ trả về 2 trạng thái: .done (thành công) hoặc .fail
      .done(function(result) {
        var contentPill = "";
        var contentTabPane = "";
        result.navPills.forEach(function(item) {
          // Kiểm tra xem tabname có phải là active. Active default là "áo" có nền màu xanh 
          // C1:　if (item.tabName === "tabTopClothes"){
          //   activeClass = "active";
          // }
          // C2: Dùng toán tử 3 ngôi: cái đó có phải là áo ko, đúng thì trả về active, ko thì rỗng
          var activeClass = item.tabName === "tabTopClothes" ? "active" : "";
          // tabName đầu tiên ko có fadeClass, từ thứ 2 đến thứ 7 thì có. Khi có fade thì nội dung bị ẩn đi
          var fadeClass = item.tabName !== "tabTopClothes" ? "fade" : "";

          contentPill += getElmTabPills(item, activeClass);
          //TabPane là vùng lớn bên dưới mỗi TabPills, chứa các sản phẩm
          contentTabPane += `
            <div class="tab-pane container ${fadeClass} ${activeClass}" id="${
            item.tabName
          }">
            <div class="row">
                ${renderTabPane(item.tabName, result.tabPanes)}
            </div>
            </div>
          `;
        });
        //Dom tới thẻ ul nav-pills để gắn 7 li lấy được từ contentPill
        $(".nav-pills").html(contentPill);
        $(".tab-content").html(contentTabPane);
      })
      .fail(function(err) {
        console.log(err);
      });
  }

  // Hàm lấy tabpills
  function getElmTabPills(nav, activeClass) {
    return `<li class="nav-item">
        <a
          class="nav-link btn-default ${activeClass}"
          data-toggle="pill"
          href="#${nav.tabName}"
        >
          ${nav.showName}
        </a>
      </li>`;
  }

  function renderTabPane(tabName, arrTabPanes) {
    var tempArr = null;
    var elmItem = null;
    switch (tabName) {
      case "tabTopClothes":
        tempArr = getTypeArr("topclothes", arrTabPanes);
        elmItem = getElmItem(tempArr);
        break;
      case "tabBotClothes":
        tempArr = getTypeArr("botclothes", arrTabPanes);
        elmItem = getElmItem(tempArr);
        break;
      case "tabShoes":
        tempArr = getTypeArr("shoes", arrTabPanes);
        elmItem = getElmItem(tempArr);
        break;
      case "tabHandBags":
        tempArr = getTypeArr("handbags", arrTabPanes);
        elmItem = getElmItem(tempArr);
        break;
      case "tabNecklaces":
        tempArr = getTypeArr("necklaces", arrTabPanes);
        elmItem = getElmItem(tempArr);
        break;
      case "tabHairStyle":
        tempArr = getTypeArr("hairstyle", arrTabPanes);
        elmItem = getElmItem(tempArr);
        break;
      case "tabBackground":
        tempArr = getTypeArr("background", arrTabPanes);
        elmItem = getElmItem(tempArr);
        break;

      default:
        break;
    }
    return elmItem;
  }

  //Hàm lọc dữ liệu lấy ra Type của mảng tabPanes
  function getTypeArr(tabType, data) {
    var tempArr = [];
    data.forEach(function(item) {
      // nếu những sp có type phù hợp với type đề cho thì push vào mảng
      if (item.type === tabType) {
        tempArr.push(item);
      }
    });
    return tempArr;
  }

  //thiết kế trên UI cách hiện các hình ảnh sản phẩm: tạo ra các col-3 
  // Mỗi col-3 là 1 hình sp
  // Gán các thuộc tính của item (phần tử trong tabpanes) vào trong button để khi click lấy được thông tin sp
  // Vd:button data-id, data-type
  function getElmItem(tempArr) {
    var elmItem = "";
    tempArr.forEach(function(item) {
      elmItem += `<div class="col-md-3">
            <div class="card text-center">
              <img src="${item.imgSrc_jpg}" />
              <h4>
                <b>${item.name}</b>
              </h4>
              <button data-id="${item.id}" data-type="${item.type}" data-name="${item.name}" data-desc="${item.desc}" data-imgsrcjpg="${item.imgSrc_jpg}"  data-imgsrcpng="${item.imgSrc_png}" class="changStyle">Thử đồ</button>
            </div>
          </div>
        `;
    });
    return elmItem;
  }

  // Tìm kiếm xem item đó đã có trong listChosen chưa: để ko có cùng 2 types (2 quần) trong list
  // nếu tìm thấy thì index đc return sẽ > -1
  function findIndex(type){
    var index = -1;
    if (listChosen.arr && listChosen.arr.length > 0) {
      listChosen.arr.forEach(function(_item, i) {
        if (_item.type === type) {
          index = i;
        }
      });
    }
    return index;
  }

  // Chức năng click nút Thử đồ thì lấy tất cả thông tin liên quan đến sản phẩm đó
  // Đối với Jquery, nút thử đồ tạo sau do render nên phải ủy quyền cho thẻ body (bằng hàm delegate) vì body luôn có sẵn trên html thì mới tạo event click được
  $("body").delegate(".changStyle", "click", function() {
    // từ khóa this giúp xác định mình đang bấm vào button đó
    var id = $(this).data("id");
    var type = $(this).data("type");
    var name = $(this).data("name");
    var desc = $(this).data("desc");
    var imgsrc_jpg = $(this).data("imgsrcjpg");
    var imgSrc_png = $(this).data("imgsrcpng");

    // choseItem tập hợp những sp chọn để thử
    var choseItem = new ChoseItem(id, type, name, desc, imgsrc_jpg, imgSrc_png);

    var index = findIndex(choseItem.type);

    if (index !== -1) {
      // Tìm thấy thì UPDATE lại item chọn
      listChosen.arr[index] = choseItem;
    } else {
      // Ko tìm thấy thì ADD vào
      listChosen.addAddItem(choseItem);
    }

    renderContain(listChosen.arr);
  });
});

function renderContain(chosenItems) {
  if (chosenItems && chosenItems.length > 0) {
    chosenItems.forEach(function(item) {
      if (item.type === "topclothes") {
        // add background mới vào có kèm chỉnh sửa CSS
        renderBikiniTop(item.imgsrc_png);
      }
      if (item.type === "botclothes") {
        renderBikiniBottom(item.imgsrc_png);
      }
      if (item.type === "shoes") {
        renderFeet(item.imgsrc_png);
      }
      if (item.type === "handbags") {
        renderHandbags(item.imgsrc_png);
      }
      if (item.type === "necklaces") {
        renderNecklace(item.imgsrc_png);
      }
      if (item.type === "hairstyle") {
        renderHairstyle(item.imgsrc_png);
      }
      if (item.type === "background") {
        renderBackground(item.imgsrc_png);
      }
    });
  }
}

//render ra vị trí đúng để đưa hình vào
function renderBikiniTop(img) {
  $(".bikinitop").css({
    width: "500px",
    height: "500px",
    background: `url(${img})`,
    position: "absolute",
    top: "-9%",
    left: "-5%",
    zIndex: "3",
    transform: "scale(0.5)"
  });
}

function renderBikiniBottom(img) {
  $(".bikinibottom").css({
    width: "500px",
    height: "1000px",
    background: `url(${img})`,
    position: "absolute",
    top: "-30%",
    left: "-5%",
    zIndex: "2",
    transform: "scale(0.5)"
  });
}

function renderFeet(img) {
  $(".feet").css({
    width: "500px",
    height: "1000px",
    background: `url(${img})`,
    position: "absolute",
    bottom: "-37%",
    right: "-3.5%",
    transform: "scale(0.5)",
    zIndex: "1"
  });
}

function renderHandbags(img) {
  $(".handbag").css({
    width: "500px",
    height: "1000px",
    background: `url(${img})`,
    position: "absolute",
    bottom: "-40%",
    right: "-3.5%",
    transform: "scale(0.5)",
    zIndex: "4"
  });
}

function renderNecklace(img) {
  $(".necklace").css({
    width: "500px",
    height: "1000px",
    background: `url(${img})`,
    position: "absolute",
    bottom: "-40%",
    right: "-3.5%",
    transform: "scale(0.5)",
    zIndex: "4"
  });
}

function renderHairstyle(img) {
  $(".hairstyle").css({
    width: "1000px",
    height: "1000px",
    background: `url(${img})`,
    position: "absolute",
    top: "-75%",
    right: "-57%",
    transform: "scale(0.15)",
    zIndex: "4"
  });
}

function renderBackground(img) {
  $(".background").css({
    backgroundImage: `url(${img})`
  });
}
