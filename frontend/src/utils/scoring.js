export function calcScore(s,a){
  if(!a) return 0;
  let score=0;

  for(let i=0;i<40;i++){
    if(s.part1[i]===a.part1[i]) score+=0.25;
  }

  for(let i=0;i<8;i++){
    let c=0;
    for(let j=0;j<4;j++){
      if(s.part2[i]?.[j]===a.part2[i]?.[j]) c++;
    }
    if(c===1) score+=0.1;
    if(c===2) score+=0.25;
    if(c===3) score+=0.5;
    if(c===4) score+=1;
  }

  for(let i=0;i<6;i++){
    if(s.part3[i]===a.part3[i]) score+=0.5;
  }

  return score;
}