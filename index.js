const getPostsBtn = document.getElementById('get-posts');
const selector = document.getElementById('sort-select');

let posts = [];

getPostsBtn.addEventListener('click', async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts');
  posts = await response.json();
  createTable(posts);
});

selector.addEventListener('change', (e) => {
  if (e.target.value) {
    sortTable(posts, e.target.value);
  }
  sortTable(posts);
})

const createTable = (data) => {
  const keys = Object.keys(data[0]);

  const container = document.createElement('div');
  const table = document.createElement('table');
  table.style.border = '1px solid black';
  table.setAttribute('id', 'table');

  const thead = table.appendChild(document.createElement('thead'));

  keys.map(key => {
    const th = document.createElement('th');
    th.innerText = key;
    thead.appendChild(th);
  })

  data.map(each => {
    const tr = table.insertRow();

    keys.map(key => {
      const td = tr.insertCell();
      td.appendChild(document.createTextNode(each[key]));
      td.style.border = '1px solid black';
    })
  });

  container.appendChild(table);
  document.body.appendChild(container);
  document.querySelector('.sort-select').className = ('sort-select visible');
}

const sortTable = (data, filter='') => {
  const filterOptions = filter.split(' ');
  switch (filterOptions[0]) {
    case 'id':
      let sortedById;
      if (filterOptions[1] === 'descend') {
        sortedById = data.sort((a,b) => a.userId - b.userId);
      } else {
        sortedById = data.sort((a,b) => b.userId - a.userId);
      }
      document.getElementById('table').remove();
      createTable(sortedById);
      break;
    case 'title':
      let sortedByTitle;
      if (filterOptions[1] === 'descend') {
        sortedByTitle = data.sort((a, b) => {
          if (a.title < b.title) {
            return -1;
          } else if (a.title > b.title) {
            return 1;
          }
          return 0;
        });
      } else {
        sortedByTitle = data.sort((a, b) => {
          if (a.title > b.title) {
            return -1;
          } else if (a.title < b.title) {
            return 1;
          }
          return 0;
        });
      }
      document.getElementById('table').remove();
      createTable(sortedByTitle);
      break;
    default:
      return;
  }
}
