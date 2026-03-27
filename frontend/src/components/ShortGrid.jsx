export default function ShortGrid({ data, setData }) {
  const toggle = (q, val) => {
    setData(prev=>{
      let d={...prev};
      d[q]=d[q]===val?null:val;
      return d;
    });
  };

  return (
    <div>
      {[...Array(6)].map((_,q)=>(
        <div key={q}>
          Câu {q+1}:
          {[...Array(10)].map((_,n)=>(
            <button
              key={n}
              style={{background:data[q]===n?"green":"white"}}
              onClick={()=>toggle(q,n)}
            >{n}</button>
          ))}
        </div>
      ))}
    </div>
  );
}