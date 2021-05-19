document.querySelector(".mobileTrigger").addEventListener("click", function show (){
  document.querySelector(".mobileHeader").classList.toggle("noView")
  // console.log("Nonse is mad");
  
} )

const getDuration = (timeStamp, form) => {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const time = { second, minute, hour, day};
  return Math.floor(timeStamp / time[form]);
}

const formatDate = (date) => {
  const modTimeStamp = Date.parse(date);
  const modDate = (new Date(modTimeStamp)).toDateString()
  const days = getDuration(Date.now() - modTimeStamp, "day");
  if(days >= 30){
    const [_, month, day, year] = /\s(\w{3})\s(\d{2})\s(\w{4})/.exec(modDate);
    return `on ${month} ${parseInt(day)} ${(new Date()).getFullYear() === +year ? "" : year}`
  }
  else{
    const durations =  ["day", "hour", "minute", "second"].map(form =>{
      const since = getDuration(Date.now() - modTimeStamp, form)
        return `${since} ${since > 1 ? form + "s": form} ago`;
      })
      .filter( value => parseInt(value) !== 0)
    return durations[0];
  }
}

const getUserData = (object) => {
  document.querySelector(".realName").textContent = object.name;
  document.querySelector(".realDescription").textContent = object.bio;
  document.querySelectorAll(".realProfile-pic").forEach( img => img.src = object.avatarUrl);
  document.querySelectorAll(".realUsername").forEach( ele => ele.textContent = object.login);
  getReposData(object.repositories.edges);
}

const populateTemplate = (repository) => {
  const repositoryNode = document.createElement("div");
  repositoryNode.className = "repository";
  repositoryNode.innerHTML = `
  <div class="flex repoItem">
  <div class="left">
    <h1><a href="${repository.url}" target="_blank">${repository.name ? repository.name : ""}</a></h1>
    <p v-if="repo.description">${repository.description ? repository.description : ""}</p>
    <div class="flex">
        <div class="flex items-center" v-if="repo.language">
              ${repository.primaryLanguage ? 
              '<span class="repo-language-color mr-5" style="background-color: '+ repository.primaryLanguage.color +'"></span>&nbsp;<p class="mr-16">' + 
              repository.primaryLanguage.name + '</p>': ""
               }
        </div>
        <p>${formatDate(repository.updatedAt)}</p>
    </div>
  </div>
  <div class="right">
      <button class="flex items-align mb-15">
          <svg class="octicon octicon-star mr-5 blacckk" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"></path></svg>
          Star
      </button>
  </div>
</div>
  `
  return repositoryNode;
}





const getReposData = (repositories) => {
  const repositoriesNode = document.querySelector(".repositories");
  document.querySelectorAll(".amount__repositories")
    .forEach(ele => ele.textContent = repositories.length);
    repositories.forEach( repository => {
      repositoriesNode.append(populateTemplate(repository.node));
    })
  
}



let content = {
  "query": `{
    pokemon(name: "Pikachu") {
      id
      number
      name
      attacks {
        special {
          name
          type
          damage
        }
      }
      evolutions {
        id
        number
        name
        weight {
          minimum
          maximum
        }
        attacks {
          fast {
            name
            type
            damage
          }
        }
      }
    }
  }
`};

// let body = JSON.stringify(query);
const token = "";

const query  = `{
  user(login: "tofmat") {
    bio
    login
    name
    avatarUrl
    repositories(first: 20, orderBy: {direction: DESC, field: UPDATED_AT}) {
      edges {
        node {
          name
          url
          parent {
            name
            url
            forkCount
          }
          description
          primaryLanguage {
            color
            name
          }
          stargazerCount
          forkCount
          licenseInfo {
            name
          }
          updatedAt
        }
      }
    }
  }
}`


fetch("https://api.github.com/graphql", {
  headers:{Authorization: `bearer  `},
  method: 'POST', 
  body: JSON.stringify({query: query})
})
  .then(res => {
    if(res.ok){
      return res.json();
    }
    else{
      return Promise.reject(res);
    }
  })
  .then(data => {
    getUserData(data.data.user);
  })
  // .catch(err => console.error(err))
