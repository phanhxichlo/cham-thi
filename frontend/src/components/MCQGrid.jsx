export default function MCQGrid({ data, setData }) {
  const letters = ["A","B","C","D"];

  const toggle = (q, val) => {
    setData(prev => {
      let d = {...prev};
      d[q] = d[q] === val ? null : val;
      return d;
    });
  };

  return (
    <div>
      {[...Array(40)].map((_,i)=>(
        <div key={i}>
          {i+1}.
          {letters.map(l=>(
            <button
              key={l}
              style={{background: data[i]===l?"green":"white"}}
              onClick={()=>toggle(i,l)}
            >{l}</button>
          ))}
        </div>
      ))}
    </div>
  );
}