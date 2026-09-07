export const WORLD = {w:1440,h:960};
export const HEROES = [
 {name:'安禾',animal:'马',role:'安全集结',tag:'均衡 · 守护',color:'#64e6bf',desc:'温暖坚定的行动队长。集结时恢复行动状态，并短时提高移动效率。',skill:'恢复25点生命，8秒移动加速',speed:218,cooldown:24},
 {name:'永勋',animal:'猫头鹰',role:'洞察之眼',tag:'研判 · 侦察',color:'#e9bd78',desc:'看懂异常背后的关联。扫描揭示全场危险，并短时强化风险标记脉冲。',skill:'扫描10秒，脉冲效能提高60%',speed:204,cooldown:20},
 {name:'凌曜',animal:'雪豹',role:'迅捷转移',tag:'敏捷 · 响应',color:'#86d9ff',desc:'冷静果断的行动派。沿可通行路线快速转移，绝不穿越隔离设施。',skill:'向移动方向快速转移，8秒加速',speed:240,cooldown:16},
 {name:'观微',animal:'边牧',role:'循迹排查',tag:'追踪 · 控制',color:'#d6ed75',desc:'沿细微线索找到源头。标出物资与目标，短时减缓危险投影的移动。',skill:'追踪10秒，危险投影减速55%',speed:216,cooldown:20},
];
// Type names follow GB 6441—2025; sprite families and numbers are fictional game abstractions.
const names=['物体打击','厂（场）内车辆致害','道路（轨道）车辆致害','机械致害','起重致害','触电','淹溺','灼烫','火灾','高处坠落','跌落','坍塌','水害','容器爆炸','管道爆炸','可燃气体爆炸','可燃液体蒸气爆炸','粉尘爆炸','民用爆炸物品爆炸','烟花爆竹爆炸','其他可燃固体爆炸','高温熔融物爆炸','中毒','窒息','滑坡','泄漏','其他','职业健康危害','环境污染'];
const nick=['坠物石卫','盲区铁牛','疾驰钢影','卷噬齿轮兽','悬钩巨人','电弧幽灵','深池涡灵','灼蚀兽','焰核兽','断桥翼魔','滑影怪','裂构巨像','涌水巨蟒','裂罐巨兽','脉冲管龙','无形燃云','蒸影魅','尘爆蜂群','封印爆核','连珠焰群','异燃岩兽','熔流巨人','毒影潜行者','噬氧空壳','移山兽','漏液软泥','异常拟态体','噪尘侵蚀者','污流吞噬者'];
const tips=['离开落物区，固定物料并实施隔离。','保持人车分流，不进入车辆盲区。','使用安全通行节点，避开运行线路。','停机不等于隔离；断能后还需验证。','退出吊装危险区，不从吊物下方通过。','由具备条件的人员实施断电处置，禁止直接接触。','保持临边防护，避免盲目入水施救。','先区分高温与化学危害，再选择匹配措施。','仅在具备条件时处理初期火情；失控立即撤离。','优先使用受保护通道，核查防坠落条件。','清理通道，留意湿滑与踏空。','根据结构异常征兆撤离，封闭不稳定区域。','发现异常涌水先撤离，启动专业处置。','远离异常容器，调用授权的系统处置。','识别关联管段，警戒并启动专业处置。','可燃气体不能凭肉眼识别；检测、撤离并控制点火条件。','蒸气危险不止存在于可见液体的位置。','防止扬尘与点火条件，恢复适配的粉尘控制。','警戒、撤离、交由专业人员处理。','远离连锁影响区，报警并组织撤离。','依据具体物料信息选择经审核的措施。','识别熔融物遇水危险，禁止用水攻击。','检测并使用匹配防护，不以气味判断安全。','检测揭示缺氧风险；禁止盲目进入和施救。','发现裂缝与位移征兆，撤出影响区域。','在安全条件下控制源头，实施适配围控。','信息不足时停止作业、报告并请求识别。','从控源、工程措施和暴露管理入手。','控制源头与扩散路径，保护敏感目标并报告。'];
const sprites=[6,4,4,0,0,1,2,3,3,6,2,6,2,6,1,5,5,7,6,3,6,3,5,5,6,2,5,7,2];
export const HAZARDS=names.map((name,i)=>({id:i,name,nick:nick[i],tip:tips[i],sprite:sprites[i],color:['#8addf0','#f6d560','#b8e36b','#ff9666','#9daeca','#c0a0ff','#adb8c2','#dcc177'][sprites[i]],extended:i>26}));
export const CHAPTERS=[
 {name:'水厂警报',site:'水处理与环保设施',sub:'加药间 · 异常泄漏',color:'#6ee3c4',hazards:[25,10,22,23,6,28],boss:25,verb:'围控排水口',knowledge:'控制源头后，仍需围控扩散、确认设备停用并报告。',panels:['检测终端','人员集合','远程停用','围控排水口'],blocks:['加药设备','储罐围堰','泵房','排水系统']},
 {name:'商场夜巡',site:'商业综合体',sub:'设备层 · 安全疏散',color:'#ffc17f',hazards:[10,5,8,15,9],boss:8,verb:'关闭危险区',knowledge:'失控火情应立即撤离；不能用生命值换取处置机会。',panels:['报警确认','人员集合','请求断电','关闭危险区'],blocks:['设备机房','后勤通道','后厨区域','仓储间']},
 {name:'物流交锋',site:'仓储物流园',sub:'装卸区 · 人车分流',color:'#f3dc77',hazards:[1,0,11,4,2],boss:1,verb:'恢复人车分流',knowledge:'车辆盲区内不能靠反应速度保证安全，应恢复隔离通道。',panels:['盲区识别','人员集合','运输停运','人车分流'],blocks:['高位货架','装卸平台','充电区','运输通道']},
 {name:'齿轮之心',site:'机械加工厂',sub:'输送线 · 能量隔离',color:'#8dd5fa',hazards:[3,5,4,0,26],boss:3,verb:'恢复防护',knowledge:'急停不等于能量隔离；隔离和验证完成后才能处理残余危险。',panels:['能量识别','人员集合','隔离并验证','恢复防护'],blocks:['输送线','加工单元','配电区域','检修区域']},
 {name:'管廊边界',site:'化学品储运区',sub:'卸车区 · 扩散阻断',color:'#c9a3fa',hazards:[25,7,13,14,15,16,22],boss:14,verb:'封控影响区',knowledge:'先识别物料与影响范围；处置必须满足授权与安全条件。',panels:['物料确认','人员集合','远程隔离','封控影响区'],blocks:['储罐区','管廊','卸车区','围控设施']},
 {name:'熔光禁区',site:'冶金与粉体工厂',sub:'粉体车间 · 连锁防控',color:'#ff9978',hazards:[7,17,20,21,27],boss:21,verb:'隔离危险组合',knowledge:'熔融物遇水与粉尘扬起都可能放大事故；动作前先识别条件。',panels:['组合识别','人员集合','系统停运','隔离危险组合'],blocks:['熔炼区','浇注区','除尘区','料仓']},
 {name:'山体回声',site:'露天矿山',sub:'运输坡道 · 异常撤离',color:'#c1c9a3',hazards:[24,1,11,3,18],boss:24,verb:'封闭影响区',knowledge:'识别边坡位移、裂缝等异常后及时撤离，不能靠装备硬抗。',panels:['征兆监测','人员集合','停运警戒','封闭影响区'],blocks:['边坡禁入区','破碎区','运输路线','物料堆场']},
 {name:'深地归途',site:'地下矿山',sub:'巷道系统 · 安全撤离',color:'#96baff',hazards:[12,11,15,23,18,19],boss:12,verb:'撤离封控',knowledge:'撤离和专业接管也是最高等级的胜利，不要求冒险消灭危险。',panels:['环境检测','人员集合','应急接管','撤离封控'],blocks:['巷道隔离区','设备硐室','排水系统','支护区域']},
];
export type Point={x:number,y:number};
export type Rect=Point&{w:number,h:number,label:string};
export type Enemy=Point&{id:number,type:number,hp:number,max:number,r:number,speed:number,boss:boolean,cd:number,flash:number,dead:boolean};
export type Shot=Point&{vx:number,vy:number,ttl:number,power:number,enemy:boolean,type?:number};
export type Pickup=Point&{kind:number,taken:boolean};
export type Ring=Point&{r:number,ttl:number,max:number,color:string,label?:string};
export type Input={x:number,y:number,fire:boolean,aim:Point|null,interact:boolean,skill:boolean};
export type State={hero:number,chapter:number,stage:number,difficulty:number,status:'playing'|'won'|'lost',p:Point&{hp:number,inv:number},time:number,step:number,progress:number,cd:number,buff:number,shotCd:number,level:number,xp:number,upgradePending:boolean,upgrades:number[],kills:number,hits:number,shots:number,gear:number[],enemies:Enemy[],shotsList:Shot[],pickups:Pickup[],rings:Ring[],blocks:Rect[],nodes:(Point&{label:string})[],events:string[],notice:string,noticeTime:number,auto:boolean,seed:number,nextId:number,interacting:boolean};
export const distance=(a:Point,b:Point)=>Math.hypot(a.x-b.x,a.y-b.y);
export const clamp=(v:number,a:number,b:number)=>Math.min(b,Math.max(a,v));
export function random(s:State){s.seed=(s.seed*1664525+1013904223)>>>0;return s.seed/4294967296;}
export function blocked(s:State,p:Point,r=19){return p.x<r+24||p.y<r+24||p.x>WORLD.w-r-24||p.y>WORLD.h-r-24||s.blocks.some(b=>p.x>b.x-r&&p.x<b.x+b.w+r&&p.y>b.y-r&&p.y<b.y+b.h+r);}
export function move(s:State,p:Point,x:number,y:number,r=19){if(!blocked(s,{x:p.x+x,y:p.y},r))p.x+=x;if(!blocked(s,{x:p.x,y:p.y+y},r))p.y+=y;}
export function visible(s:State,a:Point,b:Point){const d=distance(a,b),n=Math.ceil(d/14);for(let i=1;i<n;i++){const p={x:a.x+(b.x-a.x)*i/n,y:a.y+(b.y-a.y)*i/n};if(s.blocks.some(z=>p.x>z.x&&p.x<z.x+z.w&&p.y>z.y&&p.y<z.y+z.h))return false;}return true;}
export function createGame(hero=0,chapter=0,stage=0,difficulty=1,seed=739):State{
 const c=CHAPTERS[chapter];
 const s:State={hero,chapter,stage,difficulty,status:'playing',p:{x:120,y:790,hp:100,inv:1},time:0,step:0,progress:0,cd:0,buff:0,shotCd:0,level:1,xp:0,upgradePending:false,upgrades:[0,0,0],kills:0,hits:0,shots:0,gear:[],enemies:[],shotsList:[],pickups:[],rings:[],blocks:[{x:320,y:250,w:210,h:180,label:c.blocks[0]},{x:860,y:230,w:210,h:190,label:c.blocks[1]},{x:345,y:640,w:190,h:150,label:c.blocks[2]},{x:875,y:640,w:210,h:150,label:c.blocks[3]}],nodes:[{x:170,y:510,label:c.panels[0]},{x:660,y:810,label:c.panels[1]},{x:1220,y:470,label:c.panels[2]},{x:710,y:180,label:c.panels[3]},{x:120,y:790,label:'集合点 · 完成报告'}],events:[],notice:'先前往 ① '+c.panels[0]+'。射击仅压制虚构的危险投影。',noticeTime:7,auto:true,seed,nextId:0,interacting:false};
 const spots=[{x:620,y:490},{x:740,y:590},{x:1130,y:790},{x:1220,y:210},{x:710,y:330},{x:180,y:190},{x:670,y:110},{x:1250,y:680},{x:600,y:700},{x:1120,y:120}];
 for(let i=0;i<8+stage;i++){const p=spots[i%spots.length];spawn(s,c.hazards[i%c.hazards.length],p,false);}
 spawn(s,c.boss,{x:1130,y:540},true);
 s.pickups=[{x:185,y:650,kind:0,taken:false},{x:280,y:485,kind:1,taken:false},{x:620,y:700,kind:2,taken:false},{x:1140,y:630,kind:3,taken:false},{x:780,y:160,kind:4,taken:false},{x:170,y:290,kind:5,taken:false},{x:750,y:480,kind:6,taken:false},{x:1270,y:360,kind:7,taken:false}];return s;
}
export function spawn(s:State,type:number,p:Point,boss:boolean){const max=(boss?360:50+type%4*14)*(1+s.stage*.22)*(s.difficulty===0?.7:s.difficulty===2?1.3:1);s.enemies.push({...p,id:s.nextId++,type,hp:max,max,r:boss?45:23+type%3*3,speed:boss?30:44+type%4*8,boss,cd:2+(s.nextId%4)*.7,flash:0,dead:false});}
export function notify(s:State,msg:string){s.notice=msg;s.noticeTime=4;}
export function skill(s:State,input:Input){if(s.cd>0||s.status!=='playing')return false;s.cd=HEROES[s.hero].cooldown;s.buff=s.hero===0||s.hero===2?8:10;s.rings.push({...s.p,r:10,ttl:1,max:1,color:HEROES[s.hero].color,label:HEROES[s.hero].role});if(s.hero===0)s.p.hp=clamp(s.p.hp+25,0,100);if(s.hero===2){const m=Math.hypot(input.x,input.y);const v=m?{x:input.x/m,y:input.y/m}:{x:0,y:-1};for(let i=0;i<16;i++)move(s,s.p,v.x*8,v.y*8);}notify(s,HEROES[s.hero].role+' · '+HEROES[s.hero].skill);return true;}
export const GEAR=['安全帽','护目镜','工具快挂','检测增程','备用电源','行动补给','防滑鞋','通信组件'];
export function collect(s:State,p:Pickup){p.taken=true;s.gear.push(p.kind);if(p.kind===5)s.p.hp=clamp(s.p.hp+30,0,100);if(p.kind===4)s.cd=Math.max(0,s.cd-8);notify(s,'拾取 '+GEAR[p.kind]+' · '+['匹配的物体打击防护增强','匹配的飞溅防护增强','现场交互加快','标记射程增加','技能冷却减少','模拟生命恢复30','湿滑移动惩罚减轻','专属技能冷却加快'][p.kind]);}
export function damage(s:State,amount:number,type:number){if(s.p.inv>0||s.status!=='playing')return;let mult=s.difficulty===0?.55:s.difficulty===2?1.25:.85;if(s.gear.includes(0)&&type===0)mult*=.65;if(s.gear.includes(1)&&[7,25].includes(type))mult*=.7;s.p.hp=Math.max(0,s.p.hp-amount*mult);s.p.inv=.65;s.hits++;if(s.p.hp<=0){s.status='lost';notify(s,'演练中止。复盘后可重新出发。');}}
export function chooseUpgrade(s:State,n:number){if(!s.upgradePending||n<0||n>2)return;s.upgrades[n]++;s.upgradePending=false;notify(s,['升级 · 标记脉冲效能 +20%','升级 · 移动效率 +8%','升级 · 工具交互效率 +25%'][n]);}
export function score(s:State){const pieces=[s.step>0?20:0,s.step>2?35:0,s.step>1?25:0,s.step>3?10:0,s.status==='won'?10:0];return {total:pieces.reduce((a,b)=>a+b,0),pieces};}
export function update(s:State,input:Input,dt:number){if(s.status!=='playing'||s.upgradePending)return;dt=clamp(dt,0,.04);s.time+=dt;s.p.inv=Math.max(0,s.p.inv-dt);s.noticeTime=Math.max(0,s.noticeTime-dt);s.cd=Math.max(0,s.cd-dt*(s.gear.includes(7)?1.25:1));s.buff=Math.max(0,s.buff-dt);s.shotCd-=dt;
 if(input.skill)skill(s,input);
 const n=Math.hypot(input.x,input.y),speed=HEROES[s.hero].speed*(s.gear.includes(6)||!s.enemies.some(e=>!e.dead&&e.type===10&&distance(e,s.p)<100)?1:.8)*(1+s.upgrades[1]*.08)*(s.buff>0&&[0,2].includes(s.hero)?1.35:1);if(n)move(s,s.p,input.x/Math.max(1,n)*speed*dt,input.y/Math.max(1,n)*speed*dt);
 const target=s.nodes[s.step];s.interacting=false;
 if(target&&input.interact&&distance(s.p,target)<100){
  if(s.step===4&&s.enemies.some(e=>e.boss&&!e.dead)){notify(s,'关键措施已完成。清除残余投影后返回报告。');}
  else{s.interacting=true;s.progress+=dt*(s.gear.includes(2)?1.3:1)*(1+s.upgrades[2]*.25);if(s.progress>=1.65){s.events.push(target.label);s.step++;s.progress=0;s.rings.push({...target,r:10,ttl:1,max:1,color:'#7ef3bd'});if(s.step===1)notify(s,'检测完成 · 已标记危险。前往 ② 人员集合。');if(s.step===2)notify(s,'人员已撤至保护区域。前往 ③ '+s.nodes[2].label);if(s.step===3){s.enemies.filter(e=>e.boss).forEach(e=>{e.hp=Math.min(e.hp,e.max*.38);e.flash=.3;});notify(s,'源头措施生效！首领失去屏障，危险失控度下降62%。');}if(s.step===4)notify(s,'现场保护完成。清除残余投影，返回集合点报告。');if(s.step===5){s.status='won';return;}}}
 }else s.progress=Math.max(0,s.progress-dt*2);
 for(const p of s.pickups)if(!p.taken&&distance(s.p,p)<42)collect(s,p);
 const range=s.gear.includes(3)?580:470;
 if((s.auto||input.fire)&&s.shotCd<=0){const list=s.enemies.filter(e=>!e.dead&&distance(s.p,e)<range&&visible(s,s.p,e)).sort((a,b)=>distance(s.p,a)-distance(s.p,b));const aim=input.fire&&input.aim?input.aim:list[0];if(aim){const a=Math.atan2(aim.y-s.p.y,aim.x-s.p.x);s.shotsList.push({x:s.p.x,y:s.p.y,vx:Math.cos(a)*610,vy:Math.sin(a)*610,ttl:range/610,power:15*(1+s.upgrades[0]*.2)*(s.buff>0&&s.hero===1?1.6:1),enemy:false});s.shotCd=.20;s.shots++;}}
 for(const e of s.enemies){if(e.dead)continue;e.flash=Math.max(0,e.flash-dt);e.cd-=dt;const d=distance(e,s.p),a=Math.atan2(s.p.y-e.y,s.p.x-e.x);if(d<640&&d>e.r+26){const sp=e.speed*(s.buff>0&&s.hero===3?.45:1);move(s,e,Math.cos(a)*sp*dt,Math.sin(a)*sp*dt,e.r);}
 if(d<e.r+20)damage(s,e.boss?18:10,e.type);
 if(e.cd<0&&d<650&&visible(s,e,s.p)){e.cd=e.boss?2.3:3.6+e.type%3;s.rings.push({...e,r:e.r+12,ttl:.55,max:.55,color:HAZARDS[e.type].color});const sp=e.boss?180:135;const spread=e.boss?[-.23,0,.23]:[0];for(const angle of spread)s.shotsList.push({x:e.x,y:e.y,vx:Math.cos(a+angle)*sp,vy:Math.sin(a+angle)*sp,ttl:3.4,power:e.boss?16:9,enemy:true,type:e.type});}
 }
 for(const b of s.shotsList){b.ttl-=dt;b.x+=b.vx*dt;b.y+=b.vy*dt;if(blocked(s,b,1))b.ttl=0;if(b.ttl<=0)continue;if(b.enemy){if(distance(b,s.p)<22){damage(s,b.power,b.type??22);b.ttl=0;}}else for(const e of s.enemies){if(e.dead||distance(b,e)>e.r+6)continue;b.ttl=0;e.flash=.12;if(e.boss&&s.step<3){e.hp=Math.max(e.max*.65,e.hp-b.power*.10);if(s.noticeTime<=0)notify(s,'首领有源头屏障：先完成 ① 检测 → ② 撤离 → ③ 控制。');}else{e.hp-=b.power;if(e.hp<=0){e.dead=true;s.kills++;s.xp++;s.rings.push({...e,r:e.r,ttl:.5,max:.5,color:HAZARDS[e.type].color});if(s.xp>=3&&s.level<4){s.xp=0;s.level++;s.upgradePending=true;}if(e.boss)notify(s,'危险投影已消退。完成现场保护并返回报告。');}}break;}}
 s.shotsList=s.shotsList.filter(b=>b.ttl>0);for(const r of s.rings){r.ttl-=dt;r.r+=dt*180;}s.rings=s.rings.filter(r=>r.ttl>0);
}
// Four-way routing keeps click-to-move inside the same collision boundaries as keyboard movement.
export function findPath(s:State,target:Point):Point[]{
 if(blocked(s,target))return [];const cell=40,cols=36,rows=24;
 const key=(x:number,y:number)=>y*cols+x,start={x:clamp(Math.floor(s.p.x/cell),1,cols-2),y:clamp(Math.floor(s.p.y/cell),1,rows-2)},end={x:clamp(Math.floor(target.x/cell),1,cols-2),y:clamp(Math.floor(target.y/cell),1,rows-2)};
 const queue=[start],prev=new Map<number,number>(),visited=new Set([key(start.x,start.y)]);let head=0,found=-1;
 while(head<queue.length){const n=queue[head++],k=key(n.x,n.y);if(n.x===end.x&&n.y===end.y){found=k;break;}for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){const x=n.x+dx,y=n.y+dy,nk=key(x,y);if(x<1||y<1||x>=cols-1||y>=rows-1||visited.has(nk)||blocked(s,{x:x*cell+20,y:y*cell+20},22))continue;visited.add(nk);prev.set(nk,k);queue.push({x,y});}}
 if(found<0)return [];const result:Point[]=[target];let k=found;const first=key(start.x,start.y);while(k!==first){result.unshift({x:(k%cols)*cell+20,y:Math.floor(k/cols)*cell+20});const p=prev.get(k);if(p===undefined)break;k=p;}return result;
}
