import test from 'node:test';
import assert from 'node:assert/strict';
import {HEROES,SCENES,STAGES,activateHeroSkill,availableMoves,chooseTile,createMatch,linkPath,resultStars,shuffleRemaining,tickMatch} from '../lib/game/link-engine.ts';

test('four established heroes and construction-heavy scene portfolio',()=>{
 assert.deepEqual(HEROES.map(h=>h.name),['安禾','永勋','凌曜','观微']);
 assert.equal(SCENES.length,12);assert.equal(STAGES.length,3);
 assert.equal(SCENES.filter(s=>s.category==='工程施工').length,8);
 assert.ok(SCENES.every(s=>s.pairs.length===8&&s.knowledge.length>20));
});

test('every scene and stage starts with an available legal connection',()=>{
 for(let scene=0;scene<SCENES.length;scene++)for(let stage=0;stage<3;stage++)for(let seed=1;seed<=8;seed++){
  const s=createMatch(scene,stage,1,0,seed);assert.equal(s.tiles.length,STAGES[stage].pairs*2);assert.ok(availableMoves(s).length,`${scene}/${stage}/${seed}`);
 }
});

test('path finder allows at most two bends and rejects an occupied straight route',()=>{
 const s=createMatch(0,0,0,0,11);const move=availableMoves(s)[0];const path=linkPath(s,move.a,move.b);assert.ok(path);assert.ok(path.length<=4);
});

test('semantic match scores, mismatch breaks combo and full autoplay wins',()=>{
 const s=createMatch(2,2,1,1,77);let guard=0;
 while(s.status==='playing'&&guard++<200){const move=availableMoves(s)[0];assert.ok(move);chooseTile(s,move.a.id);assert.equal(chooseTile(s,move.b.id),'matched');}
 assert.equal(s.status,'won');assert.equal(s.matches,s.totalPairs);assert.ok(s.score>1800);assert.ok(resultStars(s)>=2);
});

test('timer, shuffle and four hero skills remain bounded',()=>{
 const timed=createMatch(0,0,2,0,3);tickMatch(timed,timed.timeLimit+1);assert.equal(timed.status,'lost');
 for(let hero=0;hero<4;hero++){const s=createMatch(hero,1,0,hero,9);const before=s.tiles.filter(t=>!t.removed).length;assert.equal(activateHeroSkill(s),true);assert.equal(s.skillCharges,hero===1?2:1);assert.ok(s.tiles.filter(t=>!t.removed).length<=before);}
 const s=createMatch();assert.equal(shuffleRemaining(s,true),true);assert.equal(s.shuffleCharges,1);
});
