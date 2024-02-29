// 加上左上角的打字搜尋功能。不用像官網一樣按了會顯示所有英雄的名字給選，
// 改成就讓用戶在輸入框打字搜尋就好，不要按鈕的設計，用戶每打一個字的同時，
// 底下列表就要更新，模糊搜尋 (例如只打個 JA 列表就會出現 JANNA, JARVAN IV, JAX, JAYCE)

// 1. 先在 html & css 設計一個輸入框　<input type="text">
// 2. 通過 js 監聽這個 input 的輸入變化，取得輸入值（ https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event )
// 3. 取得輸入值之後，根據輸入值去做英雄篩選，只顯示符合條件的，輸出一個 array 送給　render (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes)

// 1. 用 querySelector 替代 getElementById
// 2. 用 class 替代 id
// 3. BEM 命名法

function render(champions) {
  const start = document.querySelector(".championscontainer-all");
  start.innerHTML = "";
  let renderList = [];

  champions.forEach((champion, index) => {
    const targetId = champion.id;

    //創造div元素並給予id="championscontainer-each"
    let div = document.createElement("div");
    div.setAttribute("class", "championscontainer-each");

    //創造img元素並給予src及class="img"
    let imgElement = document.createElement("img");
    imgElement.setAttribute(
      "src",
      `http://ddragon.leagueoflegends.com/cdn/13.19.1/img/champion/${targetId}.png`
    );
    imgElement.setAttribute("class", "img");

    //創造p元素並給予class="championsName"
    let championsP = document.createElement("p");
    championsP.setAttribute("class", "championsName");

    //創造文字節點(allchampions)
    championsP.append(targetId);

    //append圖片及p至Div
    div.append(imgElement, championsP);

    renderList.push(div);
  });
  start.append(...renderList);
}

axios
  .get(
    "http://ddragon.leagueoflegends.com/cdn/13.19.1/data/en_US/champion.json"
  )
  .then((response) => {
    const champions = Object.keys(response.data.data).map(
      (key) => response.data.data[key]
    );

    // 渲染起始網頁畫面
    render(champions);

    //取出所有英雄的"tags"並放在陣列中
    const alltagsArray = champions.map((item) => item.tags);
    console.log(alltagsArray);
    //將[tags]轉換為一維陣列
    let convert1Array = alltagsArray.reduce(function (acc, cur) {
      return [...acc, ...cur];
    });

    //刪除一維陣列中的重複元素=全英雄分類
    let classArray = convert1Array
      .filter((el, i, arr) => arr.indexOf(el) === i)
      .sort();
    classArray.unshift("All");

    const box = document.querySelector(".box-inner");
    //抓取全英雄分類append至HTML
    classArray.forEach((championClass, index) => {
      const boxButton = document.createElement("button");
      boxButton.setAttribute("class", "btn");
      boxButton.append(championClass);
      box.append(boxButton);
      boxButton.addEventListener("click", () => {
        if (championClass === "All") {
          render(champions);
        } else {
          const filtered = champions.filter((champion) =>
            champion.tags.includes(championClass)
          );
          render(filtered);
        }
      });
    });
    //搜尋框(模糊搜尋)
    const input = document.querySelector(".box-search");

    const debounce = function (fn, delay) {
      let timer;
      return function (event) {
        clearTimeout(timer);
        timer = setTimeout(() => {
          fn(event);
        }, delay);
      };
    };

    const filterAndRender = (e) => {
      const value = e.target.value.toLowerCase();
      console.log(value);
      const searchFiltered = champions.filter((champion) =>
        champion.id.toLowerCase().includes(value)
      );
      render(searchFiltered);
    };

    const handler = debounce(filterAndRender, 1000);
    input.addEventListener("input", handler);
  });
