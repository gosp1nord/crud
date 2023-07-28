import { useEffect, useState } from "react";

interface HeadersRequests {
  method: string
  header?: {}
  body?: string
}
interface ParamRequests {
  headers: HeadersRequests
  delID: string
}
interface Params {
  params: ParamRequests
}
interface DataItem {
  id: string
  content: string
}
interface Title {
  line: React.MouseEventHandler<HTMLDivElement>
}
interface Data {
  data: DataItem[]
}
interface ElementCard {
  id: string
  content: string
  onDel: React.MouseEventHandler<HTMLDivElement>
}
interface objCards {
  items: ElementCard[]
}
let arrCards: ElementCard[] = []


export const Articles = () => {
  const [cards, setState] = useState<objCards>({items: []})
  const [refreshCards, setRefresh] = useState(0)
  let [textareaText, setTextareaText] = useState("");

  useEffect(() => {
    getContent({params: {
      headers: {
        method: 'GET' 
      },
      delID: ''
    }})
    setRefresh(0)
  }, [refreshCards])

  const getContent = ({params}: Params) => {
    fetch(`http://localhost:7070/notes/${params.delID}`, params.headers)
      .then((result) => {
          let answer;
          if (result.status === 200) {
          answer = result.json();
          }
          return answer
      })
      .then((data) => {
        if (data) {
          createCardsArr({data})
        }
      })
  }

  const createCardsArr = ({data}: Data) => {
    arrCards = []
    data.forEach(item => {
      arrCards.push({...item, onDel: onDeleteCard})
    })
    setState({...cards, items: arrCards})
  }

  const onDeleteCard = (e: React.MouseEvent) => {
    const elementParent = (e.target as HTMLElement).closest('.block-card');
    if (elementParent) {
      getContent({
        params: { 
          headers: {
            method: 'DELETE'
          },
          delID: elementParent.id
      }})
    }
    onRefresh();
  }

  const onRefresh = () => {
    setRefresh(1)
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let value = e.target.value;
    setTextareaText(value);
  }
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (textareaText === '') return;
    const body = {id: 0, content: textareaText}
    getContent({
      params: { 
        headers: {
          method: 'POST',
          header: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          body: JSON.stringify(body)
        },
        delID: ''
     }})
    setTextareaText('');
    onRefresh();
  }

  return (
    <>
    <div className='container'>
      <TitleCards line={onRefresh} />
      <div className='block-cards'>
        <Cards items={arrCards}/>
      </div>
      <AddCard item={{itemSubmit: handleSubmit, itemOnchange: handleChange, itemValue: textareaText}}/>
    </div>
    </>
  )
}

const Cards = ({items}: objCards) => {
  return (
    <>
    {items && items.map((item) => (
      <div key={item.id} id={item.id} className="block-card">
        <div className="text-card">{item.content}</div>
        <div className="dell-card" onClick={item.onDel}>&#10060;</div>
      </div>
    ))}
    </>
  )
}

interface FormAdd {
  item: {
    itemSubmit: React.FormEventHandler<HTMLFormElement>, 
    itemOnchange: React.ChangeEventHandler<HTMLTextAreaElement>,
    itemValue: string
  }
}

const AddCard = ({item}: FormAdd) => {
  return (
    <form className="block-add" autoComplete="off" onSubmit={item.itemSubmit}>
      <div className="title-new-card">Добавить заметку</div>

      <textarea className="area-new-card" name="addText" value={item.itemValue} onChange={item.itemOnchange} />
      <div className="block-btn">
        <button className="btn-add">Сохранить</button>
      </div>
    </form>
  )
}

const TitleCards = ({line}: Title) => {
  return (
    <>
    <div className="block-title">
      <div className="title">Notes</div>
      <div className="btn-refresh" onClick={line}>&#8634;</div>
    </div>
    </>
  )
}
