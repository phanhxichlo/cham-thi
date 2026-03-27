export default function TFGrid({ data, setData }) {
  const toggle = (q, i) => {
    setData(prev => {
      let d = {...prev};
      d[q] = d[q] || [false,false,false,false];
      d[q][i] = !d[q][i];
      return {...d};
    });
  };

  return (
    <div>
      {[...Array(8)].map((_,q)=>(
        <div key={q}>
          Câu {q+1}:
          {[0,1,2,3].map(i=>(
            <button
              key={i}
              style={{background: data[q]?.[i]?"green":"white"}}
              onClick={()=>toggle(q,i)}
            >{i}</button>
          ))}
        </div>
      ))}
    </div>
  );
}