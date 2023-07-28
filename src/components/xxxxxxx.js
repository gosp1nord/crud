const getContent = ({params}: Params) => {
    fetch('http://localhost:7070/notes', params)
      .then((result) => {
          let answer;
          if (result.status === 200) {
          answer = result.json();
          }
          return result
      })
    
    .then((data) => {
        if (data) {
        console.log("data 22 -", data)

        arrCards = []
        data.forEach(({item}: Item) => {
            console.log("item -", item)
            arrCards.push({...item, onDel: onDeleteCard})
        })
        setState({...cards, items: arrCards})
        }
    })
    //.then(() => createCardsArr(arrOut))

}
