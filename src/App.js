import React,{useState,useEffect} from 'react';
import './App.css';

const URL = 'http://localhost/ostoslista/';

function App() {
  const [items,setItems] = useState([]);
  const [item,setItem] = useState('');
  const [amounts,setAmounts] = useState([]);
  const [amount,setAmount] = useState('');

  useEffect(() => {
    let status = 0;
    let address = URL + 'retrieve.php';

    fetch(address)
    .then(res => {
      status = parseInt(res.status);
      return res.json();
    })
    .then(
      (res) => {
        if (status === 200) {
          setItems(res)
          setAmounts(res);
        } else {
          alert(res.error);
        }
        
      }, (error) => {
        alert(error);
      }
    )
  }, [])

  function save(e) {
    e.preventDefault();
    let status = 0;
    fetch(URL + 'index.php', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        description: item,
        amount: amount
      })
    })
    .then(res => {
      status = parseInt(res.status);
      return res.json();
    })
    .then(
      (res) => {
        if (status === 200) {
          setItems(items => [...items, res]);
          setItem('');
          setAmounts(amounts => [...amounts, res]);
          setAmount('');
        } else {
          alert(res.error);
        }
      }, (error) => {
        alert(error);
      }
      )
  }

  function remove(id) {
    let status = 0;
    fetch(URL + 'delete.php', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        id: id
      })
    })
    .then(res => {
      status = parseInt(res.status);
      return res.json();
    })
    .then(
      (res) => {
        if (status === 200) {
          const newListWithoutRemoved = items.filter((item) => item.id !== id);
          setItems(newListWithoutRemoved);
          const newListWithoutRemovedb = amounts.filter((amount) => amount.id !== id);
          setAmounts(newListWithoutRemovedb);
        } else {
          alert(res.error);
        }
      }, (error) => {
        alert(error);
      }
    )
  }


  return (
    <>
      <div className="container">
      <h3>Shopping list</h3>
      <form onSubmit={save} className="lista">
        <label>New item </label>
        <input value={item} onChange={e => setItem(e.target.value)} placeholder="Type description"/>
        <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="Type ammount"/>
        <button>Add</button>
      </form>

      <ol>
        {items.map(item => (
          <li key={item.id}>{item.description}</li>
        ))}
      </ol>
      <ol>
        {amounts.map(item => (
          <li key={item.id}>{item.amount}</li>
        ))}
      </ol>
      <ol>
        {amounts.map(item => (
          <li><a className="delete" onClick={() => remove(item.id)} href="#">Delete</a></li>
        ))}
      </ol>
    </div>
    </>
  );
}

export default App;
