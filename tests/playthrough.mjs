import {writeFileSync} from 'node:fs';
import {createGame,update,chooseUpgrade,findPath,distance,visible,CHAPTERS} from '../lib/game/engine.ts';
const results=[];
for(let difficulty=0;difficulty<3;difficulty++)for(let hero=0;hero<4;hero++)for(let chapter=0;chapter<8;chapter++)for(let stage=0;stage<3;stage++){
 const s=createGame(hero,chapter,stage,difficulty);let path=[],lastStep=-1,refresh=0;
 for(let frame=0;frame<60*180&&s.status==='playing';frame++){
  if(s.upgradePending)chooseUpgrade(s,0);
  const boss=s.enemies.find(e=>e.boss&&!e.dead);let target=s.nodes[s.step];
  if(s.step===4&&boss){target=boss;if(distance(s.p,boss)<320&&visible(s,s.p,boss))target=s.p;}
  if(lastStep!==s.step||frame>=refresh){path=distance(s.p,target)>70?findPath(s,target):[];lastStep=s.step;refresh=frame+60;}
  while(path.length&&distance(s.p,path[0])<8)path.shift();const t=path[0];const d=t?distance(s.p,t):1;
  update(s,{x:t?(t.x-s.p.x)/d:0,y:t?(t.y-s.p.y)/d:0,fire:false,aim:null,interact:distance(s.p,s.nodes[s.step])<85,skill:s.cd<=0&&(s.hero!==0||s.p.hp<75)},1/60);
 }
 results.push({difficulty,hero,chapter,stage,status:s.status,time:Math.round(s.time),hp:Math.round(s.p.hp),step:s.step,kills:s.kills});
}
const failures=results.filter(r=>r.status!=='won'); const report={total:results.length,won:results.length-failures.length,byDifficulty:[0,1,2].map(d=>({difficulty:d,won:results.filter(r=>r.difficulty===d&&r.status==='won').length,total:96})),failures,timing:{min:Math.min(...results.map(x=>x.time)),max:Math.max(...results.map(x=>x.time))}};writeFileSync('tests/playthrough-results.json',JSON.stringify(report,null,2));console.log(JSON.stringify({...report,failures:failures.length},null,2));
if(failures.some(f=>f.status!=='lost'||f.difficulty<2))process.exitCode=1;
