import {writeFileSync} from 'node:fs';
import {SCENES,activateHeroSkill,availableMoves,chooseTile,createMatch,tickMatch} from '../lib/game/link-engine.ts';

const results=[];
for(let difficulty=0;difficulty<3;difficulty++)for(let hero=0;hero<4;hero++)for(let scene=0;scene<SCENES.length;scene++)for(let stage=0;stage<3;stage++){
 const s=createMatch(scene,stage,difficulty,hero,1000+difficulty*100+hero*30+scene*3+stage);let actions=0;
 while(s.status==='playing'&&actions++<200){let move=availableMoves(s)[0];if(!move){tickMatch(s,4.1);move=availableMoves(s)[0];}if(!move){activateHeroSkill(s);move=availableMoves(s)[0];}if(!move)break;chooseTile(s,move.a.id);chooseTile(s,move.b.id);}
 results.push({difficulty,hero,scene,stage,status:s.status,matches:s.matches,total:s.totalPairs,score:s.score,mistakes:s.mistakes});
}
const failures=results.filter(r=>r.status!=='won');const report={total:results.length,won:results.length-failures.length,constructionScenes:SCENES.filter(s=>s.category==='工程施工').length,sceneTotal:SCENES.length,failures};
writeFileSync('tests/playthrough-results.json',JSON.stringify(report,null,2));console.log(JSON.stringify({...report,failures:failures.length},null,2));if(failures.length)process.exitCode=1;
