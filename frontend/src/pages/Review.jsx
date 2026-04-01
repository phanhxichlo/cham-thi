export default function Review(){
  let list = JSON.parse(localStorage.getItem("results")||"[]");

  return (
    <div>
      <button onClick={()=>history.back()}>⬅ Back</button>
      <h2>Danh sách bài</h2>

      {list.map((r,i)=>(
        <div key={i}>
          <img src={r.img} width="200"/>
          <p>Điểm: {r.score}</p>
        </div>
      ))}
    </div>
  );
}