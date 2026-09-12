(function(){
"use strict";

const COLS=8, ROWS=16;
const TYPES={
  prohibit:{name:"禁止",icon:"禁",color:"#c73239"},
  warning:{name:"警告",icon:"警",color:"#f0c33d"},
  mandatory:{name:"指令",icon:"令",color:"#277bc0"},
  safe:{name:"提示",icon:"示",color:"#188e50"}
};
const SIGNS={
  prohibit:[
    ["烟","禁止吸烟","动火及易燃易爆场所严禁吸烟"],["火","禁止烟火","存在火灾爆炸风险的区域禁止烟火"],
    ["入","禁止入内","未经许可不得进入受控区域"],["攀","禁止攀登","禁止攀爬设备、构架等部位"],
    ["启","禁止启动","设备检修等状态下不得擅自启动"],["越","禁止跨越","不得跨越护栏、输送设施等区域"]
  ],
  warning:[
    ["电","当心触电","提示附近存在触电危险"],["坠","当心坠落","提示临边、洞口或高处坠落危险"],
    ["吊","当心吊物","提示起重吊装和物体坠落危险"],["火","当心火灾","提示附近存在火灾危险"],
    ["爆","当心爆炸","提示存在爆炸性物质或环境"],["毒","当心中毒","提示存在有毒物质或中毒风险"],
    ["滑","当心滑倒","提示地面湿滑或易滑倒"],["车","注意车辆","提示车辆运行和碰撞风险"]
  ],
  mandatory:[
    ["盔","必须戴安全帽","进入规定区域必须正确佩戴安全帽"],["带","必须系安全带","高处作业按要求正确使用安全带"],
    ["镜","必须戴防护眼镜","眼部暴露风险场所必须佩戴防护眼镜"],["罩","必须戴防护面罩","存在面部伤害风险时必须使用面罩"],
    ["护","必须穿防护服","按作业风险正确穿着防护服"],["耳","必须戴护耳器","噪声暴露场所按要求使用听力防护用品"]
  ],
  safe:[
    ["出","安全出口","指示安全出口的方向或位置"],["急","急救点","指示急救设施或急救点的位置"],
    ["集","紧急集合点","指示应急疏散后的集合位置"],["洗","紧急洗眼","指示紧急冲淋或洗眼设施位置"]
  ]
};
const SCENES=[
  {name:"综合施工",targets:["warning","mandatory","prohibit"],tips:["先看危险，再看必须采取的行动。","安全标志要设在醒目且与风险对应的位置。","标志不是装饰，必须与现场风险保持一致。"]},
  {name:"高处作业",targets:["warning","mandatory","prohibit"],tips:["临边洞口先识别坠落风险。","安全带标志提示必须执行的防护要求。","警示与防护措施要同时落实。"]},
  {name:"动火消防",targets:["prohibit","warning","safe"],tips:["动火区域先辨认禁止行为。","可燃物、火源和作业边界要同时关注。","疏散与消防设施位置也要清晰可见。"]},
  {name:"起重吊装",targets:["warning","prohibit","mandatory"],tips:["吊物下方和回转半径内是重点区域。","禁止入内不能替代现场隔离和监护。","正确识别标志，也要服从统一指挥。"]},
  {name:"临时用电",targets:["warning","prohibit","mandatory"],tips:["看到电气设施，先辨识触电警告。","停送电状态必须清楚、可靠。","标志之外还要落实漏保、接地和检查。"]},
  {name:"受限空间",targets:["prohibit","mandatory","safe"],tips:["未经许可不得进入受限空间。","检测、通风和监护不能被标志替代。","同时确认撤离方向与应急设施位置。"]}
];
const MENTORS=[
  {name:"安禾",avatar:"🐎",tips:["稳住节奏，先留出安全余量。","不要急着落下，完整的一行更重要。"]},
  {name:"永勋",avatar:"🦉",tips:["先看落点，再做判断。","观察下一个方块，提前留出空间。"]},
  {name:"凌曜",avatar:"🐆",tips:["连续消行可以形成更高连击。","快落之前，先确认没有封死通道。"]},
  {name:"观微",avatar:"🐕",tips:["注意小空隙，它会变成后续障碍。","看清标志类别，也看清现场含义。"]}
];
const SHAPES=[
  [[1,1],[1,1]], [[1,1,1],[0,1,0]], [[1,1,0],[0,1,1]],
  [[0,1,1],[1,1,0]], [[1,0,0],[1,1,1]], [[0,0,1],[1,1,1]], [[1,1,1,1]],
  [[1,1,1]], [[1,0],[1,1]], [[1,1],[1,0]]
];

const $=id=>document.getElementById(id);
const els={home:$("home"),game:$("game"),result:$("result"),levelGrid:$("levelGrid"),mentorGrid:$("mentorGrid"),progressText:$("progressText"),board:$("board"),score:$("score"),lines:$("lines"),missionIcon:$("missionIcon"),missionName:$("missionName"),missionDone:$("missionDone"),missionTotal:$("missionTotal"),sceneName:$("sceneName"),stageNo:$("stageNo"),nextPiece:$("nextPiece"),mentorAvatar:$("mentorAvatar"),mentorTip:$("mentorTip"),toast:$("toast"),finalScore:$("finalScore"),finalLines:$("finalLines"),finalSigns:$("finalSigns"),finalCombo:$("finalCombo"),resultTitle:$("resultTitle"),resultMessage:$("resultMessage"),resultBadge:$("resultBadge"),knowledgeCard:$("knowledgeCard"),nextBtn:$("nextBtn"),guideDialog:$("guideDialog"),pauseDialog:$("pauseDialog")};

let selectedLevel=0, selectedMentor=1, unlocked=Math.max(1,Math.min(18,Number(localStorage.getItem("safeDropUnlocked")||1)));
let board=[], current=null, next=null, timer=null, paused=false, running=false, score=0, lines=0, missionDone=0, missionGoal=8, combo=0, maxCombo=0, clearedSigns=0, level=0, lastKnowledge=null;

function showScreen(id){document.querySelectorAll(".screen").forEach(s=>s.classList.toggle("active",s.id===id));}
function renderHome(){
  els.levelGrid.innerHTML="";
  for(let i=0;i<18;i++){
    const scene=Math.floor(i/3), stage=i%3+1, btn=document.createElement("button");
    btn.className="level-btn"+(i===selectedLevel?" selected":"")+(i>=unlocked?" locked":"");
    btn.disabled=i>=unlocked; btn.innerHTML=`${i+1}<small>${stage===1?"识别":stage===2?"混合":"挑战"}</small>`;
    btn.title=`${SCENES[scene].name} · 第${stage}关`;
    btn.onclick=()=>{selectedLevel=i;renderHome();}; els.levelGrid.appendChild(btn);
  }
  els.progressText.textContent=`已解锁 ${unlocked} / 18`;
  els.mentorGrid.innerHTML="";
  MENTORS.forEach((m,i)=>{const b=document.createElement("button");b.className="mentor"+(i===selectedMentor?" selected":"");b.innerHTML=`<span>${m.avatar}</span><small>${m.name}</small>`;b.onclick=()=>{selectedMentor=i;renderHome();};els.mentorGrid.appendChild(b);});
}
function blankBoard(){return Array.from({length:ROWS},()=>Array(COLS).fill(null));}
function rotate(matrix){return matrix[0].map((_,i)=>matrix.map(row=>row[i]).reverse());}
function randomSign(category){const list=SIGNS[category], s=list[Math.floor(Math.random()*list.length)];return {category,glyph:s[0],label:s[1],note:s[2]};}
function makePiece(forceTarget=false){
  const scene=SCENES[Math.floor(level/3)], target=scene.targets[level%3];
  const keys=Object.keys(TYPES), category=(forceTarget||Math.random()<.42)?target:keys[Math.floor(Math.random()*keys.length)];
  const matrix=SHAPES[Math.floor(Math.random()*SHAPES.length)].map(r=>r.slice());
  return {matrix,x:Math.floor((COLS-matrix[0].length)/2),y:-1,sign:randomSign(category)};
}
function valid(piece,nx=piece.x,ny=piece.y,matrix=piece.matrix){
  for(let y=0;y<matrix.length;y++)for(let x=0;x<matrix[y].length;x++)if(matrix[y][x]){
    const bx=nx+x,by=ny+y;if(bx<0||bx>=COLS||by>=ROWS)return false;if(by>=0&&board[by][bx])return false;
  }return true;
}
function ghostY(){let y=current.y;while(valid(current,current.x,y+1))y++;return y;}
function spawn(){current=next||makePiece(true);next=makePiece();current.x=Math.floor((COLS-current.matrix[0].length)/2);current.y=-1;renderNext();if(!valid(current,current.x,0)){endGame(false);}}
function move(dx,dy){if(!running||paused)return false;if(valid(current,current.x+dx,current.y+dy)){current.x+=dx;current.y+=dy;render();return true;}if(dy===1)lock();return false;}
function rotatePiece(){if(!running||paused)return;const m=rotate(current.matrix);for(const kick of [0,-1,1,-2,2])if(valid(current,current.x+kick,current.y,m)){current.x+=kick;current.matrix=m;render();return;}flash("这里转不开");}
function hardDrop(){if(!running||paused)return;let steps=0;while(valid(current,current.x,current.y+1)){current.y++;steps++;}score+=steps*2;lock();}
function lock(){
  current.matrix.forEach((row,y)=>row.forEach((v,x)=>{if(v&&current.y+y>=0)board[current.y+y][current.x+x]={...current.sign};}));
  clearLines();if(running)spawn();render();
}
function clearLines(){
  const full=[];for(let y=0;y<ROWS;y++)if(board[y].every(Boolean))full.push(y);
  if(!full.length){combo=0;return;}
  const scene=SCENES[Math.floor(level/3)], target=scene.targets[level%3];let found=0;
  full.forEach(y=>{board[y].forEach(c=>{if(c){clearedSigns++;lastKnowledge=c;if(c.category===target)found++;}});});
  full.sort((a,b)=>b-a).forEach(y=>{board.splice(y,1);board.unshift(Array(COLS).fill(null));});
  lines+=full.length;combo++;maxCombo=Math.max(maxCombo,combo);score+=full.length*100+(full.length>1?(full.length-1)*120:0)+(combo-1)*50+found*25;missionDone+=found;
  flash(found?`识别 +${found} · 连击 ${combo}`:`消行 +${full.length}`);
  updateHud();if(missionDone>=missionGoal)setTimeout(()=>endGame(true),180);
}
function render(){
  const cells=els.board.children, gy=current?ghostY():0;
  for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){const c=cells[y*COLS+x],data=board[y][x];c.className="cell";c.innerHTML="";if(data)paintCell(c,data);}
  if(current){
    current.matrix.forEach((row,y)=>row.forEach((v,x)=>{if(!v)return;const gx=current.x+x,gyy=gy+y;if(gyy>=0&&!board[gyy][gx])cells[gyy*COLS+gx].classList.add("ghost");}));
    current.matrix.forEach((row,y)=>row.forEach((v,x)=>{if(!v)return;const px=current.x+x,py=current.y+y;if(py>=0)paintCell(cells[py*COLS+px],current.sign);}));
  }
  updateHud();
}
function paintCell(cell,data){cell.className=`cell filled ${data.category}`;cell.innerHTML=`<span class="glyph">${data.glyph}</span><span class="mini-label">${data.label.replace(/禁止|当心|必须|安全|紧急/g,"")}</span>`;}
function renderNext(){els.nextPiece.innerHTML="";for(let y=0;y<3;y++)for(let x=0;x<4;x++){const c=document.createElement("i");if(next.matrix[y]?.[x]){c.className="preview-cell";c.style.background=TYPES[next.sign.category].color;}els.nextPiece.appendChild(c);}}
function updateHud(){els.score.textContent=score.toLocaleString();els.lines.textContent=lines;els.missionDone.textContent=Math.min(missionDone,missionGoal);}
function flash(msg){els.toast.textContent=msg;els.toast.classList.add("show");clearTimeout(flash.t);flash.t=setTimeout(()=>els.toast.classList.remove("show"),850);}
function setupBoard(){els.board.innerHTML="";for(let i=0;i<ROWS*COLS;i++){const c=document.createElement("div");c.className="cell";c.setAttribute("role","gridcell");els.board.appendChild(c);}}
function startGame(){
  level=selectedLevel;board=blankBoard();score=lines=missionDone=combo=maxCombo=clearedSigns=0;lastKnowledge=null;paused=false;running=true;
  const scene=SCENES[Math.floor(level/3)], stage=level%3, target=scene.targets[stage];missionGoal=6+stage*3;
  els.sceneName.textContent=scene.name;els.stageNo.textContent=`第${level+1}关 · ${stage===0?"识别":stage===1?"混合":"挑战"}`;
  els.missionIcon.textContent=TYPES[target].icon;els.missionIcon.style.background=TYPES[target].color;els.missionIcon.style.color=target==="warning"?"#111":"#fff";
  els.missionName.textContent=`收集${TYPES[target].name}标志`;els.missionTotal.textContent=missionGoal;els.mentorAvatar.textContent=MENTORS[selectedMentor].avatar;els.mentorTip.textContent=MENTORS[selectedMentor].tips[level%2];
  next=makePiece(true);spawn();showScreen("game");clearInterval(timer);timer=setInterval(()=>move(0,1),Math.max(300,820-(level%3)*120));render();
}
function endGame(won){
  if(!running)return;running=false;clearInterval(timer);showScreen("result");
  els.finalScore.textContent=score.toLocaleString();els.finalLines.textContent=lines;els.finalSigns.textContent=clearedSigns;els.finalCombo.textContent=maxCombo;
  els.resultTitle.textContent=won?"任务完成":"现场压力过高";els.resultBadge.textContent=won?"安全落点":"重新研判";
  els.resultMessage.textContent=won?"你完成了本关安全标志识别任务。":"调整落点，给后续方块留出安全空间。";
  if(won&&level+1<18){unlocked=Math.max(unlocked,level+2);localStorage.setItem("safeDropUnlocked",String(unlocked));}
  const k=lastKnowledge||randomSign(SCENES[Math.floor(level/3)].targets[level%3]);
  els.knowledgeCard.innerHTML=`<b>${k.label}</b><br>${k.note}<br><small>类别：${TYPES[k.category].name}标志</small>`;
  els.nextBtn.textContent=won&&level<17?"下一关":"再试一次";els.nextBtn.dataset.won=won?"1":"0";
}
function goHome(){running=false;paused=false;clearInterval(timer);selectedLevel=Math.min(selectedLevel,unlocked-1);renderHome();showScreen("home");}
function togglePause(){if(!running)return;paused=true;els.pauseDialog.showModal();}

$("startBtn").onclick=startGame;$("guideBtn").onclick=()=>els.guideDialog.showModal();$("closeGuide").onclick=()=>els.guideDialog.close();$("backBtn").onclick=goHome;$("pauseBtn").onclick=togglePause;
$("resumeBtn").onclick=()=>{paused=false;els.pauseDialog.close();};$("quitBtn").onclick=()=>{els.pauseDialog.close();goHome();};$("homeBtn").onclick=goHome;
els.nextBtn.onclick=()=>{if(els.nextBtn.dataset.won==="1"&&level<17)selectedLevel=Math.min(level+1,unlocked);startGame();};
document.querySelectorAll(".controls button").forEach(btn=>{btn.onclick=()=>{const a=btn.dataset.action;if(a==="left")move(-1,0);if(a==="right")move(1,0);if(a==="down")move(0,1);if(a==="rotate")rotatePiece();if(a==="drop")hardDrop();};});
document.addEventListener("keydown",e=>{if(["ArrowLeft","ArrowRight","ArrowDown","ArrowUp"," "].includes(e.key))e.preventDefault();if(e.key==="ArrowLeft")move(-1,0);if(e.key==="ArrowRight")move(1,0);if(e.key==="ArrowDown")move(0,1);if(e.key==="ArrowUp")rotatePiece();if(e.key===" ")hardDrop();if(e.key==="Escape"&&running)togglePause();});
let touch=null;els.board.addEventListener("touchstart",e=>{const t=e.touches[0];touch={x:t.clientX,y:t.clientY,time:Date.now()};},{passive:true});
els.board.addEventListener("touchend",e=>{if(!touch)return;const t=e.changedTouches[0],dx=t.clientX-touch.x,dy=t.clientY-touch.y;if(Math.abs(dx)<18&&Math.abs(dy)<18)rotatePiece();else if(Math.abs(dx)>Math.abs(dy))move(dx>0?1:-1,0);else if(dy>45)hardDrop();touch=null;},{passive:true});
document.addEventListener("visibilitychange",()=>{if(document.hidden&&running&&!paused)togglePause();});
if("serviceWorker" in navigator&&location.protocol.startsWith("http"))navigator.serviceWorker.register("./sw.js").catch(()=>{});

setupBoard();renderHome();
window.SafeDropCore={rotate,validBoardSize:()=>[COLS,ROWS],scenes:SCENES,signs:SIGNS};
})();
